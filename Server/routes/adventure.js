const express = require('express');
const router = express.Router();
const Adventure = require('../models/game/adventure');

const authMiddleware = require('../middlewares/authMiddleware')
const adventureMiddleware = require('../middlewares/adventureMiddleware');
const verifyToken = require('../middlewares/verifyToken');

router.get('', [] , async (req, res) => {
    Adventure.find({}, (err, adventures) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json(adventures);
    });
})

router.get('/:adventure_id', [] , async (req, res) => {
    const _id = req.params.adventure_id;
    Adventure.findOne({_id: _id}, (err, adventure) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json(adventure);
    });
});

// router.post('',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.post('',  [adventureMiddleware.verifyBody], async (req, res) => {
    const newAdventure = new Adventure(req.body);
    newAdventure.save((err, adventure) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        res.status(200).json(adventure);
    })
});

// router.put('/:adventure_id',  [verifyToken, authMiddleware.isAdmin, adventureMiddleware.verifyBody], async (req, res) => {
router.put('/:adventure_id',  [adventureMiddleware.verifyBody], async (req, res) => {
    const id = req.params.adventure_id;
    Adventure.findOne({_id: id}, (err, adventure) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        adventure.name = req.body.name;
        adventure.description = req.body.description;
        adventure.nodes = req.body.nodes;
        adventure.links = req.body.links;
        adventure.save((err, result) => {
            if(err) {
                return res.status(400).json({
                    err
                });
            }
            res.status(200).json(result);
        })
    });
});

module.exports = router;