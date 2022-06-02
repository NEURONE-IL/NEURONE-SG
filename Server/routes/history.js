const express = require('express');
const router = express.Router();
const History = require('../models/admin/history');
const User = require('../models/auth/user');
const Adventure = require('../models/game/adventure');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

//Traer todo el historial
router.get('' , [verifyToken, authMiddleware.isCreator],async (req, res) => {
  History.find({}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  });
})

//Traer todo el historial de un usuario

router.get('/byUser/:user_id' ,  [verifyToken], async (req, res) => {
  const _user_id = req.params.user_id;
  History.find({user: _user_id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'adventure', model: Adventure});
})

//Traer todo el historial de un usuario según el tipo de registro

router.get('/byUserByType/:user_id/:type' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.user_id;
  const type = req.params.type;

  History.find({user: _id, type: type}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'adventure', model: Adventure});
})

//Traer todo el historial relacionado a una aventura

router.get('/byAdventure/:adventure_id' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.adventure_id;
  History.find({adventure: _id}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'adventure', model: Adventure})
})

//Traer todo el historial relacionado a un estudio según el tipo de registro

router.get('/byAdventureByType/:adventure_id/:type' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.adventure_id;
  const type = req.params.type;

  History.find({adventure: _id, type: type}, (err, histories) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({histories})
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'adventure', model: Adventure});;
})

router.post('',  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const history = new History(req.body);
  history.save((err, history) => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
      res.status(200).json({
          history
      });
  })
});

module.exports = router;