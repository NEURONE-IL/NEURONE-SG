const mongoose = require("mongoose");
const { Schema } = mongoose;

const configSchema = new Schema({

  kmTracking: { type: Schema.Types.Boolean, required: true, default: false },
  linksTracking: { type: Schema.Types.Boolean, required: true, default: false },
  sessionTracking: { type: Schema.Types.Boolean, required: true, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Sets the createdAt parameter equal to the current time
configSchema.pre("save", (next) => {
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    if (!this.updatedAt) {
      this.updatedAt = now;
    }
    next();
  });

  configSchema.set("toJSON", {
    transform: (document, returnedObject) => {
      delete returnedObject.createdAt;
      delete returnedObject.updatedAt;
      delete returnedObject.__v;
    },
  });
  
  module.exports = mongoose.model("Config", configSchema, "config");