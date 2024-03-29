const mongoose = require('mongoose');
const { Schema } = mongoose;

const adventureAssistantSchema = new Schema({
    adventure: { type: Schema.Types.ObjectId, ref: 'Adventure', required: true, unique: true},
    assistant: {type: String, required: true},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Sets the createdAt parameter equal to the current time
adventureAssistantSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model("AdventureAssistant", adventureAssistantSchema);