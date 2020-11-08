const Profile = require('../models/Profile')
const User = require('../models/User')
const {validationResult} = require('express-validator')

exports.createProfile = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.json({errors: errors.array(), details: "data_no_send", msg: "Información enviada incompleta"});
    }

    const {email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({msg: "El usuario ya no existe", details: "user_not_exists"});
    }

    const exists_profile = await Profile.findOne({user: user._id});
    if (exists_profile) {
        return res.json({msg: "Usuario creado correctamente, Profile already created"});
    }

    try {
        const profile = new Profile({user: user._id});
        await profile.save();
        return res.json({msg: "Usuario creado correctamente", details: "success"});
    } catch (e) {
        return res.json({msg: e.message, details: "error"});
    }
}

exports.getAuthProfile = async (req, res) => {
    if (req.user) {
        try {
            const {id} = req.user;
            const user = await User.findById(id);
            if (!user) return res.status(400).json({profile: null});
            const profile = await Profile.findOne({user: id});
            const profileData = {
                ...profile._doc,
                user_id: user._id,
                username: user.username,
                created_at_user: user.created_at,
            };
            return res.json({profile: profileData, details: "success"});
        } catch (e) {
            return res.json({profile: null, details: "error"});
        }
    }
    return res.json({profile: null, details: "error"});
}

exports.getProfile = async (req, res) => {
    const {username} = req.params;
    try {
        let user;
        if (!user) {
            user = await User.findOne({username});
            if (!user) {
                user = await User.findById(username)
            }
        }

        if (!user) {
            return res.json({msg: "El usuario no existe", details: "user_not_exists"});
        }
        let profile = await Profile.findOne({user: user._id})
        const profileData = {
            ...profile._doc,
            user_id: user._id,
            username: user.username,
            created_at_user: user.created_at,
        };
        return res.json({profile: profileData, details: "success"});
    } catch (e) {
        return res.json({profile: null, details: "error"});
    }
}

exports.updateProfile = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {id} = req.user;

    const {field, value} = req.body;

    let user = await User.findById(id); //validar user exists
    if (!user) {
        return res.json({msg: "El usuario no existe", details: "user_not_exists"});
    }

    let profile = await Profile.findOne({user: user._id});
    if (!profile) {
        profile = new Profile({user: user._id});
        await profile.save();
    }

    try {
        const dataProfile = {
            [field]: value,
            updated_at: Date.now()
        }

        profile = await Profile.findByIdAndUpdate(
            {_id: profile._id},
            {$set: dataProfile},
            {new: true}
        );
        return res.json({profile});
    } catch (e) {
        console.log(e);
        return res.status(400).json({details: "error", msg: e.message});
    }
}
