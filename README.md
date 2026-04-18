# AquaCrop Platform — MERN Stack

> Smart solutions for aquaculture & agriculture. Full-stack MERN application with React (Vite) frontend and Express + MongoDB backend.

---

## 🗂️ Project Structure

```
AquaaSmart/
├── backend/                     ← Express + MongoDB API
│   ├── server.js                ← Entry point
│   ├── .env                     ← Environment variables
│   ├── config/
│   │   └── db.js                ← MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Booking.js
│   ├── middleware/
│   │   └── auth.js              ← JWT protect & adminOnly
│   └── routes/
│       ├── auth.js              ← /api/auth/*
│       ├── products.js          ← /api/products/*
│       ├── bookings.js          ← /api/bookings/*
│       └── admin.js             ← /api/admin/*
│
└── frontend/                    ← Vite + React SPA
    ├── index.html
    ├── vite.config.js           ← Proxy /api → :5000
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js         ← Axios + JWT interceptor
        ├── context/
        │   └── AppContext.jsx   ← Global state
        ├── components/
        │   ├── Navbar.jsx
        │   └── ProductCard.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── HomePage.jsx
            ├── ProductPage.jsx
            ├── RepairPage.jsx
            ├── MarketplacePage.jsx
            ├── CartPage.jsx
            └── AdminPanel.jsx
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start the Backend

```bash
cd backend
npm install
# Copy env if not done
cp .env.example .env
npm run dev
# ✅ Server running on http://localhost:5000
```

### 2. Seed the Database (first time)

```bash
curl -X POST http://localhost:5000/api/admin/seed
# Creates 9 sample products + admin@aquacrop.com / admin123
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

### 4. Open the App

Visit **http://localhost:5173**

- **Admin Login**: `admin@aquacrop.com` / `admin123`
- **Register** as a new user

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 | Get current user |
| GET | `/api/products?category=` | — | List products |
| POST | `/api/products` | 🔒 | Add product |
| DELETE | `/api/products/:id` | 🔒 Admin | Soft delete product |
| POST | `/api/bookings` | 🔒 | Create booking |
| GET | `/api/bookings` | 🔒 | Get bookings (own / all for admin) |
| PUT | `/api/bookings/:id` | 🔒 Admin | Update booking status |
| GET | `/api/admin/users` | 🔒 Admin | List all users |
| GET | `/api/admin/stats` | 🔒 Admin | Dashboard statistics |
| POST | `/api/admin/seed` | — | Seed sample data |

---

## 🌟 Features

- **Authentication** — JWT-based login/register with bcrypt password hashing
- **Role-based Access** — Admin panel vs. User dashboard
- **Aqua Feed & Medicine** — Browse and add to cart by category
- **Repair Booking** — Submit service requests, track status
- **Marketplace** — Buy and sell farm products
- **Shopping Cart** — Qty controls, order summary, checkout flow
- **Admin Panel** — Manage products, bookings (with status update), users, live stats

---

## 🚢 Deployment

### Backend (Railway / Render)
```bash
# Set these in your dashboard:
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/aquacrop
JWT_SECRET=your_super_secret_key
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder
# Set environment variable:
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔧 Future Enhancements

- [ ] Razorpay payment integration
- [ ] Cloudinary image uploads
- [ ] Socket.io live notifications
- [ ] Google Maps for technician tracking
- [ ] JWT refresh tokens
- [ ] Email verification (Nodemailer)
- [ ] React Router for URL-based navigation
