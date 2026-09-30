<?php
/**
 * Endpoint Aktivitas & Nilai PHP + MySQL BISA
 * Menyimpan progres langkah modul bina diri, latensi suara, dan catatan buku penghubung
 */

require_once __DIR__ . '/../db_connect.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

switch ($action) {

    // Simpan log aktivitas selesai
    case 'simpan_aktivitas':
        $siswa_id = (int)($input['siswa_id'] ?? 1);
        $modul_id = $input['modul_id'] ?? 'cuci-tangan';
        $nama_modul = $input['nama_modul'] ?? 'Cuci Tangan';
        $langkah_tercapai = (int)($input['langkah_tercapai'] ?? 6);
        $total_langkah = (int)($input['total_langkah'] ?? 6);
        $akurasi = (int)($input['akurasi_artikulasi'] ?? 92);
        $latensi = (int)($input['latensi_ms'] ?? 240);

        if ($pdo) {
            $stmt = $pdo->prepare("
                INSERT INTO aktivitas_log (siswa_id, modul_id, nama_modul, langkah_tercapai, total_langkah, akurasi_artikulasi, latensi_ms) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([$siswa_id, $modul_id, $nama_modul, $langkah_tercapai, $total_langkah, $akurasi, $latensi]);
            
            // Perbarui progress kemandirian siswa (+5%)
            $stmtUpdate = $pdo->prepare("UPDATE siswa SET progress_kemandirian = LEAST(100, progress_kemandirian + 5) WHERE id = ?");
            $stmtUpdate->execute([$siswa_id]);
        }

        send_json_response('success', 'Aktivitas berhasil dicatat ke database MySQL.', [
            'modul' => $nama_modul,
            'langkah' => $langkah_tercapai,
            'akurasi' => $akurasi,
            'latensi_ms' => $latensi
        ]);
        break;

    // Ambil log aktivitas siswa
    case 'ambil_aktivitas':
        $siswa_id = (int)($_GET['siswa_id'] ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT * FROM aktivitas_log WHERE siswa_id = ? ORDER BY waktu_selesai DESC LIMIT 20");
            $stmt->execute([$siswa_id]);
            $logs = $stmt->fetchAll();
        } else {
            $logs = [
                ['nama_modul' => 'Cuci Tangan', 'langkah_tercapai' => 6, 'akurasi_artikulasi' => 92, 'latensi_ms' => 240, 'waktu_selesai' => date('Y-m-d H:i:s')]
            ];
        }

        send_json_response('success', 'Data aktivitas ditemukan.', $logs);
        break;

    default:
        send_json_response('error', 'Aksi tidak valid.', null, 400);
}
?>
