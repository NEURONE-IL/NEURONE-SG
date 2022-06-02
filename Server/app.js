const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const config = require("config");
const bodyParser = require("body-parser");
const path = require("path");
const { initial } = require("./helpers/dataLoader");
const morgan = require("morgan");

// Setup env
require("./config/config");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/auth");
const confirmationRoutes = require("./routes/confirmation");
const adventureRoutes = require("./routes/adventure");
const adventureSearchRoutes = require('./routes/adventureSearch');
const invitationRoutes = require('./routes/invitation');
const adminNotificationRoutes = require('./routes/adminNotification');
const historyRoutes = require('./routes/history')
const answerRoutes = require("./routes/answer");
const gamificationRoutes = require("./routes/gamification");
const configRoutes = require("./routes/config");
const progressRoutes = require("./routes/progress");
const imageRoutes = require("./routes/image");
const siteRoutes = require("./routes/site");

// Import tracking routes
const keystrokeRoutes = require("./routes/tracking/keystroke");
const mouseClickRoutes = require("./routes/tracking/mouseClick");
const mouseCoordinateRoutes = require("./routes/tracking/mouseCoordinate");
const queryRoutes = require("./routes/tracking/query");
const sessionLogRoutes = require("./routes/tracking/sessionLog");
const visitedLinkRoutes = require("./routes/tracking/visitedLink");
const ScrollRoutes = require("./routes/tracking/scroll");
const EventRoutes = require("./routes/tracking/event");

// Setup DB
const dbOptions = {
  useNewUrlParser: true,
  connectTimeoutMS: 10000,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

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

app.use(morgan("combined"));

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
app.use("/api/site", siteRoutes);
app.use("/", confirmationRoutes);
app.use('/api/adventureSearch/', adventureSearchRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/adminNotification", adminNotificationRoutes);


// Use tracking routes
app.use("/api/keystroke", keystrokeRoutes);
app.use("/api/mouseClick", mouseClickRoutes);
app.use("/api/mouseCoordinate", mouseCoordinateRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/sessionLog", sessionLogRoutes);
app.use("/api/visitedLink", visitedLinkRoutes);
app.use("/api/scroll", ScrollRoutes);
app.use("/api/event", EventRoutes);

// Serve neurone docs
app.use("/assets/", express.static(process.env.NEURONE_DOCS));
app.get("/assets/downloadedDocs/*", function (req, res) {
  res.status(404).send("DOCUMENT_NOT_FOUND");
});

// Set client on root

// - Serve static content
app.use(express.static("public"));

// - Serve index
const allowedExt = [
  ".js",
  ".ico",
  ".css",
  ".png",
  ".jpg",
  ".woff2",
  ".woff",
  ".ttf",
  ".svg",
];

app.get('*', (req, res) => {
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(__dirname + `/public/${req.url}`));
  } else {
    res.sendFile(path.resolve(__dirname + '/public/index.html'));
  }
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `NEURONE-ADV-Server listening at http://localhost:${process.env.APP_PORT}`
  );
});

module.exports = app;
