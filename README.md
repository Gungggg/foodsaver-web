# FoodSaver App 🍔🌱

FoodSaver adalah sebuah platform inovatif berkonsep *Food Rescue* yang bertujuan untuk mengurangi limbah makanan (*food waste*) di Indonesia. Aplikasi ini menghubungkan pemilik toko makanan (Merchant) yang memiliki surplus makanan harian dengan pelanggan (Customer) yang dapat membeli makanan tersebut dengan harga diskon dalam bentuk "Surprise Bags".

## Fitur Utama ✨

1. **Marketplace & Kategori Makanan**
   - Menjelajahi berbagai Surprise Bags berdasarkan kategori (Roti & Kue, Sayur & Buah, Makanan Berat, dll).
   - Filter harga diskon gila-gilaan untuk makanan surplus restoran.
2. **Dashboard Administrator**
   - Laporan visual dan statistik *real-time* tentang penjualan, emisi karbon yang diselamatkan (CO2), dan aktivitas pengguna.
   - Panel Verifikasi untuk mendaftarkan dan memvalidasi Merchant.
3. **Data Dummy Realistis (Seeding)**
   - Tersedia sistem simulasi lalu lintas data (ribuan transaksi buatan) menggunakan algoritma *Power Law* untuk simulasi aktivitas startup bertumbuh.

## Tech Stack 💻

- **Frontend:** React.js, Tailwind CSS, Vite.
- **Backend:** Node.js, Express.js.
- **Database:** MySQL.
- **Data Generator:** Faker.js (untuk seeding dummy data).

## Persyaratan Sistem 🛠️

- Node.js (v16 atau di atasnya)
- MySQL / MariaDB (bisa melalui Laragon/XAMPP)
- NPM atau Yarn

## Panduan Instalasi & Menjalankan Aplikasi 🚀

1. **Kloning Repositori**
   ```bash
   git clone https://github.com/Gungggg/foodsaver-web.git
   cd foodsaverapp
   ```

2. **Menyiapkan Database MySQL**
   Buat database kosong bernama `foodsaver` di sistem MySQL lokal Anda.
   ```sql
   CREATE DATABASE foodsaver;
   ```

3. **Instalasi dan Konfigurasi Backend**
   ```bash
   cd backend
   npm install
   ```
   *Konfigurasikan file `.env` di folder backend:*
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=foodsaver
   PORT=5000
   JWT_SECRET=your_super_secret_key
   ```
   
   **Seeding Data Dummy (Opsional namun direkomendasikan):**
   ```bash
   node seed.js
   ```

   **Menjalankan Server Backend:**
   ```bash
   npm run dev
   ```

4. **Instalasi dan Konfigurasi Frontend**
   Buka terminal baru:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Aplikasi akan terbuka otomatis di browser melalui tautan `http://localhost:5173`.

## Akun Demo 🔑

Jika Anda menjalankan skrip `seed.js`, akun berikut akan langsung tersedia:
- **Admin**: `admin@mail.com` | Password: `password123`
- **Merchant/User Lain**: Silakan gunakan fitur register atau lihat tabel database.

## Kontribusi 🤝

Karena proyek ini bersifat percontohan dan dikembangkan sebagai solusi peduli lingkungan, setiap masukan *Pull Request* atau *Issues* dari developer sangat diapresiasi!

---
*Selamatkan makanan, selamatkan bumi!* 🌍
