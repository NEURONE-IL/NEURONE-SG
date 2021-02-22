// set test environment
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/auth/user");
const Role = require("../models/auth/role");
const Adventure = require("../models/game/adventure");
const bcrypt = require("bcryptjs");
const app = require("../app");
const request = require("supertest");

// Set test to use chai
chai.use(chaiHttp);
chai.should();

var playerToken = null;
var creatorToken = null;
var existingAdventureId = null;
var adventureToUpdateId = null;
var adventureToDeleteId = null;

describe("Adventures API", () => {
  before(async () => {
    // Reset DB
    await User.deleteMany({});
    await Role.deleteMany({});
    await Adventure.deleteMany({});

    // Create roles
    let playerRole = new Role({
      name: "player",
    });
    let creatorRole = new Role({
      name: "creator",
    });
    // Save roles
    await playerRole.save();
    await creatorRole.save();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("hola123", salt);

    // confirmed player
    let newPlayer = new User({
      username: "player",
      email: "player@mail.cl",
      password: password,
      role: playerRole,
      confirmed: true,
    });
    // confirmed creator
    let newCreator = new User({
      username: "creator",
      email: "creator@mail.cl",
      password: password,
      role: creatorRole,
      confirmed: true,
    });

    // Save users
    await newPlayer.save();
    await newCreator.save();

    // Create initial adventures

    let newAdventure = Adventure({
      name: "Sala de escape - Casa abandonada",
      description: "¿Puedes escapar de esta sala?",
      image: "placeholder",
      nodes: [
        {
          data: {
            image: "placeholder",
            video: "",
            text: "sample text",
          },
          id: "afqgFSjC5jjJH",
          type: "initial",
          label: "Start",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
          },
          label: "Presentación",
          type: "transition",
          id: "VTeisssGz35HX",
        },
      ],
      links: [
        {
          label: "Iniciar",
          source: "afqgFSjC5jjJH",
          target: "VTeisssGz35HX",
        },
      ],
    });

    let adventureToUpdate = Adventure({
      name: "Sala de escape - Casa abandonada",
      description: "¿Puedes escapar de esta sala?",
      image: "placeholder",
      nodes: [
        {
          data: {
            image: "placeholder",
            video: "",
            text: "sample text",
          },
          id: "afqgFSjC5jjJH",
          type: "initial",
          label: "Start",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
          },
          label: "Presentación",
          type: "transition",
          id: "VTeisssGz35HX",
        },
      ],
      links: [
        {
          label: "Iniciar",
          source: "afqgFSjC5jjJH",
          target: "VTeisssGz35HX",
        },
      ],
    });

    let adventureToDelete = Adventure({
      name: "Sala de escape - Casa abandonada",
      description: "¿Puedes escapar de esta sala?",
      image: "placeholder",
      nodes: [
        {
          data: {
            image: "placeholder",
            video: "",
            text: "sample text",
          },
          id: "afqgFSjC5jjJH",
          type: "initial",
          label: "Start",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
          },
          label: "Presentación",
          type: "transition",
          id: "VTeisssGz35HX",
        },
      ],
      links: [
        {
          label: "Iniciar",
          source: "afqgFSjC5jjJH",
          target: "VTeisssGz35HX",
        },
      ],
    });

    // Save adventure and store id
    await newAdventure.save();
    await adventureToUpdate.save();
    await adventureToDelete.save();
    existingAdventureId = newAdventure._id;
    adventureToUpdateId = adventureToUpdate._id;
    adventureToDeleteId = adventureToDelete._id;

    await request(app)
      .post("/api/auth/login")
      .send({ email: "player@mail.cl", password: "hola123" })
      .then((res) => {
        playerToken = res.body.token;
      });
    await request(app)
      .post("/api/auth/login")
      .send({ email: "creator@mail.cl", password: "hola123" })
      .then((res) => {
        creatorToken = res.body.token;
      });
  });

  describe("GET adventure", () => {
    it("should GET all adventures", (done) => {
      chai
        .request(app)
        .get("/api/adventure")
        .set({ "x-access-token": playerToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET adventures without authorization", () => {
    it("should fail to GET all adventures", (done) => {
      chai
        .request(app)
        .get("/api/adventure")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("GET certain adventure", () => {
    it("should GET certain adventure", (done) => {
      chai
        .request(app)
        .get("/api/adventure/" + existingAdventureId)
        .set({ "x-access-token": playerToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.nodes.should.be.a("array");
          res.body.nodes.length.should.be.eql(2);
          res.body.links.should.be.a("array");
          res.body.links.length.should.be.eql(1);
          done();
        });
    });
  });

  describe("POST adventure success", () => {
    it("should POST an adventure succesfully", (done) => {
      const adventure = {
        name: "Sala de escape - Casa abandonada",
        description: "¿Puedes escapar de esta sala?",
        image: "placeholder",
        nodes: [
          {
            data: {
              image: "placeholder",
              video: "",
              text: "sample text",
            },
            id: "afqgFSjC5jjJH",
            type: "initial",
            label: "Start",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
            },
            label: "Presentación",
            type: "transition",
            id: "VTeisssGz35HX",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "En esta sala te enfrentarás a espeluznantes desafíos. Afortunadamente cuentas con el siempre confiable ¡buscador de NEURONE! Este te permitirá buscar todo tipo de información que te ayudará a descifrar los misterios que te esperan!",
            },
            id: "gpEV-SsMOpi4t",
            label: "Instrucciones",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Mike ha desaparecido! Ahora te encuentras completamente solo en esta casa abandonada, solo tienes una puerta frente a ti.",
            },
            label: "Etapa1",
            type: "transition",
            id: "syoUd3hCLq1Ow",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Buuu! Soy el fantasma John, nunca te dejaré escapar de esta casa muajajajaj. Te dejaré encerrado en esta pieza por siempre, ¡Adios!. El fantasma desaparece y se cierran todas las puertas de la habitación.",
            },
            challenge: {
              type: "question",
              question: "¿Cuánto es 5*5?",
              answer: "25",
            },
            id: "0MdzB_-EQwQBM",
            label: "Fantasma1",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                'Te encuentras frente a una puerta con una especie de cerradura electrónica. Al parecer puedes escribir un código para avanzar... Abajo encuentras un papel con la siguiente pista: "Johnny: la puerta solo se abre en mi cumpleaños!"',
            },
            challenge: {
              type: "question",
              question: "¿Cuál es el código?",
              answer: "1965",
            },
            id: "9bqXrewunk42u",
            label: "codigoPuerta1",
            type: "challenge",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text: "¡Lo lograste! Has encontrado la salida.",
            },
            label: "FinalGood",
            type: "ending",
            id: "4ewf9EkQQmg07",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "La cerradura digital muestra un error y la puerta no se abre!",
            },
            label: "PuertaLocked",
            type: "transition",
            id: "0-CpPeVHWt9ws",
          },
        ],
        links: [
          {
            label: "Iniciar",
            source: "afqgFSjC5jjJH",
            target: "VTeisssGz35HX",
          },
          {
            label: "Continuar",
            source: "VTeisssGz35HX",
            target: "gpEV-SsMOpi4t",
          },
          {
            label: "Continuar",
            source: "gpEV-SsMOpi4t",
            target: "syoUd3hCLq1Ow",
          },
          {
            label: "Abrir la puerta",
            source: "syoUd3hCLq1Ow",
            target: "0MdzB_-EQwQBM",
          },
          {
            label: "Inspeccionar la puerta más cercana",
            source: "0MdzB_-EQwQBM",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "4ewf9EkQQmg07",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "correct_answer",
              },
            ],
          },
          {
            label: "Intentarlo de nuevo",
            source: "0-CpPeVHWt9ws",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "0-CpPeVHWt9ws",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "wrong_answer",
              },
            ],
          },
        ],
      };
      chai
        .request(app)
        .post("/api/adventure")
        .set({ "x-access-token": creatorToken })
        .send(adventure)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.nodes.should.be.a("array");
          res.body.nodes.length.should.be.eql(8);
          res.body.links.should.be.a("array");
          res.body.links.length.should.be.eql(8);
          res.body.name.should.be.a("string");
          res.body.name.should.be.eql(adventure.name);
          res.body.description.should.be.eql(adventure.description);
          done();
        });
    });
  });

  describe("POST invalid adventure", () => {
    it("should fail to POST an invalid adventure", (done) => {
      const adventure = {
        name: "Sala de escape - Casa abandonada",
        description: "¿Puedes escapar de esta sala?",
        image: "placeholder",
        nodes: [
          {
            data: {
              image: "placeholder",
              video: "",
              text: "",
            },
            id: "afqgFSjC5jjJH",
            type: "initial",
            label: "Start",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
            },
            label: "Presentación",
            type: "transition",
            id: "VTeisssGz35HX",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "En esta sala te enfrentarás a espeluznantes desafíos. Afortunadamente cuentas con el siempre confiable ¡buscador de NEURONE! Este te permitirá buscar todo tipo de información que te ayudará a descifrar los misterios que te esperan!",
            },
            id: "gpEV-SsMOpi4t",
            label: "Instrucciones",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Mike ha desaparecido! Ahora te encuentras completamente solo en esta casa abandonada, solo tienes una puerta frente a ti.",
            },
            label: "Etapa1",
            type: "transition",
            id: "syoUd3hCLq1Ow",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Buuu! Soy el fantasma John, nunca te dejaré escapar de esta casa muajajajaj. Te dejaré encerrado en esta pieza por siempre, ¡Adios!. El fantasma desaparece y se cierran todas las puertas de la habitación.",
            },
            challenge: {
              type: "question",
              question: "¿Cuánto es 5*5?",
              answer: "25",
            },
            id: "0MdzB_-EQwQBM",
            label: "Fantasma1",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                'Te encuentras frente a una puerta con una especie de cerradura electrónica. Al parecer puedes escribir un código para avanzar... Abajo encuentras un papel con la siguiente pista: "Johnny: la puerta solo se abre en mi cumpleaños!"',
            },
            challenge: {
              type: "question",
              question: "¿Cuál es el código?",
              answer: "1965",
            },
            id: "9bqXrewunk42u",
            label: "codigoPuerta1",
            type: "challenge",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text: "¡Lo lograste! Has encontrado la salida.",
            },
            label: "FinalGood",
            type: "ending",
            id: "4ewf9EkQQmg07",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "La cerradura digital muestra un error y la puerta no se abre!",
            },
            label: "PuertaLocked",
            type: "transition",
            id: "0-CpPeVHWt9ws",
          },
        ],
        links: [
          {
            label: "Iniciar",
            source: "afqgFSjC5jjJH",
            target: "VTeisssGz35HX",
          },
          {
            label: "Continuar",
            source: "VTeisssGz35HX",
            target: "gpEV-SsMOpi4t",
          },
          {
            label: "Continuar",
            source: "gpEV-SsMOpi4t",
            target: "syoUd3hCLq1Ow",
          },
          {
            label: "Abrir la puerta",
            source: "syoUd3hCLq1Ow",
            target: "0MdzB_-EQwQBM",
          },
          {
            label: "Inspeccionar la puerta más cercana",
            source: "0MdzB_-EQwQBM",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "4ewf9EkQQmg07",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "correct_answer",
              },
            ],
          },
          {
            label: "Intentarlo de nuevo",
            source: "0-CpPeVHWt9ws",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "0-CpPeVHWt9ws",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "wrong_answer",
              },
            ],
          },
        ],
      };
      chai
        .request(app)
        .post("/api/adventure")
        .set({ "x-access-token": creatorToken })
        .send(adventure)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.err.details.should.be.a("array");
          res.body.err.details.length.should.be.eql(1);
          res.body.err.details[0].message.should.be.eql(
            '"nodes[0].data.text" is not allowed to be empty'
          );
          done();
        });
    });
  });

  describe("POST adventure without authorization", () => {
    it("should fail to POST an adventure", (done) => {
      const adventure = {
        name: "Sala de escape - Casa abandonada",
        description: "¿Puedes escapar de esta sala?",
        image: "placeholder",
        nodes: [
          {
            data: {
              image: "placeholder",
              video: "",
              text: "sample text",
            },
            id: "afqgFSjC5jjJH",
            type: "initial",
            label: "Start",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
            },
            label: "Presentación",
            type: "transition",
            id: "VTeisssGz35HX",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "En esta sala te enfrentarás a espeluznantes desafíos. Afortunadamente cuentas con el siempre confiable ¡buscador de NEURONE! Este te permitirá buscar todo tipo de información que te ayudará a descifrar los misterios que te esperan!",
            },
            id: "gpEV-SsMOpi4t",
            label: "Instrucciones",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Mike ha desaparecido! Ahora te encuentras completamente solo en esta casa abandonada, solo tienes una puerta frente a ti.",
            },
            label: "Etapa1",
            type: "transition",
            id: "syoUd3hCLq1Ow",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "¡Buuu! Soy el fantasma John, nunca te dejaré escapar de esta casa muajajajaj. Te dejaré encerrado en esta pieza por siempre, ¡Adios!. El fantasma desaparece y se cierran todas las puertas de la habitación.",
            },
            challenge: {
              type: "question",
              question: "¿Cuánto es 5*5?",
              answer: "25",
            },
            id: "0MdzB_-EQwQBM",
            label: "Fantasma1",
            type: "transition",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                'Te encuentras frente a una puerta con una especie de cerradura electrónica. Al parecer puedes escribir un código para avanzar... Abajo encuentras un papel con la siguiente pista: "Johnny: la puerta solo se abre en mi cumpleaños!"',
            },
            challenge: {
              type: "question",
              question: "¿Cuál es el código?",
              answer: "1965",
            },
            id: "9bqXrewunk42u",
            label: "codigoPuerta1",
            type: "challenge",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text: "¡Lo lograste! Has encontrado la salida.",
            },
            label: "FinalGood",
            type: "ending",
            id: "4ewf9EkQQmg07",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "La cerradura digital muestra un error y la puerta no se abre!",
            },
            label: "PuertaLocked",
            type: "transition",
            id: "0-CpPeVHWt9ws",
          },
        ],
        links: [
          {
            label: "Iniciar",
            source: "afqgFSjC5jjJH",
            target: "VTeisssGz35HX",
          },
          {
            label: "Continuar",
            source: "VTeisssGz35HX",
            target: "gpEV-SsMOpi4t",
          },
          {
            label: "Continuar",
            source: "gpEV-SsMOpi4t",
            target: "syoUd3hCLq1Ow",
          },
          {
            label: "Abrir la puerta",
            source: "syoUd3hCLq1Ow",
            target: "0MdzB_-EQwQBM",
          },
          {
            label: "Inspeccionar la puerta más cercana",
            source: "0MdzB_-EQwQBM",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "4ewf9EkQQmg07",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "correct_answer",
              },
            ],
          },
          {
            label: "Intentarlo de nuevo",
            source: "0-CpPeVHWt9ws",
            target: "9bqXrewunk42u",
          },
          {
            label: "Continuar",
            source: "9bqXrewunk42u",
            target: "0-CpPeVHWt9ws",
            activators: [
              {
                node: "9bqXrewunk42u",
                condition: "wrong_answer",
              },
            ],
          },
        ],
      };
      chai
        .request(app)
        .post("/api/adventure")
        .send(adventure)
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("PUT adventure succesfully", () => {
    it("should PUT an adventure", (done) => {
      let updatedAdventure = {
        name: "UPDATED - Sala de escape - Casa abandonada",
        description: "¿Puedes escapar de esta sala?",
        image: "placeholder",
        nodes: [
          {
            data: {
              image: "placeholder",
              video: "",
              text: "sample text",
            },
            id: "afqgFSjC5jjJH",
            type: "initial",
            label: "Start",
          },
          {
            data: {
              image: "placeholder",
              video: "",
              text:
                "Bienvenido a la casa abandonada! Soy el presentador Mike y te explicaré como jugar!",
            },
            label: "Presentación",
            type: "transition",
            id: "VTeisssGz35HX",
          },
        ],
        links: [
          {
            label: "Iniciar",
            source: "afqgFSjC5jjJH",
            target: "VTeisssGz35HX",
          },
        ],
      };
      chai
        .request(app)
        .put("/api/adventure/" + adventureToUpdateId)
        .set({ "x-access-token": creatorToken })
        .send(updatedAdventure)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.name.should.be.a("string");
          res.body.name.should.be.eql(updatedAdventure.name);
          done();
        });
    });
  });

  describe("DELETE adventure succesfully", () => {
    it("should DELETE an adventure", (done) => {
      chai
        .request(app)
        .delete("/api/adventure/" + adventureToDeleteId)
        .set({ "x-access-token": creatorToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.adventure.ok.should.be.a("number");
          res.body.adventure.ok.should.be.eql(1);
          res.body.adventure.deletedCount.should.be.a("number");
          res.body.adventure.deletedCount.should.be.eql(1);
          done();
        });
    });
  });
});
