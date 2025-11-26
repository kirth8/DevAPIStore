const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddlewares');


router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, deleteOrder);



module.exports = router;
