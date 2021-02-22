// set test environment
process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiHttp = require("chai-http");
const User = require("../models/auth/user");
const Role = require("../models/auth/role");
const Adventure = require("../models/game/adventure");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { default: axios } = require("axios");
const request = require("supertest");

// Set test to use chai
chai.use(chaiHttp);
chai.should();

var playerToken = null;
var creatorToken = null;

describe("Adventures API", () => {
  before(async () => {
    // Reset DB
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
        console.log('playertoken: ',playerToken)
      chai
        .request(app)
        .get("/api/adventure")
        .set({'x-access-token':playerToken})
        .end((err, res) => {
          console.log("adventures: ", res.body);
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
});
