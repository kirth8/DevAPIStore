const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddlewares.js');


router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', protect, userController.getUserProfile);



module.exports = router;
