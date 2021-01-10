const Joi = require('joi');
const Adventure = require('../models/game/adventure');

const schema = Joi.object({
    _id: Joi.string(),
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    nodes: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
        data: Joi.object({
            image: Joi.string(),
            text: Joi.string().required()
        }).required()
    })),
    
    links: Joi.array().items(Joi.object({
        source: Joi.string().required(),
        target: Joi.string().required(),
        label: Joi.string().required(),
    })),
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

const adventureMiddleware = {
    verifyBody
};

module.exports = adventureMiddleware;