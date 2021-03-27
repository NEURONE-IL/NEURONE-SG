const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const GridFsStorage = require("multer-gridfs-storage");
const config = require("config");
const Grid = require("gridfs-stream");

const imagesGridFS = {};

// Init gfs and get mongoose connection
const conn = mongoose.connection;
imagesGridFS.gfs = {};

conn.once("open", () => {
  // Init stream
  imagesGridFS.gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});

// Create storage engine
const storage = new GridFsStorage({
  url: config.DBHost,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "images",
        };
        resolve(fileInfo);
      });
    });
  },
  options: {
    useUnifiedTopology: true,
  },
});

imagesGridFS.upload = multer({ storage });

module.exports = imagesGridFS;
