const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");
const postController = require('../controllers/postController')
const scorePostController = require('../controllers/scorePostController')

router.post('/', [
    check('title', "El Titulo es requerido").not().isEmpty().isLength({max: 300}),
    check('community', "La comunidad es requerida").not().isEmpty(),
], auth, postController.createPost);

router.put('/', [
    check('title', "El Titulo es requerido").not().isEmpty().isLength({max: 300}),
    check('community', "La comunidad es requerida").not().isEmpty(),
], auth, postController.editPost);

router.get('/:code', postController.getPost);
router.get('/getPostsUsers/:username', postController.getPostsUser);
router.post('/getDrafts', auth, postController.getDraftsUser);

router.post('/toggleScore', auth, scorePostController.toggleScorePost);
router.post('/getScorePost', auth, scorePostController.getScorePost);

router.post('/getPostsHome', auth, postController.getPostsHome);

module.exports = router;