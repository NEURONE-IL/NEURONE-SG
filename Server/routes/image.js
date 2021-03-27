const express = require("express");
const router = express.Router();

const imagesGridFS = require("../middlewares/imagesGridFS");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:filename", async (req, res) => {
  imagesGridFS.gfs
    .find({ filename: req.params.filename })
    .toArray((err, files) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "No files exist",
        });
      }
      if (
        files[0].contentType === "image/jpeg" ||
        files[0].contentType === "image/png"
      ) {
        imagesGridFS.gfs
          .openDownloadStreamByName(req.params.filename)
          .pipe(res);
      } else {
        return res.status(404).json({
          err: "No Image",
        });
      }
    });
});

router.get("", async (req, res) => {
  imagesGridFS.gfs.find().toArray((err, files) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }
    return res.json(files);
  });
});

router.post(
  "",
  [verifyToken, imagesGridFS.upload.single("file")],
  async (req, res) => {
    if (req.file) {
      let imageData = {
        id: req.file.id,
        filename: req.file.filename,
      };
      return res.status(200).json(imageData);
    } else {
      return res.status(404).json({
        ok: false,
        msg: "COULDNT_UPLOAD_FILE",
      });
    }
  }
);

module.exports = router;
