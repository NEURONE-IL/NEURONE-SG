// set test environment
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/auth/user");
const Role = require("../models/auth/role");
const bcrypt = require("bcryptjs");
const app = require("../app");

// Set test to use chai
chai.use(chaiHttp);
chai.should();

describe("Auth API", () => {
  before(async () => {
    // Reset DB
    await User.deleteMany({});
    await Role.deleteMany({});

    // Create roles
    let adminRole = new Role({
      name: "admin",
    });
    let playerRole = new Role({
      name: "player",
    });
    let creatorRole = new Role({
      name: "creator",
    });
    // Save roles
    await adminRole.save();
    await playerRole.save();
    await creatorRole.save();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("hola123", salt);

    // confirmed admin
    let newAdmin = new User({
      username: "admin",
      email: "admin@admin.cl",
      password: password,
      role: adminRole,
      confirmed: true,
    });
    // confirmed player
    let newPlayer = new User({
      username: "player",
      email: "player@mail.cl",
      password: password,
      role: playerRole,
      confirmed: true,
    });
    // not confirmed creator
    let newCreator = new User({
      username: "creator",
      email: "creator@mail.cl",
      password: password,
      role: creatorRole,
      confirmed: false,
    });

    // Save users
    await newAdmin.save();
    await newPlayer.save();
    await newCreator.save();
  });

  describe("succesful login", () => {
    it("should get access token", (done) => {
      let credentials = {
        email: "player@mail.cl",
        password: "hola123",
      };
      chai
        .request(app)
        .post("/api/auth/login")
        .send(credentials)
        .end((err, res) => {
          res.body.token.should.be.a("string");
          done();
        });
    });
  });

  describe("login wrong password", () => {
    it("should get invalid credentials code", (done) => {
      let credentials = {
        email: "player@mail.cl",
        password: "hola124",
      };
      chai
        .request(app)
        .post("/api/auth/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.a("string");
          res.text.should.be.equal("INVALID_PASSWORD");
          done();
        });
    });
  });

  describe("login non existent email", () => {
    it("should get email not found code", (done) => {
      let credentials = {
        email: "player@notfound.cl",
        password: "hola124",
      };
      chai
        .request(app)
        .post("/api/auth/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.a("string");
          res.text.should.be.equal("EMAIL_NOT_FOUND");
          done();
        });
    });
  });

  describe("login not confirmed user", () => {
    it("should get not confirmed code", (done) => {
      let credentials = {
        email: "creator@mail.cl",
        password: "hola123",
      };
      chai
        .request(app)
        .post("/api/auth/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(400);
          res.text.should.be.a("string");
          res.text.should.be.equal("USER_NOT_CONFIRMED");
          done();
        });
    });
  });

  describe("succesful player signup", () => {
    it("should get registered player", (done) => {
      let credentials = {
        username: "test_player",
        email: "test_player@mail.cl",
        password: "hola123",
      };
      chai
        .request(app)
        .post("/api/auth/register")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.a("string");
          res.body.code.should.be.equal("USER_REGISTERED");
          done();
        });
    });
  });

  describe("succesful admin signup", () => {
    it("should get registered admin", (done) => {
      let credentials = {
        username: "test_admin",
        email: "test_admin@mail.cl",
        password: "hola123",
      };
      chai
        .request(app)
        .post("/api/auth/register/admin")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.a("string");
          res.body.code.should.be.equal("USER_REGISTERED");
          done();
        });
    });
  });

  describe("succesful creator signup", () => {
    it("should get registered creator", (done) => {
      let credentials = {
        username: "test_creator",
        email: "test_creator@mail.cl",
        password: "hola123",
      };
      chai
        .request(app)
        .post("/api/auth/register/creator")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.code.should.be.a("string");
          res.body.code.should.be.equal("USER_REGISTERED");
          done();
        });
    });
  });
});
