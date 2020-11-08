const Community = require('../models/Community')
const CommunityMember = require('../models/CommunityMembers')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Post = require('../models/Post')
const Category = require('../models/Category')
const {validationResult} = require('express-validator')
const urlSlug = require('url-slug')

exports.createCommunity = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {id} = req.user;
    const {name, topics, description, nsfw, type, category} = req.body;
    const exists_community = await Community.findOne({name});
    if (exists_community) {
        return res.json({msg: "Ya existe una comunidad con el mismo nombre", details: "community_name_exists"});
    }

    const exists_user = await User.findById(id)
    if (!exists_user) {
        return res.json({msg: "El usuario no existe", details: "user_not_exists"});
    }

    const category_exists = await Category.findOne({slug: category})
    if (!category_exists) {
        return res.json({msg: "La categoria no existe", details: "category_not_exists"});
    }

    let topicsData = [];
    for (const topic in topics) {
        const topic_exists = await Category.findOne({name: topics[topic]});
        if (topic_exists) {
            topicsData.push(topic_exists._id)
        }
    }

    try {
        const communityData = {
            name, description,
            slug: urlSlug(name),
            showAdultContent: nsfw, type,
            category: category_exists._id,
            topics: topicsData,
            user: id
        }
        const community = new Community(communityData);
        await community.save();

        const communityMember = new CommunityMember({
            user: id, community: community._id
        });
        await communityMember.save();
        return res.json({community});
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.updateCommunity = async (req, res, next) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.json({errors: errors.array(), details: "no_data_send", msg: "Datos enviados incorrectos"});
    }

    const {id} = req.user;
    const {displayName, topics, description, nsfw, type, category, name, rules, status} = req.body;
    const exists_community = await Community.findOne({name});
    if (!exists_community) {
        return res.json({msg: "La comunidad ya no existe", details: "community_not_exists"});
    }

    const exists_user = await User.findById(id)
    if (!exists_user || !id === exists_community.user) {
        return res.json({
            msg: "El usuario no existe o no esta autorizado para realizar esta acción",
            details: "user_not_exists"
        });
    }

    const category_exists = await Category.findOne({slug: category})
    if (!category_exists) {
        return res.json({msg: "La categoria no existe", details: "category_not_exists"});
    }

    let topicsData = [];
    for (const topic in topics) {
        const topic_exists = await Category.findOne({name: topics[topic]});
        if (topic_exists) {
            topicsData.push(topic_exists._id)
        }
    }
    try {
        const communityData = {
            displayName, description,
            showAdultContent: nsfw, type,
            category: category_exists._id,
            topics: topicsData, rules, status
        }
        const community = await Community.findByIdAndUpdate(
            {_id: exists_community._id},
            {$set: communityData},
            {new: true}
        );
        return res.json({community, details: "success"});
    } catch (e) {
        console.log(e);
        return res.json({msg: e.message, details: "error"});
    }
}

exports.getCommunitiesByCategory = async (req, res) => {
    const {category} = req.params;
    try {
        let communities;
        if (category !== "all") {
            const category_exists = await Category.findOne({slug: category});
            if (!category_exists) {
                return res.status(404).json({
                    communities: null,
                    msg: "La categoria no existe",
                    details: "category_no_exists"
                });
            }
            communities = await Community.find({category: category_exists._id}).sort({name: 'asc'});
        } else {
            communities = await Community.find().sort({name: 'asc'});
        }
        return res.json({communities});
    } catch (e) {
        return res.json({
            communities: null,
            msg: "Ha ocurrido un error inesperado. intenta nuevamente",
            details: "error"
        });
    }
}

exports.getCommunity = async (req, res) => {
    const {community} = req.params;
    try {
        const communityData = await Community.findOne()
            .or([{name: community}, {slug: community}, {id: community}])
            .populate('category', 'name slug')
        const countMembers = await CommunityMember.find({community: communityData._id}).countDocuments()
        const userInfo = await User.findById(communityData.user).select('username');

        let topics = [];
        if (communityData.topics.length > 0) {
            for (const topic of communityData.topics) {
                const category = await Category.findById(topic).select('name slug')
                if (category) topics.push(category.slug)
            }
        }

        const data = {
            ...communityData._doc,
            membersCount: countMembers,
            userInfo, topics
        }
        return res.json({community: data});
    } catch (e) {
        console.log(e);
        return res.json({community: null, details: "error"});
    }
}

// communityMember
exports.joinOrLeave = async (req, res) => {
    const {community, type} = req.body;
    const {id} = req.user;
    try {
        let communityData;
        if (type === "user") {
            communityData = await User.findOne({username: community})
        } else {
            communityData = await Community.findOne().or([{name: community}, {slug: community}])
        }
        const member = await CommunityMember.findOne({community: communityData._id, user: id}).countDocuments()
        if (member === 0) {
            const communityMember = new CommunityMember({
                user: id,
                community: communityData._id,
                type
            });
            await communityMember.save();
            return res.json({member: true});
        } else {
            await CommunityMember.findOneAndRemove({community: communityData._id, user: id})
            return res.json({member: false});
        }
    } catch (e) {
        return res.json({response: null, details: "error"});
    }
}

exports.getMemberCount = async (req, res) => {
    const {community} = req.body;
    try {
        const communityData = await Community.findOne().or([{name: community}, {slug: community}])
        const count = await CommunityMember.find({community: communityData._id}).countDocuments()
        return res.json({count});
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: "Ocurrio un error.", details: "error"});
    }
}

exports.getMemberUser = async (req, res) => {
    const {community} = req.body;
    const {id} = req.user;
    try {
        const communityData = await Community.findOne().or([{name: community}, {slug: community}])
        const member = await CommunityMember.findOne({community: communityData._id, user: id}).countDocuments()
        if (member > 0) {
            return res.json({member: true});
        } else {
            return res.json({member: false});
        }
    } catch (e) {
        return res.json({member: 0, details: "error"});
    }
}

exports.getCommunitiesUser = async (req, res) => {
    const {id} = req.user;
    try {
        const communityData = await CommunityMember.find({user: id}).select('community')
        let communities = [];
        if (communityData) {
            for (const resKey of communityData) {
                const communityInfo = await Community.findById(resKey.community).select('name slug avatar banner')
                if (communityInfo) {
                    communities.push(communityInfo);
                }
            }
        }
        if (communities.length > 0) {
            return res.json({communities});
        } else {
            return res.json({
                communities: null,
                details: "community_data_null",
                msg: "No hay comunidades para mostrar"
            });
        }
    } catch (e) {
        return res.status(400).json({msg: "Ocurrio un error.", details: "error"});
    }
}

//search
exports.getResultsSearch = async (req, res) => {
    const {search} = req.body;
    try {
        let results = [];
        const communitties = await Community.find()
            .or([
                {"name": {$regex: `.*${search}.*`}},
                {"slug": {$regex: `.*${search}.*`}},
                //{"description": {$regex: `.*${search}.*`}}
            ])
            .select('name slug description avatar')
            .where('status', "ACTIVE")
        for (let community of communitties) {
            results.push(community._doc);
        }

        const users = await User.find().or([{"username": {$regex: `.*${search}.*`}}])
            .select('username avatar ')
            .where('status', "ACTIVE")
        for (let user of users) {
            const profile = await Profile.findOne({user: user._id}).select('avatar displayName showInSearch -_id')
            let avatar;
            if (profile) {
                avatar = profile.avatar
                if (!profile.showInSearch) continue;
            }
            results.push({
                ...user._doc, avatar
            });
        }

        return res.json({results, details: "success"});
    } catch (e) {
        return res.json({details: "error"});
    }
}

//posts community
exports.getPostsCommunity = async (req, res) => {
    const {community} = req.params;
    try {
        const communityData = await Community.findOne().or([{slug: community}]).select('slug -_id')
        if (!communityData) {
            return res.json({posts: null, msg: "La comunidad ya no existe", details: "community_not_exists"});
        }
        const posts = await Post.find({"community.slug": communityData.slug}).populate('user', 'username')
            .where('status').gte("ACTIVE")
            .sort({updated_at: 'desc'});

        if (posts) {
            const postsData = [];
            for (let post of posts) {
                let postData = {...post._doc};
                postData.profile = await Profile.findOne({user: post.user._id}).select('avatar');

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
        return res.json({details: "error"});
    }
}