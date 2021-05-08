//PORT
process.env.APP_PORT = process.env.APP_PORT || 3002;

//token secret
process.env.TOKEN_SECRET = "ady7asdy78";

//DB
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_PORT = process.env.MONGO_PORT || "";
const MONGO_DB = process.env.MONGO_DB || "";
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || "";

process.env.MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
// process.env.MONGO_URI = "mongodb://localhost:27017/neurone-sg";

//NEURONE GM
process.env.NEURONEGM = process.env.GM_URL || "http://198.199.75.148:3080";

// NEURONE Docs path
process.env.NEURONE_DOCS =
  process.env.NEURONE_DOCS_PATH || "/home/neurone/neuroneAssets";

// EMAIL Service
process.env.SENDEMAIL_USER = process.env.SENDEMAIL_USER || "user@mail.com";
process.env.SENDEMAIL_PASSWORD = process.env.SENDEMAIL_PASSWORD || "userpass";
