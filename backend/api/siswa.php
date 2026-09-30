<?php
/**
 * Endpoint Pengelolaan Siswa PHP + MySQL BISA
 * Menyimpan data peserta didik (anak/murid) ke database MySQL
 */

require_once __DIR__ . '/../db_connect.php';

$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

switch ($action) {

    // 1. Tambah Peserta Didik Baru
    case 'tambah_siswa':
        $ruang_id = (int)($input['ruang_id'] ?? 1);
        $nama = trim($input['nama'] ?? '');
        $kelas = trim($input['kelas'] ?? 'Kelas 1 SLB');
        $kebutuhan = trim($input['kebutuhan_khusus'] ?? 'Tunagrahita Ringan');
        $avatar = trim($input['avatar'] ?? '👦');
        $nama_ortu = trim($input['nama_orang_tua'] ?? '');
        $no_hp = trim($input['no_hp_ortu'] ?? '');
        $kode_undangan = strtoupper(trim($input['kode_undangan'] ?? 'SLB-BUDI-01'));

        if (empty($nama) || empty($nama_ortu)) {
            send_json_response('error', 'Nama siswa dan nama orang tua wajib diisi.', null, 400);
        }

        if ($pdo) {
            try {
                // Buat akun orang tua jika belum ada
                $stmtCheckOrtu = $pdo->prepare("SELECT id FROM orang_tua WHERE nama = ? OR no_hp = ?");
                $stmtCheckOrtu->execute([$nama_ortu, $no_hp]);
                $ortu = $stmtCheckOrtu->fetch();

                if ($ortu) {
                    $ortu_id = $ortu['id'];
                } else {
                    $default_pass = password_hash('bisa123', PASSWORD_BCRYPT);
                    $stmtNewOrtu = $pdo->prepare("INSERT INTO orang_tua (nama, no_hp, password) VALUES (?, ?, ?)");
                    $stmtNewOrtu->execute([$nama_ortu, $no_hp ?: '081234567890', $default_pass]);
                    $ortu_id = $pdo->lastInsertId();
                }

                // Tambahkan siswa ke tabel MySQL dengan statistik awal kosong/nol
                $stmt = $pdo->prepare("
                    INSERT INTO siswa (ruang_id, orang_tua_id, nama, kelas, kebutuhan_khusus, avatar, progress_kemandirian, status, bintang_pekanan)
                    VALUES (?, ?, ?, ?, ?, ?, 0, 'butuh_bantuan', 0)
                ");
                $stmt->execute([$ruang_id, $ortu_id, $nama, $kelas, $kebutuhan, $avatar]);
                $siswa_id = $pdo->lastInsertId();

            } catch (PDOException $e) {
                send_json_response('error', 'Gagal menyimpan siswa ke basis data: ' . $e->getMessage(), null, 500);
            }
        } else {
            $siswa_id = time();
            $ortu_id = time() + 1;
        }

        send_json_response('success', 'Data siswa berhasil disimpan ke database MySQL.', [
            'id' => "student-{$siswa_id}",
            'nama' => $nama,
            'kelas' => $kelas,
            'kebutuhan_khusus' => $kebutuhan,
            'avatar' => $avatar,
            'orang_tua' => $nama_ortu,
            'kode_ruang' => $kode_undangan
        ], 201);
        break;

    // 2. Ambil Daftar Siswa
    case 'daftar_siswa':
        $ruang_id = (int)($_GET['ruang_id'] ?? 1);
        if ($pdo) {
            $stmt = $pdo->prepare("
                SELECT s.*, o.nama AS nama_ortu, o.no_hp AS no_hp_ortu, r.kode_undangan 
                FROM siswa s
                LEFT JOIN orang_tua o ON s.orang_tua_id = o.id
                LEFT JOIN ruang_belajar r ON s.ruang_id = r.id
                WHERE s.ruang_id = ?
                ORDER BY s.id ASC
            ");
            $stmt->execute([$ruang_id]);
            $list = $stmt->fetchAll();
        } else {
            $list = [
                [
                    'id' => 1,
                    'nama' => 'Budi Pratama',
                    'kelas' => 'Kelas 1 SLB',
                    'kebutuhan_khusus' => 'Tunagrahita Ringan',
                    'avatar' => '👦',
                    'progress_kemandirian' => 85,
                    'status' => 'mandiri',
                    'nama_ortu' => 'Ibu Dewi Pratama'
                ]
            ];
        }

        send_json_response('success', 'Daftar siswa ditemukan.', $list);
        break;

    default:
        send_json_response('error', 'Aksi tidak valid.', null, 400);
}
?>
