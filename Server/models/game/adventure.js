const mongoose = require('mongoose');
const adventure = require('../../models/game/adventure');
const { Schema } = mongoose;


const adventureSchema = new Schema({

  name: {type: String, required: true},
  description: {type: String, required: true},

  nodes: { type: [{
    id: {type: String, required: true},
    label: {type: String, required: true},
    type: {type: String, required: true},
    data: {type: {
      image: {type: String, default: ""},
      text: {type: String, default: ""}
    }, required: true},
    challenge: {type: {
      type: {type: String}
    }},
    // _id: false
  }], required: true, default: []},

  links: { type: [{
    source: {type: String, required: true},
    target: {type: String, required: true},
    label: {type: String, required: true},
    // _id: false
  }], default: []},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adventureSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    if (returnedObject.nodes) {
      returnedObject.nodes.forEach(node => {
        delete node._id;
      });
    }
    if (returnedObject.links) {
      returnedObject.links.forEach(link => {
        delete link._id;
      });
    }
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
    delete returnedObject.__v;
  }
});

// Sets the createdAt parameter equal to the current time
adventureSchema.pre('save', next => {
    const now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Adventure', adventureSchema);