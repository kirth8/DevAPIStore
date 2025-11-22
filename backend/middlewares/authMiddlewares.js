const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    // 1. Verificar si el encabezado tiene el token (Formato: "Bearer eyJhbGci...")
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // 2. Obtener solo el token (quitamos la palabra "Bearer ")
            token = req.headers.authorization.split(' ')[1];
            // 3. Verificar que el token sea válido (la firma secreta)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // 4. Buscar al usuario en la DB y adjuntarlo a la petición (req.user)
            // .select('-password') significa "trae todo MENOS la contraseña"
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'No autorizado, token fallido'
            });
        }
    }
    if (!token) {
        res.status(401).json({
            success: false,
            message: 'No autorizado, no hay token'
        });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'No autorizado como administrador'
        });
    }
};

module.exports = { protect, admin };