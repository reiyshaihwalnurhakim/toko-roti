# 🎂 Sweet Moments Bakery — Fullstack E-Commerce & Custom Cake Platform

Aplikasi web pemesanan kue katalog dan kue *custom* modern yang dibangun menggunakan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, dan **NextAuth.js**.

## ✨ Fitur Utama

- **Guest Checkout (Tanpa Harus Login):** Pelanggan dapat langsung memesan kue katalog maupun kue *custom* cukup dengan mengisi nama, nomor WhatsApp aktif, dan memilih/menuliskan metode pembayaran.
- **Katalog & Filter Kue:** Pencarian kue berdasarkan nama, filter kategori, urutan harga, dan halaman detail kue dengan **Tab Informasi Interaktif** (*Deskripsi, Bahan & Penyimpanan, Prosedur Pemesanan, dan Ulasan*).
- **Pemesanan Kue Custom & Kalkulator Estimasi Harga:** Formulir interaktif untuk menentukan acara, tanggal, ukuran kue, rasa, tema, tulisan di atas kue, serta *upload* foto referensi (maks. 1MB).
- **Integrasi Langsung ke WhatsApp Admin:** Setelah pesanan dibuat, sistem otomatis menyusun format pesan lengkap dengan Nomor Pesanan (`ORD-...`) untuk dikirim ke WhatsApp Admin.
- **Lacak Status Pesanan (`/cek-pesanan`):** Pelanggan dapat mengecek status pesanan katalog maupun *custom* secara *real-time* menggunakan Nomor Pesanan atau Nomor Telepon.
- **Ulasan Pelanggan dengan Verifikasi Otomatis (`/ulasan`):** Pelanggan dapat mengirim ulasan beserta foto kue, dan otomatis mendapatkan badge **Pembeli Terverifikasi** jika memasukkan Nomor Pesanan yang valid.
- **Hidden Admin Portal & Auto-Cleanup:**
  - Akses login Admin tersembunyi (*Secret Trigger*: ketuk 5x pada logo **Sweet Moments** di Navbar atau teks copyright di Footer).
  - Manajemen Katalog Kue (Tambah Kue, Edit, Hapus, & *Toggle* Status Stok Tersedia/Habis).
  - Manajemen Pesanan & **Auto-Cleanup** otomatis menghapus file foto referensi dari server saat pesanan *custom* ditandai *Selesai* atau *Dibatalkan*.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 + Lucide Icons
- **Database & ORM:** SQLite / Prisma ORM
- **Authentication:** NextAuth.js (Credentials Provider)

## 🚀 Cara Menjalankan di Lokal

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup environment variable (`.env`):**
   ```env
   NEXTAUTH_SECRET="sweet-moments-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Sinkronisasi database & jalankan seed data awal:**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. **Jalankan server development:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:3000` di browser.

### 🔐 Akun Demo Admin
- **Cara Masuk:** Buka `/login` atau klik 5x dengan cepat pada logo **Sweet Moments** di pojok kiri atas.
- **Email:** `admin@bakery.com`
- **Password:** `password123`
