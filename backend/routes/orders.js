const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/orders — Create a new order (authenticated users)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = await Order.create({
      user: req.user._id,
      orderItems,
      totalPrice,
    });

    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/orders — Get all orders (Admin only) or own orders (User)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/status — Update order status (Admin only)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
