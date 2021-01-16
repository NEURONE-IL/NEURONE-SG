const express = require('express');
const router = express.Router();
const Answer = require('../models/game/answer');

const authMiddleware = require('../middlewares/authMiddleware')
const answerMiddleware = require('../middlewares/answerMiddleware');
const verifyToken = require('../middlewares/verifyToken');



// router.post('',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.post('',  [answerMiddleware.verifyBody], async (req, res) => {
    const newAnswer = new Answer(req.body);
    newAnswer.save((err, answer) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json(answer);
    })
});

module.exports = router;