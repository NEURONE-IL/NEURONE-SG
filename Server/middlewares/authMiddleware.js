const Joi = require('joi');
const User = require('../models/auth/user');
const Role = require('../models/auth/role');

const schema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }),

    username: Joi.string()
    .required()
})

const adminSchema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/)
        .required(),

    repeat_password: Joi.ref('password'),

    username: Joi.string()
    .required(),

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

const uniqueUsername = async(req, res, next) => {
    if (!req.body.username) {
        return res.status(404).json({
            ok: false,
            message: "No username in request"
        });
    }
    await User.findOne({username: req.body.username}, (err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        if(user){
            return res.status(403).json({
                ok: false,
                message: "Username already exists!"
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

const isCreator = async(req, res, next) => {
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

                if (role.name === 'creator') {
                    next();
                    return;
                }

                res.status(403).send({ message: "Require Creator Role!" });
                return;
            }
        );
    });
}

const authMiddleware = {
    verifyBody,
    verifyBodyAdmin,
    uniqueEmail,
    uniqueUsername,
    isAdmin,
    isCreator
};

module.exports = authMiddleware;