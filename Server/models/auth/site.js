const mongoose = require('mongoose');
const { Schema } = mongoose;

const SiteSchema = new Schema({
    api_key: {type: String, required: true},
    host: {type: String},
    confirmed: {type: Boolean},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
SiteSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});


module.exports = mongoose.model("Site", SiteSchema); 