const express = require("express");
const router = express.Router();
const Adventure = require("../models/game/adventure");
const AdventureAssistant = require("../models/game/adventureAssistant")
const Progress = require("../models/game/progress");
const { nanoid } = require("nanoid");
const path = require("path");
const jwt = require("jsonwebtoken");
const imagesGridFS = require("../middlewares/imagesGridFS");
const adventureMiddleware = require("../middlewares/adventureMiddleware");
const authMiddleware = require("../middlewares/authMiddleware")
const verifyToken = require("../middlewares/verifyToken");
const imageHelper = require("../helpers/imagesHelper");

router.get("", [verifyToken, authMiddleware.isCreator], async (req, res) => {
  Adventure.find({}, (err, adventures) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    else {
      res.status(200).json(adventures);
    }
  });
});

router.get("/player/:user_id", [verifyToken], async (req, res) => {
  const userId = req.params.user_id;
  Progress.find({ user: userId }, (err, progresses) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    Adventure.find({}, (err, adventures) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      let playableAdventures = [];
      validatePreconditions(adventures, progresses, playableAdventures);
      res.status(200).json(playableAdventures);
    });
  });
});

router.get("/:adventure_id", [verifyToken], async (req, res) => {
  const _id = req.params.adventure_id;
  Adventure.findOne({ _id: _id }, (err, adventure) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    res.status(200).json(adventure);
  });
});

router.post(
  "",
  [verifyToken, authMiddleware.isCreator, adventureMiddleware.verifyBody],
  async (req, res) => {
    const newAdventure = new Adventure(req.body);
    newAdventure.save((err, adventure) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      res.status(200).json(adventure);
    });
  }
);

router.post(
  "/new",
  [
    verifyToken,
    authMiddleware.isCreator,
    imagesGridFS.upload.single("file"),
    adventureMiddleware.verifyNewBody,
  ],
  async (req, res) => {
    const initialAdventure = req.body;
    if (req.file) {
      initialAdventure.image_id = req.file.id;
    }
    initialAdventure.nodes = [
      {
        id: nanoid(13),
        type: "initial",
        label: "Start",
        data: {
          text: "...",
        },
      },
    ];

    const newAdventure = new Adventure(initialAdventure);

    try {
      let authToken = req.header("x-access-token");
      let userId = jwt.verify(authToken, process.env.TOKEN_SECRET)._id;
      if (userId) {
        newAdventure.user = userId;
      }
    } catch (error) {
      console.log("couldn't set user adventure relationship.");
    }

    newAdventure.save((err, adventure) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      res.status(200).json(adventure);
    });
  }
);

router.put(
  "/:adventure_id",
  [verifyToken, authMiddleware.isCreator, adventureMiddleware.verifyBody],
  async (req, res) => {
    const id = req.params.adventure_id;
    Adventure.findOne({ _id: id }, (err, adventure) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      adventure.name = req.body.name;
      adventure.description = req.body.description;
      adventure.nodes = req.body.nodes;
      adventure.links = req.body.links;
      if (req.body.image_id && adventure.image_id!=req.body.image_id) {
        imageHelper.deleteImage(adventure.image_id);
        adventure.image_id = req.body.image_id;
      }
      else if(!req.body.image_id) {
        imageHelper.deleteImage(adventure.image_id);
        adventure.image_id = undefined;
      }
      if (req.body.preconditions) {
        adventure.preconditions = req.body.preconditions;
      } else {
        adventure.preconditions = undefined;
      }
      adventure.save((err, result) => {
        if (err) {
          return res.status(400).json({
            err,
          });
        }
        res.status(200).json(result);
      });
    });
  }
);

router.delete("/:adventure_id", [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.adventure_id;
  Adventure.deleteOne({ _id: _id }, (err, adventure) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
    res.status(200).json({
      adventure,
    });
  });
});

function validatePreconditions(adventures, progresses, playableAdventures) {
  adventures.forEach((adv) => {
    if (adv.preconditions && adv.preconditions.length > 0) {
      let count = 0;
      adv.preconditions.forEach((pre) => {
        let foundProgress = progresses.filter((pro) => {
          return pre.equals(pro.adventure) && pro.finished;
        });
        if (foundProgress.length > 0) count++;
      });
      if (count == adv.preconditions.length) {
        playableAdventures.push(adv);
      }
    } else {
      playableAdventures.push(adv);
    }
  });
}

router.get('/:adventure_id/assistant', async (req, res) => {
  let adventure_id = req.params.adventure_id;
  const adventure = await Adventure.findOne({_id: adventure_id}, err => {
      if (err) {
          return res.status(404).json({
              ok: false,
              err: 'Adventure not found!'
          });
      }
  });
  if(!adventure){
      return res.status(404).json({
          ok: false,
          err: 'Adventure not found!'
      });
  }
  else{
      AdventureAssistant.findOne({adventure: adventure._id}, (err, adventureAssistant) => {
          if (err) {
              return res.status(404).json({
                  ok: false,
                  err: 'Adventure not found!'
              });
          }
          else{
              res.status(200).json({
                  ok: true,
                  adventureAssistant
              });
          }
      });
  }
});

router.post('/:adventure_id/assistant', async (req, res) => {
  let adventure_id = req.params.adventure_id;
  const adventure = await Adventure.findOne({_id: adventure_id}, err => {
      if (err) {
          return res.status(404).json({
              ok: false,
              err: 'Adventure not found!'
          });
      }
  });
  if(!adventure){
      return res.status(404).json({
          ok: false,
          err: 'Adventure not found!'
      });
  }
  else{
      const adventureAssistant = new AdventureAssistant({
          adventure: adventure._id,
          assistant: req.body.assistant
      })
      adventureAssistant.save((err, adventureAssistant)=> {
          if(err){
              return res.status(404).json({
                  ok: false,
                  err,
                });   
          }
          res.status(200).json({
              ok: true,
              adventureAssistant
          });
      })
  }
});

router.put('/:adventure_id/assistant', async (req, res) => {
  let adventure_id = req.params.adventure_id;
  const adventure = await Adventure.findOne({_id: adventure_id}, err => {
      if (err) {
          return res.status(404).json({
              ok: false,
              err: 'Adventure not found!'
          });
      }
  });
  if(!adventure){
      return res.status(404).json({
          ok: false,
          err: 'Adventure not found!'
      });
  }
  else{
      const adventureAssistant = await AdventureAssistant.findOne({adventure: adventure._id}, err => {
          if (err) {
              return res.status(404).json({
                  err: 'Adventure not found!'
              });
          }
      });
      adventureAssistant.assistant = req.body.assistant;
      adventureAssistant.save((err, adventureAssistant)=> {
          if(err){
              return res.status(404).json({
                  ok: false,
                  err,
                });   
          }
          res.status(200).json({
              ok: true,
              adventureAssistant
          });
        })
  }
});

module.exports = router;
