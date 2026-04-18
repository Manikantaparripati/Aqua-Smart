const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/bookings — authenticated user
router.post('/', protect, async (req, res) => {
  try {
    const { name, phone, serviceType, message } = req.body;
    if (!name || !phone || !serviceType)
      return res.status(400).json({ message: 'Name, phone and service type are required' });

    const booking = await Booking.create({
      user: req.user._id,
      name,
      phone,
      serviceType,
      message: message || '',
    });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/bookings — admin gets all, user gets own
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt');
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id — admin only (update status)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/bookings/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
