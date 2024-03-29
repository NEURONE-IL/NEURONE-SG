const express = require('express');
const router = express.Router();
const Invitation = require('../models/admin/invitation');
const History = require('../models/admin/history');
const AdminNotification = require('../models/admin/adminNotification');
const User = require('../models/auth/user');
const Adventure = require('../models/game/adventure');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

/*
@Valentina Ligueño
TESTED: Traer todas las notificaciones de un usuario
*/
router.get('/byUser/:user_id' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _user = req.params.user_id;
  AdminNotification.find({userTo: _user}, (err, notifications) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      notifications.reverse();
      res.status(200).json({message:'Admin Notification by user successfully get', notifications});
  }).populate({path: 'userFrom', model: User, select:'-password'})
    .populate({path: 'userTo', model: User, select:'-password'})
    .populate({path: 'invitation', model: Invitation, populate: {path:'adventure', model: Adventure, populate: {path: 'user', model: User, select:'-password'}}})
    .populate({path: 'history', model: History, populate: {path:'user', model: User, select:'-password'}})
})

/*
@Valentina Ligueño
TESTED: Actualizar a vistas todas las invitaciones
*/
router.put('/seeNotifications' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
    const _user_id = req.body.userTo._id;
    await AdminNotification.find({userTo: _user_id, seen: false}, (err, notifications)=> {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        else{
          notifications.forEach(async not => { 
                not.seen = true;
                not.save( async err => {
                    if (err) {
                        return res.status(404).json({
                            err
                        });
                    }
                })
            })
            res.status(200).json({message: 'Successfully change of seen status for admin notifications'})
        }
    })
    
  })

module.exports = router;
