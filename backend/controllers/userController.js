const userService = require('../services/userService');

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
                isAdmin: user.isAdmin
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
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Usuario no encontrado:' + error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
}