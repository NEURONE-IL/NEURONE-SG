const express = require("express");
const router = express.Router();
const AdventureSearch = require('../models/search/adventureSearch');
const Adventure = require('../models/game/adventure');
const User = require('../models/auth/user');
//const Challenge = require('../models/challenge');
const verifyToken = require('../middlewares/verifyToken');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/search/:user_id/:query/:page', [verifyToken, authMiddleware.isCreator], async (req, res) => {
  const query = req.params.query;
  const _id = req.params.user_id;
  
  const page = req.params.page;
  const totalPerPage = 10;
  const skip = page > 0 ? ( ( page - 1 ) * totalPerPage ) : 0 ;
  if(query != 'all'){
    const totalDocs = await AdventureSearch.countDocuments({userID: { $ne:_id }, $text: {$search: query}});
    AdventureSearch.find({userID: { $ne:_id }, $text: {$search: query}},{ score: { $meta: "textScore" } }, (err, docs) =>{
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});

    }).sort( { score: { $meta: "textScore" } } )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'adventure', model: Adventure, populate: {path:'user', model: User, select:'-password'}});
  }
  else{
    const totalDocs = await AdventureSearch.countDocuments({userID: { $ne:_id }});
    AdventureSearch.find({userID: { $ne:_id }}, (err, docs) => {
      if(err){
          return res.status(404).json({
              ok: false,
              err
          });
      }
      res.status(200).json({'docs':docs, 'actualPage': page, 'totalDocs':totalDocs});
    }).sort( {name:1} )
      .skip( skip )
      .limit( totalPerPage )
      .populate({path:'adventure', model: Adventure, populate: {path:'user', model: User, select:'-password'}});
  }
})

router.post('/loadAdventures', async (req, res) => {
  let adventuresIndexes = []
  const adventures = await Adventure.find({privacy:false}, err =>{
    if(err){
        return res.status(404).json({
            ok: false,
            err
        });
    }
  }).populate({path:'user', model: User});

  await adventures.forEach(async adventure => {
    const adventureSearch = new AdventureSearch({
      name: adventure.name,
      author: adventure.user.username,
      description: adventure.description,
      tags: adventure.tags,
      userID: adventure.user._id,
      nodesLabel: [],
      nodesText: [],
      adventure: adventure
    })

    adventure.nodes.forEach(node => {
      adventureSearch.nodesLabel.push(node.label);
      adventureSearch.nodesText.push(node.data.text);

      if(adventureSearch.nodesLabel.length == adventure.nodes.length) {
        adventuresIndexes.push(adventureSearch);
        adventureSearch.save(err => {
          if(err){
              return res.status(404).json({
                  err
              });
          }
        })
      }
    });
    
    if(adventuresIndexes.length === adventures.length) {
      res.status(200).json({adventuresIndexes});

    }
  });
  
});


module.exports = router;