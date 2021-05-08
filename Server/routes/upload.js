const express = require("express");
const fg = require("../middlewares/imagesGridFS");
const router = express.Router();


router.get('/', (req, res) => {
  fg.gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });
});

router.post('/upload', fg.upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

module.exports = router;
