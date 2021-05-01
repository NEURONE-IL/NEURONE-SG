//PORT
process.env.PORT = process.env.PORT || 3002;

//token secret
process.env.TOKEN_SECRET = 'ady7asdy78'

//DB
const MONGO_USERNAME = process.env.MONGO_USERNAME || ''
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || ''
const MONGO_PORT = process.env.MONGO_PORT || ''
const MONGO_DB = process.env.MONGO_DB || ''
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || ''

process.env.MONGO_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
// process.env.MONGO_URI = 'mongodb://mongo:27017/neurone-adv';

//NEURONE GM
process.env.NEURONEGM = process.env.GM_URL || 'http://localhost:3080'

// NEURONE Docs path
process.env.NEURONE_DOCS = process.env.NEURONE_DOCS_PATH || '/home/neurone/neuroneAssets'