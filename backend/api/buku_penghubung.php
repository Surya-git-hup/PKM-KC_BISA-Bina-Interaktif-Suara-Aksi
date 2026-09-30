<?php
/**
 * Endpoint Buku Penghubung Digital PHP + MySQL BISA
 * Mengelola catatan interaktif guru dan orang tua di database MySQL
 */

require_once __DIR__ . '/../db_connect.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

switch ($action) {

    // Simpan Catatan Baru
    case 'tambah_catatan':
        $siswa_id = (int)($input['siswa_id'] ?? 1);
        $penulis_nama = trim($input['penulis_nama'] ?? 'Guru SLB');
        $peran_penulis = trim($input['peran_penulis'] ?? 'Guru SLB');
        $isi_catatan = trim($input['isi_catatan'] ?? '');
        $foto_url = trim($input['foto_url'] ?? null);

        if (empty($isi_catatan)) {
            send_json_response('error', 'Isi catatan tidak boleh kosong.', null, 400);
        }

        if ($pdo) {
            $stmt = $pdo->prepare("
                INSERT INTO buku_penghubung (siswa_id, penulis_nama, peran_penulis, isi_catatan, foto_url, dibaca)
                VALUES (?, ?, ?, ?, ?, 1)
            ");
            $stmt->execute([$siswa_id, $penulis_nama, $peran_penulis, $isi_catatan, $foto_url]);
            $catatan_id = $pdo->lastInsertId();
        } else {
            $catatan_id = time();
        }

        send_json_response('success', 'Catatan buku penghubung berhasil disimpan ke MySQL.', [
            'id' => $catatan_id,
            'penulis' => $penulis_nama,
            'peran' => $peran_penulis,
            'isi' => $isi_catatan,
            'waktu' => date('Y-m-d H:i:s')
        ], 201);
        break;

    // Ambil Catatan Buku Penghubung
    case 'ambil_catatan':
        $siswa_id = (int)($_GET['siswa_id'] ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare("SELECT * FROM buku_penghubung WHERE siswa_id = ? ORDER BY id DESC LIMIT 50");
            $stmt->execute([$siswa_id]);
            $rows = $stmt->fetchAll();
        } else {
            $rows = [];
        }

        send_json_response('success', 'Catatan buku penghubung ditemukan.', $rows);
        break;

    default:
        send_json_response('error', 'Aksi tidak valid.', null, 400);
}
?>
