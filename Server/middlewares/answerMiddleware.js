const Joi = require('joi');

const schema = Joi.object({
    
    answer: Joi.string().required(),
    node: Joi.string().required(),
    user: Joi.string().required(),
    type: Joi.string(),
    adventure: Joi.string(),
    escaperoom: Joi.string()

})

const verifyBody = async (req, res, next) => {
    try {
        const validation = await schema.validateAsync(req.body);
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

const answerMiddleware = {
    verifyBody
};

module.exports = answerMiddleware;