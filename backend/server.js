const express = require('express');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ products: [] }).write();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://ecommerce-fullstack-design-te38.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// GET all products
app.get('/api/products', (req, res) => {
  const { search, category, featured, sort, limit = 20, page = 1 } = req.query;
  let products = db.get('products').value();

  if (search) {
    const s = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(s) || p.category.toLowerCase().includes(s)
    );
  }
  if (category) products = products.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  if (featured === 'true') products = products.filter(p => p.featured);
  if (sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (sort === 'price_desc') products.sort((a, b) => b.price - a.price);
  if (sort === 'rating') products.sort((a, b) => b.rating - a.rating);
  if (sort === 'sold') products.sort((a, b) => b.sold - a.sold);

  const total = products.length;
  const start = (Number(page) - 1) * Number(limit);
  const data = products.slice(start, start + Number(limit));

  res.json({ success: true, count: data.length, total, page: Number(page), pages: Math.ceil(total / Number(limit)), data });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product =
    db.get('products').find({ slug: req.params.id }).value() ||
    db.get('products').find({ id: req.params.id }).value();
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API running' }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 API: http://localhost:${PORT}/api/products`);
});