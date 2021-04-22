const imagesGridFS = require("../middlewares/imagesGridFS");
const mongoose = require("mongoose");

const deleteImage = (imageId) => {
  if (imageId) {
    const imageObjectId = new mongoose.mongo.ObjectId(imageId);
    console.log("delete ", imageId);
    imagesGridFS.gfs.delete(imageObjectId);
  }
};

const imageHelper = {
  deleteImage,
};

module.exports = imageHelper;
