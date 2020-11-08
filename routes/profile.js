const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const profileController = require("../controllers/profileController");
const fileController = require("../controllers/fileController");

router.get('/', auth, profileController.getAuthProfile);
router.put('/', auth, profileController.updateProfile);
router.put('/avatar/', auth, fileController.uploadAvatar);
router.put('/banner/', auth, fileController.uploadBanner);
router.get('/:username', profileController.getProfile);

module.exports = router;