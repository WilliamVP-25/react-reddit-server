const User = require('../models/User')
const Profile = require('../models/Profile')
const bcryptjs = require('bcrypt')
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')

exports.verifyEmailRegister = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email} = req.body;
    const exists_email = await User.findOne({email});
    if (exists_email) {
        return res.json({
            msg: "El correo electrónico digitado ya esta en uso por una cuenta",
            details: "email_existss"
        });
    }
    return res.status(200).json({msg: "Correo electrónico válido", details: "success"});
}

exports.verifyUsernameRegister = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {username} = req.body;
    const exists_username = await User.findOne({username})
    if (exists_username) {
        return res.status(400).json({msg: "El nombre de usuario digitado ya esta en uso", details: "username_exists"});
    }
    return res.status(200).json({msg: "Nombre de usuario válido", details: "success"});
}

exports.login = async (req, res) => {
    const errors = validationResult(req); //revisar errores
    if (!errors.isEmpty()) {
        return res.status(400).json({msg: "Verifica que los datos ingresados sean correctos", errors: errors.array()})
    }

    const {username, password} = req.body;
    try {
        //let user = await User.findOne({username});
        let user = await User.findOne().or([{username}, {email: username}]); //validar user exists
        if (!user) {
            return res.status(200).json({msg: "El usuario ingresado no existe", details: "user_not_exists"});
        }

        const password_validation = await bcryptjs.compare(password, user.password); //validar password
        if (!password_validation) {
            return res.status(200).json({msg: "La contraseña ingresada es incorrecta", details: "password_incorrect"});
        }

        const payload = { //login, crear y firmar JWT
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET_JWT, { //firmar JWT
            expiresIn: process.env.TIME_SESSION_AUTH
        }, (error, token) => {
            if (error) {
                return res.status(200).json({
                    msg: "Autenticación fallida. Intenta nuevamente",
                    details: "error_token"
                });
            }
            res.status(200).json({token, details: "success"});//mensaje confirmacion
        });
    } catch (e) {
        res.status(400).json({msg: e.message, details: "error"});
    }
}

exports.getUserAuth = async (req, res) => {
    if (req.user) {
        try {
            const {id} = req.user;
            const user = await User.findById(id).select('-password');
            return res.json({user, details: "success"});
        } catch (e) {
            console.log(e);
            return res.json({msg: "Ocurrio un error inesperado.", errors: e.message, details: "error"});
        }
    }
    return res.json({user: null, msg: "Usuario no autenticado", details: "user_no_auth"});
}
