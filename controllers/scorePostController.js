const User = require('../models/User')
const Post = require('../models/Post')
const ScorePost = require('../models/ScorePost')

exports.getScorePost = async (req, res) => {
    try {
        const {postId} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.json({post: null, msg: "La publicación no existe.", details: "post_not_exists"});
        }

        if (req.user) {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
            }
            let score = await ScorePost.findOne({post: post._id, user: user._id});
            if (score) {
                return res.json({
                    score: {
                        score: post.score,
                        user_value: score.value
                    }
                    , details: "success"
                });
            }
        }

        return res.json({score: {score: post.score}, details: "success"});

    } catch (e) {
        return res.json({details: "error", error: e.response.message});
    }
}

exports.toggleScorePost = async (req, res) => {
    const {id} = req.user;
    try {

        const user = await User.findById(id);
        if (!user) {
            return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
        }

        const {postId, action} = req.body;

        let post = await Post.findById(postId);
        if (!post) {
            return res.json({post: null, msg: "La publicación no existe.", details: "post_not_exists"});
        }

        let score = await ScorePost.findOne({post: post._id, user: user._id});

        let scorePostUserData = {
            post: post._id,
            user: user._id,
            value: action
        }

        if (score) {
            if (score.value === scorePostUserData.value) {
                await ScorePost.findByIdAndRemove(score._id)

                const newScore = action ? post.score - 1 : post.score + 1;
                let newPostData = post;
                newPostData.score = newScore;
                post = await Post.findByIdAndUpdate(
                    {_id: post._id},
                    {$set: newPostData},
                    {new: true}
                );

                return res.json({
                    score: {
                        score: post.score,
                        user_value: 0
                    },
                    details: "success"
                });
            } else {
                score = await ScorePost.findByIdAndUpdate(
                    {_id: score._id},
                    {$set: scorePostUserData},
                    {new: true}
                );
            }
        } else {
            score = new ScorePost(scorePostUserData);
            await score.save();
        }

        if (score) {
            const newScore = action ? post.score + 1 : post.score - 1;
            let newPostData = post;
            newPostData.score = newScore;
            post = await Post.findByIdAndUpdate(
                {_id: post._id},
                {$set: newPostData},
                {new: true}
            );
        }

        return res.json({
            score: {
                score: post.score,
                user_value: score.value
            },
            details: "success"
        });
    } catch (e) {
        return res.json({msg: e.message, details: "error"});
    }
}