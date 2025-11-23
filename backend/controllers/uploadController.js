const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Solo puedes subir imagenes jpg, jpeg o png');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});
// La función que se ejecutará después de subir la imagen
const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'Por favor sube una imagen' });
    }
    res.send(`/${req.file.path.replace(/\\/g, '/')}`);
};
module.exports = { upload, uploadImage };