const mongoose = require("mongoose");
const { Schema } = mongoose;

const progressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  adventure: { type: Schema.Types.ObjectId, ref: "Adventure", required: true },
  currentNode: { type: String, required: true },
  activators: {
    type: [
      {
        condition: { type: String, required: true },
        node: { type: String },
        links_count: { type: Number },
        level: { type: String },
      },
    ],
    default: undefined,
  },
  relevantDocsVisited: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
progressSchema.pre("save", (next) => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  if (!this.updatedAt) {
    this.updatedAt = now;
  }
  next();
});

module.exports = mongoose.model("Progress", progressSchema);
