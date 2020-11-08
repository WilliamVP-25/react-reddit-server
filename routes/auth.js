const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const authController = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post('/', [
    check('username', "Nombre de usuario inválido").not().isEmpty(),
    check('password', "Contraseña inválida").not().isEmpty(),
], authController.login);

router.post('/verify_email', [
    check('email', "Verifica el correo electrónico").isEmail(),
], authController.verifyEmailRegister);

router.post('/verify_username', [
    check('username', "Nombre de usuario inválido").isLength({min: 3}),
], authController.verifyUsernameRegister);

router.get('/', auth, authController.getUserAuth);

module.exports = router;