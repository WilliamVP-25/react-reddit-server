const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    },
    displayName: {
        type: String,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    },
    about: {
        type: String,
    },
    avatar: {
        type: String,
    },
    banner: {
        type: String,
    },
    contentVisibility: {
        type: Boolean,
        default: false
    },
    communitiesVisibility: {
        type: Boolean,
        default: false
    },
    showInSearch: {
        type: Boolean,
        default: false
    },
    showAdultContent: {
        type: Boolean,
        default: false
    },
/*    autoPlay: {
        type: Boolean,
        default: false
    },
    openPostInNewWindow: {
        type: Boolean,
        default: false
    },*/
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Profile', profileSchema);