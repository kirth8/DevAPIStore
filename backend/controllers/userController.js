const userService = require('../services/userService');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
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
// @desc    Actualizar perfil del usuario (El mismo usuario)
// @route   PUT /api/users/profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.userName = req.body.userName || user.userName;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                console.log('Actualizando contraseña para usuario:', user._id);
                // Encriptar contraseña manualmente
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
                console.log('Contraseña encriptada y asignada');
            } else {
                console.log('No se envió contraseña para actualizar');
            }
            const updatedUser = await user.save();
            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    userName: updatedUser.userName,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
// @desc    Obtener todos los usuarios (Admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Eliminar usuario (Admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ success: true, message: 'Usuario eliminado' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Obtener usuario por ID (Admin)
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Actualizar usuario (Admin)
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.userName = req.body.userName || user.userName;
            user.email = req.body.email || user.email;
            user.isAdmin = req.body.isAdmin === undefined ? user.isAdmin : req.body.isAdmin;
            const updatedUser = await user.save();
            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    userName: updatedUser.userName,
                    email: updatedUser.email,
                    isAdmin: updatedUser.isAdmin
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser
};