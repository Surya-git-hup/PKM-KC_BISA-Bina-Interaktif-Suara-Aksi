# Dokumentasi Arsitektur Database Stack PHP + MySQL - BISA (Bina Interaktif Suara-Aksi)

## 1. Ikhtisar Arsitektur
Aplikasi BISA menggunakan arsitektur basis data relasional **PHP + MySQL**:
- **Database Engine**: MySQL 8.0 / MariaDB (Mendukung UTF8MB4 untuk karakter teks & emoji avatar siswa)
- **Koneksi Backend**: PHP Data Objects (PDO) dengan Prepared Statements (`PDO::ERRMODE_EXCEPTION`, `PDO::ATTR_EMULATE_PREPARES => false`) untuk mencegah SQL Injection.
- **Enkripsi Kata Sandi**: `password_hash()` menggunakan algoritma BCRYPT kuat.
- **Node.js Production Server (`server.ts`)**: Berfungsi ganda menyajikan frontend React SPA sekaligus mengemulasi REST API endpoint yang identik dengan PHP API sehingga aplikasi dapat berjalan langsung di cloud container maupun dideploy ke server LAMP/WAMP/XAMPP.

## 2. Struktur Tabel MySQL (`db_bisa_slb`)

| No | Nama Tabel | Deskripsi & Relasi |
|---|---|---|
| 1 | `guru` | Menyimpan kredensial guru SLB, NIP, sekolah, email & hash password. |
| 2 | `ruang_belajar` | Menyimpan ruang kelas dan `kode_undangan` unik (relasi FK ke `guru.id`). |
| 3 | `orang_tua` | Menyimpan nama wali murid, no HP, dan password terenkripsi. |
| 4 | `siswa` | Menyimpan profil anak/murid, kelas, kebutuhan khusus, avatar, dan progress kemandirian (relasi FK ke `ruang_belajar.id` & `orang_tua.id`). |
| 5 | `aktivitas_log` | Menyimpan riwayat pengerjaan modul bina diri (langkah tercapai, akurasi suara %, latensi respons ms) (FK ke `siswa.id`). |
| 6 | `buku_penghubung` | Catatan harian dua arah guru dan orang tua beserta foto & tanda suka/baca. |
| 7 | `nilai_berkala` | Riwayat asesmen nilai bina diri per sesi/pekan untuk grafik analitik. |

## 3. Daftar Endpoint API PHP (`/backend/api/`)

1. **Autentikasi & Ruang Belajar** (`auth.php`):
   - `action=register_guru`: Registrasi guru langsung buat ruang & kode undangan.
   - `action=register_orang_tua`: Registrasi orang tua dengan kode undangan guru (otomatis tautkan siswa).
   - `action=login_guru`: Login guru via email & password.
   - `action=login_orang_tua`: Login orang tua via kode ruang & password.

2. **Pencatatan Aktivitas** (`aktivitas.php`):
   - `action=simpan_aktivitas`: Menyimpan pengerjaan modul bina diri, latensi & akurasi suara.
   - `action=ambil_aktivitas`: Mengambil riwayat log aktivitas siswa.

3. **Data Peserta Didik** (`siswa.php`):
   - `action=tambah_siswa`: Menambahkan siswa baru oleh guru SLB.
   - `action=daftar_siswa`: Mengambil daftar siswa per ruang belajar.

4. **Buku Penghubung** (`buku_penghubung.php`):
   - `action=tambah_catatan`: Menulis catatan kolaborasi.
   - `action=ambil_catatan`: Menampilkan linimasa catatan harian.

## 4. Cara Deploy ke Server PHP + MySQL (XAMPP / Apache / Nginx)

1. Buat database di phpMyAdmin / MySQL CLI:
   ```sql
   CREATE DATABASE db_bisa_slb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Impor file skema:
   ```bash
   mysql -u root -p db_bisa_slb < backend/database.sql
   ```
3. Salin folder `backend` ke direktori web server (misal `htdocs/bisa/backend`).
4. Atur file `.env` atau environment variable `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.
