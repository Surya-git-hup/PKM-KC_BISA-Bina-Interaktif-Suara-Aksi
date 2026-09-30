-- ================================================================
-- SKEMA BASIS DATA MySQL - BISA (BINA INTERAKTIF SUARA-AKSI)
-- Sesuai Proposal PKM-KC: Platform Pembelajaran Bina Diri Interaktif
-- Menggunakan MySQL Server / MariaDB via XAMPP / Apache / PHP PDO
-- ================================================================

CREATE DATABASE IF NOT EXISTS `db_bisa_slb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `db_bisa_slb`;

-- 1. TABEL GURU SLB
CREATE TABLE IF NOT EXISTS `guru` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `sekolah` VARCHAR(200) NOT NULL DEFAULT 'SLB Budi Kasih Bengkulu',
  `nip` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. TABEL RUANG BELAJAR & KODE UNDANGAN
CREATE TABLE IF NOT EXISTS `ruang_belajar` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `guru_id` INT NOT NULL,
  `nama_ruang` VARCHAR(150) NOT NULL,
  `kode_undangan` VARCHAR(20) NOT NULL UNIQUE,
  `tahun_ajaran` VARCHAR(20) DEFAULT '2024/2025',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`guru_id`) REFERENCES `guru`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. TABEL ORANG TUA / WALI
CREATE TABLE IF NOT EXISTS `orang_tua` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama` VARCHAR(150) NOT NULL,
  `no_hp` VARCHAR(25) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. TABEL SISWA (TERHUBUNG KE RUANG & ORANG TUA)
CREATE TABLE IF NOT EXISTS `siswa` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ruang_id` INT NOT NULL,
  `orang_tua_id` INT DEFAULT NULL,
  `nama` VARCHAR(150) NOT NULL,
  `kelas` VARCHAR(50) NOT NULL DEFAULT 'Kelas 1 SLB',
  `kebutuhan_khusus` VARCHAR(100) NOT NULL DEFAULT 'Tunagrahita Ringan',
  `avatar` VARCHAR(20) NOT NULL DEFAULT '👦',
  `progress_kemandirian` INT DEFAULT 0,
  `status` ENUM('mandiri', 'suara', 'butuh_bantuan') DEFAULT 'butuh_bantuan',
  `bintang_pekanan` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`ruang_id`) REFERENCES `ruang_belajar`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`orang_tua_id`) REFERENCES `orang_tua`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. TABEL LOG AKTIVITAS BINA DIRI
CREATE TABLE IF NOT EXISTS `aktivitas_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `modul_id` VARCHAR(50) NOT NULL,
  `nama_modul` VARCHAR(100) NOT NULL,
  `langkah_tercapai` INT NOT NULL,
  `total_langkah` INT NOT NULL,
  `bantuan_digunakan` VARCHAR(50) DEFAULT 'mandiri',
  `perintah_suara_terakhir` VARCHAR(50) DEFAULT 'selesai',
  `akurasi_artikulasi` INT DEFAULT 92,
  `latensi_ms` INT DEFAULT 240,
  `waktu_selesai` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. TABEL BUKU PENGHUBUNG DIGITAL
CREATE TABLE IF NOT EXISTS `buku_penghubung` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `penulis_nama` VARCHAR(150) NOT NULL,
  `peran_penulis` ENUM('Guru SLB', 'Orang Tua', 'Sistem BISA (Otomatis)') NOT NULL,
  `isi_catatan` TEXT NOT NULL,
  `foto_url` VARCHAR(255) DEFAULT NULL,
  `suka` TINYINT(1) DEFAULT 0,
  `disukai_oleh` VARCHAR(150) DEFAULT NULL,
  `dibaca` TINYINT(1) DEFAULT 1,
  `dibaca_oleh` VARCHAR(150) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. TABEL NILAI BERKALA
CREATE TABLE IF NOT EXISTS `nilai_berkala` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `siswa_id` INT NOT NULL,
  `periode` VARCHAR(50) NOT NULL,
  `skor` INT NOT NULL,
  `tingkat_prompt` INT DEFAULT 4,
  `status` VARCHAR(50) DEFAULT 'Meningkat',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- SEED DATA AWAL DEMO
INSERT INTO `guru` (`id`, `nama`, `email`, `password`, `sekolah`) VALUES
(1, 'Ibu Ratna, S.Pd', 'ratna@slb-budikasih.sch.id', '$2y$10$e8w.demo.hash.bisa2026', 'SLB Budi Kasih Bengkulu')
ON DUPLICATE KEY UPDATE `nama`=`nama`;

INSERT INTO `ruang_belajar` (`id`, `guru_id`, `nama_ruang`, `kode_undangan`, `tahun_ajaran`) VALUES
(1, 1, 'Kelas Inklusi C1', 'SLB-BUDI-01', '2024/2025')
ON DUPLICATE KEY UPDATE `kode_undangan`=`kode_undangan`;

INSERT INTO `orang_tua` (`id`, `nama`, `no_hp`, `password`) VALUES
(1, 'Ibu Dewi Pratama', '0812-7890-4412', '$2y$10$e8w.demo.hash.budi123')
ON DUPLICATE KEY UPDATE `nama`=`nama`;

INSERT INTO `siswa` (`id`, `ruang_id`, `orang_tua_id`, `nama`, `kelas`, `kebutuhan_khusus`, `avatar`, `progress_kemandirian`, `status`) VALUES
(1, 1, 1, 'Budi Pratama', 'Kelas 1 SLB', 'Tunagrahita Ringan', '👦', 85, 'mandiri')
ON DUPLICATE KEY UPDATE `nama`=`nama`;
