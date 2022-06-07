const Role = require('../models/auth/role');
const Adventure = require('../models/game/adventure')
const Config = require('../models/game/config');

async function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count < 3) {
      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });

      new Role({
        name: "creator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'creator' to roles collection");
      });

      new Role({
        name: "player"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'player' to roles collection");
      });
    }
  });

  Config.estimatedDocumentCount((err, count) => {
    if(!err && count < 1) {
      new Config({
        KMtracker: false
      }).save(err => {
        if(err) {
          console.log("error:", err);
        }
        console.log("added initial default config");
      })
    }
  })

}
async function cleanEdit(){
  const adventures = await Adventure.find({}, (err) => {
      if(err){
          console.log(err)
      }
  })
  adventures.forEach(async adventure => {
      adventure.edit = undefined;
      adventure.save(err => {
          if(err){
              console.log(err)
          }
      })
  })
}

exports.initial = initial;
exports.cleanEdit = cleanEdit;
