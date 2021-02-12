const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema({

  adventure: { type: Schema.Types.ObjectId, ref: 'Adventure'},
  escaperoom: { type: Schema.Types.ObjectId, ref: 'Escaperoom'},
  node: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  type: { type: String, required: true },
  answer: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const multipleAnswerSchema = new Schema({

  adventure: { type: Schema.Types.ObjectId, ref: 'Adventure'},
  escaperoom: { type: Schema.Types.ObjectId, ref: 'Escaperoom'},
  node: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true},
  type: { type: String, required: true },
  answer: {
    type: [
      {
        value: { type: String, default: undefined },
        checked: { type: Boolean, default: false },
        _id: false,
      },
    ],
    default: undefined,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
answerSchema.pre("save", (next) => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  if (!this.updatedAt) {
    this.updatedAt = now;
  }
  next();
});

module.exports = mongoose.model("Answer", answerSchema, "answers");
