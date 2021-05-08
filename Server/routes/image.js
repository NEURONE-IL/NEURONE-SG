const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authMiddleware = require("../middlewares/authMiddleware");

const imagesGridFS = require("../middlewares/imagesGridFS");
const verifyToken = require("../middlewares/verifyToken");

router.get("/:id", async (req, res) => {
  try {
    const image_id = new mongoose.mongo.ObjectId(req.params.id)
  imagesGridFS.gfs
    .find({ _id: image_id })
    .toArray((err, files) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      if (!files || files.length === 0) {
        return res.status(404).json({
          msg: "FILE_NOT_FOUND",
        });
      }
      if (
        files[0].contentType === "image/jpeg" ||
        files[0].contentType === "image/png"
      ) {
        imagesGridFS.gfs
          .openDownloadStream(image_id)
          .pipe(res);
      } else {
        return res.status(404).json({
          msg: "ERROR_FETCHING_IMAGE",
        });
      }
    });
  }
  catch {
    return res.status(404).json({
      msg: "ERROR_FETCHING_IMAGE",
    });
  }
  
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
  [verifyToken, authMiddleware.isCreator, imagesGridFS.upload.single("file")],
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
