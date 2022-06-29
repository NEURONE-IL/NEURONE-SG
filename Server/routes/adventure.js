const express = require("express");
const router = express.Router();
const axios = require("axios");
const Adventure = require("../models/game/adventure");
const AdventureSearch = require("../models/search/adventureSearch");
const User = require("../models/auth/user");
const History = require('../models/admin/history');
const AdminNotification = require('../models/admin/adminNotification');
const Invitation = require('../models/admin/invitation');
const AdventureAssistant = require("../models/game/adventureAssistant");
const Progress = require("../models/game/progress");
const { nanoid } = require("nanoid");
const path = require("path");
const jwt = require("jsonwebtoken");
const imagesGridFS = require("../middlewares/imagesGridFS");
const adventureMiddleware = require("../middlewares/adventureMiddleware");
const authMiddleware = require("../middlewares/authMiddleware")
const verifyToken = require("../middlewares/verifyToken");
const imageHelper = require("../helpers/imagesHelper");

/* Para Concurrencia D:*/
const { EventEmitter } = require('events');
var AsyncLock = require('async-lock');
var lock = new AsyncLock();

router.get("", [verifyToken, authMiddleware.isCreator], async (req, res) => {
  Adventure.find({}, async (err, adventures) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    else {
      res.status(200).json(adventures);
    }
  })
});

//Valentina
//Ruta para traer las aventuras filtradas por usuario
router.get("/byUser/:user_id", [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.user_id;
  
  Adventure.find({user: _id}, (err, adventures) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    else {
      res.status(200).json(adventures);
    }
  }).populate({
    path: 'collaborators',
    populate: {
      path: 'user',
      model: User,
      select:'-password' 
    }
  }).populate({path: 'user', model: User, select:'-password'});
});

//Ruta para traer las aventuras filtradas privacidad de un usuario
router.get('/byUserbyPrivacy/:user_id/:privacy', [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _privacy = JSON.parse(req.params.privacy);
  const _id = req.params.user_id; 
  
  Adventure.find({user: _id, privacy: _privacy}, (err, adventures) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({adventures});
  }).populate({
    path: 'collaborators',
    populate: {
      path: 'user',
      model: User,
      select:'-password' 
    }
  }).populate({path: 'user', model: User, select:'-password'});
});

//Método para obtener las aventuras por tipo de un usuario
router.get('/byUserbyType/:user_id/:type', [verifyToken, authMiddleware.isCreator] ,async (req, res) => {
  const type = req.params.type;
  const _id = req.params.user_id; 
  
  Adventure.find({user: _id, type: type}, (err, adventures) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }

      res.status(200).json({adventures});
  }).populate({
    path: 'collaborators',
    populate: {
      path: 'user',
      model: User,
      select:'-password' 
    }
  }).populate({path: 'user', model: User, select:'-password'})
});

//Método para obtener las aventuras de colaboración de un usuario en específico
router.get('/byUserCollaboration/:user_id', [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.user_id;
  
  Adventure.find({"collaborators": { 
                $elemMatch: {
                  user:_id,
                  invitation:'Aceptada'
                }
              }}, (err, adventures) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          })
      }
      res.status(200).json({adventures});
  }).populate({
    path: 'collaborators',
    populate: {
      path: 'user',
      model: User,
      select:'-password' 
    }
  }).populate({path: 'user', model: User, select:'-password'})
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
  }).populate({
    path: 'collaborators',
    populate: {
      path: 'user',
      model: User,
      select:'-password' 
    }
  }).populate({ path: 'user', model: User, select:'-password'});
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

router.post("/new",
[
    verifyToken,
    authMiddleware.isCreator,
    imagesGridFS.upload.single("file"),
    adventureMiddleware.verifyNewBody,
  ],
  async (req, res) => {
    const initialAdventure = req.body;
    //Valentina
    let collaborators = JSON.parse(req.body.collaborators);
    let tags = JSON.parse(req.body.tags);
    initialAdventure.collaborators = collaborators;
    if(tags.length > 0)
      initialAdventure.tags = tags;
    else
      initialAdventure.tags = ['ejemplo'];


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
    let userId = "";
    try {
      let authToken = req.header("x-access-token");
      userId = jwt.verify(authToken, process.env.TOKEN_SECRET)._id;
      if (userId) {
        newAdventure.user = userId;
      }
    } catch (error) {
      console.log("couldn't set user adventure relationship.");
    }
    if(collaborators.length > 0){
      collaborators.forEach( async coll => {
          const invitation = new Invitation ({
              user: coll.user,
              adventure: newAdventure._id,
              status: 'Pendiente',
          });
          invitation.save(err => {
              if(err){
                  return res.status(404).json({
                      err
                  });
              }
          })
          const notification = new AdminNotification ({
              userFrom:userId,
              userTo: coll.user,
              type: 'invitation',
              invitation: invitation._id,
              description:'Invitación para colaborar en la aventura: ' + newAdventure.name,
              seen: false,
          });
          notification.save(err => {
              if(err){
                  return res.status(404).json({
                      err
                  });
              }
          })
      });
    }

    newAdventure.save(async (err, adventure) => {
      if (err) {
        return res.status(404).json({
          err,
        });
      }
      await adventure.populate({path:'user', model:User}).execPopulate();
      if(adventure.privacy == false)
        createAdventureSearch(adventure);

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
      var privacyChange = false;
      adventure.name = req.body.name;
      adventure.description = req.body.description;
      adventure.nodes = req.body.nodes;
      adventure.links = req.body.links;
      adventure.tags = req.body.tags;
      adventure.collaborators = req.body.collaborators;

      let privacy = req.body.privacy;
      console.log('privacidad: ', privacy)

      if(adventure.privacy === privacy)
        privacyChange = false;
      else {
        adventure.privacy = privacy
        privacyChange = true;
      }
      console.log('Cambia la privacidad?',privacyChange)
      adventure.privacy = req.body.privacy;
      
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
        if(adventure.privacy == true && privacyChange)
          deleteAdventureSeach(adventure._id);
        else if(adventure.privacy == false && privacyChange)
          createAdventureSearch(adventure);
        else if(adventure.privacy == false && !privacyChange)
          updateAdventureSearch(adventure);
          
        res.status(200).json(result);
      })
    }).populate({path:'user', model:User});;
  }
);

/*************Valentina *************/

//Método para recibir cambios de edición de un estudio
router.get('/editStatus/:adventure_id/:user_id' ,async (req, res) => {
  console.log('Event Source for Adventure Edit Status');
  
  var Stream = new EventEmitter(); 
  const _adventure = req.params.adventure_id;       
  const _user = req.params.user_id;

  res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
  });

  Stream.on(_user+'/'+_adventure, function(event, data){
      res.write('event: '+ String(event)+'\n'+'data: ' + JSON.stringify(data)+"\n\n");
  })

  var id = setInterval(async function(){
      const adventure = await Adventure.findOne({_id:_adventure}, (err) => {
          if (err) {
              return res.status(404).json({
                  err
              });
          }
      }).populate({path:'edit', model:User});
      Stream.emit(_user+'/'+_adventure,'message',{currentUser: adventure.edit});

      if(adventure.edit === undefined){
        console.log('xx')
        Stream.removeAllListeners();
        clearInterval(id);
      }
  }, 5000); 
});

router.put('/requestEdit/:adventure_id'/*, [verifyToken, authMiddleware.isCreator]*/, async (req, res) => {
  
  const _adventure = req.params.adventure_id;
  const _user = req.body.user;

  console.log(_user + ' arrived');
  console.log('Entering to Function: ', new Date())

  lock.acquire(_adventure, async function(done) {
      console.log('Entering to Lock: ', new Date())
      console.log(_user + ' acquire');
      
      const adventure = await Adventure.findOne({_id:_adventure}, async (err, adv) => {
          if (err) {
              return res.status(404).json({
                  err
              });
          }
      }).populate({path:'edit', model:User});

      if(adventure.edit == undefined){
        adventure.edit = _user
        adventure.save(async (err,adv) => {
          if(err){
              return res.status(404).json({
                  ok: false,
                  err
              });
          }
          await adv.populate({path:'edit', model:User}).execPopulate();
          done(JSON.stringify(adv.edit._id));
          res.status(200).json({userEdit: adv.edit});
        })
        
      }
      else{
        done(JSON.stringify(adventure.edit._id));
        res.status(200).json({userEdit: adventure.edit});
      }
      
  }, async function(edit) {
      if(JSON.stringify(_user) == edit)
        console.log('Current ser can edit ');
      else
        console.log('Current ser can\' edit yet');

      console.log('Lock free...');
  })
})

router.put('/releaseAdventure/:adventure_id', [verifyToken, authMiddleware.isCreator], async (req, res) => {
  console.log('releaseEntrando')
  const _adventure = req.params.adventure_id;
  const _user = req.body.user;

  const adventure = await Adventure.findOne({_id:_adventure}, err => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
  });
  if(JSON.stringify(adventure.edit) === JSON.stringify(_user))
    adventure.edit = undefined;

  //console.log('Current adventure edit %s for %s',adventure.edit,adventure.name)
  adventure.save(err => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json(adventure);
  })
  //await delay(5); Para probar
      
})

router.put('/editCollaborator/:adventure_id', [verifyToken, authMiddleware.isCreator], async (req, res) => {
    
  const _id = req.params.adventure_id;

  const adventure = await Adventure.findOne({_id: _id}, (err, adventure) => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
  })
  let collaborators = req.body.collaborators;
  if(collaborators){
      adventure.collaborators.forEach(async coll => {
          //Si el colaborador actual del loop no se encuentra en la lista de colaboradores
          let collDelete = collaborators.some(item => JSON.stringify(item.user._id) === JSON.stringify(coll.user));

          if(!collDelete && coll.invitation === 'Pendiente'){
              await Invitation.findOneAndDelete({user: coll.user, status: 'Pendiente', adventure: adventure._id}, async (err, inv) =>{
                  if(err){
                      return res.status(404).json({
                          ok: false,
                          err
                      });
                  }
                  await AdminNotification.deleteOne({invitation: inv._id}, err =>{
                      if(err){
                          return res.status(404).json({
                              ok: false,
                              err
                          });
                      }
                  })
              })
              
              
          }
      });
      collaborators.forEach((coll, i) => {
          let index = adventure.collaborators.findIndex(item => item.user == coll.user._id);

          if(!(index >= 0)){
              const invitation = new Invitation ({
                  user: coll.user,
                  adventure: adventure,
                  status: 'Pendiente',
              });
              invitation.save(err => {
                  if(err){
                      return res.status(404).json({
                          err
                      });
                  }
              })
              const notification = new AdminNotification ({
                  userFrom:adventure.user,
                  userTo: coll.user,
                  type: 'invitation',
                  invitation: invitation,
                  description:'Invitación para colaborar en la aventura: ' + adventure.name,
                  seen: false,
              });
              notification.save(err => {
                  if(err){
                      return res.status(404).json({
                          err
                      });
                  }
              })
          }
          if(i === (collaborators.length-1))
            adventure.collaborators = req.body.collaborators
      })
      adventure.collaborators = req.body.collaborators
  }
  adventure.collaborators = collaborators
  adventure.updatedAt = Date.now();

  await adventure.save(async (err, adventure) => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
      await adventure.populate({
          path: 'collaborators',
          populate: {
            path: 'user',
            model: User,
            select:'-password' 
          }
        }).populate({path: 'user', model: User, select:'-password'}).execPopulate()
      res.status(200).json({
          adventure
      });
  })
})

router.post("/clone/:adventure_id",
[verifyToken,authMiddleware.isCreator,imagesGridFS.upload.single("file")], async (req, res) => {
    console.log('entra')
    const _id = req.params.adventure_id
    const _user = req.body.user_id

    console.log(_id)

    let adventure = await Adventure.findOne({ _id: _id }, (err) => {
      if (err) {
        return res.status(404).json({
          ok: false,
          err,
        });
      }
    }).populate({
      path: 'collaborators',
      populate: {
        path: 'user',
        model: User,
        select:'-password' 
      }
    }).populate({ path: 'user', model: User, select:'-password'});
    let nodes = [];
    let links = [];
    adventure.nodes.forEach(node => {
      let newNode = {};
      newNode.id = node.id;
      newNode.label = node.label
      newNode.type = node.type

      if(JSON.stringify(node.challenge) !== "{}")
        newNode.challenge = node.challenge;

      if(JSON.stringify(node.data) !== "{}")
        newNode.data = node.data
      
        nodes.push(newNode);
    });

    adventure.links.forEach(link => {
      let newLink = {};
      newLink.source = link.source;
      newLink.target = link.target;
      newLink.label = link.label;
      
      if(JSON.stringify(link.activators) !== "[]")
        newLink.activators = link.activators;
        
      links.push(newLink)
    });
    
    const cloneAdventure = {
      name: adventure.name + ' (clonada)',
      description: adventure.description,
      image_filename: adventure.image_filename,
      image_id: adventure.image_id,
      preconditions: [],
      user: _user,
      nodes: nodes,
      links: links,
      collaborators: [],
      privacy: true,
      type: 'clone',
      tags: adventure.tags,
      edit: undefined,
    };
    const newAdventure = new Adventure(cloneAdventure);

    const post = JSON.stringify({query: '*', domain: _id});
    let filteredResources = [];

    await axios.post(process.env.NEURONE_URL+'v1/document/search', post,
    {
      headers: { 'Content-Type': 'text/plain'}
    }).then((response) => {
        let resources = response.data;
        filteredResources = resources.filter(resource => resource.type != 'image');
    }).catch((err) => {
        console.log(err);
    })

    await newAdventure.nodes.forEach(async node => {
      let adventureResources = filteredResources.filter(resource => JSON.stringify(resource.task[0]) === JSON.stringify(node.id));
      
      adventureResources.forEach( async (resource, i) => { 
        resourceCopy = {
            docName: resource.docName+'clone '+newAdventure._id,
            domain: [newAdventure._id],
            keywords: resource.keywords, 
            locale: resource.locale,
            relevant: resource.relevant,
            searchSnippet: resource.searchSnippet,
            task: [node.id],
            title: resource.title,
            url: resource.url
        }
        if(resource.maskedUrl != null && resource.maskedUrl != 'undefined')
           Object.assign(resourceCopy, {maskedUrl: resource.maskedUrl})

        if(resource.type != null && resource.type != 'undefined')
           Object.assign(resourceCopy, {type: resource.type})
        else
           Object.assign(resourceCopy, {type: 'document'})
                
        await axios.post(process.env.NEURONE_URL+'v1/document/load', resourceCopy,
        {
          headers: { 'Content-Type': 'text/plain'}
          }).then(async (response)=> {
            let docId = response.data._id;
            node.challenge.document = docId;
            if(i === adventureResources.length-1){
              await Adventure.findOneAndUpdate({_id:newAdventure._id}, {nodes: newAdventure.nodes}, (err) => {
                if (err) {
                  console.log(err)
                }
            });
          }

          }).catch((err) => {
            console.log(err);
          })

      })
    });

    try {
      let authToken = req.header("x-access-token");
      let userId = jwt.verify(authToken, process.env.TOKEN_SECRET)._id;
      if (userId) {
        newAdventure.user = userId;
      }
    } catch (error) {
      console.log("couldn't set user adventure relationship.");
    }

    const userClone = await User.findOne({_id: _user},{password:0}, err => {
      if (err) {
          return res.status(404).json({
              err
          });
      }
    });

    let cloneHistory = new History({
      user: _user,
      adventure: _id,
      type: 'clone',
      description: 'The adventure was cloned'
      })
      
      cloneHistory.save(err => {
          if(err){
              return res.status(404).json({
                  err
              });
          }
      })

      const notification = new AdminNotification ({
        userFrom:userClone,
        userTo: adventure.user,
        type: 'clone',
        history: cloneHistory._id,
        description:userClone.username + ' ha clonado su aventura: ' + adventure.name,
        seen: false,
      });
      notification.save(err => {
        if(err){
            return res.status(404).json({
                err
            });
        }
      })

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
router.delete("/:adventure_id", [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const _id = req.params.adventure_id;
  Adventure.findOneAndDelete({ _id: _id }, (err, adventure) => {
    if (err) {
      return res.status(404).json({
        err,
      });
    }
    if(adventure.privacy === false)
      deleteAdventureSeach(_id);
    
    deleteInvitations(adventure,res)
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

async function createAdventureSearch(adventure){
  console.log('createAdventureSearch');
  try {
    const adventureSearch = new AdventureSearch({
      name: adventure.name,
      author: adventure.user.username,
      description: adventure.description,
      nodesLabel:['Start'],
      nodesText:['...'],
      userID: adventure.user._id,
      tags: adventure.tags,
      adventure: adventure
    })
    adventureSearch.save(err => {
      if(err){
        console.log(err);
      }
    })
  }
  catch (err) {
    console.log(err);
  }
};

async function updateAdventureSearch(adventure){
  console.log('updateAdventureSearch');
  try {
    const _id = adventure._id;
    //Find the adventureSearch element
    const adventureSearch = await AdventureSearch.findOne({adventure:_id}, err =>{
      if(err){
          console.log(err);
      }
    });

    adventureSearch.name = adventure.name;
    adventureSearch.description= adventure.description;
    adventureSearch.tags= adventure.tags;
    adventureSearch.nodesLabel = [];
    adventureSearch.nodesText = [];

    adventure.nodes.forEach(node => {
      adventureSearch.nodesLabel.push(node.label);
      adventureSearch.nodesText.push(node.data.text);

      if(adventureSearch.nodesLabel.length == adventure.nodes.length) {
        adventureSearch.save(err => {
          if(err){
            return res.status(404).json({
                err
            });
          }
        })
      }
    });
  }catch (err) {
    console.log(err)
  }

};


async function deleteAdventureSeach(adv_id){
  console.log('deleteAdventureSeach');
  try {
    const _id = adv_id;
    //Find the adventureSearch element
    await AdventureSearch.deleteOne({adventure:_id}, err =>{
        if(err){
        console.log(err);
      }
    });
  }
  catch (err) {
        console.log(err);
   }
};
async function deleteInvitations(adventure, res){
  const invitations = await Invitation.find({adventure:adventure, status: 'Pendiente'}, err =>{
    if(err){
        return res.status(404).json({
            ok: false,
            err
        });
    }
  });

  if(invitations.length > 0){
    invitations.forEach(async invitation => {
      await AdminNotification.deleteOne({invitation: invitation._id}, err => {
        if (err) {
          return res.status(404).json({
              err
          });
        }
      })
      await Invitation.deleteOne({_id:invitation._id}, err => {
        if (err) {
          return res.status(404).json({
              err
          });
        }
      })
  
    })
  }
}


module.exports = router;
