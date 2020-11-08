const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");
const communityController = require("../controllers/communityController");
const fileController = require("../controllers/fileController");

router.post('/', [
    check('name', "El nombre de la comunidad es requerido").not().isEmpty(),
    check('category', "La categoria es requerida").not().isEmpty(),
], auth, communityController.createCommunity);

router.get('/category/:category', communityController.getCommunitiesByCategory);
router.get('/getCommunity/:community', communityController.getCommunity);
router.get('/:community/getPosts', communityController.getPostsCommunity);

router.get('/getCommunitiesUser', auth, communityController.getCommunitiesUser);
router.post('/joinOrLeave', auth, communityController.joinOrLeave);
router.post('/memberCount', auth, communityController.getMemberCount);
router.post('/memberUser', auth, communityController.getMemberUser);

router.post('/searchCommunity', auth, communityController.getResultsSearch);
router.put('/', [
    check('name', "El nombre de la comunidad es requerido").not().isEmpty(),
    check('category', "La categoria es requerida").not().isEmpty()
], auth, communityController.updateCommunity);

router.put('/:community/avatar', auth, fileController.uploadCommunityAvatar);
router.put('/:community/banner', auth, fileController.uploadCommunityBanner);

module.exports = router;