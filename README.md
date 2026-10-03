# 👟 Shoes Showroom E-Commerce Platform

A full-stack, secure e-commerce application built for a shoe showroom. The platform implements robust security patterns using dual JWT tokens, role-based access control, integrated session management, and payment processing with failure rollbacks via the PayFast Sandbox.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Redux Toolkit (State & In-Memory Token Management), React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT), Cookie-Parser
- **Payment Gateway:** PayFast Sandbox Integration

---

## 🚀 Key Features & Architecture

### 🔐 Advanced Authentication & Security
- **Dual JWT Token Architecture:**
  - **Access Token:** Stored safely in **Redux (In-Memory)** to eliminate XSS vulnerability risks.
  - **Refresh Token:** Stored in secure, **HttpOnly, SameSite Cookies** to prevent unauthorized access.
- **Protected Routes:** Dynamic client-side and server-side route guarding based on authentication status.
- **Role-Based Access Control (RBAC):**
  - **Admin:** Product catalog management, order tracking, transaction oversight, user management.
  - **Customer:** Product browsing, cart management, checkout, order history.

### 💳 Payment Processing & Session Management
- **PayFast Sandbox Integration:** End-to-end checkout flow simulation.
- **Transaction Rollback Mechanism:** Automatic database transaction rollback if a payment fails, is canceled, or encounters a gateway timeout during checkout.
- **Session Management:** Persisted cart state, active session validation, and silent token updates via refresh tokens.

---

## 📁 Project Structure

```text
shoes-showroom/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── app/            # Redux store configuration
│   │   ├── components/     # Reusable UI components & Protected Routes
│   │   ├── features/       # Slices (auth, cart, products, orders)
│   │   ├── pages/          # Admin & Customer Views
│   │   └── services/       # API endpoints & Axios interceptors
│   └── package.json
│
└── server/                 # Node.js / Express Backend
    ├── config/             # DB & PayFast configurations
    ├── controllers/        # Auth, Payment, Product, Order logic
    ├── middleware/         # Auth verification & RBAC check
    ├── models/             # Mongoose schemas (User, Product, Order, Transaction)
    ├── routes/             # API endpoints
    ├── utils/              # Token generators & PayFast transaction helpers
    └── package.json
