const User = require('../models/User');
const bcrypt = require('bcryptjs');

const registerUser = async (userData) => {
    const { userName, email, password } = userData;
    // 1. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new Error('El usuario ya existe');
    }
    // 2. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 3. Crear el usuario en la base de datos
    const user = await User.create({
        userName,
        email,
        password: hashedPassword
    });
    return user;
};

// Función para login (comparar contraseñas)
const loginUser = async (email, password) => {
    // 1. Buscar usuario por email
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('Credenciales inválidas');
    }
    // 2. Comparar la contraseña que ingresó con la encriptada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Credenciales inválidas');
    }
    return user;
};

module.exports = {
    registerUser,
    loginUser
}