const express = require('express');
const router = express.Router();
const Invitation = require('../models/admin/invitation');
const User = require('../models/auth/user');
const Adventure = require('../models/game/adventure');
const AdminNotification = require('../models/admin/adminNotification');

const authMiddleware = require('../middlewares/authMiddleware');
const verifyToken = require('../middlewares/verifyToken');

//Traer todas las invitaciones de un usuario

router.get('/byUser/:user_id' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _user = req.params.user_id;
  Invitation.find({user: _user}, (err, invitations) =>{
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      invitations.reverse();
      res.status(200).json({invitations});
  }).populate({path: 'user', model: User, select:'-password'}).populate({path:'adventure', model: Adventure, populate: {path: 'user', model: User, select:'-password'}});
})

router.get('/checkExist/:user_id/:adventure_id' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
    const _user = req.params.user_id;
    const _adventure = req.params.adventure_id;
    const invitation = await Invitation.findOne({user: _user, status: 'Pendiente', adventure: _adventure}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    })
    console.log(invitation)
    if(invitation != null)
        return res.status(200).json({message: "EXISTING_INVITATION"})
    else  
        return res.status(200).json({message: "NOT_EXISTING_INVITATION"})

  })

//Para aceptar una invitación
router.put('/acceptInvitation/:type' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
    const type = req.params.type
    const _invitation = req.body._id;
    const invitation = await Invitation.findOne({_id: _invitation}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'});

    const adventure = await Adventure.findOne( {_id: invitation.adventure}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'})
    let _user = invitation.user._id;
    console.log(_user);
    console.log(adventure.collaborators);

    if(type === 'invitation'){
        let index = adventure.collaborators.findIndex( coll => JSON.stringify(coll.user) === JSON.stringify(_user))
        adventure.collaborators[index].invitation = 'Aceptada'
        
        const newNotification = new AdminNotification ({
            userFrom: invitation.user,
            userTo: adventure.user,
            type: 'invitation_response',
            description:invitation.user.username+' ha aceptado colaborar en su aventura: '+adventure.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    else{
        //El user de la invitation es quien pidió ser colaborador
        let newColl = {user: invitation.user, invitation:'Aceptada'};
        adventure.collaborators.push(newColl);
        
        const newNotification = new AdminNotification ({
            userFrom: adventure.user,
            userTo: invitation.user,
            type: 'invitation_response',
            description: adventure.user.username +' ha aceptado su solicitud de colaboración en la aventura: '+adventure.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    
    adventure.updatedAt = Date.now();
    adventure.save((err, adventure) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
    })

    invitation.status = 'Aceptada';
    invitation.save( async (err, invitation) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await invitation.populate({path: 'user', model: User, select:'-password'})
                        .populate({path:'adventure', model: Adventure, populate: {path: 'user', model: User, select:'-password'}}).execPopulate()
        res.status(200).json({
            invitation
        });
    })

  })

router.put('/rejectInvitation/:type' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
    const type = req.params.type;

    const _invitation = req.body._id;
    const invitation = await Invitation.findOne({_id: _invitation}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'});
    console.log(invitation);
    const adventure = await Adventure.findOne( {_id: invitation.adventure}, err =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    }).populate({path:'user', model: User, select:'-password'})
    
    if(type === 'invitation'){
        let _user = JSON.stringify(invitation.user);
        let index = adventure.collaborators.findIndex( coll => JSON.stringify(coll.user) === _user);
        adventure.collaborators.splice( index, 1 );
        adventure.updatedAt = Date.now();
        adventure.save((err, adventure) => {
            if (err) {
                return res.status(404).json({
                    err
                });
            }
        })
        const newNotification = new AdminNotification ({
            userFrom: invitation.user,
            userTo: adventure.user,
            type: 'invitation_response',
            description: invitation.user.username +' ha rechazado su invitación para colaborar en la aventura: '+ adventure.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }
    else{
        const newNotification = new AdminNotification ({
            userFrom: adventure.user,
            userTo: invitation.user,
            type: 'invitation_response',
            description: adventure.user.username +' ha rechazado su solicitud de colaboración en la aventura: '+adventure.name,
            seen: false,
        });
        newNotification.save(err => {
            if(err){
                return res.status(404).json({
                    err
                });
            }
        })
    }

    invitation.status = 'Rechazada';
    invitation.save( async (err, invitation) => {
        if (err) {
            return res.status(404).json({
                err
            });
        }
        await invitation.populate({path: 'user', model: User, select:'-password'})
                        .populate({path:'adventure', model: Adventure, populate: {path: 'user', model: User, select:'-password'}}).execPopulate()
        res.status(200).json({
            invitation
        });
    })

  })

  
//Método para crear una invitación
router.post('/requestCollaboration' ,  [verifyToken, authMiddleware.isCreator], async (req, res) => {
    const invitation = new Invitation ({
        user: req.body.user,
        adventure: req.body.adventure._id,
        status: 'Pendiente',
    });
    invitation.save( err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    const notification = new AdminNotification ({
        userFrom:req.body.user,
        userTo: req.body.adventure.user._id,
        type: 'collabRequest',
        invitation: invitation._id,
        description:req.body.user.username + ' desea colaborar en su aventura: ' + req.body.adventure.name,
        seen: false,
    });
    notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
    })
    res.status(200).json({
        invitation
    });
});


module.exports = router;
