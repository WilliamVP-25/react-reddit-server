const User = require('../models/User')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')

exports.createUser = async (req, res, next) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.json({errors: errors.array(), details: "data_send_incomplete", msg: "Datos enviados incorrectos"});
    }

    const {email, password, username} = req.body;
    const exists_email = await User.findOne({email});
    if (exists_email) {
        return res.json({msg: "El correo electrónico digitado ya esta en uso por una cuenta", details: "email_exists"});
    }
    const exists_username = await User.findOne({username})
    if (exists_username) {
        return res.json({msg: "El nombre de usuario digitado ya esta en uso", details: "username_exists"});
    }

    try {
        const user = new User(req.body);
        const salt = await bcrypt.genSalt(10);  //hash password
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        req.body.userId = user._id;
        next();
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.updateUser = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.json({errors: errors.array(), details: "data_send_incomplete", msg: "Datos enviados incompletos"});
    }

    const {id} = req.user;
    if (req.body.newEmail) {
        const {newEmail, password} = req.body;

        let user = await User.findById(id); //validar user exists
        if (!user) {
            return res.json({msg: "El usuario no existe", details: "user_not_exists"});
        }

        if (user.email === newEmail) {
            return res.json({
                msg: "El correo ingresado debe ser diferente al actual",
                details: "email_incorrect"
            });
        }

        const exists_email = await User.findOne({email: newEmail}).where({id: {$ne: id}});
        if (exists_email) {
            return res.json({
                msg: "El correo electrónico digitado ya esta en uso por una cuenta diferente",
                details: "email_exists"
            });
        }

        const password_validation = await bcrypt.compare(password, user.password); //validar password
        if (!password_validation) {
            return res.json({msg: "La contraseña ingresada es incorrecta", details: "password_incorrect"});
        }

        try {
            const dataUser = {
                email: newEmail,
                email_verification: null,
                updated_at: Date.now()
            }

            user = await User.findByIdAndUpdate(
                {_id: id},
                {$set: dataUser},
                {new: true}
            );

            return res.json({user, details: "success"});
        } catch (e) {
            return res.json({msg: e.message, details: "error"});
        }
    }

    if (req.body.newPassword) {
        const {newPassword, confirmNewPassword, password} = req.body;
        let user = await User.findById(id); //validar user exists
        if (!user) {
            return res.json({msg: "El usuario no existe", details: "user_not_exists"});
        }

        const password_validation = await bcrypt.compare(password, user.password); //validar password
        if (!password_validation) {
            return res.json({msg: "La contraseña ingresada es incorrecta", details: "password_incorrect"});
        }

        if (newPassword !== confirmNewPassword) {
            return res.json({msg: "Las contraseña ingresadas no coinciden", details: "password_incorrect"});
        }

        try {
            const salt = await bcrypt.genSalt(10);  //hash password
            const newPasswordUser = await bcrypt.hash(newPassword, salt);
            const dataUser = {
                password: newPasswordUser,
                updated_at: Date.now()
            }

            user = await User.findByIdAndUpdate(
                {_id: id},
                {$set: dataUser},
                {new: true}
            );

            return res.json({user, details: "success"});
        } catch (e) {
            return res.json({msg: e.message, details: "error"});
        }

    }
}