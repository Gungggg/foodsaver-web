# FoodSaver Backend API

Backend REST API untuk platform **FoodSaver**, yaitu marketplace makanan surplus berbasis B2C yang membantu merchant menjual makanan surplus layak konsumsi dengan harga diskon untuk mengurangi limbah pangan.

---

# Tech Stack

| Technology | Usage                         |
| ---------- | ----------------------------- |
| Node.js    | Backend Runtime               |
| Express.js | REST API Framework            |
| MySQL      | Database                      |
| JWT        | Authentication                |
| bcryptjs   | Password Hashing              |
| Laragon    | Local Development Environment |
| Insomnia   | API Testing                   |
| GitHub     | Version Control               |

---

# Features

## Authentication

* Register User
* Login User
* JWT Authentication
* Protected Routes
* Role Authorization

## Merchant System

* Merchant Profile
* Store Location
* Pickup Window
* Merchant Verification Flow

## Product System

* Create Surprise Bag
* Product Listing
* Product Detail
* Update Stock
* Delete Product

## Order System

* Create Order
* Generate Invoice
* Pickup Code Generation
* Order History

## Payment System

* Create Payment
* Payment Callback
* Update Invoice Status
* Update Order Status

## Pickup & Redeem System

* Redeem Pickup Code
* Order Pickup Verification
* Impact Logging

## Impact Statistics

* CO2 Saved
* Money Saved
* Completed Orders

---

# Project Structure

```bash
foodsaver-backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   ├── authenticate.js
│   │   └── authorizeRole.js
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── merchant/
│   │   ├── products/
│   │   ├── orders/
│   │   └── payments/
│   │
│   ├── routes/
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Installation

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/foodsaver-backend.git
```

---

## 2. Install Dependency

```bash
npm install
```

---

## 3. Setup Environment

Create file:

```bash
.env
```

Isi:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=foodsaver

JWT_SECRET=foodsaversecret
```

---

## 4. Run Server

```bash
npm run dev
```

Server berjalan di:

```txt
http://localhost:5000
```

---

# Database Tables

Project menggunakan MySQL dengan tabel:

* users
* merchant_profiles
* surprise_bags
* orders
* invoices
* payments
* impact_logs

---

# API Endpoints

# Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/profile  |

---

# Merchant

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/merchant/profile |
| GET    | /api/merchant/profile |

---

# Products

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /api/products           |
| GET    | /api/products           |
| GET    | /api/products/:id       |
| PATCH  | /api/products/:id/stock |
| DELETE | /api/products/:id       |

---

# Orders

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/orders            |
| GET    | /api/orders/my-orders  |
| GET    | /api/orders/:id        |
| POST   | /api/orders/:id/redeem |

---

# Payments

| Method | Endpoint               |
| ------ | ---------------------- |
| POST   | /api/payments          |
| POST   | /api/payments/callback |
| GET    | /api/payments/:id      |

---

# Authentication Header

Gunakan JWT token pada endpoint protected:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# Example Register Request

```json
{
  "name": "Agung",
  "email": "agung@gmail.com",
  "password": "12345678",
  "role": "customer"
}
```

---

# Example Login Response

```json
{
  "message": "Login success",
  "token": "JWT_TOKEN"
}
```

---

# Roles

| Role     | Access                          |
| -------- | ------------------------------- |
| customer | Order products                  |
| merchant | Manage products & redeem pickup |
| admin    | Manage platform                 |

---

# API Testing

Gunakan:

* Insomnia
* Postman

Testing flow:

1. Register
2. Login
3. Create Merchant Profile
4. Create Product
5. Create Order
6. Create Payment
7. Payment Callback
8. Redeem Order

---

# Future Improvements

* Midtrans Integration
* QR Code Pickup
* Product Image Upload
* Google Maps Integration
* Push Notification
* Pagination & Search
* Admin Dashboard
* Customer Dashboard
* Merchant Analytics
* Docker Deployment
* Cloud Hosting

---

# Architecture

Project menggunakan pendekatan:

```txt
Modular Monolith Architecture
```

Dengan pemisahan module berdasarkan domain:

* Auth Module
* Merchant Module
* Product Module
* Order Module
* Payment Module
* Impact Module

---

# Security

Implementasi keamanan:

* JWT Authentication
* Password Hashing (bcrypt)
* Role Authorization
* Protected Routes
* Environment Variables

---

# Author

Developed for E-Business Project:
Agung Setyadi
**FoodSaver - Surplus Food Marketplace Platform**

---

# License

This project is for educational and academic purposes.
