const Joi = require('joi');
const User = require('../models/auth/user');
const Role = require('../models/auth/role');
const jwt = require('jsonwebtoken');

const schema = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*\d).{4,32}$/),

    repeat_password: Joi.ref('password'),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'cl'] } }),

    username: Joi.string()
    .required(),

    avatar_img: Joi.string()
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
        .required(),

    avatar_img: Joi.string()
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
    if (req.header && req.header('x-access-token')) {
        var authorization = req.header('x-access-token'),
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
            return;
        }
        var userId = decoded._id;
        console.log(decoded);
        User.findOne({_id: userId}).then(user => {
            const roleId = user.role;
            Role.findOne({_id: roleId}).then(role => {
                console.log(role);
                if(role.name == 'admin') {
                    next();
                    return;
                }
            })
        });
    }
    res.status(401).send('Unauthorized: Requires admin role!');
    return;
}

const isCreator = async(req, res, next) => {
    if (req.header && req.header('x-access-token')) {
        var authorization = req.header('x-access-token'),
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
            return;
        }
        var userId = decoded._id;
        console.log(decoded);
        User.findOne({_id: userId}).then(user => {
            const roleId = user.role;
            Role.findOne({_id: roleId}).then(role => {
                console.log(role);
                if(role.name == 'creator' || role.name == 'admin') {
                    next();
                    return;
                }
            })
        });
    }
    res.status(401).send('Unauthorized: Requires creator role at least!');
    return;
}

const isPlayer = async(req, res, next) => {
    if (req.header && req.header('x-access-token')) {
        var authorization = req.header('x-access-token'),
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
        } catch (e) {
            res.status(401).send('unauthorized');
            return;
        }
        var userId = decoded._id;
        User.findOne({_id: userId}).then(user => {
            const roleId = user.role;
            Role.findOne({_id: roleId}).then(role => {
                console.log(role);
                if(role.name == 'player' || role.name == 'creator' || role.name == 'admin') {
                    next();
                    return;
                }
            })
        });
    }
    res.status(401).send('Unauthorized: Requires player role at least!');
    return;
}

const authMiddleware = {
    verifyBody,
    verifyBodyAdmin,
    uniqueEmail,
    uniqueUsername,
    isAdmin,
    isCreator,
    isPlayer
};

module.exports = authMiddleware;