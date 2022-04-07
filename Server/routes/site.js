const express = require("express");
const User = require("../models/auth/user");
const Role = require("../models/auth/role");
const Site = require("../models/auth/site");
const Progress = require("../models/game/progress");
const Adventure = require("../models/game/adventure");
const verifyAPIKey = require('../middlewares/verifyAPIKEY');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const neuronegmService = require("../services/neuronegm/connect");
const playerService = require("../services/neuronegm/player");

const genKey = () => {
    return [...Array(30)]
        .map((e) => ((Math.random() * 36 | 0).toString(36)))
        .join('');
}

// Creates player on NEURONE-GM
function saveGMPlayer(req, user, res) {
  try {
    const player = {
      name: user.username,
      last_name: user.username,
      sourceId: user.id,
    };
    playerService.postPlayer(player, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({
          user,
        });
      } else {
        user.gm_code = data.code;
        user.save((err) => {
          if (err) {
            return res.status(404).json({
              ok: false,
              err,
            });
          }
        });
      }
    });
  } catch (error) {
    console.log("couldn't save gm player");
  }
}

router.post(
  "/register",
  async (req, res) => {
    console.log(req.headers.origin);
    const siteExists = await Site.findOne({host: req.headers.origin}, err => {
      if(err){
        return res.status(404).json({
          ok: false,
          err
        });   
      }
    })
    if(siteExists){
      res.status(200).json({
        site: siteExists
      });
    }
    else{
      const site = new Site({
        host: req.headers.origin,
        api_key: genKey(),
        confirmed: false
      });
      site.save((err, site)=> {
        if(err){
            return res.status(404).json({
                ok: false,
                err,
              });   
        }
        res.status(200).json({
            site
        });
      })
    }
  }
);

router.post("/registeruser", verifyAPIKey, async (req, res) => {
    const url = req.body.url;
    // Find student role
    const role = await Role.findOne({ name: "player" }, (err) => {
        if (err) {
          return res.status(404).json({
            ok: false,
            err,
          });
        }
      });
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(genKey(), salt);
    const user = new User({
        username: req.body.username.toLowerCase(),
        email: req.body.email.toLowerCase(),
        password: hashpassword,
        role: role._id,
        trainer_id: req.body.trainer_id,
        trainer_return_url: url,
        confirmed: true
    });

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    await user.save((err, user) => {
        if(err){
          return res.status(404).json({
            ok: false,
            err,
          });   
        }
        try {
          saveGMPlayer(req, user, res);
        } catch (error) {
          console.log(error);
        }

        res.header("x-access-token", token).send({ user: user, token: token, url: url });
    })

})

router.post("/login", verifyAPIKey, async (req, res) => {
    const url = req.body.url;
    //checking if username exists
    const user = await User.findOne({
      trainer_id: req.body.trainer_id,
    }, err => {
      if(err){
        res.status(400).send(err)
      }
    }).populate( { path: 'role', model: Role} );
    if (!user) res.status(400).send("ID_NOT_FOUND");
    await user.save(err => {
      if(err){
        res.status(400).send(err)
      }
    });
    //create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header("x-access-token", token).send({ user: user, token: token, url: url });
  });

router.get("/adventure", verifyAPIKey, async (req, res) => {
  Adventure.find({}, (err, adventures) => {
    if (err) {
      return res.status(404).json({
        ok: false,
        err,
      });
    }
    else {
      res.status(200).json({adventures});
    }
  });
})

router.get("/user/:trainer_id", async (req, res) => {
  const trainer_id = req.params.trainer_id;
  const user = await User.findOne({trainer_id: trainer_id}, err => {
    if(err){
      return res.status(400).send(err)
    }
  })
  return res.status(200).json({
    ok: true,
    user
  });
})

router.get("/user/:trainer_id/advance", async (req, res) => {
  const trainer_id = req.params.trainer_id;
  const user = await User.findOne({trainer_id: trainer_id}, err => {
    if(err){
      res.status(400).send(err)
    }
  })
  const advances = await Progress.find({user: user._id} , err => {
    if(err){
      return res.status(404).json({
        ok: false,
        err
      });
    }
  }).populate( 'adventure', {name: 1, description: 1});
  const progress = [];
  for(let i = 0; i<advances.length; i++){
    let counter = 0;
    if(advances[i].finished){
      counter = 1;
    }
    progress.push({
      adventure: advances[i].adventure,
      completed: advances[i].finished,
      percentage: counter/1
    })
  }
  res.status(200).json({
    progress
  });
})


module.exports = router;