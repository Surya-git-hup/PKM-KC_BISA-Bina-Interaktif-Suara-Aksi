import { BinaDiriModule, StudentProgress, HandbookEntry, DailyNotification } from '../types';

export const BINA_DIRI_MODULES: BinaDiriModule[] = [
  {
    id: 'cuci-tangan',
    title: 'Cuci Tangan',
    subtitle: 'Tahap Mandiri 6 Langkah',
    category: 'Kebersihan Diri',
    image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
    duration: '3-5 Menit',
    totalSteps: 6,
    badgeName: 'Juara Cuci Tangan Bersih',
    badgeDesc: 'Rian berhasil memutar keran, memakai sabun wangi, dan mengeringkan tangan sendiri tanpa bantuan!',
    badgeIcon: '🧼',
    equipment: [
      {
        id: 1,
        name: 'Sabun Cuci Tangan',
        description: 'Membuat tangan wangi, berbusa lembut, dan mengusir kuman!',
        soundCue: 'sabun',
        soundDescription: 'Keluarkan satu pompa sabun cair wangi.',
        iconType: 'soap'
      },
      {
        id: 2,
        name: 'Air Bersih Mengalir',
        description: 'Membilas kuman dan sabun hingga tangan bersih kesat.',
        soundCue: 'air',
        soundDescription: 'Suara air gemericik segar dari keran.',
        iconType: 'water'
      },
      {
        id: 3,
        name: 'Handuk Bersih',
        description: 'Kain lembut untuk mengusap air dari kedua tangan.',
        soundCue: 'handuk',
        soundDescription: 'Usap kedua telapak tangan dengan lembut.',
        iconType: 'towel'
      },
      {
        id: 4,
        name: 'Tisu Pengering',
        description: 'Alternatif higienis untuk mengeringkan tangan sampai kering.',
        soundCue: 'tisu',
        soundDescription: 'Ambil selembar tisu kering yang bersih.',
        iconType: 'tissue'
      }
    ],
    steps: [
      {
        id: 1,
        stepNumber: 1,
        instruction: 'Buka keran air.',
        voiceText: 'Langkah satu: Ayo buka keran air sampai air mengalir lembut.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Basahi kedua tangan dengan air bersih yang mengalir.'
      },
      {
        id: 2,
        stepNumber: 2,
        instruction: 'Tuang sabun ke telapak tangan.',
        voiceText: 'Langkah dua: Tekan pompa sabun satu kali ke telapak tanganmu.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Ratakan sabun sampai muncul busa putih yang wangi.'
      },
      {
        id: 3,
        stepNumber: 3,
        instruction: 'Gosok sela-sela jari tangan.',
        voiceText: 'Langkah tiga: Kaitkan jarimu dan gosok sela-sela jari sampai bersih.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Jangan lupa gosok juga punggung tangan kanan dan kiri.'
      },
      {
        id: 4,
        stepNumber: 4,
        instruction: 'Gosok kedua ujung ibu jari dan kuku.',
        voiceText: 'Langkah empat: Putar ibu jarimu dan gosok ujung kuku dengan lembut.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Kuman di balik kuku akan hilang saat digosok bersih.'
      },
      {
        id: 5,
        stepNumber: 5,
        instruction: 'Bilas tangan dengan air mengalir.',
        voiceText: 'Langkah lima: Taruh tangan di bawah aliran air sampai busa sabun hilang.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Pastikan tidak ada sisa busa yang licin di tangan.'
      },
      {
        id: 6,
        stepNumber: 6,
        instruction: 'Tutup keran dan keringkan tangan.',
        voiceText: 'Langkah enam: Tutup keran air, lalu keringkan tangan dengan handuk bersih.',
        image: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`,
        tip: 'Tanganmu kini harum, bersih, dan bebas kuman!'
      }
    ]
  },
  {
    id: 'gosok-gigi',
    title: 'Gosok Gigi',
    subtitle: 'Respons Suara Mandiri',
    category: 'Kebersihan Diri',
    image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
    duration: '3-4 Menit',
    totalSteps: 5,
    badgeName: 'Bintang Gigi Sehat Berkilau',
    badgeDesc: 'Rian menyikat gigi depan, samping, dan berkumur dengan tertib dan mandiri!',
    badgeIcon: '🪥',
    equipment: [
      {
        id: 1,
        name: 'Sikat Gigi Halus',
        description: 'Bulu sikat lembut yang pas untuk mulut anak.',
        soundCue: 'sikat',
        soundDescription: 'Pegang gagang sikat gigi dengan nyaman.',
        iconType: 'toothbrush'
      },
      {
        id: 2,
        name: 'Pasta Gigi Anak',
        description: 'Pasta gigi beraroma buah yang aman dan menyegarkan.',
        soundCue: 'odol',
        soundDescription: 'Keluarkan pasta gigi seukuran biji jagung.',
        iconType: 'paste'
      },
      {
        id: 3,
        name: 'Gelas Kumur',
        description: 'Gelas kecil berisi air matang untuk berkumur.',
        soundCue: 'gelas',
        soundDescription: 'Isi air secukupnya ke dalam gelas kumur.',
        iconType: 'cup'
      },
      {
        id: 4,
        name: 'Air Bersih',
        description: 'Air bersih untuk membilas sikat dan berkumur.',
        soundCue: 'air',
        soundDescription: 'Gunakan air bersih untuk berkumur.',
        iconType: 'water'
      }
    ],
    steps: [
      {
        id: 1,
        stepNumber: 1,
        instruction: 'Oleskan pasta gigi ke sikat.',
        voiceText: 'Langkah satu: Buka tutup pasta gigi dan taruh sedikit di atas bulu sikat.',
        image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
        tip: 'Cukup gunakan pasta gigi sebesar biji jagung.'
      },
      {
        id: 2,
        stepNumber: 2,
        instruction: 'Sikat gigi bagian depan secara memutar.',
        voiceText: 'Langkah dua: Rapatkan gigi depan dan sikat dengan gerakan memutar bulat-bulat.',
        image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
        tip: 'Sikat perlahan seperti membuat lingkaran kecil di depan cermin.'
      },
      {
        id: 3,
        stepNumber: 3,
        instruction: 'Sikat gigi bagian dalam dan geraham.',
        voiceText: 'Langkah tiga: Buka mulut sedikit dan sikat gigi bagian samping kiri dan kanan.',
        image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
        tip: 'Gerakkan maju mundur untuk membersihkan sisa makanan.'
      },
      {
        id: 4,
        stepNumber: 4,
        instruction: 'Berkumur dengan air bersih lalu buang.',
        voiceText: 'Langkah empat: Ambil air dengan gelas, kumur di mulut, lalu buang ke wastafel.',
        image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
        tip: 'Jangan ditelan ya, buang air kumurnya ke saluran air.'
      },
      {
        id: 5,
        stepNumber: 5,
        instruction: 'Cuci sikat gigi dan simpan tegak.',
        voiceText: 'Langkah lima: Bilas bulu sikat gigi di bawah air mengalir dan letakkan tegak.',
        image: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`,
        tip: 'Gigimu kini bersih, berkilau, dan nafasmu wangi!'
      }
    ]
  },
  {
    id: 'makan-mandiri',
    title: 'Makan Mandiri',
    subtitle: 'Pembiasaan Sendok & Garpu',
    category: 'Makan & Minum',
    image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
    duration: '5-10 Menit',
    totalSteps: 5,
    badgeName: 'Pahlawan Meja Makan Rapi',
    badgeDesc: 'Rian makan dengan duduk tertib, menyuap mandiri tanpa tumpah, dan merapikan alat makan!',
    badgeIcon: '🍽️',
    equipment: [
      {
        id: 1,
        name: 'Piring Sekat / Mangkuk',
        description: 'Wadah makanan bersekat yang tidak mudah pecah.',
        soundCue: 'piring',
        soundDescription: 'Letakkan piring tepat di depanmu.',
        iconType: 'plate'
      },
      {
        id: 2,
        name: 'Sendok Makan Anak',
        description: 'Sendok berujung tumpul yang pas di genggaman tangan.',
        soundCue: 'sendok',
        soundDescription: 'Genggam pegangan sendok dengan tangan kanan.',
        iconType: 'spoon'
      },
      {
        id: 3,
        name: 'Gelas Minum Bertangkai',
        description: 'Gelas yang mudah dipegang untuk minum air putih.',
        soundCue: 'gelas',
        soundDescription: 'Pegang kedua gagang cangkir saat minum.',
        iconType: 'cup'
      },
      {
        id: 4,
        name: 'Serbet / Celemek Makan',
        description: 'Melindungi pakaian dari noda makanan.',
        soundCue: 'serbet',
        soundDescription: 'Pasang serbet di depan dada.',
        iconType: 'bib'
      }
    ],
    steps: [
      {
        id: 1,
        stepNumber: 1,
        instruction: 'Duduk tegak dan berdoa sebelum makan.',
        voiceText: 'Langkah satu: Ayo duduk tertib di kursi makan dan berdoa sebelum mulai makan.',
        image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
        tip: 'Pastikan tangan sudah dicuci bersih sebelum menyentuh makanan.'
      },
      {
        id: 2,
        stepNumber: 2,
        instruction: 'Pegang sendok dengan tangan kanan.',
        voiceText: 'Langkah dua: Genggam sendok dengan nyaman menggunakan tangan kananmu.',
        image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
        tip: 'Posisikan jari memegang tangkai sendok dengan kokoh.'
      },
      {
        id: 3,
        stepNumber: 3,
        instruction: 'Ambil makanan secukupnya dan suap ke mulut.',
        voiceText: 'Langkah tiga: Sendok makanan perlahan, lalu suap ke dalam mulut tanpa terburu-buru.',
        image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
        tip: 'Kunyah makanan sampai lembut sebelum menelan.'
      },
      {
        id: 4,
        stepNumber: 4,
        instruction: 'Minum air putih dengan kedua tangan.',
        voiceText: 'Langkah empat: Angkat gelas minum perlahan dengan kedua tangan, lalu teguk airnya.',
        image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
        tip: 'Minum sedikit demi sedikit agar tidak tersedak.'
      },
      {
        id: 5,
        stepNumber: 5,
        instruction: 'Rapikan piring dan lap mulut dengan tisu.',
        voiceText: 'Langkah lima: Bersihkan mulut dengan tisu dan letakkan sendok di atas piring.',
        image: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`,
        tip: 'Meja makan tetap rapi dan bersih. Hebat sekali!'
      }
    ]
  },
  {
    id: 'memakai-pakaian',
    title: 'Memakai Pakaian',
    subtitle: 'Latihan Kaus & Kancing',
    category: 'Berpakaian',
    image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
    duration: '4-6 Menit',
    totalSteps: 5,
    badgeName: 'Bintang Busana Mandiri',
    badgeDesc: 'Rian berhasil mengenakan kaus dan memasang kancing baju dengan sabar dan rapi!',
    badgeIcon: '👕',
    equipment: [
      {
        id: 1,
        name: 'Kaus / Kemeja Bersih',
        description: 'Baju santai dengan label di bagian belakang.',
        soundCue: 'baju',
        soundDescription: 'Siapkan baju favorit yang bersih dan wangi.',
        iconType: 'shirt'
      },
      {
        id: 2,
        name: 'Cermin Kecil',
        description: 'Membantu anak memeriksa posisi baju dan kancing.',
        soundCue: 'cermin',
        soundDescription: 'Lihat pantulan diri di cermin.',
        iconType: 'mirror'
      },
      {
        id: 3,
        name: 'Gantungan Baju',
        description: 'Tempat menggantung pakaian sebelum dan sesudah dipakai.',
        soundCue: 'hanger',
        soundDescription: 'Lepas baju dari gantungan pakaian.',
        iconType: 'hanger'
      },
      {
        id: 4,
        name: 'Keranjang Baju Kotor',
        description: 'Tempat menaruh baju yang sudah dipakai.',
        soundCue: 'keranjang',
        soundDescription: 'Taruh baju kotor ke dalam keranjang.',
        iconType: 'basket'
      }
    ],
    steps: [
      {
        id: 1,
        stepNumber: 1,
        instruction: 'Cari label baju di bagian leher belakang.',
        voiceText: 'Langkah satu: Pegang bajumu dan temukan label di leher bagian belakang.',
        image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
        tip: 'Bagian berlabel menghadap ke belakang badan kita.'
      },
      {
        id: 2,
        stepNumber: 2,
        instruction: 'Masukkan kepala ke lubang kerah baju.',
        voiceText: 'Langkah dua: Buka kerah baju lebar-lebar dan masukkan kepalamu dengan nyaman.',
        image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
        tip: 'Kepalamu akan muncul di atas lubang baju.'
      },
      {
        id: 3,
        stepNumber: 3,
        instruction: 'Masukkan tangan kanan ke lengan baju.',
        voiceText: 'Langkah tiga: Dorong tangan kananmu keluar melalui lubang lengan baju kanan.',
        image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
        tip: 'Ujung jemari tangan akan keluar dengan pas.'
      },
      {
        id: 4,
        stepNumber: 4,
        instruction: 'Masukkan tangan kiri ke lengan baju.',
        voiceText: 'Langkah empat: Sekarang dorong tangan kirimu keluar melalui lengan baju kiri.',
        image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
        tip: 'Kedua tanganmu kini sudah masuk ke dalam lengan baju.'
      },
      {
        id: 5,
        stepNumber: 5,
        instruction: 'Tarik baju ke bawah dan rapikan di cermin.',
        voiceText: 'Langkah lima: Tarik bagian bawah baju ke bawah dan bercerminlah dengan rapi.',
        image: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`,
        tip: 'Bajumu sudah terpasang dengan rapi dan keren!'
      }
    ]
  }
];

export const INITIAL_STUDENTS: StudentProgress[] = [
  {
    id: 'budi-pratama',
    name: 'Budi Pratama',
    nickname: 'Budi',
    roomCode: 'SLB-BUDI-01',
    avatar: '👦',
    class: 'Kelas 1 SLB',
    condition: 'Tunagrahita Ringan',
    parentName: 'Ibu Dewi Pratama',
    parentPhone: '0812-7890-4412',
    currentActivity: 'Cuci Tangan 7 Langkah',
    status: 'mandiri',
    progressPercentage: 85,
    completedActivities: 18,
    totalActivities: 25,
    weeklyStars: 8,
    maxWeeklyStars: 10,
    assistanceTrend: 'menurun',
    modulesProgress: {
      cuciTangan: 100,
      menggosokGigi: 75,
      makanMandiri: 60,
      memakaiPakaian: 40
    },
    latestTeacherNote: {
      author: 'Ibu Ratna, S.Pd',
      role: 'Wali Kelas C1',
      timestamp: 'Hari ini, 10:15 WIB',
      text: 'Budi sangat cepat merespons instruksi saat mengalirkan air keran. Pembiasaan di rumah sangat mendukung kemajuannya.',
      synced: true
    },
    latestAudioRecording: {
      command: 'Lanjut!',
      duration: '00:04',
      accuracy: 92
    },
    gradeHistory: [
      { period: 'Pekan 1 Agu', score: 62, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 2 Agu', score: 68, verbalPromptLevel: 3, status: 'Meningkat' },
      { period: 'Pekan 3 Agu', score: 74, verbalPromptLevel: 3, status: 'Meningkat' },
      { period: 'Pekan 4 Agu', score: 79, verbalPromptLevel: 4, status: 'Meningkat' },
      { period: 'Pekan 1 Sep', score: 82, verbalPromptLevel: 4, status: 'Meningkat' },
      { period: 'Pekan 2 Sep', score: 85, verbalPromptLevel: 5, status: 'Meningkat' }
    ]
  },
  {
    id: 'siti-rahma',
    name: 'Siti Rahma',
    nickname: 'Siti',
    roomCode: 'SLB-SITI-02',
    avatar: '👧',
    class: 'Kelas 2 SLB',
    condition: 'Disabilitas Intelektual Ringan',
    parentName: 'Bapak Ahmad',
    parentPhone: '0813-6621-9011',
    currentActivity: 'Gosok Gigi Mandiri',
    status: 'suara',
    progressPercentage: 70,
    completedActivities: 14,
    totalActivities: 25,
    weeklyStars: 7,
    maxWeeklyStars: 10,
    assistanceTrend: 'menurun',
    modulesProgress: {
      cuciTangan: 85,
      menggosokGigi: 70,
      makanMandiri: 50,
      memakaiPakaian: 35
    },
    latestTeacherNote: {
      author: 'Ibu Ratna, S.Pd',
      role: 'Wali Kelas C1',
      timestamp: 'Kemarin, 11:00 WIB',
      text: 'Siti aktif merespons perintah suara "Lanjut" saat menyikat gigi bagian depan.',
      synced: true
    },
    latestAudioRecording: {
      command: 'Ulangi!',
      duration: '00:03',
      accuracy: 88
    },
    gradeHistory: [
      { period: 'Pekan 1 Agu', score: 50, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 2 Agu', score: 58, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 3 Agu', score: 63, verbalPromptLevel: 3, status: 'Meningkat' },
      { period: 'Pekan 4 Agu', score: 66, verbalPromptLevel: 3, status: 'Meningkat' },
      { period: 'Pekan 1 Sep', score: 69, verbalPromptLevel: 4, status: 'Meningkat' },
      { period: 'Pekan 2 Sep', score: 70, verbalPromptLevel: 4, status: 'Meningkat' }
    ]
  },
  {
    id: 'andi-wijaya',
    name: 'Andi Wijaya',
    nickname: 'Andi',
    roomCode: 'SLB-ANDI-03',
    avatar: '👦',
    class: 'Kelas 1 SLB',
    condition: 'Tunagrahita Sedang',
    parentName: 'Ibu Anita Wijaya',
    parentPhone: '0821-4455-6677',
    currentActivity: 'Persiapan Memakai Pakaian',
    status: 'butuh_bantuan',
    progressPercentage: 45,
    completedActivities: 8,
    totalActivities: 25,
    weeklyStars: 4,
    maxWeeklyStars: 10,
    assistanceTrend: 'stabil',
    modulesProgress: {
      cuciTangan: 60,
      menggosokGigi: 45,
      makanMandiri: 40,
      memakaiPakaian: 35
    },
    latestTeacherNote: {
      author: 'Ibu Ratna, S.Pd',
      role: 'Wali Kelas C1',
      timestamp: 'Kemarin, 09:30 WIB',
      text: 'Andi mulai mengenali bagian depan dan belakang baju secara mandiri.',
      synced: true
    },
    latestAudioRecording: {
      command: 'Bantuan!',
      duration: '00:04',
      accuracy: 85
    },
    gradeHistory: [
      { period: 'Pekan 1 Agu', score: 40, verbalPromptLevel: 1, status: 'Perlu Bimbingan' },
      { period: 'Pekan 2 Agu', score: 42, verbalPromptLevel: 2, status: 'Stabil' },
      { period: 'Pekan 3 Agu', score: 45, verbalPromptLevel: 2, status: 'Meningkat' }
    ]
  },
  {
    id: 'doni-kusuma',
    name: 'Doni Kusuma',
    nickname: 'Doni',
    roomCode: 'SLB-DONI-03',
    avatar: '🧒',
    class: 'Kelas 2 SLB',
    condition: 'Tunagrahita Ringan',
    parentName: 'Ibu Linda',
    parentPhone: '0821-9988-3112',
    currentActivity: 'Makan & Minum Mandiri',
    status: 'mandiri',
    progressPercentage: 90,
    completedActivities: 22,
    totalActivities: 25,
    weeklyStars: 9,
    maxWeeklyStars: 10,
    assistanceTrend: 'menurun',
    modulesProgress: {
      cuciTangan: 95,
      menggosokGigi: 90,
      makanMandiri: 90,
      memakaiPakaian: 65
    },
    latestTeacherNote: {
      author: 'Ibu Ratna, S.Pd',
      role: 'Wali Kelas C1',
      timestamp: '2 hari lalu',
      text: 'Doni memegang sendok dengan sangat mantap dan minum tanpa tumpah.',
      synced: true
    },
    latestAudioRecording: {
      command: 'Selesai!',
      duration: '00:05',
      accuracy: 94
    },
    gradeHistory: [
      { period: 'Pekan 1 Agu', score: 70, verbalPromptLevel: 3, status: 'Meningkat' },
      { period: 'Pekan 2 Agu', score: 75, verbalPromptLevel: 4, status: 'Meningkat' },
      { period: 'Pekan 3 Agu', score: 80, verbalPromptLevel: 4, status: 'Meningkat' },
      { period: 'Pekan 4 Agu', score: 85, verbalPromptLevel: 5, status: 'Meningkat' },
      { period: 'Pekan 1 Sep', score: 88, verbalPromptLevel: 5, status: 'Meningkat' },
      { period: 'Pekan 2 Sep', score: 90, verbalPromptLevel: 5, status: 'Meningkat' }
    ]
  },
  {
    id: 'rafi-alfarizi',
    name: 'Rafi Alfarizi',
    nickname: 'Rafi',
    roomCode: 'SLB-RAFI-04',
    avatar: '👦',
    class: 'Kelas 1 SLB',
    condition: 'Autisme & Disabilitas Intelektual',
    parentName: 'Ibu Nurul',
    parentPhone: '0852-3344-5566',
    currentActivity: 'Kancing Pakaian',
    status: 'butuh_bantuan',
    progressPercentage: 55,
    completedActivities: 11,
    totalActivities: 25,
    weeklyStars: 5,
    maxWeeklyStars: 10,
    assistanceTrend: 'meningkat',
    modulesProgress: {
      cuciTangan: 70,
      menggosokGigi: 60,
      makanMandiri: 45,
      memakaiPakaian: 30
    },
    latestTeacherNote: {
      author: 'Ibu Ratna, S.Pd',
      role: 'Wali Kelas C1',
      timestamp: 'Hari ini, 09:20 WIB',
      text: 'Rafi membutuhkan bimbingan fisik pada langkah memasukkan kancing baju ke lubangnya.',
      synced: true
    },
    latestAudioRecording: {
      command: 'Bantuan!',
      duration: '00:03',
      accuracy: 84
    },
    gradeHistory: [
      { period: 'Pekan 1 Agu', score: 42, verbalPromptLevel: 1, status: 'Perlu Bimbingan' },
      { period: 'Pekan 2 Agu', score: 45, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 3 Agu', score: 48, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 4 Agu', score: 50, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 1 Sep', score: 52, verbalPromptLevel: 2, status: 'Meningkat' },
      { period: 'Pekan 2 Sep', score: 55, verbalPromptLevel: 3, status: 'Meningkat' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: DailyNotification[] = [
  {
    id: 'notif-1',
    title: 'Aktivitas Mandiri Tuntas',
    message: 'Budi Pratama berhasil menyelesaikan 6 langkah Cuci Tangan mandiri tanpa bantuan sentuh!',
    timestamp: '10:30 WIB',
    type: 'activity_completed',
    read: false,
    studentName: 'Budi Pratama'
  },
  {
    id: 'notif-2',
    title: 'Catatan Guru Terkirim',
    message: 'Ibu Ratna, S.Pd telah mengirimkan evaluasi respon suara Budi ke Buku Penghubung.',
    timestamp: '10:15 WIB',
    type: 'teacher_note',
    read: false,
    studentName: 'Budi Pratama'
  },
  {
    id: 'notif-3',
    title: 'Permintaan Bantuan Teratasi',
    message: 'Rafi Alfarizi telah menerima asistensi bimbingan kancing baju di kelas C1.',
    timestamp: '09:25 WIB',
    type: 'help_requested',
    read: true,
    studentName: 'Rafi Alfarizi'
  },
  {
    id: 'notif-4',
    title: 'Sinkronisasi Cloud Berhasil',
    message: '38 log sesi pembelajaran hari ini telah terenkripsi dan dicadangkan ke server cloud.',
    timestamp: '08:00 WIB',
    type: 'sync_success',
    read: true,
    studentName: 'Sistem'
  }
];

export const INITIAL_HANDBOOK_ENTRIES: HandbookEntry[] = [
  {
    id: 'entry-1',
    studentId: 'budi-pratama',
    authorName: 'Ibu Ratna, S.Pd',
    authorRole: 'Guru SLB',
    authorAvatar: '👩‍🏫',
    timestamp: 'Hari ini, 10:30 WIB',
    content: 'Budi berhasil mencuci tangan mandiri 6 langkah di sekolah tanpa bantuan sentuh! Responnya sangat antusias terhadap panduan suara animasi BISA.',
    liked: true,
    likedBy: 'Disukai Ibu Dewi',
    readStatus: true,
    readBy: 'Terbaca oleh Ibu Dewi'
  },
  {
    id: 'entry-2',
    studentId: 'budi-pratama',
    authorName: 'Ibu Dewi Pratama',
    authorRole: 'Orang Tua',
    authorAvatar: '👩',
    timestamp: 'Hari ini, 12:45 WIB',
    content: 'Alhamdulillah, Budi mencoba mencuci tangan sendiri di rumah saat makan siang tadi sambil mengingat instruksi suara BISA.',
    imageUrl: `${import.meta.env.BASE_URL}images/budi_cuci_tangan_real_1790423591381.jpg`,
    liked: false,
    readStatus: true,
    readBy: 'Terbaca oleh Ibu Ratna, S.Pd'
  }
];
