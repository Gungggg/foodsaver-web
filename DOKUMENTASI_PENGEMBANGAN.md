# Dokumentasi Pengembangan Aplikasi FoodSaver 🍔🌱

FoodSaver adalah platform berbasis *Food Rescue* yang bertujuan untuk mengurangi limbah makanan (*food waste*) dengan menghubungkan pemilik bisnis kuliner yang memiliki surplus makanan dengan pelanggan yang bisa membeli makanan tersebut dengan harga diskon melalui sistem "Surprise Bags".

Dokumen ini memuat detail mengenai fitur-fitur yang telah berhasil dikembangkan, beserta proses keseluruhan pengembangannya.

---

## 1. Fitur-Fitur yang Telah Dibuat ✨

Aplikasi ini dibagi menjadi beberapa modul utama yang saling berintegrasi (Frontend dan Backend):

### A. Fitur Pelanggan (Customer)
* **Autentikasi Pengguna**: Sistem pendaftaran (Register) dan masuk (Login) dengan keamanan enkripsi *password* menggunakan bcrypt dan token JWT (*JSON Web Token*).
* **Landing Page Interaktif**: Halaman beranda yang menjelaskan nilai tambah aplikasi, cara kerja, serta ajakan untuk bergabung dalam menyelamatkan lingkungan.
* **Marketplace Surprise Bags**: Halaman penjelajahan untuk melihat semua paket makanan sisa (Surprise Bags) yang dijual oleh berbagai *merchant*. Terdapat filter berdasarkan harga diskon dan kategori makanan (seperti Sayur & Buah, Roti & Kue, Daging, dll).
* **Detail Produk**: Menampilkan deskripsi makanan, harga asli, harga diskon, batas waktu (*available until*), gambar, serta stok yang tersedia.
* **Manajemen Pesanan (Orders)**: Sistem untuk memesan Surprise Bag dan memantau status pesanan (pending, dibayar, diambil, atau dibatalkan).

### B. Fitur Penjual / Toko (Merchant)
* **Autentikasi Merchant**: Merchant dapat mendaftar dan memverifikasi profil toko mereka, termasuk lokasi dan jadwal pengambilan (*pickup window*).
* **Merchant Dashboard**: Ringkasan data penjualan, jumlah makanan yang telah diselamatkan, serta total pendapatan dari makanan surplus.
* **Manajemen Produk (Surprise Bags)**: Fitur CRUD (Create, Read, Update, Delete) agar merchant dapat menambah, mengubah stok, atau menghapus Surprise Bag yang mereka tawarkan hari ini.

### C. Fitur Administrator
* **Admin Dashboard**: Panel kontrol terpusat bagi administrator platform untuk memantau metrik keseluruhan.
* **Laporan Dampak Lingkungan (Impact)**: Menghitung akumulasi emisi karbon (CO2) yang berhasil dicegah dan total penghematan dana akibat penyelamatan makanan.

### D. Fitur Pendukung (Backend & Database)
* **Sistem Database Relasional**: Desain arsitektur database relasional meliputi tabel `users`, `merchant_profiles`, `categories`, `surprise_bags`, `orders`, `invoices`, `payments`, `impact_logs`, `reviews`, dan `wishlists`.
* **Data Seeding Skala Besar (Faker.js)**: Script `seed.js` untuk membuat lebih dari 200 data pengguna (customer/merchant), ratusan Surprise Bag, dan 1000+ data transaksi historis menggunakan simulasi lalu lintas data algoritma kurva pertumbuhan (*Power Law*). Ini membuat aplikasi langsung terasa "hidup" saat dijalankan.

---

## 2. Dokumentasi Proses Pembuatan Website 🛠️

Pengembangan website ini dilakukan melalui beberapa tahapan sistematis untuk memastikan fungsionalitas dan skalabilitas yang baik:

### Tahap 1: Perencanaan & Perancangan Sistem
* **Analisis Kebutuhan**: Mengidentifikasi *pain points* (food waste) dan merumuskan solusi berbasis platform perantara (marketplace Surprise Bags).
* **Pemilihan Tech Stack**:
  * **Frontend**: React.js dengan Vite agar *build* cepat, serta TailwindCSS untuk UI/UX yang modern dan responsif.
  * **Backend**: Node.js dengan framework Express.js sebagai penyedia REST API.
  * **Database**: MySQL untuk memastikan integritas data transaksi dan relasi antar entitas (User, Order, Payment).

### Tahap 2: Pengembangan Backend (API & Database)
1. **Inisialisasi Proyek Node.js**: Memasang depedensi krusial seperti `express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, dan `dotenv`.
2. **Pembuatan Skema Database (DDL)**: Menyusun arsitektur basis data, termasuk implementasi *Foreign Keys* untuk integritas relasional (misal: pesanan terikat pada satu *user* dan satu *surprise bag*).
3. **Pengembangan Modul API (RESTful)**:
   * **Modul Auth**: *Endpoint* untuk registrasi dan *login*.
   * **Modul Products**: *Endpoint* untuk manajemen Surprise Bags (Create, Read, Update, Delete).
   * **Modul Orders & Payments**: Alur transaksi dari pemesanan barang hingga pembuatan *invoice* dan verifikasi pembayaran.
   * **Modul Impact**: Menghitung secara otomatis konversi makanan yang diselamatkan menjadi angka reduksi CO2.
4. **Data Seeding**: Mengembangkan script `seed.js` menggunakan `@faker-js/faker` untuk mensimulasikan lingkungan *production* buatan.

### Tahap 3: Pengembangan Frontend (UI/UX)
1. **Inisialisasi Vite + React**: Setup *environment* modern dengan Tailwind CSS.
2. **Pembuatan Routing**: Menggunakan `react-router-dom` untuk navigasi halaman (Landing, Login, Register, Marketplace, Dashboard, dll).
3. **Pembuatan Halaman Publik & Pelanggan**: Merancang antarmuka Marketplace dengan *grid* produk dan tampilan yang ramah pengguna.
4. **Pembuatan Dashboard**: Merancang halaman dashboard (baik untuk Admin maupun Merchant) yang menampilkan data secara terstruktur (menggunakan Axios untuk mengambil data dari Backend API).

### Tahap 4: Integrasi (Frontend & Backend)
* Menghubungkan *state* frontend dengan REST API backend.
* Mengimplementasikan manajemen Token JWT di Frontend (biasanya disimpan di *localStorage* atau *context*) sehingga halaman yang bersifat privat (Dashboard, Orders) dapat dilindungi dari pengguna yang belum *login*.

### Tahap 5: Pengujian & Penyempurnaan (Testing & Polishing)
* Menjalankan API Testing untuk memastikan setiap *endpoint* mengembalikan respon yang benar (termasuk *error handling*).
* Menjalankan UI Testing untuk memastikan tampilan konsisten (responsif) dari perangkat *desktop* maupun *mobile*.
* Penyempurnaan script seeding dan *bug fixes* pada alur transaksi.

---

**Selesai!** Platform FoodSaver kini siap dijalankan di *environment* lokal (menggunakan Laragon/XAMPP dan npm) dan berpotensi untuk dideploy ke *server cloud* untuk tahap produksi.
