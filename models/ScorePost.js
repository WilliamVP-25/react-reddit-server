const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ScorePostSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    value: {
        type: Boolean,
    }
});
module.exports = mongoose.model('ScorePost', ScorePostSchema);