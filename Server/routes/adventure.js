const express = require("express");
const router = express.Router();
const Adventure = require("../models/game/adventure");
const { nanoid } = require("nanoid");

const adventureMiddleware = require("../middlewares/adventureMiddleware");
const verifyToken = require("../middlewares/verifyToken");

router.get("", [verifyToken], async (req, res) => {
  Adventure.find({}, (err, adventures) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    res.status(200).json(adventures);
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

// router.post('',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.post(
  "",
  [adventureMiddleware.verifyBody, verifyToken],
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
  [adventureMiddleware.verifyNewBody, verifyToken],
  async (req, res) => {
    const initialAdventure = req.body;
    initialAdventure.nodes = [
      {
        id: nanoid(13),
        type: "initial",
        label: "Start",
        data: {
          image: "",
          video: "",
          text: "sample text",
        },
      },
    ];
    const newAdventure = new Adventure(initialAdventure);
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

// router.put('/:adventure_id',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.put(
  "/:adventure_id",
  [adventureMiddleware.verifyBody, verifyToken],
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

// router.delete('/:adventure_id',  [verifyToken, authMiddleware.isAdmin] , async (req, res) => {
router.delete("/:adventure_id", [], async (req, res) => {
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

module.exports = router;
