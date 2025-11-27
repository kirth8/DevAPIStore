const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddlewares');

// Ruta para ver todos (GET /api/products)
router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

// Ruta para ver uno solo (GET /api/products/:id)
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.route('/:id/reviews')
    .post(protect, createProductReview);

module.exports = router;
