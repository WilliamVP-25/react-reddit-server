const Profile = require('../models/Profile')
const User = require('../models/User')
const Community = require('../models/Community')
const shortid = require("shortid");
const multer = require("multer");
const fs = require("fs")

exports.uploadAvatar = async (req, res) => {
    const {id} = req.user;
    let user = await User.findById(id); //validar user exists
    if (!user) {
        return res.status(400).json({msg: "El usuario no existe"});
    }

    let profile = await Profile.findOne({user: user._id});
    if (!profile) {
        profile = new Profile({user: user._id});
        await profile.save();
    }

    const config = {
        limits: {fileSize: 1024 * 1024 * 10},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/avatar/")
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                const name = `${shortid.generate()}.${extension}`
                callback(null, name)
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/exe") { //validation extension file
                    return callback(null, true);
                }
            }
        })
    }
    const upload = multer(config).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            const dataProfile = {
                avatar: req.file.filename,
                updated_at: Date.now()
            }
            profile = await Profile.findByIdAndUpdate(
                {_id: profile._id},
                {$set: dataProfile},
                {new: true}
            );
            res.json({profile});
        } else {
            console.log(error);
            return res.json({details: "error", msg: "Ocurrió un error inesperado. Intenta nuevamente"});
        }
    })
    upload.single('file');
}

exports.uploadBanner = async (req, res) => {
    const {id} = req.user;
    let user = await User.findById(id); //validar user exists
    if (!user) {
        return res.status(400).json({msg: "El usuario no existe"});
    }

    let profile = await Profile.findOne({user: user._id});
    if (!profile) {
        profile = new Profile({user: user._id});
        await profile.save();
    }

    const config = {
        limits: {fileSize: 1024 * 1024 * 10},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/banner/")
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                const name = `${shortid.generate()}.${extension}`
                callback(null, name)
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/exe") { //validation extension file
                    return callback(null, true);
                }
            }
        })
    }
    const upload = multer(config).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            const dataProfile = {
                banner: req.file.filename,
                updated_at: Date.now()
            }
            profile = await Profile.findByIdAndUpdate(
                {_id: profile._id},
                {$set: dataProfile},
                {new: true}
            );
            res.json({profile});
        } else {
            console.log(error);
            return res.json({details: "error", msg: "Ocurrió un error inesperado. Intenta nuevamente"});
        }
    })
    upload.single('file');
}

exports.uploadCommunityAvatar = async (req, res) => {
    const {id} = req.user;
    let user = await User.findById(id); //validar user exists
    if (!user) {
        return res.status(400).json({msg: "El usuario no existe"});
    }

    let community = await Community.findOne({slug: req.params.community});
    if (!community) {
        return res.json({msg: "La comunidad no existe"});
    }

    const config = {
        limits: {fileSize: 1024 * 1024 * 10},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/communities/avatar/")
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                const name = `${shortid.generate()}.${extension}`
                callback(null, name)
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/exe") { //validation extension file
                    return callback(null, true);
                }
            }
        })
    }
    const upload = multer(config).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            const dataCommunity = {
                avatar: req.file.filename,
                updated_at: Date.now()
            }
            community = await Community.findByIdAndUpdate(
                {_id: community._id},
                {$set: dataCommunity},
                {new: true}
            );
            res.json({file: req.file.filename, details: "success"});
        } else {
            return res.json({details: "error", msg: "Ocurrió un error inesperado. Intenta nuevamente"});
        }
    })
    upload.single('file');
}

exports.uploadCommunityBanner = async (req, res) => {
    const {id} = req.user;
    let user = await User.findById(id); //validar user exists
    if (!user) {
        return res.status(400).json({msg: "El usuario no existe"});
    }

    let community = await Community.findOne({slug: req.params.community});
    if (!community) {
        return res.json({msg: "La comunidad no existe"});
    }

    const config = {
        limits: {fileSize: 1024 * 1024 * 10},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/communities/banner/")
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                const name = `${shortid.generate()}.${extension}`
                callback(null, name)
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/exe") { //validation extension file
                    return callback(null, true);
                }
            }
        })
    }
    const upload = multer(config).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            const dataCommunity = {
                banner: req.file.filename,
                updated_at: Date.now()
            }
            community = await Community.findByIdAndUpdate(
                {_id: community._id},
                {$set: dataCommunity},
                {new: true}
            );
            res.json({file: req.file.filename, details: "success"});
        } else {
            console.log(error);
            return res.status(400).json({msg: "Error inesperado. Intenta nuevamente"});
        }
    })
    upload.single('file');
}

exports.deleteFile = async (req, res) => {
    console.log("eliminar archivo")
    console.log(req.file)

    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.file}`);
        console.log("eliminado...")
    } catch (e) {
        console.log("error eliminando archivo")
        console.log(e)
    }
}

exports.download = async (req, res, next) => {
    const {file} = req.params;
    const download = __dirname + "/../uploads/" + file;
    res.download(download);

    const link = await Link.findOne({name: file});
    const {download_limit, name, url} = link;
    if (download_limit === 1) {//validar limite descargas
        req.file = name;
        await Link.findOneAndRemove(url);
    } else {
        link.download_limit--;
        await link.save();
        return res.status(200).json({file: link.name});
    }
    next();
}
