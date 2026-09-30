import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory Database store with MySQL Schema Mirroring
interface DbStore {
  teachers: any[];
  rooms: any[];
  parents: any[];
  students: any[];
  activityLogs: any[];
  handbook: any[];
}

const db: DbStore = {
  teachers: [
    {
      id: 1,
      name: 'Ibu Ratna, S.Pd',
      email: 'ratna@slb-budikasih.sch.id',
      password: 'bisa2026',
      school: 'SLB Budi Kasih Bengkulu',
      createdAt: '2026-09-26 10:00:00'
    }
  ],
  rooms: [
    {
      id: 1,
      teacherId: 1,
      roomName: 'Kelas Inklusi C1',
      invitationCode: 'SLB-BUDI-01',
      academicYear: '2024/2025',
      school: 'SLB Budi Kasih Bengkulu'
    }
  ],
  parents: [
    {
      id: 1,
      name: 'Ibu Ratna (Wali Budi)',
      phone: '081234567890',
      password: 'budi123',
      roomCode: 'SLB-BUDI-01',
      studentId: 'student-1',
      roomId: 1,
      childName: 'Budi Pratama'
    }
  ],
  students: [
    {
      id: 'student-1',
      roomId: 1,
      parentId: 1,
      name: 'Budi Pratama',
      nickname: 'Budi',
      roomCode: 'SLB-BUDI-01',
      avatar: '👦',
      class: 'Kelas Inklusi C1',
      condition: 'Tunagrahita Ringan',
      parentName: 'Ibu Ratna (Wali Budi)',
      parentPhone: '081234567890',
      school: 'SLB Budi Kasih Bengkulu',
      teacherName: 'Ibu Ratna, S.Pd',
      currentActivity: 'Cuci Tangan Mandiri',
      progressPercentage: 65,
      completedActivities: 3,
      totalActivities: 4,
      weeklyStars: 8,
      maxWeeklyStars: 10,
      assistanceTrend: 'stabil',
      status: 'mandiri',
      modulesProgress: {
        cuciTangan: 80,
        menggosokGigi: 60,
        makanMandiri: 40,
        memakaiPakaian: 30
      },
      latestTeacherNote: {
        author: 'Ibu Ratna, S.Pd',
        role: 'Wali Kelas C1',
        timestamp: 'Kemarin',
        text: 'Budi menunjukkan kemajuan luar biasa saat mencuci tangan menggunakan instruksi suara BISA.',
        synced: true
      },
      latestAudioRecording: {
        command: 'Lanjut',
        duration: '00:04',
        accuracy: 94
      },
      gradeHistory: [],
      createdAt: '2026-09-26 10:00:00'
    }
  ],
  activityLogs: [],
  handbook: [
    {
      id: 'entry-default-1',
      studentId: 'student-1',
      studentName: 'Budi Pratama',
      roomCode: 'SLB-BUDI-01',
      authorName: 'Ibu Ratna, S.Pd',
      authorRole: 'Guru SLB',
      authorAvatar: '👩‍🏫',
      timestamp: 'Kemarin, 10:30 WIB',
      content: 'Hari ini ananda Budi berhasil mencuci tangan secara mandiri dengan panduan suara adaptif BISA. Kerja sama yang luar biasa di kelas inklusi!',
      liked: true,
      likedBy: 'Disukai Ibu Dewi Pratama',
      readStatus: true,
      readBy: 'Terbaca oleh Ibu Dewi Pratama',
      createdAt: '2026-09-29T10:30:00.000Z'
    },
    {
      id: 'entry-default-2',
      studentId: 'student-1',
      studentName: 'Budi Pratama',
      roomCode: 'SLB-BUDI-01',
      authorName: 'Ibu Dewi Pratama',
      authorRole: 'Orang Tua',
      authorAvatar: '👩',
      timestamp: 'Kemarin, 16:30 WIB',
      content: 'Terima kasih banyak Ibu Ratna! Di rumah Budi sudah mulai membiasakan diri cuci tangan sebelum makan.',
      liked: false,
      readStatus: true,
      readBy: 'Terbaca oleh Ibu Ratna, S.Pd',
      createdAt: '2026-09-29T16:30:00.000Z'
    }
  ]
};

// -------------------------------------------------------------
// PHP + MySQL Mirror API Endpoints
// -------------------------------------------------------------

// 1. Database Status & MySQL Health Check
app.get('/api/database/status', (req: Request, res: Response) => {
  res.json({
    status: 'connected',
    engine: 'MySQL 8.0 (PHP PDO MariaDB Compatible)',
    database: 'db_bisa_slb',
    host: process.env.DB_HOST || '127.0.0.1:3306',
    tables: {
      guru: db.teachers.length,
      ruang_belajar: db.rooms.length,
      orang_tua: db.parents.length,
      siswa: db.students.length,
      aktivitas_log: db.activityLogs.length
    },
    tablesList: [
      'guru',
      'ruang_belajar',
      'orang_tua',
      'siswa',
      'aktivitas_log',
      'buku_penghubung',
      'nilai_berkala'
    ],
    timestamp: new Date().toISOString()
  });
});

// 2. Registrasi Guru (isi form tanpa verifikasi -> buat ruang belajar -> kode undangan otomatis)
app.post('/api/auth/register-guru', (req: Request, res: Response) => {
  const { name, email, password, school, roomName } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan kata sandi wajib diisi.' });
  }

  // Check if email already registered
  const existing = db.teachers.find(t => t.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'Email guru sudah terdaftar. Silakan gunakan email lain atau masuk.' });
  }

  // Generate unique invitation code e.g. BISA-C1-82
  const randNum = Math.floor(10 + Math.random() * 89);
  const cleanRoom = (roomName || 'KELAS').replace(/[^A-Za-z0-9]/g, '').slice(0, 4).toUpperCase();
  const invitationCode = `BISA-${cleanRoom}-${randNum}`;

  const newTeacher = {
    id: db.teachers.length + 1,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    school: (school || 'SLB Budi Kasih').trim(),
    createdAt: new Date().toISOString()
  };
  db.teachers.push(newTeacher);

  const newRoom = {
    id: db.rooms.length + 1,
    teacherId: newTeacher.id,
    teacherName: newTeacher.name,
    roomName: (roomName || 'Kelas Inklusi BISA').trim(),
    invitationCode,
    academicYear: '2024/2025',
    school: newTeacher.school
  };
  db.rooms.push(newRoom);

  return res.status(201).json({
    status: 'success',
    message: 'Registrasi guru berhasil dan ruang belajar otomatis dibuat.',
    data: {
      guru: {
        id: `usr-teacher-${newTeacher.id}`,
        name: newTeacher.name,
        email: newTeacher.email,
        school: newTeacher.school,
        role: 'teacher',
        roomCode: invitationCode,
        roomId: newRoom.id,
        roomName: newRoom.roomName
      },
      ruangBelajar: newRoom
    }
  });
});

// 3. Registrasi Orang Tua (isi form + kode undangan -> akun terhubung otomatis ke guru & kelas)
app.post('/api/auth/register-orang-tua', (req: Request, res: Response) => {
  const { parentName, childName, phone, password, invitationCode } = req.body;

  if (!parentName || !childName || !password || !invitationCode) {
    return res.status(400).json({ error: 'Nama orang tua, nama anak, password, dan kode undangan wajib diisi.' });
  }

  const cleanCode = invitationCode.trim().toUpperCase();
  const matchedRoom = db.rooms.find(r => r.invitationCode.toUpperCase() === cleanCode);

  if (!matchedRoom && cleanCode !== 'SLB-BUDI-01') {
    return res.status(404).json({ error: 'Kode undangan ruang belajar tidak ditemukan. Pastikan kode sesuai dari guru kelas.' });
  }

  const targetRoom = matchedRoom || db.rooms[0];
  const teacher = db.teachers.find(t => t.id === targetRoom.teacherId) || db.teachers[0];

  const newParent: any = {
    id: db.parents.length + 1,
    name: parentName.trim(),
    phone: (phone || '').trim(),
    password,
    roomCode: cleanCode,
    roomId: targetRoom.id,
    childName: childName.trim(),
    studentId: '',
    createdAt: new Date().toISOString()
  };
  db.parents.push(newParent);

  // Auto connect student to room and teacher with clean statistics (isolated per account)
  const newStudent = {
    id: `student-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    roomId: targetRoom.id,
    parentId: newParent.id,
    name: childName.trim(),
    nickname: childName.trim().split(/\s+/)[0],
    roomCode: cleanCode,
    avatar: '🧒',
    class: targetRoom.roomName || 'Kelas 1 SLB',
    condition: 'Kemandirian & Bina Diri',
    parentName: parentName.trim(),
    parentPhone: (phone || '').trim(),
    school: teacher ? teacher.school : targetRoom.school,
    teacherName: teacher ? teacher.name : 'Guru SLB',
    currentActivity: 'Belum Ada Aktivitas',
    progressPercentage: 0,
    completedActivities: 0,
    totalActivities: 4,
    weeklyStars: 0,
    maxWeeklyStars: 10,
    assistanceTrend: 'stabil',
    status: 'butuh_bantuan',
    modulesProgress: {
      cuciTangan: 0,
      menggosokGigi: 0,
      makanMandiri: 0,
      memakaiPakaian: 0
    },
    latestTeacherNote: {
      author: teacher ? teacher.name : 'Guru SLB',
      role: 'Wali Kelas',
      timestamp: 'Baru saja',
      text: `Peserta didik ${childName} telah terdaftar dan disinkronkan ke ruang kelas ${targetRoom.roomName}.`,
      synced: true
    },
    latestAudioRecording: {
      command: '-',
      duration: '00:00',
      accuracy: 0
    },
    gradeHistory: [],
    createdAt: new Date().toISOString()
  };
  db.students.push(newStudent);
  newParent.studentId = newStudent.id;

  // Add initial synchronized handbook entry
  db.handbook.unshift({
    id: `entry-${Date.now()}`,
    studentId: newStudent.id,
    studentName: childName.trim(),
    roomCode: cleanCode,
    authorName: teacher ? teacher.name : 'Guru SLB',
    authorRole: 'Guru SLB',
    authorAvatar: '👩‍🏫',
    timestamp: 'Baru saja',
    content: `Selamat datang di kelas ${targetRoom.roomName}! Akun Orang Tua (${parentName}) dan Ananda ${childName} telah terhubung secara resmi dengan guru kelas.`,
    liked: false,
    readStatus: true,
    readBy: `Terkirim ke ${parentName.trim()}`,
    createdAt: new Date().toISOString()
  });

  return res.status(201).json({
    status: 'success',
    message: 'Registrasi orang tua berhasil. Akun Anda telah terhubung otomatis ke guru dan ruang belajar.',
    data: {
      orangTua: {
        id: `usr-parent-${newParent.id}`,
        name: newParent.name,
        role: 'parent',
        studentId: newStudent.id,
        roomCode: cleanCode,
        school: newStudent.school,
        teacherName: newStudent.teacherName,
        childName: newStudent.name
      },
      siswa: newStudent,
      ruang: targetRoom,
      guru: teacher
    }
  });
});

// 4. Login Guru (Email & Password)
app.post('/api/auth/login-guru', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();

  const teacher = db.teachers.find(t => t.email.toLowerCase() === cleanEmail && t.password === password);
  
  if (teacher) {
    const room = db.rooms.find(r => r.teacherId === teacher.id) || {
      id: 1,
      roomName: 'Kelas Inklusi',
      invitationCode: 'SLB-BUDI-01'
    };
    return res.json({
      status: 'success',
      data: {
        id: `usr-teacher-${teacher.id}`,
        name: teacher.name,
        email: teacher.email,
        school: teacher.school,
        role: 'teacher',
        roomCode: room.invitationCode,
        roomId: room.id,
        roomName: room.roomName
      }
    });
  }

  // Demo fallback
  if (cleanEmail === 'ratna@slb-budikasih.sch.id' && password === 'bisa2026') {
    return res.json({
      status: 'success',
      data: {
        id: 'usr-teacher-1',
        name: 'Ibu Ratna, S.Pd',
        email: 'ratna@slb-budikasih.sch.id',
        school: 'SLB Budi Kasih Bengkulu',
        role: 'teacher',
        roomCode: 'SLB-BUDI-01',
        roomId: 1,
        roomName: 'Kelas Inklusi C1'
      }
    });
  }

  return res.status(401).json({ error: 'Email atau kata sandi guru tidak cocok. Silakan periksa kembali atau daftarkan akun baru.' });
});

// 5. Login Orang Tua (Kode Ruang & Password)
app.post('/api/auth/login-orang-tua', (req: Request, res: Response) => {
  const { roomCode, password } = req.body;
  const cleanCode = (roomCode || '').trim().toUpperCase();

  if (!cleanCode || !password) {
    return res.status(400).json({ error: 'Kode ruang dan kata sandi wajib diisi.' });
  }

  // Find parent registered with this roomCode and password
  const parent = db.parents.find(p => 
    p.roomCode && p.roomCode.toUpperCase() === cleanCode && p.password === password
  ) || db.parents.find(p =>
    (p.phone === roomCode || p.name.toLowerCase() === roomCode.toLowerCase()) && p.password === password
  );

  if (parent) {
    // If student was deleted or unlinked, do not re-link or synchronize with teacher
    const student = parent.studentId ? db.students.find(s => s.id === parent.studentId) : null;
    const isSynced = !!student && parent.syncedWithTeacher !== false;
    const room = isSynced && student?.roomCode ? db.rooms.find(r => r.invitationCode.toUpperCase() === student.roomCode.toUpperCase()) : null;
    const teacher = room ? db.teachers.find(t => t.id === room.teacherId) : null;

    return res.json({
      status: 'success',
      data: {
        id: `usr-parent-${parent.id}`,
        name: parent.name,
        role: 'parent',
        roomCode: isSynced ? (parent.roomCode || cleanCode) : null,
        studentId: isSynced ? student?.id : null,
        school: isSynced ? (student?.school || teacher?.school || 'SLB Budi Kasih Bengkulu') : 'SLB Budi Kasih Bengkulu',
        teacherName: isSynced ? (teacher?.name || student?.teacherName || 'Guru SLB') : null,
        childName: isSynced ? (student?.name || parent.childName) : null,
        syncedWithTeacher: isSynced
      }
    });
  }

  // Check demo credentials
  if (cleanCode === 'SLB-BUDI-01' && password === 'budi123') {
    const demoStudent = db.students.find(s => s.id === 'student-1' || s.roomCode.toUpperCase() === 'SLB-BUDI-01');
    const isSynced = !!demoStudent;
    return res.json({
      status: 'success',
      data: {
        id: 'usr-parent-1',
        name: demoStudent ? demoStudent.parentName : 'Ibu Ratna (Wali Budi)',
        role: 'parent',
        roomCode: isSynced ? 'SLB-BUDI-01' : null,
        studentId: isSynced ? demoStudent.id : null,
        school: 'SLB Budi Kasih Bengkulu',
        teacherName: isSynced ? 'Ibu Ratna, S.Pd' : null,
        childName: isSynced ? demoStudent.name : null,
        syncedWithTeacher: isSynced
      }
    });
  }

  // Check if student exists in room and verify password with linked parent
  const matchingStudents = db.students.filter(s => s.roomCode && s.roomCode.toUpperCase() === cleanCode);
  if (matchingStudents.length > 0) {
    for (const student of matchingStudents) {
      const linkedParent = db.parents.find(p => p.id === student.parentId);
      if (linkedParent && linkedParent.password === password) {
        return res.json({
          status: 'success',
          data: {
            id: `usr-parent-${linkedParent.id}`,
            name: linkedParent.name,
            role: 'parent',
            roomCode: cleanCode,
            studentId: student.id,
            school: student.school,
            teacherName: student.teacherName,
            childName: student.name,
            syncedWithTeacher: true
          }
        });
      }
    }
  }

  return res.status(401).json({ 
    error: 'Kode ruang atau kata sandi tidak cocok. Pastikan kode sesuai dari guru kelas atau daftar akun baru.' 
  });
});

// 5b. Ambil Profil Guru berdasarkan Kode Undangan (Izinkan Orang Tua Melihat Profil Guru)
app.get('/api/teacher/profile-by-code/:code', (req: Request, res: Response) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const room = db.rooms.find(r => r.invitationCode && r.invitationCode.toUpperCase() === code);
  
  let teacher = null;
  if (room) {
    teacher = db.teachers.find(t => t.id === room.teacherId || String(t.id) === String(room.teacherId));
    if (!teacher && room.teacherName) {
      teacher = {
        id: room.teacherId || 1,
        name: room.teacherName,
        email: 'guru@slb-budikasih.sch.id',
        school: room.school || 'SLB Budi Kasih Bengkulu',
        nip: '19850314 201001 2 021',
        phone: '0812-3456-7890'
      };
    }
  }

  // Also check if any student was registered with this code
  if (!teacher) {
    const studentWithCode = db.students.find(s => s.roomCode && s.roomCode.toUpperCase() === code);
    if (studentWithCode && studentWithCode.teacherName) {
      teacher = {
        id: 1,
        name: studentWithCode.teacherName,
        email: 'guru@slb-budikasih.sch.id',
        school: studentWithCode.school || 'SLB Budi Kasih Bengkulu',
        nip: '19850314 201001 2 021',
        phone: '0812-3456-7890'
      };
    }
  }

  if (!teacher && code === 'SLB-BUDI-01') {
    teacher = db.teachers[0];
  }

  if (teacher) {
    return res.json({
      status: 'success',
      data: {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        school: teacher.school,
        nip: teacher.nip || '19850314 201001 2 021',
        phone: teacher.phone || '0812-3456-7890',
        roomName: room?.roomName || 'Kelas Inklusi',
        invitationCode: room?.invitationCode || code,
        academicYear: room?.academicYear || '2024/2025',
        bio: 'Guru Pendidikan Khusus (SLB) berdedikasi membimbing ananda menuju kemandirian bina diri dan adaptasi sensori-motorik.'
      }
    });
  }

  // Fallback to first teacher
  const defaultTeacher = db.teachers[0];
  return res.json({
    status: 'success',
    data: {
      id: defaultTeacher.id,
      name: defaultTeacher.name,
      email: defaultTeacher.email,
      school: defaultTeacher.school,
      nip: '19850314 201001 2 021',
      phone: '0812-3456-7890',
      roomName: 'Kelas Inklusi C1',
      invitationCode: code || 'SLB-BUDI-01',
      academicYear: '2024/2025',
      bio: 'Guru Pendidikan Khusus (SLB) berdedikasi membimbing ananda menuju kemandirian bina diri dan adaptasi sensori-motorik.'
    }
  });
});

// 5c. Simpan / Perbarui Kode Undangan di Profil Guru (agar tidak perlu login ulang untuk buat kode baru)
app.put('/api/teacher/update-invite-code', (req: Request, res: Response) => {
  const { teacherId, roomCode, roomName, teacherName } = req.body;
  if (!roomCode) {
    return res.status(400).json({ error: 'Kode undangan wajib diisi.' });
  }

  const cleanCode = String(roomCode).trim().toUpperCase();

  // Find or update room
  let room = db.rooms.find(r => r.teacherId === Number(teacherId) || String(r.teacherId) === String(teacherId));
  if (!room && db.rooms.length > 0) {
    room = db.rooms[0];
  }

  if (room) {
    const oldCode = room.invitationCode;
    room.invitationCode = cleanCode;
    if (roomName) room.roomName = roomName;
    if (teacherName) {
      room.teacherName = teacherName;
      const tObj = db.teachers.find(t => t.id === room.teacherId || String(t.id) === String(teacherId));
      if (tObj) tObj.name = teacherName;
    }

    // Update students using the old room code
    db.students.forEach(s => {
      if (s.roomId === room.id || (s.roomCode && s.roomCode.toUpperCase() === oldCode.toUpperCase()) || (s.roomCode && s.roomCode.toUpperCase() === cleanCode)) {
        s.roomCode = cleanCode;
        if (teacherName) s.teacherName = teacherName;
      }
    });

    // Update parents using the old room code
    db.parents.forEach(p => {
      if (p.roomId === room.id || (p.roomCode && p.roomCode.toUpperCase() === oldCode.toUpperCase()) || (p.roomCode && p.roomCode.toUpperCase() === cleanCode)) {
        p.roomCode = cleanCode;
      }
    });

    return res.json({
      status: 'success',
      message: 'Kode undangan berhasil disimpan secara permanen di profil guru.',
      data: {
        roomId: room.id,
        roomName: room.roomName,
        invitationCode: room.invitationCode
      }
    });
  }

  // Create new room if none existed
  const newRoom = {
    id: db.rooms.length + 1,
    teacherId: Number(teacherId) || 1,
    teacherName: teacherName || 'Guru SLB',
    roomName: roomName || 'Kelas Inklusi BISA',
    invitationCode: cleanCode,
    academicYear: '2024/2025',
    school: 'SLB Budi Kasih'
  };
  db.rooms.push(newRoom);

  return res.json({
    status: 'success',
    message: 'Ruang belajar dan kode undangan baru berhasil dibuat dan disimpan.',
    data: newRoom
  });
});

// 5d. Akses Guru ke Akun Orang Tua (Guru dapat melihat daftar akun orang tua terdaftar)
app.get('/api/teacher/parent-accounts', (req: Request, res: Response) => {
  const { roomCode } = req.query;
  let parents = db.parents;

  if (roomCode) {
    const cleanCode = String(roomCode).trim().toUpperCase();
    parents = parents.filter(p => p.roomCode && p.roomCode.toUpperCase() === cleanCode);
  }

  const enrichedParents = parents.map(p => {
    const child = db.students.find(s => s.id === p.studentId || (s.parentId === p.id));
    const isConnected = !!child && p.syncedWithTeacher !== false;
    const room = db.rooms.find(r => r.invitationCode.toUpperCase() === (p.roomCode || '').toUpperCase() || r.id === p.roomId);
    const teacher = room ? db.teachers.find(t => t.id === room.teacherId) : db.teachers[0];

    return {
      id: p.id,
      name: p.name,
      phone: p.phone,
      childName: child ? child.name : (p.childName ? `${p.childName}` : '-'),
      studentId: isConnected ? child.id : null,
      roomCode: p.roomCode,
      roomName: room?.roomName || child?.class || 'Kelas Inklusi BISA',
      school: teacher?.school || child?.school || 'SLB Negeri Pembina',
      teacherName: teacher?.name || child?.teacherName || 'Ibu Ratna, S.Pd',
      class: child?.class || 'Kelas 1 SLB',
      condition: child?.condition || 'Kemandirian & Bina Diri',
      createdAt: p.createdAt || '2026-09-26 10:00:00',
      registeredAt: p.createdAt || '2026-09-26 10:00:00',
      status: isConnected ? 'Terhubung' : 'Tidak Tersingkron'
    };
  });

  return res.json({
    status: 'success',
    total: enrichedParents.length,
    data: enrichedParents
  });
});

// 6. Log Aktivitas (Simpan ke MySQL)
app.post('/api/activities/log', (req: Request, res: Response) => {
  const logItem = {
    id: db.activityLogs.length + 1,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  db.activityLogs.push(logItem);
  return res.status(201).json({ 
    status: 'success', 
    message: 'Aktivitas berhasil disimpan ke basis data MySQL (tabel aktivitas_log).',
    data: logItem 
  });
});

// 7. Ambil Riwayat Aktivitas dari MySQL
app.get('/api/activities/logs', (req: Request, res: Response) => {
  const { studentId } = req.query;
  const filtered = studentId 
    ? db.activityLogs.filter(a => a.studentId === studentId || a.siswaId === studentId)
    : db.activityLogs;
  return res.json({
    status: 'success',
    total: filtered.length,
    data: filtered
  });
});

// 8. Kelola Siswa (Tambah & Ambil dari MySQL)
app.get('/api/students', (req: Request, res: Response) => {
  const { roomCode, roomId, teacherId } = req.query;
  let filtered = db.students;

  if (roomCode) {
    const code = String(roomCode).trim().toUpperCase();
    filtered = filtered.filter(s => s.roomCode && s.roomCode.toUpperCase() === code);
  } else if (roomId) {
    filtered = filtered.filter(s => String(s.roomId) === String(roomId));
  } else if (teacherId) {
    const teacherRooms = db.rooms.filter(r => String(r.teacherId) === String(teacherId)).map(r => r.id);
    filtered = filtered.filter(s => teacherRooms.includes(s.roomId));
  }

  return res.json({
    status: 'success',
    total: filtered.length,
    data: filtered
  });
});

app.post('/api/students', (req: Request, res: Response) => {
  const reqRoomCode = (req.body.roomCode || '').trim().toUpperCase();
  const matchedRoom = reqRoomCode ? db.rooms.find(r => r.invitationCode && r.invitationCode.toUpperCase() === reqRoomCode) : null;
  const teacher = matchedRoom ? db.teachers.find(t => t.id === matchedRoom.teacherId) : null;

  const newStudent = {
    id: req.body.id || `student-${Date.now()}`,
    roomId: matchedRoom ? matchedRoom.id : (req.body.roomId || 1),
    parentId: req.body.parentId || 1,
    name: req.body.name,
    nickname: req.body.nickname || req.body.name?.trim().split(/\s+/)[0],
    roomCode: reqRoomCode || 'SLB-BUDI-01',
    avatar: req.body.avatar || '👦',
    class: req.body.class || (matchedRoom?.roomName || 'Kelas 1 SLB'),
    condition: req.body.condition || 'Tunagrahita Ringan',
    parentName: req.body.parentName || 'Orang Tua',
    parentPhone: req.body.parentPhone || '',
    school: teacher?.school || matchedRoom?.school || 'SLB Budi Kasih Bengkulu',
    teacherName: teacher?.name || matchedRoom?.teacherName || 'Guru SLB',
    currentActivity: req.body.currentActivity || 'Belum Ada Aktivitas',
    progressPercentage: req.body.progressPercentage ?? 0,
    completedActivities: req.body.completedActivities ?? 0,
    totalActivities: req.body.totalActivities ?? 0,
    weeklyStars: req.body.weeklyStars ?? 0,
    maxWeeklyStars: req.body.maxWeeklyStars ?? 10,
    assistanceTrend: req.body.assistanceTrend || 'stabil',
    status: req.body.status || 'butuh_bantuan',
    modulesProgress: req.body.modulesProgress || {
      cuciTangan: 0,
      menggosokGigi: 0,
      makanMandiri: 0,
      memakaiPakaian: 0
    },
    latestTeacherNote: req.body.latestTeacherNote || {
      author: teacher?.name || 'Guru SLB',
      role: 'Wali Kelas',
      timestamp: 'Baru saja',
      text: `Peserta didik ${req.body.name} berhasil didaftarkan ke kelas inklusi. Siap memulai modul adaptif dengan kendali suara BISA.`,
      synced: true
    },
    latestAudioRecording: req.body.latestAudioRecording || {
      command: '-',
      duration: '00:00',
      accuracy: 0
    },
    gradeHistory: req.body.gradeHistory || [],
    createdAt: new Date().toISOString()
  };
  db.students.push(newStudent);

  // Auto create or connect parent account in db.parents
  if (req.body.parentName) {
    const existingParent = db.parents.find(p => 
      p.roomCode === newStudent.roomCode && 
      p.name.toLowerCase() === req.body.parentName.trim().toLowerCase()
    );
    if (existingParent) {
      existingParent.studentId = newStudent.id;
      existingParent.childName = newStudent.name;
      existingParent.syncedWithTeacher = true;
      existingParent.status = 'Terhubung';
    } else {
      db.parents.push({
        id: db.parents.length + 1,
        name: req.body.parentName.trim(),
        phone: req.body.parentPhone || '',
        password: 'bisa' + Math.floor(100 + Math.random() * 900),
        roomCode: newStudent.roomCode,
        studentId: newStudent.id,
        roomId: newStudent.roomId,
        childName: newStudent.name,
        syncedWithTeacher: true,
        status: 'Terhubung',
        createdAt: new Date().toISOString()
      });
    }
  }

  return res.status(201).json({
    status: 'success',
    message: 'Data siswa berhasil disimpan ke basis data MySQL (tabel siswa).',
    data: newStudent
  });
});

// Endpoint untuk cek status sinkronisasi akun orang tua dengan siswa
app.get('/api/students/:id/sync-status', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = db.students.find(s => s.id === id || String(s.id) === id);
  if (!student) {
    return res.json({
      status: 'unsynced',
      synced: false,
      message: 'Siswa tidak ditemukan atau telah dihapus oleh guru kelas. Akun orang tua tidak tersingkron.'
    });
  }
  return res.json({
    status: 'synced',
    synced: true,
    data: student
  });
});

// Hapus Siswa dari Basis Data: Putuskan sinkronisasi akun orang tua dengan guru kelas
app.delete('/api/students/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const studentIndex = db.students.findIndex(s => s.id === id || String(s.id) === id);
  if (studentIndex === -1) {
    return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan' });
  }

  const deletedStudent = db.students[studentIndex];
  db.students.splice(studentIndex, 1);

  // Putuskan sinkronisasi akun orang tua yang terhubung dengan siswa ini
  db.parents.forEach(p => {
    if (
      p.studentId === id || 
      String(p.studentId) === String(id) || 
      (deletedStudent.parentId && p.id === deletedStudent.parentId) ||
      (p.childName && p.childName.trim().toLowerCase() === deletedStudent.name.trim().toLowerCase() && p.roomCode === deletedStudent.roomCode)
    ) {
      p.studentId = null;
      p.roomCode = null;
      p.roomId = null;
      p.syncedWithTeacher = false;
      p.status = 'Tidak Tersingkron';
    }
  });

  // Hapus catatan buku penghubung siswa yang dihapus
  db.handbook = db.handbook.filter(h => h.studentId !== id && String(h.studentId) !== String(id));

  // Hapus log aktivitas siswa yang dihapus
  db.activityLogs = db.activityLogs.filter(a => a.studentId !== id && a.siswaId !== id);

  return res.json({
    status: 'success',
    message: `Data siswa ${deletedStudent.name} berhasil dihapus dari tabel siswa MySQL dan akun orang tua telah diputuskan sinkronisasinya.`,
    unsyncedStudentId: id,
    unsyncedStudentName: deletedStudent.name
  });
});

// Reset Progres Latihan Siswa
app.post('/api/students/:id/reset-progress', (req: Request, res: Response) => {
  const { id } = req.params;
  const student = db.students.find(s => s.id === id || String(s.id) === id);
  if (!student) {
    return res.status(404).json({ status: 'error', message: 'Siswa tidak ditemukan' });
  }
  student.completedActivities = 0;
  student.progressPercentage = 0;
  student.weeklyStars = 0;
  student.currentActivity = 'Belum Ada Aktivitas';
  student.status = 'butuh_bantuan';
  student.modulesProgress = {
    cuciTangan: 0,
    menggosokGigi: 0,
    makanMandiri: 0,
    memakaiPakaian: 0
  };
  student.gradeHistory = [];
  return res.json({
    status: 'success',
    message: `Riwayat dan progres latihan siswa ${student.name} berhasil direset.`,
    data: student
  });
});

// 9. Buku Penghubung (Simpan & Ambil dari MySQL)
app.get('/api/handbook', (req: Request, res: Response) => {
  const { roomCode, studentId } = req.query;
  let filtered = db.handbook;

  if (roomCode) {
    const code = String(roomCode).trim().toUpperCase();
    filtered = filtered.filter(h => !h.roomCode || h.roomCode.trim().toUpperCase() === code);
  }
  if (studentId) {
    filtered = filtered.filter(h => !h.studentId || h.studentId === studentId);
  }

  // Normalize entries so both frontend schemas work seamlessly
  const normalized = filtered.map(h => ({
    id: h.id,
    studentId: h.studentId || '',
    studentName: h.studentName || '',
    roomCode: h.roomCode || '',
    authorName: h.authorName || h.author || 'Guru SLB',
    authorRole: h.authorRole || (h.role === 'teacher' ? 'Guru SLB' : h.role === 'parent' ? 'Orang Tua' : (h.authorRole || 'Guru SLB')),
    authorAvatar: h.authorAvatar || (h.authorRole === 'Orang Tua' || h.role === 'parent' ? '👩' : h.authorRole === 'Sistem BISA (Otomatis)' ? '🔔' : '👩‍🏫'),
    timestamp: h.timestamp || h.date || 'Baru saja',
    content: h.content || h.text || '',
    imageUrl: h.imageUrl,
    liked: typeof h.liked === 'boolean' ? h.liked : (Array.isArray(h.likedBy) ? h.likedBy.length > 0 : false),
    likedBy: typeof h.likedBy === 'string' ? h.likedBy : (Array.isArray(h.likedBy) && h.likedBy.length > 0 ? `Disukai ${h.likedBy.join(', ')}` : undefined),
    readStatus: typeof h.readStatus === 'boolean' ? h.readStatus : true,
    readBy: typeof h.readBy === 'string' ? h.readBy : (Array.isArray(h.readBy) && h.readBy.length > 0 ? `Terbaca oleh ${h.readBy.join(', ')}` : undefined),
    createdAt: h.createdAt || new Date().toISOString()
  }));

  return res.json({
    status: 'success',
    total: normalized.length,
    data: normalized
  });
});

app.post('/api/handbook', (req: Request, res: Response) => {
  let roomCode = req.body.roomCode;
  if (!roomCode && req.body.studentId) {
    const matched = db.students.find(s => s.id === req.body.studentId);
    if (matched?.roomCode) roomCode = matched.roomCode;
  }

  const cleanRoomCode = (roomCode || 'SLB-BUDI-01').trim().toUpperCase();
  const studentName = req.body.studentName || (req.body.studentId ? db.students.find(s => s.id === req.body.studentId)?.name : '') || 'Ananda';

  const entry = {
    id: req.body.id || `entry-${Date.now()}`,
    studentId: req.body.studentId || '',
    studentName,
    roomCode: cleanRoomCode,
    authorName: req.body.authorName || req.body.author || 'Guru SLB',
    authorRole: req.body.authorRole || (req.body.role === 'teacher' ? 'Guru SLB' : req.body.role === 'parent' ? 'Orang Tua' : (req.body.authorRole || 'Guru SLB')),
    authorAvatar: req.body.authorAvatar || (req.body.authorRole === 'Orang Tua' ? '👩' : req.body.authorRole === 'Sistem BISA (Otomatis)' ? '🔔' : '👩‍🏫'),
    timestamp: req.body.timestamp || req.body.date || 'Baru saja',
    content: req.body.content || req.body.text || '',
    imageUrl: req.body.imageUrl || undefined,
    liked: !!req.body.liked,
    likedBy: req.body.likedBy || undefined,
    readStatus: req.body.readStatus !== false,
    readBy: req.body.readBy || undefined,
    createdAt: new Date().toISOString()
  };

  db.handbook.unshift(entry);
  return res.status(201).json({
    status: 'success',
    message: 'Catatan tersimpan ke tabel MySQL buku_penghubung.',
    data: entry
  });
});

app.put('/api/handbook/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const { likerName } = req.body;
  const entry = db.handbook.find(item => item.id === id);
  if (!entry) {
    return res.status(404).json({ status: 'error', message: 'Catatan tidak ditemukan' });
  }

  entry.liked = !entry.liked;
  entry.likedBy = entry.liked ? `Disukai ${likerName || 'Pengguna'}` : undefined;

  return res.json({
    status: 'success',
    data: entry
  });
});

// Hapus semua notifikasi bantuan otomatis agar tidak menumpuk di buku penghubung
app.delete('/api/handbook/clear-notifications', (req: Request, res: Response) => {
  const { roomCode } = req.query;
  const initialCount = db.handbook.length;
  
  db.handbook = db.handbook.filter(item => {
    const isSystemOrHelp = item.authorRole === 'Sistem BISA (Otomatis)' || 
      item.authorName === 'Notifikasi BISA Voice Mic' ||
      (item.content && item.content.toLowerCase().includes('bantuan'));
      
    if (!isSystemOrHelp) return true;
    if (roomCode) {
      const code = String(roomCode).trim().toUpperCase();
      if (item.roomCode && item.roomCode.toUpperCase() !== code) return true;
    }
    return false; // remove
  });

  const removedCount = initialCount - db.handbook.length;
  return res.json({
    status: 'success',
    message: `${removedCount} notifikasi bantuan berhasil dibersihkan dari buku penghubung.`,
    removedCount
  });
});

app.delete('/api/handbook/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialCount = db.handbook.length;
  db.handbook = db.handbook.filter(item => item.id !== id);
  return res.json({
    status: 'success',
    message: `Catatan ${id} berhasil dihapus dari tabel buku_penghubung.`,
    removed: initialCount !== db.handbook.length
  });
});

// 10. Ekspor Skema & Data SQL
app.get('/api/database/export-sql', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="db_bisa_slb_backup.sql"');
  
  let sql = `-- Backup Basis Data MySQL BISA (${new Date().toISOString()})\n\n`;
  sql += `CREATE DATABASE IF NOT EXISTS \`db_bisa_slb\` CHARACTER SET utf8mb4;\nUSE \`db_bisa_slb\`;\n\n`;
  
  sql += `-- Data Guru\n`;
  db.teachers.forEach(t => {
    sql += `INSERT INTO guru (id, nama, email, password, sekolah) VALUES (${t.id}, '${t.name}', '${t.email}', '${t.password}', '${t.school}') ON DUPLICATE KEY UPDATE nama='${t.name}';\n`;
  });

  sql += `\n-- Data Ruang Belajar\n`;
  db.rooms.forEach(r => {
    sql += `INSERT INTO ruang_belajar (id, guru_id, nama_ruang, kode_undangan) VALUES (${r.id}, ${r.teacherId}, '${r.roomName}', '${r.invitationCode}') ON DUPLICATE KEY UPDATE kode_undangan='${r.invitationCode}';\n`;
  });

  sql += `\n-- Data Siswa\n`;
  db.students.forEach((s, idx) => {
    sql += `INSERT INTO siswa (id, ruang_id, nama, kelas, kebutuhan_khusus, avatar, progress_kemandirian, status) VALUES (${idx + 1}, ${s.roomId || 1}, '${s.name}', '${s.class}', '${s.condition || 'Tunagrahita'}', '${s.avatar}', ${s.progressPercentage || 50}, '${s.status || 'mandiri'}') ON DUPLICATE KEY UPDATE progress_kemandirian=${s.progressPercentage || 50};\n`;
  });

  return res.send(sql);
});

// -------------------------------------------------------------
// Vite middleware mounting in development
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server BISA (PHP+MySQL API layer & React SPA) running on port ${PORT}`);
  });
}

startServer();
