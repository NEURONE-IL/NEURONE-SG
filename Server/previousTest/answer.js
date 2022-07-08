// set test environment
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/auth/user");
const Role = require("../models/auth/role");
const Adventure = require("../models/game/adventure");
const Answer = require("../models/game/answer");
const MultipleAnswer = require("../models/game/multiple_answer");
const bcrypt = require("bcryptjs");
const app = require("../app");
const request = require("supertest");

// Set test to use chai
chai.use(chaiHttp);
chai.should();

var playerToken = null;
var existingUserId = null;
var creatorToken = null;
var existingAdventureId = null;
var existingChallengeId = null;
var existingMultipleChallengeId = null;
var existingAnswerId = null;
var answerToUpdateId = null;
var answerToDeleteId = null;

describe("Answers API", () => {
  before(async () => {
    // Reset DB
    await Answer.deleteMany({});
    await Adventure.deleteMany({});
    await User.deleteMany({});
    await Role.deleteMany({});

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
    existingUserId = newPlayer._id;

    // Create initial adventure with a challenge

    let initialAdventure = new Adventure({
      name: "Aventura en el espacio",
      description: "Esta es una gran aventura donde salvarás la galaxia!",
      nodes: [
        {
          data: {
            image: "placeholder",
            video: "",
            text: "sample text",
          },
          id: "C4GcQgFsNpUUI",
          label: "Start",
          type: "initial",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "Te encuentras con un grupo de habitantes del planeta. Al parecer quieren preguntarte algo...",
          },
          challenge: {
            type: "question",
            question:
              "¿Cuál es la dimensión más importante para los habitantes de Ralifrey?",
            answer: "Tiempo",
          },
          id: "yn9xZgrnEFh3Q",
          label: "RalifreyDesafio",
          type: "challenge",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "Un grupo de habitantes autóctonos de la zona te detienen. Dicen ser pacíficos y quieren preguntarte cosas sobre la tierra. Al parecer, uno de ellos es fanático de la música de la tierra, dice que su nombre es Adam, y te plantea la siguiente pregunta:",
          },
          challenge: {
            type: "multiple",
            question:
              "De los siguientes artistas de la Tierra, ¿Cuáles tienen 50 o más discos de oro?",
            options: [
              {
                correct: true,
                value: "Elvis Presley",
              },
              {
                correct: true,
                value: "Barbra Streisand",
              },
              {
                correct: false,
                value: "The Beatles",
              },
            ],
          },
          id: "mm94A2TbhPYH2",
          label: "EnroraMultiple",
          type: "challenge",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text: "Felicidades, completaste tu aventura con un gran desempeño!",
          },
          label: "FinalGood",
          type: "ending",
          id: "nErOZRZCMk8T3",
        },
        {
          data: {
            image: "placeholder",
            video: "",
            text:
              "¡Rayos! Has tenido un mal desempeño y finalmente tu nave se ha averiado, no lograste volver a la tierra.",
          },
          label: "FinalBad",
          type: "ending",
          id: "xrffp2rly58eN",
        },
      ],
      links: [
        {
          label: "Ralifrey",
          source: "C4GcQgFsNpUUI",
          target: "yn9xZgrnEFh3Q",
        },
      ],
    });

    // Save adventure and store id
    await initialAdventure.save();
    existingAdventureId = initialAdventure._id;
    existingChallengeId = initialAdventure.nodes[1]._id;
    existingMultipleChallengeId = initialAdventure.nodes[2]._id;

    // Create existing answers
    let existingAnswer = new Answer({
      node: existingChallengeId,
      user: existingUserId,
      type: "question",
      answer: "Get me",
    });

    let answerToUpdate = new Answer({
      node: existingChallengeId,
      user: existingUserId,
      type: "question",
      answer: "Update me",
    });

    let answerToDelete = new Answer({
      node: existingChallengeId,
      user: existingUserId,
      type: "question",
      answer: "Delete me",
    });

    // save answers and IDs
    await existingAnswer.save();
    await answerToUpdate.save();
    await answerToDelete.save();
    existingAnswerId = existingAnswer._id;
    answerToUpdateId = answerToUpdate._id;
    answerToDeleteId = answerToDelete._id;

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

  describe("GET answer", () => {
    it("should GET all answers", (done) => {
      chai
        .request(app)
        .get("/api/answer")
        .set({ "x-access-token": playerToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");
          done();
        });
    });
  });

  describe("GET answer without authorization", () => {
    it("should fail to GET all answers", (done) => {
      chai
        .request(app)
        .get("/api/answer")
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe("GET certain answer", () => {
    it("should GET specific answer", (done) => {
      chai
        .request(app)
        .get("/api/answer/" + existingAnswerId)
        .set({ "x-access-token": playerToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.should.be.a("string");
          res.body.answer.should.be.eql("Get me");
          done();
        });
    });
  });

  describe("POST question type answer success", () => {
    it("should POST a question type answer succesfully", (done) => {
      let answer = {
        node: existingChallengeId,
        user: existingUserId,
        type: "question",
        answer: "Post me",
      };
      chai
        .request(app)
        .post("/api/answer")
        .set({ "x-access-token": playerToken })
        .send(answer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.should.be.eql(answer.answer);
          done();
        });
    });
  });

  describe("POST multiple type answer success", () => {
    it("should POST a multiple type answer succesfully", (done) => {
      let multipleAnswer = {
        answer: [
          { checked: true, value: "Elvis Presley" },
          { checked: false, value: "Barbra Streisand" },
          { checked: true, value: "The Beatles" },
        ],
        user: existingUserId,
        node: existingMultipleChallengeId,
        type: "multiple",
      };
      chai
        .request(app)
        .post("/api/answer")
        .set({ "x-access-token": playerToken })
        .send(multipleAnswer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.should.be.a("array");
          res.body.answer[0].should.be.eql({
            checked: true,
            value: "Elvis Presley",
          });
          done();
        });
    });
  });

  describe("PUT question type answer success", () => {
    it("should PUT a question type answer succesfully", (done) => {
      let answer = {
        node: existingChallengeId,
        user: existingUserId,
        type: "question",
        answer: "Updated answer",
      };
      chai
        .request(app)
        .put("/api/answer/" + answerToUpdateId)
        .set({ "x-access-token": creatorToken })
        .send(answer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.should.be.a('string');
          res.body.answer.should.be.eql(answer.answer);
          done();
        });
    });
  });

  describe("PUT multiple type answer success", () => {
    it("should PUT a multiple type answer succesfully", (done) => {
        let updatedMultipleAnswer = {
            answer: [
              { checked: false, value: "Elvis Presley" },
              { checked: false, value: "Barbra Streisand" },
              { checked: false, value: "The Beatles" },
            ],
            user: existingUserId,
            node: existingMultipleChallengeId,
            type: "multiple",
          };
      chai
        .request(app)
        .put("/api/answer/" + answerToUpdateId)
        .set({ "x-access-token": creatorToken })
        .send(updatedMultipleAnswer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.should.be.a('array');
          res.body.answer[0].checked.should.be.a('boolean');
          res.body.answer[0].checked.should.be.eql(false);
          done();
        });
    });
  });

  describe("DELETE answer success", () => {
    it("should DELETE an answer succesfully", (done) => {
      chai
        .request(app)
        .delete("/api/answer/" + answerToUpdateId)
        .set({ "x-access-token": creatorToken })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.answer.ok.should.be.a("number");
          res.body.answer.ok.should.be.eql(1);
          res.body.answer.deletedCount.should.be.a("number");
          res.body.answer.deletedCount.should.be.eql(1);
          done();
        });
    });
  });
});
