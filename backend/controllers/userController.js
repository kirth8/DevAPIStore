const userService = require('../services/userService');
const generateToken = require('../utils/generateToken');

const registerUser = async (req, res) => {
    try {
        const user = await userService.registerUser(req.body);
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Usuario ya registrado:' + error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);

        res.status(200).json({
            success: true,
            message: 'Usuario logueado exitosamente',
            data: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id)
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Usuario no encontrado:' + error.message
        });
    }
};

const getUserProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: {
            _id: req.user._id,
            userName: req.user.userName,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        }
    })
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
}