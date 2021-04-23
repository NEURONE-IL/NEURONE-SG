const express = require("express");
const router = express.Router();
const Progress = require("../models/game/progress");
const verifyToken = require("../middlewares/verifyToken");
const authMiddleware = require("../middlewares/authMiddleware");
const progressMiddleware = require("../middlewares/progressMiddleware");

router.get("", [verifyToken], async (req, res) => {
  Progress.find({}, (err, progresses) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    res.status(200).json(progresses);
  });
});

router.get("/user/:user_id", [verifyToken], async (req, res) => {
  const user_id = req.params.user_id;
  Progress.find({user: user_id}, (err, progresses) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    return res.status(200).json(progresses);
  });
});

router.post(
  "",
  [verifyToken, progressMiddleware.verifyBody],
  async (req, res) => {
    const user_id = req.body.user;
    const adventure_id = req.body.adventure;
    const updatedProgress = req.body;
    console.log("about to find and replace");
    Progress.findOneAndReplace(
      { user: user_id, adventure: adventure_id },
      updatedProgress,
      null,
      (error, result) => {
        if (!error) {
          console.log("no error");
          if (!result) {
            console.log("not found");
            result = new Progress(updatedProgress);
          }
          console.log("save");
          result.save((error, saveResult) => {
            if (error) {
              console.log("error saving");
              return res.status(404).json({
                ok: false,
                err,
              });
            }
            return res.status(200).json(saveResult);
          });
        }
      }
    );
  }
);

module.exports = router;
