const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// Ruta para ver todos (GET /api/products)
router.route('/')
    .get(getProducts)
    .post(createProduct);

// Ruta para ver uno solo (GET /api/products/:id)
router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
