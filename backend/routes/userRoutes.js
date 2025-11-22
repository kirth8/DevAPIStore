const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddlewares');


router.post('/', userController.registerUser);
router.post('/login', userController.loginUser);

//Para el usuario
router.route('/profile')
    .get(protect, userController.getUserProfile)
    .put(protect, userController.updateUserProfile);

//Para el admin
router.get('/', protect, admin, userController.getUsers);

router.route('/:id')
    .delete(protect, admin, userController.deleteUser)
    .get(protect, admin, userController.getUserById)
    .put(protect, admin, userController.updateUser);


module.exports = router;

