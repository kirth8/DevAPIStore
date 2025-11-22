const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddlewares');

// Ruta para ver todos (GET /api/products)
router.route('/')
    .get(protect, getProducts)
    .post(protect, admin, createProduct);

// Ruta para ver uno solo (GET /api/products/:id)
router.route('/:id')
    .get(protect, admin, getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;
