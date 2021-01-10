const mongoose = require('mongoose');
const { Schema } = mongoose;


const UserSchema = new Schema({
    email: {type: String, required: true, unique: true},
    confirmed: {type: Boolean, default: false},
    names: {type: String },
    last_names: {type: String },
    birthday: {type: Date},
    password: {type: String, required: true},
    gm_code: {type: String},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true}
});

// Sets the createdAt parameter equal to the current time
UserSchema.pre('save', next => {
    const now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    if(!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);