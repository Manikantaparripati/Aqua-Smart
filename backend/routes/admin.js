const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Booking = require('../models/Booking');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/admin/users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort('-createdAt').select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [userCount, productCount, bookingCount, orderCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Booking.countDocuments(),
      Order.countDocuments(),
    ]);
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const categoryStats = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);
    const orderRevenueData = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = orderRevenueData.length > 0 ? orderRevenueData[0].totalRevenue : 0;

    res.json({
      users: userCount,
      products: productCount,
      bookings: bookingCount,
      orders: orderCount,
      revenue: totalRevenue,
      bookingsByStatus,
      categoryStats,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/seed — seed sample products + admin user
router.post('/seed', async (req, res) => {
  try {
    // Seed products
    await Product.deleteMany({});
    const products = [
      { name: 'Premium Fish Feed 1kg', description: 'High protein pellets for healthy fish growth', price: 299, category: 'aquafeed', image: '🐟', stock: 200 },
      { name: 'Shrimp Starter Feed', description: 'Micro pellets for shrimp larvae and juveniles', price: 450, category: 'aquafeed', image: '🦐', stock: 150 },
      { name: 'Growth Supplement', description: 'Vitamins & minerals blend for aquaculture', price: 399, category: 'aquafeed', image: '💊', stock: 100 },
      { name: 'Anti-Bacterial Medicine', description: 'Treats bacterial infections in fish', price: 599, category: 'medicine', image: '🧪', stock: 80 },
      { name: 'Water Treatment Solution', description: 'Balances pH and removes harmful chemicals', price: 349, category: 'medicine', image: '💧', stock: 120 },
      { name: 'Fish Vitamins Boost', description: 'Boosts immunity and promotes growth', price: 249, category: 'medicine', image: '⚗️', stock: 200 },
      { name: 'Fresh Prawns (1kg)', description: 'Farm-fresh tiger prawns, live delivery', price: 850, category: 'marketplace', image: '🦞', stock: 50, seller: 'RajaFarm' },
      { name: 'Paddy Seeds (5kg)', description: 'High yield IR-64 paddy seeds', price: 320, category: 'marketplace', image: '🌾', stock: 300, seller: 'SeedMart' },
      { name: 'Organic Fertilizer 10kg', description: 'Bio-compost for healthy soil and crops', price: 199, category: 'marketplace', image: '🌱', stock: 500, seller: 'GreenGrow' },
    ];
    await Product.insertMany(products);

    // Seed admin user if not exists
    const adminExists = await User.findOne({ email: 'admin@aquacrop.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin User',
        email: 'admin@aquacrop.com',
        password: 'admin123',
        role: 'admin',
      });
    }

    res.json({ message: 'Database seeded successfully', productsAdded: products.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
