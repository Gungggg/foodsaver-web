# Dokumentasi Backend FoodSaver API

## 1. Pendahuluan
Backend FoodSaver merupakan RESTful API yang dibangun menggunakan **Node.js** dan framework **Express.js**. Backend ini bertugas untuk menangani logika bisnis aplikasi FoodSaver, mengelola database pengguna, produk (surprise bags), pesanan, pembayaran, serta mencatat dampak positif (impact) dari penyelamatan makanan.

## 2. Teknologi yang Digunakan
- **Framework**: Express.js (v5.2.1)
- **Database**: MySQL (diakses menggunakan package `mysql2`)
- **Autentikasi**: JSON Web Token (`jsonwebtoken`)
- **Keamanan Password**: bcryptjs
- **Keamanan Header**: Helmet
- **File Upload**: Multer
- **Unique Identifier**: UUID (v4)
- **CORS**: `cors` package untuk mengizinkan akses dari origin lain.

## 3. Struktur Direktori Utama
Proyek ini mengadopsi arsitektur modular (berbasis fitur), yang memudahkan pengelolaan kode saat aplikasi bertambah besar.
```text
src/
├── app.js               # Inisialisasi Express app dan pendaftaran semua global middleware/routes
├── server.js            # Entry point aplikasi, menghubungkan ke database dan menjalankan server (port 5000)
├── config/
│   └── db.js            # Konfigurasi dan inisialisasi koneksi MySQL menggunakan raw query
├── middleware/
│   ├── authenticate.js  # Middleware untuk memverifikasi JWT Bearer token
│   └── authorizeRole.js # Middleware untuk pembatasan hak akses berdasarkan role user (admin/merchant/customer)
├── modules/             # Berisi modul-modul fungsionalitas (Feature-based structure)
│   ├── admin/           # Pengelolaan verifikasi merchant dan analytics dashboard
│   ├── auth/            # Registrasi, Login, dan Profil Pengguna
│   ├── impact/          # Perhitungan dampak/statistik makanan yang diselamatkan
│   ├── merchant/        # Pembuatan dan pengambilan profil toko
│   ├── orders/          # Transaksi pesanan, riwayat, dan penukaran/redeem pesanan (QR)
│   ├── payments/        # Proses inisiasi pembayaran dan callback gateway pembayaran
│   └── products/        # CRUD produk sisa makanan (Surprise Bags)
├── routes/
│   └── test.routes.js   # Route untuk testing (opsional)
└── utils/
    └── upload.js        # Konfigurasi Multer untuk menangani upload gambar ke folder `uploads/`
```

## 4. Mekanisme Keamanan & Autentikasi
1. **Pendaftaran (Register)**: Saat pengguna mendaftar, password di-hash menggunakan `bcryptjs` sebelum disimpan ke database. Pengguna diberikan role default (seperti `customer` atau `merchant`).
2. **Login**: Setelah memverifikasi email dan password, server menghasilkan token JWT (`jsonwebtoken`) yang berisi payload `id`, `email`, dan `role`. Token ini memiliki masa berlaku 1 hari (`1d`).
3. **Autentikasi Middleware (`authenticate.js`)**: Middleware ini mengekstrak token dari header `Authorization: Bearer <token>`, kemudian memverifikasinya. Jika valid, payload user disisipkan ke object `req.user`.
4. **Otorisasi Role (`authorizeRole.js`)**: Digunakan secara berantai setelah middleware autentikasi. Middleware ini mengecek apakah `req.user.role` termasuk dalam daftar role yang diizinkan untuk mengakses suatu route (contoh: hanya `merchant` yang boleh menambah produk).

## 5. Ringkasan Modul (API Endpoints)
Berikut adalah penjelasan singkat mengenai modul yang tersedia beserta fungsi controller yang dijalankan:

### A. Auth Module (`/api/auth`)
Menangani autentikasi dan profil pengguna.
- `POST /register`: Pendaftaran user baru dengan hashing password.
- `POST /login`: Login user dan pengembalian token JWT.
- `GET /profile`: Mengambil profil user yang sedang login (Protected).
- `PUT /profile`: Memperbarui profil (Protected).

### B. Products Module (`/api/products`)
Menangani entitas "Surprise Bags" (Sisa makanan yang dijual murah).
- `POST /`: Membuat produk baru lengkap dengan upload gambar (Protected, Merchant-only).
- `GET /`: Mendapatkan daftar produk dengan dukungan filter (search, min_price, max_price, in_stock, merchant) dan paginasi.
- `GET /:id`: Mendapatkan detail produk tertentu.
- `PATCH /:id/stock`: Mengupdate stok produk (Protected, Merchant-only).
- `DELETE /:id`: Menghapus produk (Protected, Merchant-only).

### C. Merchant Module (`/api/merchant`)
Menangani informasi detail toko/merchant.
- `createProfile`: Mendaftarkan info merchant/toko ke akun pengguna.
- `getProfile`: Melihat info profil merchant.

### D. Orders Module (`/api/orders`)
Menangani alur pesanan dari pelanggan.
- `createOrder`: Pelanggan membuat pesanan produk.
- `getMyOrders`: Melihat riwayat pesanan pelanggan.
- `getOrderById`: Melihat detail pesanan spesifik.
- `redeemOrder`: Penukaran pesanan di lokasi toko (bisa via scan QR code).

### E. Payments Module (`/api/payments`)
- `createPayment`: Menginisiasi transaksi/tagihan pembayaran.
- `paymentCallback`: Webhook/callback untuk menerima status pembayaran dari payment gateway (misalnya Midtrans).
- `getPaymentById`: Mengecek status pembayaran.

### F. Impact Module (`/api/impact`)
- `getImpactStats`: Mengembalikan metrik statistik tentang berapa banyak makanan yang telah diselamatkan dan dampaknya terhadap pengurangan emisi karbon.

### G. Admin Module (`/api/admin`)
Khusus untuk pengelola sistem FoodSaver.
- `getAllMerchants`: Menampilkan daftar semua merchant.
- `verifyMerchant`: Memverifikasi merchant agar bisa mulai berjualan.
- `getDashboardAnalytics`: Mendapatkan ringkasan data untuk dashboard admin.

## 6. Struktur Database (Tabel)
Database MySQL (`foodsaver`) menggunakan 10 tabel yang terintegrasi secara relasional:
1. **`users`**: Data pelanggan, merchant, dan admin.
2. **`merchant_profiles`**: Profil detail toko yang dikaitkan ke `users` (dengan role merchant).
3. **`categories`**: Kategori makanan (Roti, Sayur, dll) yang mengelompokkan `surprise_bags`.
4. **`surprise_bags`**: Data produk sisa makanan yang dijual.
5. **`orders`**: Data transaksi pesanan pelanggan ke suatu surprise bag.
6. **`invoices`**: Data tagihan untuk order yang dibuat.
7. **`payments`**: Data pembayaran berhasil untuk suatu invoice.
8. **`impact_logs`**: Metrik dampak lingkungan (CO2 & Uang) yang berhasil diselamatkan setelah pesanan selesai.
9. **`reviews`**: Ulasan dan rating (1-5) dari pelanggan kepada toko terkait pesanan mereka.
10. **`wishlists`**: Produk (surprise bags) favorit pelanggan yang disimpan untuk dibeli nanti.

## 7. Cara Berinteraksi dengan Database
Backend ini **tidak** menggunakan ORM (seperti Sequelize atau Prisma). Interaksi dengan database MySQL dilakukan secara langsung dengan **Raw SQL Queries** melalui package `mysql2`.
Contoh pola interaksi:
1. Menerima request (misalnya dari `req.body` atau `req.query`).
2. Menyiapkan string query SQL dan nilai parameterized binding (`?`) untuk mencegah SQL Injection.
3. Memanggil `db.query(query, [values], callback)`.
4. Jika berhasil, mengirim response JSON ke client.

## 8. Penanganan File Statis (Uploads)
Folder `uploads/` di ekspos secara publik menggunakan `express.static` di file `app.js`. Ketika merchant mengupload gambar produk menggunakan `multer` (lewat `utils/upload.js`), file akan tersimpan di folder ini dan client dapat mengaksesnya via URL seperti `http://localhost:5000/uploads/nama-file.jpg`.
