const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookmarkAnswerSchema = new Schema({

  adventure: { type: Schema.Types.ObjectId, ref: 'Adventure'},
  node: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  type: { type: String, required: true },
  document: { type: String, required: true },
  answer: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
  
  // Sets the createdAt parameter equal to the current time
  bookmarkAnswerSchema.pre("save", (next) => {
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    if (!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
  });
  
  module.exports = mongoose.model("BookmarkAnswer", bookmarkAnswerSchema, "answers");