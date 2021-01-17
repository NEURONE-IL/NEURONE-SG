const express = require('express');
const router = express.Router();
const Answer = require('../models/game/answer');
const Adventure = require('../models/game/adventure');
const answerService = require('../services/game/answer')

const authMiddleware = require('../middlewares/authMiddleware')
const answerMiddleware = require('../middlewares/answerMiddleware');
const verifyToken = require('../middlewares/verifyToken');



// router.post('',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.post('',  [answerMiddleware.verifyBody], async (req, res) => {
    const newAnswer = new Answer(req.body);
    newAnswer.save(async (err, answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
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
                const answerCheck = await answerService.checkAnswer(challenge, answer);
                res.status(200).json(answerCheck);
            }
            else {
                return res.status(404).json({
                    msg: 'node not found'
                });
            }
        });
    })
});

module.exports = router;;