const express = require("express");
const router = express.Router();
const Config = require("../models/game/config");
const verifyToken = require("../middlewares/verifyToken");
const configMiddleware = require("../middlewares/configMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("", async (req, res) => {
  Config.findOne({}, (err, configs) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    res.status(200).json(configs);
  });
});

router.put(
  "/:config_id",
  [verifyToken, [authMiddleware.isAdmin], configMiddleware.verifyBody],
  async (req, res) => {
    const id = req.params.config_id;
    const updatedConfig = req.body;
    Config.findOneAndReplace(
      { _id: id },
      updatedConfig,
      null,
      (err, config) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        }
        res.status(200).json({ oldConfig: config, newConfig: updatedConfig });
      }
    );
  }
);

module.exports = router;
