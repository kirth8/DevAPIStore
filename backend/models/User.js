const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        trim: true //Elimina los espacion en blanco al inicio y al final 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true //para poder saber la fecha de creacion y actualizacion
});

module.exports = mongoose.model('User', UserSchema); 