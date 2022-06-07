const mongoose = require('mongoose');
const { Schema } = mongoose;

const AdventureSearchSchema = new Schema({
    name: { type: String, required: true},
    description: { type: String},
    nodesLabel: {type: [String]},
    nodesText: {type: [String]},
    tags: {type: [String]},
    author: { type: String},
    userID:{type: String},
    adventure: { type: Schema.Types.ObjectId, ref: 'Adventure', required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
AdventureSearchSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

AdventureSearchSchema.index({name:'text', description: 'text', tags: 'text', 
                            author: 'text',nodesText:'text', nodesLabel:'text'},
                            {default_language: "spanish" })

const myDB = mongoose.connection.useDb('neurone-sg');
const AdventureSearch = myDB.model('AdventureSearch', AdventureSearchSchema);

module.exports = AdventureSearch;