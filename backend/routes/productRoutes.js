const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/productController');

// Ruta para ver todos (GET /api/products)
router.get('/', getProducts);

// Ruta para ver uno solo (GET /api/products/:id)
router.get('/:id', getProductById);

module.exports = router;
