const Joi = require("joi");

const schema = Joi.object({
  user: Joi.string().required(),
  adventure: Joi.string().required(),
  currentNode: Joi.string().required(),
  activators: Joi.array().items(Joi.object()),
  relevantDocsVisited: Joi.array().items(Joi.object()),
  finished: Joi.bool()
});

const verifyBody = async (req, res, next) => {
  try {
    const validation = await schema.validateAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      ok: false,
      err,
    });
  }
};

const progressMiddleware = {
  verifyBody,
};

module.exports = progressMiddleware;
