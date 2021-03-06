const mongoose = require('mongoose');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const GridFsStorage = require('multer-gridfs-storage');
const config = require('config');
const Grid = require('gridfs-stream');

const filesGridFS = {};

// Init gfs and get mongoose connection
const conn = mongoose.connection;
filesGridFS.gfs = {};

conn.once('open', () => {
  // Init stream
  filesGridFS.gfs = Grid(conn.db, mongoose.mongo);  
  filesGridFS.gfs.collection('files');
});

// Create storage engine
const storage = new GridFsStorage({
  url: config.DBHost,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: 'files'
        };
        resolve(fileInfo);
    });
  }
});

filesGridFS.upload = multer({ storage });

 module.exports = filesGridFS;