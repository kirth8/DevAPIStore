const express = require('express');
const router = express.Router();
const { upload, uploadImage } = require('../controllers/uploadController');

// api/uploads
router.post('/', upload.single('image'), uploadImage);

module.exports = router;