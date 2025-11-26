const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, deleteOrder, updateOrderToPaid, updateOrderToDelivered, getOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddlewares');


router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);


router.route('/myorders').get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, deleteOrder);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

module.exports = router;
