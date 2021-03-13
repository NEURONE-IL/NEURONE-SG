const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const config = require("config");
const bodyParser = require("body-parser");
const path = require('path');
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

// Import tracking routes
const keystrokeRoutes = require("./routes/tracking/keystroke");
const mouseClickRoutes = require("./routes/tracking/mouseClick");
const mouseCoordinateRoutes = require("./routes/tracking/mouseCoordinate");
const queryRoutes = require("./routes/tracking/query");
const sessionLogRoutes = require("./routes/tracking/sessionLog");
const visitedLinkRoutes = require("./routes/tracking/visitedLink");
const ScrollRoutes = require("./routes/tracking/scroll");

// Import upload route
const uploadRoutes = require("./routes/upload");

// Setup DB
mongoose
  .connect(config.DBHost, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    initial();
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
app.use("/", confirmationRoutes);

// Use tracking routes
app.use("/api/keystroke", keystrokeRoutes);
app.use("/api/mouseClick", mouseClickRoutes);
app.use("/api/mouseCoordinate", mouseCoordinateRoutes);
app.use("/api/query", queryRoutes);
app.use("/api/sessionLog", sessionLogRoutes);
app.use("/api/visitedLink", visitedLinkRoutes);
app.use("/api/scroll", ScrollRoutes);

// Use upload route
app.use("/api/files", uploadRoutes);

// Serve neurone docs
app.use("/assets/", express.static(process.env.NEURONE_DOCS));

// Set client on root

// - Serve static content
app.use(express.static('public'));
// - Serve index
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});

app.listen(process.env.PORT, () => {
  console.log(
    `NEURONE-ADV-Server listening at http://localhost:${process.env.PORT}`
  );
});

module.exports = app;
