const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Role = require('../models/role');
const Token = require('../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const crypto = require('crypto');
const fs = require('fs');
const authMw = require('../middlewares/authMiddleware');

const neuronegmService = require('../services/neuronegm/connect');
const playerService = require('../services/neuronegm/player');

router.post('/register/admin', [authMw.verifyBodyAdmin, authMw.uniqueEmail], async (req, res) => {
    // Role
    const role = await Role.findOne({name: 'admin'}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        email: req.body.email.toLowerCase(),
        password: hashpassword,
        role: role._id
    })

    await neuronegmService.connectGM(req.body.email, req.body.password, (err, res) => {
        if(err){
            console.log(err);
        }
        else {
            console.log(res);
        }
    })
    //save user in db
    await user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
        res.status(200).json({
            user
        });
    });
})

router.post('/register/', [authMw.verifyBody, authMw.uniqueEmail], async (req, res)=>{

    // Find student role
    const role = await Role.findOne({name: 'student'}, err => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }
    });

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password, salt);

    //create user
    const user = new User({
        email: req.body.email,
        names: req.body.names,
        last_names: req.body.last_names,
        birthday: req.body.birthday,
        password: hashpassword,
        role: role._id
    });

    //save user in db
    user.save((err, user) => {
        if(err){
            return res.status(404).json({
                ok: false,
                err
            });
        }

        // Register player in NEURONE-GM
        saveGMPlayer(req, user, res);

        // Send confirmation email
        sendConfirmationEmail(user, res, req);

        res.status(200).json({
            user
        });
    });
});

router.post('/login', async (req, res) => {
    //checking if username exists
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).populate('role');
    if(!user) res.status(400).send('EMAIL_NOT_FOUND');
    //checking password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) res.status(400).send('INVALID_PASSWORD');
    //check if user is confirmed
    if(!user.confirmed) res.status(400).send('USER_NOT_CONFIRMED');
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('x-access-token', token).send({user: user, token: token});
});


// Creates player on NEURONE-GM
function saveGMPlayer(req, user, res) {
    playerService.postPlayer({ name: user.names, last_name: user.last_names, sourceId: user._id }, (err, data) => {
        if (err) {
            console.log(err);
            res.status(200).json({
                user
            });
        }
        else {
            user.gm_code = data.code;
            user.save(err => {
                if (err) {
                    return res.status(404).json({
                        ok: false,
                        err
                    });
                }
            });
        }
    });
}

// Sends user confirmation email
// Adapted from: https://codemoto.io/coding/nodejs/email-verification-node-express-mongodb
function sendConfirmationEmail(user, res, req) {

    // Create a verification token
    const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

    // Save the verification token
    token.save((err) => {
        if (err) { return res.status(500).send({ msg: 'TOKEN_ERROR' }); }

        // Generate email data
        const { mailHTML, mailText } = generateEmailData(req, token, user);

        // Send the email
        const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: process.env.SENDEMAIL_USER, pass: process.env.SENDEMAIL_PASSWORD } });
        const mailOptions = { from: 'neuronemail2020@gmail.com', to: user.email, subject: 'Verifique su correo', text: mailText, html: mailHTML };
        transporter.sendMail(mailOptions, (err) => {
            if (err) { return res.status(500).send({ msg: err.message }); }
        });
    });
}

// Reads email template and adds custom data
function generateEmailData(req, token, user) {
    const emailTemplateFile = 'assets/confirmationEmail.html';
    const link = 'http://' + req.headers.host + '\/confirmation\/' + token.token;
    let mailHTML = null;
    let mailText = 'Hola,\n\n' + 'Por favor, verifique su correo ingresando al siguiente link: \nhttp:\/\/' + link + '.\n';

    // Load email template
    mailHTML = fs.readFileSync(emailTemplateFile, 'utf8', (err, data) => {
        if (err) { console.log(err); }
        mailHTML = data.toString();
    });
    // Add custom text to email
    mailHTML = addTextToEmail(mailHTML, user, link);
    return { mailHTML, mailText };
}

// Add translated text and user data to email
function addTextToEmail(mailHTML, user, link) {
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.PREHEADER_TEXT]", "Confirme su cuenta:");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TITLE]","Hola " + user.names.split(" ")[0] + ".");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.TEXT]","Gracias por registrarse en NEURONE-ADV, "
                                + "antes de ingresar al juego debe confirmar su correo.");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.CONFIRM]", "Confirmar cuenta");
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.IF_BUTTON_DOESNT_WORK_TEXT]", "Si el botón no funciona, use el siguiente link:");
    mailHTML = mailHTML.replace(/%CONFIRMATION_EMAIL.LINK%/g, link);
    mailHTML = mailHTML.replace("[CONFIRMATION_EMAIL.GREETINGS]", "¡Saludos!");
    return mailHTML;
}

module.exports = router;