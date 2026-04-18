// ============================================================
// AquaCrop Platform - Backend (Node.js + Express + MongoDB)
// Run: npm install && node server.js
// ============================================================
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ─── MongoDB Connection ───────────────────────────────────────
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aquacrop')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Models ──────────────────────────────────────────────────

// User Model
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true, select: false },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const User = mongoose.model('User', userSchema);

// Product Model
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  price:       { type: Number, required: true },
  category:    { type: String, enum: ['aquafeed', 'medicine', 'marketplace'], required: true },
  image:       { type: String, default: '' },
  stock:       { type: Number, default: 100 },
  seller:      { type: String, default: 'AquaCrop' },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  phone:       { type: String, required: true },
  serviceType: { type: String, required: true },
  message:     { type: String, default: '' },
  status:      { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });
const Booking = mongoose.model('Booking', bookingSchema);

// ─── Auth Middleware ──────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET || 'aquacrop_secret_key');
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Token invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
  next();
};

// ─── Auth Routes ─────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'aquacrop_secret_key', { expiresIn: '7d' });
    res.status(201).json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'aquacrop_secret_key', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// ─── Product Routes ───────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  const { category } = req.query;
  const filter = { isActive: true };
  if (category) filter.category = category;
  const products = await Product.find(filter).sort('-createdAt');
  res.json({ products });
});

app.post('/api/products', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/products/:id', protect, adminOnly, async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product deleted' });
});

// ─── Booking Routes ───────────────────────────────────────────
app.post('/api/bookings', protect, async (req, res) => {
  try {
    const booking = await Booking.create({ ...req.body, user: req.user._id });
    res.status(201).json({ booking });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/bookings', protect, adminOnly, async (req, res) => {
  const bookings = await Booking.find().populate('user', 'name email').sort('-createdAt');
  res.json({ bookings });
});

app.put('/api/bookings/:id', protect, adminOnly, async (req, res) => {
  const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ booking });
});

// ─── Admin Routes ─────────────────────────────────────────────
app.get('/api/admin/users', protect, adminOnly, async (req, res) => {
  const users = await User.find().sort('-createdAt').select('-password');
  res.json({ users });
});

app.get('/api/admin/stats', protect, adminOnly, async (req, res) => {
  const [users, products, bookings] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments({ isActive: true }),
    Booking.countDocuments(),
  ]);
  const bookingsByStatus = await Booking.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  res.json({ users, products, bookings, bookingsByStatus });
});

// ─── Seed Data ────────────────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  await Product.deleteMany({});
  const products = [
    { name: 'Premium Fish Feed 1kg', description: 'High protein pellets for healthy fish growth', price: 299, category: 'aquafeed', stock: 200 },
    { name: 'Shrimp Starter Feed', description: 'Micro pellets for shrimp larvae', price: 450, category: 'aquafeed', stock: 150 },
    { name: 'Growth Supplement', description: 'Vitamins & minerals blend for aquaculture', price: 399, category: 'aquafeed', stock: 100 },
    { name: 'Anti-Bacterial Medicine', description: 'Treats bacterial infections in fish', price: 599, category: 'medicine', stock: 80 },
    { name: 'Water Treatment Solution', description: 'Balances pH and removes chlorine', price: 349, category: 'medicine', stock: 120 },
    { name: 'Fish Vitamins', description: 'Boosts immunity and growth', price: 249, category: 'medicine', stock: 200 },
    { name: 'Fresh Prawns (1kg)', description: 'Farm-fresh tiger prawns', price: 850, category: 'marketplace', seller: 'RajaFarm' },
    { name: 'Paddy Seeds (5kg)', description: 'High yield paddy seeds', price: 320, category: 'marketplace', seller: 'SeedMart' },
    { name: 'Organic Fertilizer', description: 'Bio-compost for healthy crops', price: 199, category: 'marketplace', seller: 'GreenGrow' },
  ];
  await Product.insertMany(products);
  res.json({ message: 'Seeded successfully', count: products.length });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
