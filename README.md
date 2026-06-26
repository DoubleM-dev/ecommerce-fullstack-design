# 🛒 Brand Ecommerce App

A full-stack ecommerce web application built with React, Node.js, Express, and a local JSON database. Includes product listing, cart, user authentication, and an admin panel.

---

## Project Structure

```
ecommerce/
├── backend/
│   ├── middleware/auth.js     ← JWT middleware
│   ├── routes/auth.js         ← Login/Register APIs
│   ├── routes/admin.js        ← Admin CRUD APIs
│   ├── server.js              ← Express server
│   ├── seed.js                ← Seed sample products
│   ├── createAdmin.js         ← Create admin user
│   ├── db.json                ← Products database
│   └── users.json             ← Users database
└── src/
    ├── components/            ← Navbar, Footer, ProductCard
    ├── context/               ← Auth + Cart state
    ├── pages/                 ← All 6 pages
    ├── services/api.js        ← API calls
    └── App.js
```

---

##  How to Run

### Terminal 1 — Backend
```bash
cd backend
npm install
npm run seed
npm run create-admin
npm run dev
```

### Terminal 2 — Frontend
```bash
npm install
npm start
```

Frontend: http://localhost:3000
Backend:  http://localhost:5000

---

##  Admin Login
```
Email:    admin@shop.com
Password: admin123
```

---

## 🛒 Coupon Code
```
SHOP10
```

---

## 🔗 API Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products?search=iphone` | Search products |
| GET | `/api/products?category=Electronics` | Filter by category |
| GET | `/api/products?featured=true` | Featured only |
| GET | `/api/products/:slug` | Single product |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/admin/products` | Admin: all products |
| POST | `/api/admin/products` | Admin: create |
| PUT | `/api/admin/products/:id` | Admin: update |
| DELETE | `/api/admin/products/:id` | Admin: delete |

---

## 📄 Pages

| Page | URL |
|------|-----|
| Home | `/` |
| Products | `/products` |
| Product Detail | `/products/:slug` |
| Cart | `/cart` |
| Login | `/login` |
| Admin Panel | `/admin` |

---

##  Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Icons | Lucide React |
| Backend | Node.js, Express.js |
| Database | lowdb (local JSON file) |
| Auth | JWT + bcryptjs |
| State | React Context API |
| Persistence | localStorage |

---

##  Scripts

### Frontend
```bash
npm start        # Dev server port 3000
npm run build    # Production build
```

### Backend
```bash
npm run dev          # Dev server port 5000
npm run seed         # Seed 12 sample products
npm run create-admin # Create admin user
```

---

##  Weeks Completed

### Week 1 — Frontend Pages
- Home, Products, Detail, Cart pages
- Responsive desktop + mobile

### Week 2 — Backend + Dynamic Data
- Express REST API with CRUD
- Search, filter, sort, pagination
- All pages fetch from API

### Week 3 — Auth + Admin
- JWT login/register
- Protected admin panel
- Add/Edit/Delete products
- Cart persists on refresh
