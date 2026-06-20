# TESTPLAN.md

# FoodSaver Test Plan

## Document Information

| Item         | Value                            |
| ------------ | -------------------------------- |
| Project Name | FoodSaver                        |
| Version      | 1.0                              |
| Prepared By  | Development Team                 |
| Testing Type | Functional, Integration, UI, API |
| Environment  | Localhost                        |
| Frontend     | React + Vite                     |
| Backend      | Node.js + Express                |
| Database     | MySQL                            |

---

# 1. Introduction

## Purpose

Dokumen ini bertujuan untuk memastikan seluruh fitur pada aplikasi FoodSaver berjalan sesuai Product Requirement Document (PRD), Design Specification, dan Backend API Specification.

## Scope

Pengujian mencakup:

* Authentication
* Marketplace
* Product Management
* Orders
* Payments
* Impact Dashboard
* Merchant Dashboard
* Merchant Verification
* Admin Dashboard
* API Integration
* UI & Responsive Design

---

# 2. Testing Objectives

Memastikan:

1. Seluruh fitur berjalan sesuai kebutuhan bisnis.
2. Tidak terdapat bug kritikal.
3. API dapat berkomunikasi dengan frontend.
4. Hak akses berdasarkan role berjalan dengan benar.
5. Tampilan sesuai Design System.

---

# 3. Testing Environment

## Frontend

```text
http://localhost:5173
```

## Backend

```text
http://localhost:5000
```

## Database

```text
MySQL
```

## Browser

* Google Chrome
* Microsoft Edge
* Firefox

---

# 4. Test Strategy

## Functional Testing

Menguji seluruh fitur aplikasi.

## API Testing

Menguji seluruh endpoint backend.

## UI Testing

Menguji tampilan dan konsistensi desain.

## Responsive Testing

Menguji tampilan mobile, tablet, desktop.

## Role Testing

Menguji hak akses:

* Customer
* Merchant
* Admin

---

# 5. Entry Criteria

Testing dimulai apabila:

* Frontend berhasil dijalankan.
* Backend berhasil dijalankan.
* Database terhubung.
* API dapat diakses.

---

# 6. Exit Criteria

Testing selesai apabila:

* Semua test case dijalankan.
* Tidak ada bug Critical.
* Tidak ada bug High Severity yang belum diperbaiki.

---

# 7. Test Cases

---

## Module A - Authentication

### TC-AUTH-001

Title:
Register Customer

Precondition:
Belum memiliki akun.

Steps:

1. Buka halaman Register.
2. Isi seluruh form.
3. Klik Register.

Expected Result:

* Akun berhasil dibuat.
* Data tersimpan di database.

Priority:
High

---

### TC-AUTH-002

Title:
Login Valid

Steps:

1. Masukkan email valid.
2. Masukkan password valid.
3. Klik Login.

Expected:

* Login berhasil.
* Redirect ke dashboard.

Priority:
High

---

### TC-AUTH-003

Title:
Login Invalid Password

Expected:

* Muncul pesan error.
* Tetap berada di halaman login.

Priority:
High

---

### TC-AUTH-004

Title:
Logout

Expected:

* Token dihapus.
* Redirect ke login.

Priority:
Medium

---

# Module B - Marketplace

### TC-MARKET-001

Title:
View Product List

Expected:

* Semua produk tampil.

Priority:
High

---

### TC-MARKET-002

Title:
Search Product

Expected:

* Produk sesuai keyword tampil.

Priority:
Medium

---

### TC-MARKET-003

Title:
Filter Product

Expected:

* Produk terfilter sesuai kriteria.

Priority:
Medium

---

### TC-MARKET-004

Title:
View Product Detail

Expected:

* Detail produk tampil lengkap.

Priority:
High

---

# Module C - Orders

### TC-ORDER-001

Title:
Create Order

Expected:

* Order berhasil dibuat.

Priority:
Critical

---

### TC-ORDER-002

Title:
Order With Out Of Stock Product

Expected:

* Order ditolak.

Priority:
Critical

---

### TC-ORDER-003

Title:
View Order History

Expected:

* Riwayat pesanan tampil.

Priority:
High

---

### TC-ORDER-004

Title:
View Order Detail

Expected:

* Detail pesanan tampil.

Priority:
Medium

---

# Module D - Payments

### TC-PAY-001

Title:
Successful Payment

Expected:

* Status berubah menjadi Paid.

Priority:
Critical

---

### TC-PAY-002

Title:
Failed Payment

Expected:

* Status tetap Pending.

Priority:
Critical

---

### TC-PAY-003

Title:
Payment Callback

Expected:

* Data pembayaran diperbarui.

Priority:
Critical

---

# Module E - Impact Dashboard

### TC-IMPACT-001

Title:
View Impact Dashboard

Expected:

* Statistik tampil.

Priority:
Medium

---

### TC-IMPACT-002

Title:
Impact Update After Redeem

Expected:

* Nilai impact bertambah.

Priority:
High

---

# Module F - Merchant Dashboard

### TC-MERCHANT-001

Title:
Add Product

Expected:

* Produk berhasil dibuat.

Priority:
Critical

---

### TC-MERCHANT-002

Title:
Edit Product

Expected:

* Produk berhasil diperbarui.

Priority:
High

---

### TC-MERCHANT-003

Title:
Delete Product

Expected:

* Produk terhapus.

Priority:
High

---

### TC-MERCHANT-004

Title:
Update Stock

Expected:

* Stok berubah.

Priority:
High

---

### TC-MERCHANT-005

Title:
View Orders

Expected:

* Order merchant tampil.

Priority:
Medium

---

### TC-MERCHANT-006

Title:
Redeem Order

Expected:

* Status berubah Redeemed.

Priority:
Critical

---

# Module G - Merchant Verification

### TC-VERIFY-001

Title:
Submit Verification

Expected:

* Status Pending.

Priority:
High

---

### TC-VERIFY-002

Title:
Approve Verification

Expected:

* Status Approved.

Priority:
Critical

---

### TC-VERIFY-003

Title:
Reject Verification

Expected:

* Status Rejected.

Priority:
Critical

---

# Module H - Admin Dashboard

### TC-ADMIN-001

Title:
View Dashboard

Expected:

* Statistik tampil.

Priority:
High

---

### TC-ADMIN-002

Title:
View Merchant List

Expected:

* Data merchant tampil.

Priority:
Medium

---

### TC-ADMIN-003

Title:
Approve Merchant

Expected:

* Merchant aktif.

Priority:
Critical

---

### TC-ADMIN-004

Title:
Reject Merchant

Expected:

* Merchant ditolak.

Priority:
Critical

---

# Module I - Authorization

### TC-ROLE-001

Customer Access Merchant Page

Expected:

Access Denied

Priority:
Critical

---

### TC-ROLE-002

Merchant Access Admin Page

Expected:

Access Denied

Priority:
Critical

---

### TC-ROLE-003

Admin Access Admin Page

Expected:

Success

Priority:
Critical

---

# Module J - Responsive Testing

### TC-RESP-001

Viewport:
320px

Expected:

Layout mobile berjalan normal.

---

### TC-RESP-002

Viewport:
768px

Expected:

Layout tablet berjalan normal.

---

### TC-RESP-003

Viewport:
1024px

Expected:

Layout desktop berjalan normal.

---

# 8. API Testing Checklist

## Auth

* [ ] POST /api/auth/register
* [ ] POST /api/auth/login
* [ ] GET /api/auth/profile
* [ ] PUT /api/auth/profile

## Products

* [ ] POST /api/products
* [ ] GET /api/products
* [ ] GET /api/products/:id
* [ ] PATCH /api/products/:id/stock
* [ ] DELETE /api/products/:id

## Orders

* [ ] POST /api/orders
* [ ] GET /api/orders
* [ ] GET /api/orders/:id
* [ ] PATCH /api/orders/redeem

## Merchant

* [ ] POST /api/merchant/profile
* [ ] GET /api/merchant/profile

## Impact

* [ ] GET /api/impact

---

# 9. Bug Severity

## Critical

Aplikasi tidak dapat digunakan.

Contoh:

* Login gagal total.
* Checkout gagal total.
* Database tidak menyimpan data.

---

## High

Fitur utama tidak berjalan.

Contoh:

* Add Product gagal.
* Payment gagal.

---

## Medium

Fitur berjalan sebagian.

Contoh:

* Search tidak akurat.

---

## Low

Masalah UI.

Contoh:

* Icon tidak tampil.
* Alignment tidak rapi.

---

# 10. Test Result Summary

| Module         | Total Test Case | Pass | Fail |
| -------------- | --------------- | ---- | ---- |
| Authentication | 4               |      |      |
| Marketplace    | 4               |      |      |
| Orders         | 4               |      |      |
| Payments       | 3               |      |      |
| Impact         | 2               |      |      |
| Merchant       | 6               |      |      |
| Verification   | 3               |      |      |
| Admin          | 4               |      |      |
| Role           | 3               |      |      |
| Responsive     | 3               |      |      |

Total Test Cases: 36

Tester Signature:

---

Date:

---
