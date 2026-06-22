import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the product.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description.'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price.'],
    min: [0, 'Price cannot be negative.'],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative.'],
    max: [5, 'Rating cannot be more than 5.'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category.'],
    lowercase: true,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: [true, 'Please provide a thumbnail image URL.'],
  },
  images: {
    type: [String],
    default: [],
  },
  brand: {
    type: String,
    default: '',
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative.'],
  },
  warrantyInformation: {
    type: String,
    default: 'No warranty',
  },
  shippingInformation: {
    type: String,
    default: 'Standard shipping',
  },
  returnPolicy: {
    type: String,
    default: 'No returns',
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
