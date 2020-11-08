const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";
const DISABLED = "DISABLED ";

const communitySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    displayName: {
        type: String,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    avatar: {
        type: String,
    },
    banner: {
        type: String,
    },
    showAdultContent: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        trim: true
    },
    topics: {
        type: Array
    },
    rules: {
        type: Array
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    type: {
        type: String,
        required: true,
        enumValues: ['public', 'restricted', 'private'],
    },
    status: {
        type: String,
        default: ACTIVE,
        trim: true,
        enumValues: [ACTIVE, INACTIVE, DISABLED],
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
module.exports = mongoose.model('Community', communitySchema);