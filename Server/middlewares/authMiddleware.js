const Joi = require('joi');
const User = require('../models/auth/user');
const Role = require('../models/auth/role');

const schema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }),

    names: Joi.string()
        .required(),
    
    last_names: Joi.string()
        .required(),

    birthday: Joi.date()
        .required(),
})

const adminSchema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/)
        .required(),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } })
        .required()
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

const verifyBodyAdmin = async (req, res, next) => {
    try {
        const validation = await adminSchema.validateAsync(req.body);
        next();
    }
    catch(err){
        return res.status(400).json({
            ok: false,
            err
        });
    }
}

const uniqueEmail = async(req, res, next) => {
    if (!req.body.email) {
        return res.status(404).json({
            ok: false,
            message: "No email in request"
        });
    }
    await User.findOne({email: req.body.email}, (err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(user){
            return res.status(403).json({
                ok: false,
                message: "Email already exists!"
            });
        }
        else{
            next();
        }
    })
}

const isAdmin = async(req, res, next) => {
    User.findById(req.user).exec((err, user) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            });
        }

        Role.findOne(
            {
                _id: user.role
            },
            (err, role) => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }

                if (role.name === 'admin') {
                    next();
                    return;
                }

                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
}

const authMiddleware = {
    verifyBody,
    verifyBodyAdmin,
    uniqueEmail,
    isAdmin
};

module.exports = authMiddleware;