# 🛒 ShopEase – React Ecommerce Frontend

A modern ecommerce frontend built using **React, Vite, Tailwind CSS, JWT authentication, Shopping Cart, and Orders**, designed to work with a Node.js backend.

---

## 🚀 Features

- User authentication (Login & Register)
- Role-based access (Admin & User)
- Product listing
- Admin product management (CRUD)
- Shopping cart
- Checkout and order creation
- User order history
- Admin order management
- JWT secured API communication
- Responsive UI using Tailwind CSS

---

## 🧱 Tech Stack

| Layer | Technology |
|------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Routing | React Router |
| State Management | React Context API |
| API Client | Axios |
| Authentication | JWT |
| Hosting | Render |

---

## 📁 Project Structure

```
src/
│
├── api/           # Axios API calls
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   └── orders.js
│
├── context/
│   ├── AuthContext.jsx
│   └── CartContext.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Cart.jsx
│   ├── Orders.jsx
│   └── AdminOrders.jsx
│
├── components/
│   ├── Navbar.jsx
│   ├── Input.jsx
│   └── Button.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🔗 Backend API

This frontend consumes APIs from:

```
https://express-ecommerce-api-xedd.onrender.com/api
```

Endpoints used:
- `/auth`
- `/products`
- `/cart`
- `/orders`

---

## 🧪 Run Locally

### 1️⃣ Install dependencies
```bash
npm install
```

### 2️⃣ Start the dev server
```bash
npm run dev
```

App will be available at:
```
http://localhost:5173
```

---

## 🏗️ Create Production Build

```bash
npm run build
```

This will create a `dist/` folder containing the optimized build.

---

## 🧭 Steps to Deploy on Render

### 1️⃣ Go to Render
Open: https://render.com

Click:
```
New → Static Site
```

---

### 2️⃣ Connect GitHub Repository
- Select your frontend repo
- Click **Connect**

---

### 3️⃣ Configure Build

| Field | Value |
|------|------|
| Environment | Static Site |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

---

### 4️⃣ Enable React Router Support

In **Render → Redirects / Rewrites**, add:

| Source | Destination | Status |
|--------|------------|--------|
| `/*` | `/index.html` | `200` |

This is required for SPA routing.

---

### 5️⃣ Click **Deploy**

Render will:
- Install dependencies
- Build the app
- Host it globally

Your app will be available at:
```
https://your-project-name.onrender.com
```

---

## 🔐 Notes

- JWT token is stored in `localStorage`
- Axios automatically sends the token in Authorization headers
- Backend CORS is already configured

---

## ✅ Production Ready

This application is ready for:
- Real users
- Order processing
- Admin management
- Cloud deployment

---

## 📌 Future Enhancements

- Payment gateway (Stripe / Razorpay)
- Product images
- Order invoices
- Email notifications
- Mobile UI improvements

---

