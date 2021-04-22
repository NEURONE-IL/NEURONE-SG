const mongoose = require("mongoose");
const { Schema } = mongoose;

const adventureSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },

  image_filename: { type: String },
  image_id: { type: String },

  preconditions: [
    { type: Schema.Types.ObjectId, ref: "Adventure" },
  ],

  nodes: {
    type: [
      {
        id: { type: String, required: true },
        label: { type: String, required: true },
        type: { type: String, required: true },
        data: {
          image_id: { type: String },
          video: { type: String },
          text: { type: String, default: "", required: true },
        },
        challenge: {
          question: { type: String },
          answer: { type: String },
          document: { type: String },
          type: { type: String },
          options: {
            type: [
              {
                value: { type: String, default: undefined },
                correct: { type: Boolean, default: false },
                _id: false,
              },
            ],
            default: undefined,
          },
        },
      },
    ],
    required: true,
    default: [],
  },

  links: {
    type: [
      {
        source: { type: String, required: true },
        target: { type: String, required: true },
        label: { type: String, required: true },
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
      },
    ],
    default: [],
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adventureSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject.nodes) {
      returnedObject.nodes.forEach((node) => {
        // delete node._id;
        if (node.challenge) {
          if (node.challenge.options) {
            node.challenge.options.forEach((option) => {
              delete option._id;
            });
          }
        }
      });
    }
    if (returnedObject.links) {
      returnedObject.links.forEach((link) => {
        delete link._id;
        if (link.activators) {
          link.activators.forEach((activator) => {
            delete activator._id;
          });
        }
      });
    }
    delete returnedObject.createdAt;
    delete returnedObject.updatedAt;
    delete returnedObject.__v;
  },
});

// Sets the createdAt parameter equal to the current time
adventureSchema.pre("save", (next) => {
  const now = new Date();
  if (!this.createdAt) {
    this.createdAt = now;
  }
  if (!this.updatedAt) {
    this.updatedAt = now;
  }
  next();
});

module.exports = mongoose.model("Adventure", adventureSchema);
