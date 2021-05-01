const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const config = require("config");
const bodyParser = require("body-parser");
const path = require("path");
const { initial } = require("./helpers/dataLoader");

// Setup env
require("./config/config");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const confirmationRoutes = require("./routes/confirmation");
const adventureRoutes = require("./routes/adventure");
const answerRoutes = require("./routes/answer");
const gamificationRoutes = require("./routes/gamification");
const configRoutes = require("./routes/config");
const progressRoutes = require("./routes/progress");
const imageRoutes = require("./routes/image");

// Import tracking routes
const keystrokeRoutes = require("./routes/tracking/keystroke");
const mouseClickRoutes = require("./routes/tracking/mouseClick");
const mouseCoordinateRoutes = require("./routes/tracking/mouseCoordinate");
const queryRoutes = require("./routes/tracking/query");
const sessionLogRoutes = require("./routes/tracking/sessionLog");
const visitedLinkRoutes = require("./routes/tracking/visitedLink");
const ScrollRoutes = require("./routes/tracking/scroll");

// Setup DB
const dbOptions = {
  useNewUrlParser: true,
  reconnectTries: 2,
  reconnectInterval: 500,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

console.log(process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, dbOptions)
  .then(function () {
    console.log("MongoDB is connected");
  })
  .then(() => {
    initial();
  })
  .catch(function (err) {
    console.log(err);
  });

let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB: Connection error:"));

// Setup CORS
app.use(cors());

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/json" }));

// Use game routes
app.use("/api/auth", authRoutes);
app.use("/api/adventure", adventureRoutes);
app.use("/api/answer", answerRoutes);
app.use("/api/gamification", gamificationRoutes);
app.use("/api/config", configRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/image", imageRoutes);
app.use("/", confirmationRoutes);

// Use tracking routes
app.use("/api/keystroke", keystrokeRoutes);
app.use("/api/mouseClick", mouseClickRoutes);
app.use("/api/mouseCoordinate", mouseCoordinateRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/sessionLog", sessionLogRoutes);
app.use("/api/visitedLink", visitedLinkRoutes);
app.use("/api/scroll", ScrollRoutes);

// Serve neurone docs
app.use("/assets/", express.static(process.env.NEURONE_DOCS));
// app.get("/assets/*", function (req, res) {
//   res.status(404).send("DOCUMENT_NOT_FOUND");
// });

// Set client on root

// - Serve static content
app.use(express.static("public"));
// - Serve index
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(
    `NEURONE-ADV-Server listening at http://localhost:${process.env.PORT}`
  );
});

module.exports = app;
