const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ACTIVE = "ACTIVE";
const INACTIVE = "INACTIVE";
const HIDDEN = "HIDDEN ";
const DRAFT = "DRAFT ";

exports.ACTIVE = ACTIVE;
exports.INACTIVE = INACTIVE;
exports.HIDDEN = HIDDEN;
exports.DRAFT = DRAFT;

const postSchema = new Schema({
    code: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    tags: {
        type: Array
    },
    content: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    community: {
        type: Map,
        required: true
    },
    status: {
        type: String,
        default: ACTIVE,
        trim: true,
        enumValues: [ACTIVE, INACTIVE, HIDDEN, DRAFT],
    },
    score: {
        type: Number,
        default: 0
    },
    deleted_at: {
        type: Date
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
module.exports = mongoose.model('Post', postSchema);