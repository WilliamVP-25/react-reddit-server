const Category = require('../models/Category')
const User = require('../models/User')
const {validationResult} = require('express-validator')
const urlSlug = require('url-slug')

exports.createCategory = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array(), details: "no_data_send"});
    }

    const {name, description} = req.body;
    const {id} = req.user;

    const user = await User.findById(id);
    if (!user) {
        return res.json({msg: "El usuario ya no existe", details: "user_exists"});
    }

    const exists_category = await Category.findOne({slug: urlSlug(name)});
    if (exists_category) {
        return res.json({msg: "Una categoría con ese nombre ya ha sido creada", details: "category_exists"});
    }

    try {
        const category = new Category({name, description});
        category.created_by = user.id;
        category.slug = urlSlug(name);
        await category.save();
        return res.json({msg: "Categoria creada correctamente", details: "success"});
    } catch (e) {
        console.log(e);
        return res.json({msg: "Ocurrió un error inesperado", errors: e.message, details: "errror"});
    }
}

exports.getCategories = async (req, res) => {
    try {
        let categories = await Category.find().select('name slug').sort({name: 'asc'});
        return res.json({categories});
    } catch (e) {
        return res.json({categories: e.response.message, details: "error"});
    }
}