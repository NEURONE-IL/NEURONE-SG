const Joi = require("joi");

const schema = Joi.object({
  kmTracking: Joi.boolean().required(),

  linksTracking: Joi.boolean().required(),

  sessionTracking: Joi.boolean().required(),
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

const configMiddleware = {
  verifyBody,
};

module.exports = configMiddleware;
