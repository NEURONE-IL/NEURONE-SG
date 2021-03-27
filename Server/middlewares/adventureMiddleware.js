const Joi = require('joi');

const schema = Joi.object({
    _id: Joi.string(),
    
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    image_id: Joi.string().allow('').allow(null),

    nodes: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
        data: Joi.object({
            image_id: Joi.string().allow('').allow(null),
            video: Joi.string().allow('').allow(null),
            text: Joi.string().required(),
        }).required(),
        challenge: Joi.object({
            type: Joi.string().required(),
            question: Joi.string(),
            answer: Joi.string(),
            // options: Joi.array().items(Joi.string())
            options: Joi.array().items(Joi.object({
                value: Joi.string().allow(''),
                correct: Joi.bool()
            }))
        })
    })),
    
    links: Joi.array().items(Joi.object({
        source: Joi.string().required(),
        target: Joi.string().required(),
        label: Joi.string().required(),
        activators: Joi.array().items(Joi.object({
            condition: Joi.string().required(),
            node: Joi.string(),
            links_count: Joi.number(),
            level: Joi.string()
        }))
    })),
})

const newSchema = Joi.object({

    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    image_id: Joi.string().allow('').allow(null)
})


const verifyBody = async (req, res, next) => {
    try {
        const validation = await schema.validateAsync(req.body);
        if(!req.body.image_id || req.body.image_id=='') {
            delete req.body.image_id;
        }
        if (req.body.nodes) {
            req.body.nodes.forEach(node => {
                if(!node.data.image_id || node.data.image_id=='') {
                    delete node.data.image_id;
                }
                if(!node.data.video || node.data.video=='') {
                    delete node.data.video;
                }       
            });
        }
        next();
    }
    catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
     }
};

const verifyNewBody = async (req, res, next) => {
    try {
        const validation = await newSchema.validateAsync(req.body);
        if(!req.body.image_id || req.body.image_id=='') {
            delete req.body.image_id;
        }
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
    verifyBody,
    verifyNewBody
};

module.exports = adventureMiddleware;