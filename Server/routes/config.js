const express = require("express");
const router = express.Router();
const Config = require("../models/game/config");
const verifyToken = require("../middlewares/verifyToken");
const configMiddleware = require("../middlewares/configMiddleware");

router.get("", [], async (req, res) => {
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

// router.post("", [verifyToken, configMiddleware.verifyBody], async (req, res) => {
//   const newConfig = new Config(req.body);
//   newConfig.save((err, config) => {
//     if (err) {
//       return res.status(404).json({
//         err,
//       });
//     }
//     res.status(200).json(config);
//   });
// });

router.put(
  "/:config_id",
  [verifyToken, configMiddleware.verifyBody],
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
    // Config.findOne({ _id: id }, (err, config) => {
    //   if (err) {
    //     return res.status(404).json({
    //       ok: false,
    //       err,
    //     });
    //   }
    //   config = new Config(req.body);
    //   config.save((err, result) => {
    //     if (err) {
    //       return res.status(400).json({
    //         err,
    //       });
    //     }
    //     res.status(200).json(result);
    //   });
    // });
  }
);

module.exports = router;
