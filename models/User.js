const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";
const DISABLED = "DISABLED ";

const USER = "USER";
const ADMIN = "ADMIN";
const MODERATOR = "MODERATOR ";
exports.types = {USER, ADMIN, MODERATOR};

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        default: USER
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: ACTIVE,
        trim: true,
        enumValues: [ACTIVE, INACTIVE, DISABLED],
    },
    email_verification: {
        type: Date,
        default: null
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('User', userSchema);