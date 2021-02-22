const express = require('express');
const router = express.Router();
const Answer = require('../models/game/answer');
const MultipleAnswer = require('../models/game/multiple_answer');
const Adventure = require('../models/game/adventure');
const answerService = require('../services/game/answer')

const authMiddleware = require('../middlewares/authMiddleware')
const answerMiddleware = require('../middlewares/answerMiddleware');
const verifyToken = require('../middlewares/verifyToken');
const config = require("config");



// router.post('',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.post('',  [answerMiddleware.verifyBody, verifyToken], async (req, res) => {
    let newAnswer;
    if(req.body.type=='question') {
        newAnswer = new Answer(req.body);
    }
    if(req.body.type=='multiple') {
        newAnswer = new MultipleAnswer(req.body);
    }
    newAnswer.save(async (err, answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        if (config.util.getEnv("NODE_ENV") == "test") {
          res.status(200).json(answer);
        }
        Adventure.findById(answer.adventure, async (err, adventure) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
            const node = adventure.nodes.id(answer.node);
            if (node) {
                const challenge = node.challenge;
                const answerCheck = await answerService.checkAnswer(node, challenge, answer);
                res.status(200).json(answerCheck);
            }
            else {
                return res.status(404).json({
                    msg: 'NODE_NOT_FOUND'
                });
            }
        });
    })
});

router.get("", [verifyToken], async (req, res) => {
    Answer.find({}, (err, answers) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json(answers);
    });
  });
  
  router.get("/:answer_id", [verifyToken], async (req, res) => {
    const _id = req.params.answer_id;
    Answer.findOne({ _id: _id }, (err, answer) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
      res.status(200).json(answer);
    });
  });

  router.put(
    "/:answer_id",
    [answerMiddleware.verifyBody, verifyToken],
    async (req, res) => {
      console.log('updating!!');
      const id = req.params.answer_id;
      if(req.body.type=='question') {
        Answer.findOne({ _id: id }, (err, answer) => {
          if (err) {
            return res.status(404).json({
              ok: false,
              err,
            });
          }
          answer.node = req.body.node;
          answer.user = req.body.user;
          answer.answer = req.body.answer;
          answer.type = req.body.type;
          answer.save((err, result) => {
            if (err) {
              return res.status(400).json({
                err,
              });
            }
            res.status(200).json(result);
          });
        });
      }
      if(req.body.type=='multiple') {
        MultipleAnswer.findOne({ _id: id }, (err, answer) => {
          if (err) {
            return res.status(404).json({
              ok: false,
              err,
            });
          }
          answer.node = req.body.node;
          answer.user = req.body.user;
          answer.answer = req.body.answer;
          answer.type = req.body.type;
          answer.save((err, result) => {
            if (err) {
              return res.status(400).json({
                err,
              });
            }
            res.status(200).json(result);
          });
        });
      }
    }
  );

  router.delete("/:answer_id", [verifyToken], async (req, res) => {
    const _id = req.params.answer_id;
    Answer.deleteOne({ _id: _id }, (err, answer) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      res.status(200).json({
        answer,
      });
    });
  });

module.exports = router;;