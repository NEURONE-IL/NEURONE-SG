const mongoose = require('mongoose');
const { Schema } = mongoose;


const EscaperoomSchema = new Schema({

  name: {type: String, required: true},
  description: {type: String, required: true},

  nodes: { type: [{
    id: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true},
    data: {
      image: {type: String, default: ""},
      text: {type: String, default: ""}
    }, required: true,
    challenge: {
      type: {type: String, default: ""}
    },
    _id: false
  }], default: []},

  links: { type: [{
    source: {type: String, required: true},
    target: {type: String, required: true},
    label: {type: String, required: true},
    _id: false
  }], default: []},

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
EscaperoomSchema.pre('save', next => {
    const now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('Escaperoom', EscaperoomSchema);