const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price:       { type: Number, required: true, min: 0 },
    category:    { type: String, enum: ['aquafeed', 'medicine', 'marketplace'], required: true },
    image:       { type: String, default: '📦' },
    stock:       { type: Number, default: 100, min: 0 },
    seller:      { type: String, default: 'AquaCrop' },
    isActive:    { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
