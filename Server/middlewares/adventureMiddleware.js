const Joi = require('joi');

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
            text: Joi.string().required(),
            challenge: Joi.object({
                type: Joi.string().required(),
                question: Joi.string(),
                answer: Joi.string(),
                options: Joi.array().items(Joi.string())
            })
        }).required(),
    })),
    
    links: Joi.array().items(Joi.object({
        source: Joi.string().required(),
        target: Joi.string().required(),
        label: Joi.string().required(),
        activators: Joi.array().items(Joi.string())
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