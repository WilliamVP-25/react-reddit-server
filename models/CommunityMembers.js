const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const communityMemberSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    },
    type: {
        type: String,
        enumValues: ["user", "community"],
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('CommunityMember', communityMemberSchema);