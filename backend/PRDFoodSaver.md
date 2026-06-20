# Product Requirements Document (PRD)
# FoodSaver Web Application

## 1. Project Overview

### Product Name
FoodSaver

### Product Type
B2C Marketplace Platform

### Vision
Mengurangi limbah makanan dengan menghubungkan merchant yang memiliki surplus makanan dengan pelanggan yang ingin membeli makanan layak konsumsi dengan harga lebih murah.

### Problem Statement
Restoran, bakery, hotel, dan merchant makanan lainnya menghasilkan surplus makanan setiap hari yang berpotensi menjadi limbah.

### Solution
Platform marketplace yang memungkinkan merchant menjual "Surprise Bag" berisi makanan surplus dengan harga diskon kepada pelanggan.

---

# 2. Design System

## Color Palette

### Primary
Color: #1B4332

Usage:
- Primary Button
- Active Navigation
- CTA Button
- Logo Accent

### Secondary
Color: #74C365

Usage:
- Success State
- Impact Indicator
- Environmental Metrics

### Tertiary
Color: #F59E0B

Usage:
- Warning
- Pending Status
- Highlight

### Neutral
Color: #64748B

Usage:
- Text Secondary
- Border
- Disabled State

---

## Typography

### Heading Font
Hanken Grotesk

Weights:
- 600
- 700

### Body Font
Inter

Weights:
- 400
- 500
- 600

---

## Border Radius

Small:
8px

Medium:
12px

Large:
16px

Pill:
999px

---

## Spacing

Base:
8px

Small:
12px

Medium:
24px

Large:
40px

Extra Large:
64px

---

## Shadows

Card:
0 4px 24px rgba(27,67,50,0.08)

Hover:
0 8px 32px rgba(27,67,50,0.12)

---

# 3. User Roles

## Customer

Permissions:
- Register
- Login
- Browse Marketplace
- Search Merchant
- Purchase Surprise Bag
- View Orders
- View Impact Dashboard
- Manage Profile

---

## Merchant

Permissions:
- Register Merchant
- Manage Store
- Create Product
- Update Stock
- Verify Pickup
- View Sales Analytics

---

## Admin

Permissions:
- Verify Merchant
- Manage Users
- Monitor Transactions
- View Global Analytics
- Handle Reports

---

# 4. Navigation Structure

## Customer Navigation

Top Navigation

- Home
- Marketplace
- My Orders
- Impact
- Dashboard
- Profile

Mobile Bottom Navigation

- Home
- Search
- Orders
- Impact
- Profile

---

## Merchant Navigation

Sidebar

- Dashboard
- Products
- Orders
- Verification
- Analytics
- Settings

---

## Admin Navigation

Sidebar

- Dashboard
- Merchants
- Verification
- Analytics
- Users
- Reports
- Settings

---

# 5. Pages

---

## 5.1 Landing Page

Purpose:
Menjelaskan konsep FoodSaver kepada pengguna baru.

Sections:

### Hero Section

Components:
- Headline
- Subheadline
- CTA Button
- Hero Image

### Features Section

Cards:
- Save Money
- Save Food
- Reduce Carbon

### How It Works

Steps:
1. Browse
2. Reserve
3. Pickup

### Impact Statistics

Metrics:
- Food Rescued
- CO2 Saved
- Active Merchants

### Footer

Links:
- About
- Contact
- Privacy Policy
- Terms

---

## 5.2 Marketplace

Purpose:
Menampilkan semua Surprise Bag.

Components:

### Search Bar

Features:
- Keyword Search
- Location Search

### Filters

- Category
- Price Range
- Distance
- Availability

### Product Card

Contains:
- Product Image
- Merchant Name
- Price
- Original Price
- Pickup Time
- Distance
- Remaining Stock

### Product Detail

Contains:
- Gallery
- Description
- Pickup Window
- Merchant Information
- Purchase Button

---

## 5.3 Checkout

Purpose:
Melakukan pemesanan.

Components:

### Order Summary

- Product
- Quantity
- Price

### Payment Method

- QRIS
- E-Wallet
- Bank Transfer

### Confirmation

- Order Number
- QR Pickup Code

---

## 5.4 My Orders

Purpose:
Melihat riwayat pesanan.

Status:

- Pending
- Paid
- Ready For Pickup
- Redeemed
- Expired
- Cancelled

Features:
- Filter Status
- Search Order
- View Receipt

---

## 5.5 Impact Dashboard

Purpose:
Menampilkan dampak lingkungan.

Widgets:

### Personal Impact

- Total Food Saved
- CO2 Reduction
- Money Saved

### Charts

- Monthly Impact
- Weekly Activity

### Achievements

- Green Hero
- Food Saver
- Eco Champion

---

## 5.6 Merchant Dashboard

Purpose:
Mengelola operasional merchant.

Widgets:

### Overview

- Revenue
- Orders
- Inventory
- Customers

### Quick Actions

- Add Product
- Update Stock
- Verify Pickup

### Analytics

- Daily Sales
- Best Selling Product
- Waste Reduction

---

## 5.7 Merchant Verification

Purpose:
Verifikasi merchant baru.

Required Documents:

- Business License
- Tax Number
- Store Photo
- Identity Card

Statuses:

- Pending
- Approved
- Rejected

---

## 5.8 Admin Dashboard

Purpose:
Monitoring keseluruhan platform.

Widgets:

### Platform Metrics

- Active Users
- Active Merchants
- Total Orders
- Revenue

### Verification Queue

- Pending Merchant Applications

### Environmental Impact

- Food Saved
- CO2 Reduced

### User Reports

- Complaints
- Fraud Detection

---

# 6. Functional Requirements

## Authentication

### Register

Input:
- Name
- Email
- Password
- Role

Validation:
- Email Unique
- Password Minimum 8 Characters

---

### Login

Input:
- Email
- Password

Output:
- JWT Token
- User Data

---

## Product Management

Merchant Can:

- Create Product
- Update Product
- Delete Product
- Upload Image
- Update Stock

---

## Order Management

Customer Can:

- Place Order
- Pay Order
- Cancel Order

Merchant Can:

- Accept Order
- Verify Pickup

---

## Impact Tracking

System Calculates:

- Food Saved (kg)
- CO2 Reduction (kg)
- Economic Savings

---

# 7. Non Functional Requirements

## Performance

Page Load:
< 3 Seconds

API Response:
< 500 ms

---

## Security

Requirements:

- JWT Authentication
- Password Hashing (bcrypt)
- HTTPS
- Role Based Access Control

---

## Accessibility

Requirements:

- WCAG AA
- Keyboard Navigation
- Responsive Design

---

## Responsive Breakpoints

Mobile:
320px - 767px

Tablet:
768px - 1023px

Desktop:
1024px+

---

# 8. API Integration

Base URL

/api

Modules:

- Authentication
- Products
- Merchant
- Orders
- Payments
- Impact
- Admin

---

# 9. Success Metrics

Business Metrics:

- Total Orders
- Monthly Active Users
- Merchant Growth

Environmental Metrics:

- Food Rescued
- CO2 Reduction

Product Metrics:

- Conversion Rate
- Checkout Completion Rate
- Retention Rate

---

# 10. Future Enhancements

Phase 2

- AI Demand Prediction
- Smart Recommendation
- Loyalty Program
- Carbon Credit Tracking

Phase 3

- Mobile App
- Merchant POS Integration
- Real-time Inventory Sync
- AI Dynamic Pricing
# Product Requirements Document (PRD)
# FoodSaver Web Application

## 1. Project Overview

### Product Name
FoodSaver

### Product Type
B2C Marketplace Platform

### Vision
Mengurangi limbah makanan dengan menghubungkan merchant yang memiliki surplus makanan dengan pelanggan yang ingin membeli makanan layak konsumsi dengan harga lebih murah.

### Problem Statement
Restoran, bakery, hotel, dan merchant makanan lainnya menghasilkan surplus makanan setiap hari yang berpotensi menjadi limbah.

### Solution
Platform marketplace yang memungkinkan merchant menjual "Surprise Bag" berisi makanan surplus dengan harga diskon kepada pelanggan.

---

# 2. Design System

## Color Palette

### Primary
Color: #1B4332

Usage:
- Primary Button
- Active Navigation
- CTA Button
- Logo Accent

### Secondary
Color: #74C365

Usage:
- Success State
- Impact Indicator
- Environmental Metrics

### Tertiary
Color: #F59E0B

Usage:
- Warning
- Pending Status
- Highlight

### Neutral
Color: #64748B

Usage:
- Text Secondary
- Border
- Disabled State

---

## Typography

### Heading Font
Hanken Grotesk

Weights:
- 600
- 700

### Body Font
Inter

Weights:
- 400
- 500
- 600

---

## Border Radius

Small:
8px

Medium:
12px

Large:
16px

Pill:
999px

---

## Spacing

Base:
8px

Small:
12px

Medium:
24px

Large:
40px

Extra Large:
64px

---

## Shadows

Card:
0 4px 24px rgba(27,67,50,0.08)

Hover:
0 8px 32px rgba(27,67,50,0.12)

---

# 3. User Roles

## Customer

Permissions:
- Register
- Login
- Browse Marketplace
- Search Merchant
- Purchase Surprise Bag
- View Orders
- View Impact Dashboard
- Manage Profile

---

## Merchant

Permissions:
- Register Merchant
- Manage Store
- Create Product
- Update Stock
- Verify Pickup
- View Sales Analytics

---

## Admin

Permissions:
- Verify Merchant
- Manage Users
- Monitor Transactions
- View Global Analytics
- Handle Reports

---

# 4. Navigation Structure

## Customer Navigation

Top Navigation

- Home
- Marketplace
- My Orders
- Impact
- Dashboard
- Profile

Mobile Bottom Navigation

- Home
- Search
- Orders
- Impact
- Profile

---

## Merchant Navigation

Sidebar

- Dashboard
- Products
- Orders
- Verification
- Analytics
- Settings

---

## Admin Navigation

Sidebar

- Dashboard
- Merchants
- Verification
- Analytics
- Users
- Reports
- Settings

---

# 5. Pages

---

## 5.1 Landing Page

Purpose:
Menjelaskan konsep FoodSaver kepada pengguna baru.

Sections:

### Hero Section

Components:
- Headline
- Subheadline
- CTA Button
- Hero Image

### Features Section

Cards:
- Save Money
- Save Food
- Reduce Carbon

### How It Works

Steps:
1. Browse
2. Reserve
3. Pickup

### Impact Statistics

Metrics:
- Food Rescued
- CO2 Saved
- Active Merchants

### Footer

Links:
- About
- Contact
- Privacy Policy
- Terms

---

## 5.2 Marketplace

Purpose:
Menampilkan semua Surprise Bag.

Components:

### Search Bar

Features:
- Keyword Search
- Location Search

### Filters

- Category
- Price Range
- Distance
- Availability

### Product Card

Contains:
- Product Image
- Merchant Name
- Price
- Original Price
- Pickup Time
- Distance
- Remaining Stock

### Product Detail

Contains:
- Gallery
- Description
- Pickup Window
- Merchant Information
- Purchase Button

---

## 5.3 Checkout

Purpose:
Melakukan pemesanan.

Components:

### Order Summary

- Product
- Quantity
- Price

### Payment Method

- QRIS
- E-Wallet
- Bank Transfer

### Confirmation

- Order Number
- QR Pickup Code

---

## 5.4 My Orders

Purpose:
Melihat riwayat pesanan.

Status:

- Pending
- Paid
- Ready For Pickup
- Redeemed
- Expired
- Cancelled

Features:
- Filter Status
- Search Order
- View Receipt

---

## 5.5 Impact Dashboard

Purpose:
Menampilkan dampak lingkungan.

Widgets:

### Personal Impact

- Total Food Saved
- CO2 Reduction
- Money Saved

### Charts

- Monthly Impact
- Weekly Activity

### Achievements

- Green Hero
- Food Saver
- Eco Champion

---

## 5.6 Merchant Dashboard

Purpose:
Mengelola operasional merchant.

Widgets:

### Overview

- Revenue
- Orders
- Inventory
- Customers

### Quick Actions

- Add Product
- Update Stock
- Verify Pickup

### Analytics

- Daily Sales
- Best Selling Product
- Waste Reduction

---

## 5.7 Merchant Verification

Purpose:
Verifikasi merchant baru.

Required Documents:

- Business License
- Tax Number
- Store Photo
- Identity Card

Statuses:

- Pending
- Approved
- Rejected

---

## 5.8 Admin Dashboard

Purpose:
Monitoring keseluruhan platform.

Widgets:

### Platform Metrics

- Active Users
- Active Merchants
- Total Orders
- Revenue

### Verification Queue

- Pending Merchant Applications

### Environmental Impact

- Food Saved
- CO2 Reduced

### User Reports

- Complaints
- Fraud Detection

---

# 6. Functional Requirements

## Authentication

### Register

Input:
- Name
- Email
- Password
- Role

Validation:
- Email Unique
- Password Minimum 8 Characters

---

### Login

Input:
- Email
- Password

Output:
- JWT Token
- User Data

---

## Product Management

Merchant Can:

- Create Product
- Update Product
- Delete Product
- Upload Image
- Update Stock

---

## Order Management

Customer Can:

- Place Order
- Pay Order
- Cancel Order

Merchant Can:

- Accept Order
- Verify Pickup

---

## Impact Tracking

System Calculates:

- Food Saved (kg)
- CO2 Reduction (kg)
- Economic Savings

---

# 7. Non Functional Requirements

## Performance

Page Load:
< 3 Seconds

API Response:
< 500 ms

---

## Security

Requirements:

- JWT Authentication
- Password Hashing (bcrypt)
- HTTPS
- Role Based Access Control

---

## Accessibility

Requirements:

- WCAG AA
- Keyboard Navigation
- Responsive Design

---

## Responsive Breakpoints

Mobile:
320px - 767px

Tablet:
768px - 1023px

Desktop:
1024px+

---

# 8. API Integration

Base URL

/api

Modules:

- Authentication
- Products
- Merchant
- Orders
- Payments
- Impact
- Admin

---

# 9. Success Metrics

Business Metrics:

- Total Orders
- Monthly Active Users
- Merchant Growth

Environmental Metrics:

- Food Rescued
- CO2 Reduction

Product Metrics:

- Conversion Rate
- Checkout Completion Rate
- Retention Rate

---

# 10. Future Enhancements

Phase 2

- AI Demand Prediction
- Smart Recommendation
- Loyalty Program
- Carbon Credit Tracking

Phase 3

- Mobile App
- Merchant POS Integration
- Real-time Inventory Sync
- AI Dynamic Pricing
