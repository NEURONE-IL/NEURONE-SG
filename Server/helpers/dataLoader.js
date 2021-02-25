const Role = require('../models/auth/role');
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

exports.initial = initial;
