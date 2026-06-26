const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ products: [] }).write();

const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Admin access required' });
  next();
};

router.use(auth, adminOnly);

router.get('/products', (req, res) => {
  const products = db.get('products').value();
  res.json({ success: true, count: products.length, data: products });
});

router.post('/products', (req, res) => {
  const product = {
    ...req.body,
    id: Date.now().toString(),
    slug: req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now(),
    images: [req.body.image],
    createdAt: new Date().toISOString(),
  };
  db.get('products').push(product).write();
  res.status(201).json({ success: true, data: product });
});

router.put('/products/:id', (req, res) => {
  const exists = db.get('products').find({ id: req.params.id }).value();
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });
  db.get('products').find({ id: req.params.id }).assign(req.body).write();
  const updated = db.get('products').find({ id: req.params.id }).value();
  res.json({ success: true, data: updated });
});

router.delete('/products/:id', (req, res) => {
  const exists = db.get('products').find({ id: req.params.id }).value();
  if (!exists) return res.status(404).json({ success: false, message: 'Not found' });
  db.get('products').remove({ id: req.params.id }).write();
  res.json({ success: true, message: 'Deleted' });
});

module.exports = router;
