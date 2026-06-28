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

  // Auto-seed if database is empty
  const products = db.get("products").value();
  if (!products || products.length === 0) {
    const bcrypt = require("bcryptjs");
    const sampleProducts = [
      {
        id: "1",
        slug: "gopro-hero6-action-camera",
        name: "GoPro HERO6 4K Action Camera - Black",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Mobile accessory",
        subCategory: "Electronics",
        stock: 150,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: true,
        tag: "Bestseller",
        colors: ["Black", "Silver"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Model: "#874562", Style: "Classic" },
        features: ["Great feature 1", "Great feature 2"],
      },
      {
        id: "2",
        slug: "iphone-12-red",
        name: "iPhone 12 Red Edition",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1592286927505-1def25115558?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Smartphones",
        subCategory: "Smartphones",
        stock: 80,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: true,
        tag: "New Arrival",
        colors: ["Red", "Blue", "Black"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Model: "#874563", Memory: "128GB" },
        features: ["5G capable", "Super Retina XDR display"],
      },
      {
        id: "3",
        slug: "samsung-galaxy-blue",
        name: "Samsung Galaxy Smartphone Blue",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Smartphones",
        subCategory: "Smartphones",
        stock: 120,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: false,
        tag: "Sale",
        colors: ["Blue", "Black"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Model: "#874564", Memory: "64GB" },
        features: ["High performance", "Long battery life"],
      },
      {
        id: "4",
        slug: "pro-tablet-gradient",
        name: "Pro Tablet Gradient Edition",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Electronics",
        subCategory: "Tablets",
        stock: 60,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: true,
        tag: "Premium",
        colors: ["Space Gray", "Silver"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Size: "247mm x 178mm", Memory: "256GB" },
        features: ["Retina display", "All-day battery"],
      },
      {
        id: "5",
        slug: "canon-dslr-camera",
        name: "Canon DSLR Camera Professional",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1606980625066-fed42cc1faa0?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1606980625066-fed42cc1faa0?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Electronics",
        subCategory: "Modern tech",
        stock: 40,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: false,
        tag: "Pro",
        colors: ["Black"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Model: "#874566", Style: "Pro" },
        features: ["24MP sensor", "4K video"],
      },
      {
        id: "6",
        slug: "macbook-pro-silver",
        name: "MacBook Pro Laptop Silver",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Electronics",
        subCategory: "Modern tech",
        stock: 35,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: true,
        tag: "Featured",
        colors: ["Silver", "Space Gray"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Size: "304mm x 212mm", Memory: "512GB SSD" },
        features: ["M2 chip", "18-hour battery"],
      },
      {
        id: "7",
        slug: "smart-watch-gray",
        name: "Smart Watch Gray Sport Edition",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Electronics",
        subCategory: "Modern tech",
        stock: 90,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: false,
        tag: "New Arrival",
        colors: ["Gray", "Black"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Size: "44mm", Memory: "32GB" },
        features: ["Heart rate monitor", "GPS tracking"],
      },
      {
        id: "8",
        slug: "mens-tshirt-cotton",
        name: "Mens Long Sleeve T-shirt Cotton Slim",
        price: 98.0,
        originalPrice: null,
        image:
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Clothing",
        subCategory: "Men's wear",
        stock: 200,
        rating: 9.3,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: true,
        tag: "Bestseller",
        colors: ["Gray", "White", "Navy"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Type: "Classic", Material: "Cotton" },
        features: ["Premium cotton", "Slim fit"],
      },
      {
        id: "9",
        slug: "wireless-headphones",
        name: "Wireless Headphones Premium Sound",
        price: 55.0,
        originalPrice: 89.0,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
        ],
        description: "Premium wireless headphones with noise cancellation.",
        category: "Electronics",
        subCategory: "Modern tech",
        stock: 110,
        rating: 8.2,
        stars: 4,
        reviews: 88,
        sold: 320,
        featured: false,
        tag: "Sale",
        colors: ["Black", "White"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 55 },
          { qty: "100-700 pcs", price: 40 },
          { qty: "700+ pcs", price: 28 },
        ],
        specs: { Battery: "30 hours", Connection: "Bluetooth 5.0" },
        features: ["Noise cancellation", "Fast charging"],
      },
      {
        id: "10",
        slug: "apple-watch-space-gray",
        name: "Apple Watch Series Space Gray",
        price: 99.5,
        originalPrice: null,
        image:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Electronics",
        subCategory: "Modern tech",
        stock: 55,
        rating: 8.7,
        stars: 5,
        reviews: 64,
        sold: 280,
        featured: true,
        tag: "Premium",
        colors: ["Space Gray", "Silver"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 99.5 },
          { qty: "100-700 pcs", price: 45 },
          { qty: "700+ pcs", price: 7 },
        ],
        specs: { Model: "Series 7", Memory: "32GB" },
        features: ["Always-on display", "Blood oxygen sensor"],
      },
      {
        id: "11",
        slug: "iphone-12-blue",
        name: "iPhone 12 Blue Edition 128GB",
        price: 99.5,
        originalPrice: 1128.0,
        image:
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Smartphones",
        subCategory: "Smartphones",
        stock: 95,
        rating: 7.5,
        stars: 4,
        reviews: 32,
        sold: 154,
        featured: false,
        tag: "New Arrival",
        colors: ["Blue", "Green"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 98 },
          { qty: "100-700 pcs", price: 90 },
          { qty: "700+ pcs", price: 78 },
        ],
        specs: { Model: "#874567", Memory: "128GB" },
        features: ["5G capable", "Dual camera"],
      },
      {
        id: "12",
        slug: "men-blazer-formal",
        name: "Men Blazers Sets Elegant Formal",
        price: 99.5,
        originalPrice: null,
        image:
          "https://images.unsplash.com/photo-1594938298603-c8148c4b4f06?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1594938298603-c8148c4b4f06?w=600&q=80",
        ],
        description:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category: "Clothing",
        subCategory: "Men's wear",
        stock: 75,
        rating: 8.1,
        stars: 4,
        reviews: 18,
        sold: 90,
        featured: false,
        tag: "Formal",
        colors: ["Navy", "Black"],
        sizes: ["S", "M", "L", "XL"],
        supplier: {
          name: "Guanjoi Trading LLC",
          country: "Germany, Berlin",
          verified: true,
          worldwide: true,
        },
        moq: [
          { qty: "50-100 pcs", price: 99.5 },
          { qty: "100-700 pcs", price: 45 },
          { qty: "700+ pcs", price: 7 },
        ],
        specs: { Type: "Formal wear", Material: "Wool blend" },
        features: ["Wool blend fabric", "Slim fit"],
      },
    ];
    db.set("products", sampleProducts).write();
    console.log("✅ Auto-seeded 12 products!");

    // Auto create admin
    bcrypt.hash("admin123", 10).then((hashed) => {
      const userAdapter = new FileSync("users.json");
      const userDb = low(userAdapter);
      userDb.defaults({ users: [] }).write();
      const existing = userDb
        .get("users")
        .find({ email: "admin@shop.com" })
        .value();
      if (!existing) {
        userDb
          .get("users")
          .push({
            id: Date.now().toString(),
            name: "Admin",
            email: "admin@shop.com",
            password: hashed,
            role: "admin",
            createdAt: new Date().toISOString(),
          })
          .write();
        console.log("✅ Auto-created admin user!");
      }
    });
  }
});