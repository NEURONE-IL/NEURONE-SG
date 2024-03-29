const Joi = require("joi");

const simpleSchema = Joi.object({
  answer: Joi.string().required(),
  node: Joi.string().required(),
  user: Joi.string().required(),
  type: Joi.string().required(),
  adventure: Joi.string(),
});

const multipleSchema = Joi.object({
  node: Joi.string().required(),
  user: Joi.string().required(),
  type: Joi.string().required(),
  adventure: Joi.string(),
  answer: Joi.array().items(
    Joi.object({
      value: Joi.string().allow(""),
      index: Joi.number(),
      checked: Joi.bool().required(),
    })
  ),
});

const bookmarkSchema = Joi.object({
  document: Joi.string().required(),
  answer: Joi.string().required(),
  node: Joi.string().required(),
  user: Joi.string().required(),
  type: Joi.string().required(),
  adventure: Joi.string(),
});

const verifyBody = async (req, res, next) => {
  try {
    if (req.body.type == "question") {
      const simpleValidation = await simpleSchema.validateAsync(req.body);
    }
    if (req.body.type == "multiple") {
      const multipleValidation = await multipleSchema.validateAsync(req.body);
    }
    if (req.body.type == "bookmark") {
      const bookmarkValidation = await bookmarkSchema.validateAsync(req.body);
    }
    next();
  } catch (err) {
    const simpleValidation = await simpleSchema.validateAsync(req.body);
    return res.status(400).json({
      ok: false,
      err,
    });
  }
};

const answerMiddleware = {
  verifyBody,
};

module.exports = answerMiddleware;
