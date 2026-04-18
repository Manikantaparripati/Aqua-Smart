const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/products?category=aquafeed
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    const products = await Product.find(filter).sort('-createdAt');
    res.json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products — admin or authenticated user (for marketplace listings)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, category, image, stock, seller } = req.body;
    if (!name || !price || !category)
      return res.status(400).json({ message: 'Name, price and category are required' });

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      category,
      image: image || '📦',
      stock: stock || 100,
      seller: seller || req.user.name,
    });
    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/products/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/products/:id — admin only (soft delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
