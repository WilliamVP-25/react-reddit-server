const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const categoryController = require("../controllers/categoryController");

router.post('/', [
    check('name', "El nombre de la categoria es requerido").not().isEmpty(),
], auth, categoryController.createCategory);

router.get('/', categoryController.getCategories);

module.exports = router;