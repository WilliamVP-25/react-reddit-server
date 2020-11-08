const User = require('../models/User')
const Post = require('../models/Post')
const CommunityMembers = require('../models/CommunityMembers')
const Community = require('../models/Community')
const Profile = require('../models/Profile')
const {validationResult} = require('express-validator')
const shortid = require("shortid");
const urlSlug = require("url-slug");

exports.createPost = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {id} = req.user;
    console.log("create")
    console.log(req.body)

    if (req.body.postDraftId) {
        const {community, typeCommunity} = req.body;

        if (typeCommunity === 'user') {
            const exists_user = await User.findById(id);
            if (!exists_user) {
                return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
            }
        } else {
            const exists_community = await Community.findOne({slug: community});
            if (!exists_community) {
                return res.json({
                    msg: "La comunidad seleccionada ya no existe",
                    details: "community_not_exists"
                });
            }
        }

        try {
            const postData = req.body;
            postData.community = {
                type: postData.typeCommunity,
                slug: postData.community,
                updated_at: Date.now()
            }
            postData.slug = urlSlug(postData.title)
            postData.status = 'ACTIVE'
            post = await Post.findByIdAndUpdate(
                {_id: req.body.postDraftId},
                {$set: postData},
                {new: true}
            );
            return res.json({msg: `Publicación creada correctamente`, details: "success", post});

        } catch (e) {
            console.log(e);
            return res.json({msg: e.message, details: "error"});
        }


    } else {
        const {community, typeCommunity} = req.body;

        if (typeCommunity === 'user') {
            const exists_user = await User.findById(id);
            if (!exists_user) {
                return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
            }
        } else {
            const exists_community = await Community.findOne({slug: community});
            if (!exists_community) {
                return res.json({
                    msg: "La comunidad seleccionada ya no existe",
                    details: "community_not_exists"
                });
            }
        }

        try {
            const postData = req.body;
            postData.user = id
            postData.community = {
                type: postData.typeCommunity,
                slug: postData.community,
            }
            postData.code = shortid.generate()
            postData.slug = urlSlug(postData.title)
            if (req.body.draft) {
                postData.status = 'DRAFT'
            }
            const post = new Post(postData);
            await post.save();
            if (req.body.draft) {
                return res.json({msg: `Borrador guardado correctamente`, details: "success"});
            } else {
                return res.json({msg: `Publicación creada correctamente`, details: "success"});
            }
        } catch (e) {
            console.log(e);
            return res.json({msg: e.message, details: "error"});
        }
    }
}

exports.editPost = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const {id} = req.user;

    if (req.body.postDraftId) {
        let post = await Post.findById(req.body.postDraftId);

        if (!id === post.user) {
            return res.json({
                msg: "No tienes permiso para realizar esta acción",
                details: "user_not_authorized"
            });
        }
        const {community, typeCommunity} = req.body;

        if (typeCommunity === 'user') {
            const exists_user = await User.findById(id);
            if (!exists_user) {
                return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
            }
        } else {
            const exists_community = await Community.findOne({slug: community});
            if (!exists_community) {
                return res.json({
                    msg: "La comunidad seleccionada ya no existe",
                    details: "community_not_exists"
                });
            }
        }

        try {
            const postData = req.body;
            postData.community = {
                type: postData.typeCommunity,
                slug: postData.community,
                updated_at: Date.now()
            }
            postData.slug = urlSlug(postData.title)
            postData.status = 'DRAFT'
            post = await Post.findByIdAndUpdate(
                {_id: req.body.postDraftId},
                {$set: postData},
                {new: true}
            );
            return res.json({msg: `Borrador guardado correctamente`, details: "success", post});
        } catch (e) {
            console.log(e);
            return res.json({msg: e.response.message, details: "error"});
        }

    }
    if (req.body.postEditId) {
        let post = await Post.findById(req.body.postEditId);

        if (!id === post.user) {
            return res.json({
                msg: "No tienes permiso para realizar esta acción",
                details: "user_not_authorized"
            });
        }
        const {community, typeCommunity} = req.body;

        if (typeCommunity === 'user') {
            const exists_user = await User.findById(id);
            if (!exists_user) {
                return res.json({msg: "Este usuario ya no existe", details: "user_not_exists"});
            }
        } else {
            const exists_community = await Community.findOne({slug: community});
            if (!exists_community) {
                return res.json({
                    msg: "La comunidad seleccionada ya no existe",
                    details: "community_not_exists"
                });
            }
        }

        try {
            const postData = req.body;
            postData.community = {
                type: postData.typeCommunity,
                slug: postData.community,
                updated_at: Date.now()
            }
            postData.slug = urlSlug(postData.title)
            postData.status = 'ACTIVE'
            post = await Post.findByIdAndUpdate(
                {_id: req.body.postEditId},
                {$set: postData},
                {new: true}
            );
            return res.json({msg: `Publicación actualizada correctamente`, details: "success", post});
        } catch (e) {
            console.log(e);
            return res.json({msg: e.response.message, details: "error"});
        }
    }
}

exports.getPost = async (req, res) => {
    const {code} = req.params;
    try {
        const post = await Post.findOne({code}).populate('user', 'username');

        let postData = {
            ...post._doc
        };
        postData.profile = await Profile.findOne({user: post.user}).select('avatar');

        const community = post.community.toJSON()
        if (community.type === 'user') {
            postData.communityInfo = await User.findOne({username: community.slug});
            postData.communityInfo.profile = await Profile.findOne({user: postData.communityInfo._id});
        } else {
            postData.communityInfo = await Community.findOne({slug: community.slug});
        }

        if (post) {
            return res.json({post: postData, details: "success"});
        } else {
            return res.json({post: null, msg: "La publicación no existe.", details: "post_not_exists"});
        }
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.getPostsUser = async (req, res) => {
    const {username} = req.params;
    try {
        const user = await User.findOne({username});
        const posts = await Post.find({user: user._id}).populate('user', 'username -_id')
            .where('status').gte("ACTIVE")
            .sort({updated_at: 'desc'});

        if (posts) {
            const postsData = [];
            for (let post of posts) {
                let postData = {
                    ...post._doc
                };
                postData.profile = await Profile.findOne({user: user._id}).select('avatar');

                const community = post.community.toJSON()
                if (community.type === 'user') {
                    postData.communityInfo = await User.findOne({username: community.slug});
                    postData.communityInfo.profile = await Profile.findOne({user: postData.communityInfo._id});
                } else {
                    postData.communityInfo = await Community.findOne({slug: community.slug});
                }
                postsData.push(postData);
            }
            return res.json({posts: postsData, details: "success"});
        } else {
            return res.json({posts: null, msg: "No existen publicaciones para mostrar.", details: "post_not_exists"});
        }
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.getDraftsUser = async (req, res) => {
    const {id} = req.user;
    try {
        const user = await User.findById(id);
        const drafts = await Post.find({user: user._id}).populate('user', 'username -_id').where('status').gte("DRAFT");

        if (drafts) {
            const postsData = [];
            for (let post of drafts) {
                let postData = {
                    ...post._doc
                };
                postData.profile = await Profile.findOne({user: user._id}).select('avatar');

                const community = post.community.toJSON()
                if (community.type === 'user') {
                    postData.communityInfo = await User.findOne({username: community.slug});
                    postData.communityInfo.profile = await Profile.findOne({user: postData.communityInfo._id});
                } else {
                    postData.communityInfo = await Community.findOne({slug: community.slug});
                }
                postsData.push(postData);
            }
            return res.json({drafts: postsData, details: "success"});
        } else {
            return res.json({drafts: null, msg: "No existen publicaciones para mostrar.", details: "post_not_exists"});
        }
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.getPostsHome = async (req, res) => {
    try {
        let communitiesUser;
        if (req.user) {
            const user = await User.findById(req.user.id);
            communitiesUser = await CommunityMembers.find({user: user._id});
        }

        let posts = [];
        if (communitiesUser) {
            for (let communityUser of communitiesUser) {
                const {type} = communityUser;
                let slug;
                let communityInfo;
                if (type === 'user') {
                    communityInfo = await User.findById(communityUser.community);
                    communityInfo.profile = await Profile.findOne({user: communityInfo._id});
                    slug = communityInfo.username;
                } else {
                    communityInfo = await Community.findById(communityUser.community);
                    slug = communityInfo.slug;
                }
                let postsCommunity = await Post.find({"community.slug": slug}).populate('user', 'username')
                    .where('status').gte("ACTIVE")

                for (let postCommunity of postsCommunity) {
                    postCommunity = postCommunity._doc;
                    postCommunity.communityInfo = communityInfo;
                    posts.push(postCommunity);
                }

            }
        }

        if (posts.length > 0) {
            const postsData = [];
            for (let post of posts) {
                let postData = {
                    ...post
                };
                postData.profile = await Profile.findOne({user: post.user._id}).select('avatar');
                postsData.push(postData);
            }
            return res.json({posts: postsData, details: "success"});
        } else {
            return res.json({
                posts: null,
                msg: "No existen publicaciones para mostrar.",
                details: "post_not_exists"
            });
        }

    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}