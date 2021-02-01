const Joi = require('joi');

const schema = Joi.object({
    _id: Joi.string(),
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    image: Joi.string(),

    nodes: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
        data: Joi.object({
            image: Joi.string().allow(''),
            video: Joi.string().allow(''),
            text: Joi.string().required(),
        }).required(),
        challenge: Joi.object({
            type: Joi.string().required(),
            question: Joi.string(),
            answer: Joi.string(),
            options: Joi.array().items(Joi.string())
        })
    })),
    
    links: Joi.array().items(Joi.object({
        source: Joi.string().required(),
        target: Joi.string().required(),
        label: Joi.string().required(),
        activators: Joi.array().items(Joi.object({
            node: Joi.string(),
            condition: Joi.string().required()
        }))
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