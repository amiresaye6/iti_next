const fs = require('fs');
const path = require('path');
const https = require('https');
const mongoose = require('mongoose');

// 1. Simple helper to parse the .env file and set process.env
const envPath = path.join(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.includes('=')) return;
    const [key, ...valueParts] = line.split('=');
    const value = valueParts.join('=').trim();
    process.env[key.trim()] = value.replace(/^['"]|['"]$/g, ''); // remove wrapping quotes
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopvibe';

// 2. Define Product schema inline for CommonJS execution
const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  images: { type: [String], default: [] },
  brand: { type: String, default: '' },
  stock: { type: Number, default: 0 },
  warrantyInformation: { type: String, default: 'No warranty' },
  shippingInformation: { type: String, default: 'Standard shipping' },
  returnPolicy: { type: String, default: 'No returns' }
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

// 3. Fetch products helper
function fetchProducts() {
  return new Promise((resolve, reject) => {
    https.get('https://dummyjson.com/products?limit=30', (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve(data.products || []);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// 4. Main execution
async function run() {
  console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    console.log('Fetching sample products from DummyJSON...');
    const dummyProducts = await fetchProducts();
    console.log(`Fetched ${dummyProducts.length} products.`);

    console.log('Clearing existing products in database...');
    await Product.deleteMany({});
    console.log('Products collection cleared.');

    console.log('Formatting and inserting products...');
    const formattedProducts = dummyProducts.map(p => ({
      title: p.title,
      description: p.description,
      price: p.price,
      rating: p.rating || 0,
      category: p.category.toLowerCase(),
      thumbnail: p.thumbnail,
      images: p.images || [],
      brand: p.brand || '',
      stock: p.stock || 0,
      warrantyInformation: p.warrantyInformation || 'No warranty',
      shippingInformation: p.shippingInformation || 'Standard shipping',
      returnPolicy: p.returnPolicy || 'No returns'
    }));

    await Product.insertMany(formattedProducts);
    console.log('Database seeded successfully with 30 products!');

  } catch (error) {
    console.error('Seeding process failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
}

run();
