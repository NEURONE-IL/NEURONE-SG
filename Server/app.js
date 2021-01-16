const express = require('express');
const mongoose = require("mongoose");
const app = express();
const cors = require('cors');
const config = require('config');
const bodyParser = require("body-parser");
const { initial } = require("./helpers/dataLoader");

// Setup env
require('./config/config');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const confirmationRoutes = require('./routes/confirmation');
const adventureRoutes = require('./routes/adventure');
const answerRoutes = require('./routes/answer');

// Setup DB
mongoose.connect(config.DBHost, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(()=>{
        console.log("MongoDB: Successfully connected.");
        initial();
    });
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB: Connection error:'));

// Setup CORS
app.use(cors());

//parse application/json and look for raw text
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/json'}));

// Express routes
app.use('/api/auth', authRoutes);
app.use('/api/adventure', adventureRoutes);
app.use('/api/answer', answerRoutes);
app.use('/', confirmationRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to NEURONE-adv REST API!')
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})