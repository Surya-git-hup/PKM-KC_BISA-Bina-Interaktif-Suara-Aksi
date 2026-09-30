import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Printer, 
  CheckCircle2, 
  TrendingDown, 
  Play, 
  Pause, 
  Star, 
  Volume2, 
  Send, 
  Mic,
  Users,
  Trash2,
  RotateCcw,
  BookOpen,
  MessageSquare,
  Sparkles,
  Phone,
  Eye,
  Calendar,
  Check,
  Plus
} from 'lucide-react';
import { StudentProgress, UserSession } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { ReportCardModal } from './ReportCardModal';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserAvatar } from '../common/UserAvatar';

interface StudentDetailProfileProps {
  student?: StudentProgress | null;
  onBack: () => void;
  onUpdateNote: (studentId: string, noteText: string) => void;
  onDeleteStudent?: (student: StudentProgress) => void;
  onResetPractice?: (studentId: string) => void;
  onUpdateStudentPhoto?: (studentId: string, photoDataUrl: string) => void;
  currentUser?: UserSession | null;
  onViewAsParent?: (student: StudentProgress) => void;
}

export const StudentDetailProfile: React.FC<StudentDetailProfileProps> = ({
  student,
  onBack,
  onUpdateNote,
  onDeleteStudent,
  onResetPractice,
  onUpdateStudentPhoto,
  currentUser,
  onViewAsParent
}) => {
  // Tabs: 'modul' (Progres & Modul) or 'catatan' (Menu Catatan Guru yang diaktifkan)
  const [activeTab, setActiveTab] = useState<'modul' | 'catatan'>('modul');
  const [showReportCard, setShowReportCard] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [appreciated, setAppreciated] = useState(false);

  // Teacher Note Form State
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState(student?.latestTeacherNote?.text || '');
  const [noteCategory, setNoteCategory] = useState('Bina Diri Mandiri');
  const [syncToParent, setSyncToParent] = useState(true);
  const [noteSavedFeedback, setNoteSavedFeedback] = useState(false);

  // Modals for deleting student and resetting practice mode
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPracticeModalOpen, setIsResetPracticeModalOpen] = useState(false);

  // Quick preset evaluation recommendations for teachers
  const quickTemplates = [
    `Ananda ${student?.name || 'siswa'} sangat mandiri saat mencuci tangan tanpa instruksi berulang.`,
    `Respon suara ananda makin jelas dan artikulasi kata "Lanjut" berkembang baik.`,
    `Mampu mengenali peralatan secara mandiri, perlu penguatan pada langkah akhir.`,
    `Mohon kerja sama orang tua untuk melatih pembiasaan sebelum makan di rumah.`
  ];

  if (!student) {
    return (
      <div className="space-y-6 animate-fadeIn p-4 sm:p-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard Guru</span>
        </button>
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="font-['Fredoka'] font-bold text-xl text-slate-800 mb-1">
            Belum Ada Siswa Dipilih
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            Data siswa masih kosong. Silakan tambahkan peserta didik baru di Dashboard Guru untuk melihat profil dan lembar evaluasi bina diri.
          </p>
          <button
            onClick={onBack}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            Buka Dashboard Guru
          </button>
        </div>
      </div>
    );
  }

  const handlePlayVoiceSample = () => {
    if (isPlayingAudio) {
      soundEffects.stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      soundEffects.speakIndonesian(student.latestAudioRecording?.command || 'Lanjut!', () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const handleSaveNote = () => {
    if (newNoteText.trim()) {
      onUpdateNote(student.id, newNoteText.trim());
      setIsEditingNote(false);
      setNoteSavedFeedback(true);
      soundEffects.playPop();
      setTimeout(() => setNoteSavedFeedback(false), 3000);
    }
  };

  const handleOpenWhatsApp = (phone?: string) => {
    if (!phone) return;
    soundEffects.playPop();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Halo ${student.parentName}, saya guru kelas ananda ${student.name}. Saya telah memperbarui lembar evaluasi bina diri ananda di aplikasi BISA.`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full max-w-full">
      
      {/* Top Breadcrumb & Status Pill (Responsive flex-wrap) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Daftar Siswa</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900">Profil Evaluasi {student.name}</span>
        </button>

        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Evaluasi Fase A • Aktif Sesi 12</span>
        </div>
      </div>

      {/* Profile Header Banner (Responsive layout) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Avatar + Student Details */}
        <div className="flex items-center gap-4 sm:gap-5 flex-wrap sm:flex-nowrap">
          <UserAvatar
            avatar={student.avatar}
            name={student.name}
            size="2xl"
            editable={true}
            onPhotoChange={(newPhoto) => {
              if (onUpdateStudentPhoto) {
                onUpdateStudentPhoto(student.id, newPhoto);
              }
            }}
            editTooltip="Klik untuk unggah foto siswa"
          />

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {student.class}
              </span>
              <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {student.condition}
              </span>
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Kode: {student.roomCode}
              </span>
            </div>

            <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 truncate">
              {student.name}
            </h1>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
              <span>👥 Wali Murid: <strong className="text-slate-700">{student.parentName}</strong></span>
              {student.parentPhone && (
                <>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(student.parentPhone)}
                    className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{student.parentPhone}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons (Responsive flex wrap) */}
        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Button to open / activate Catatan Guru menu directly */}
          <button
            onClick={() => {
              setActiveTab('catatan');
              setIsEditingNote(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl font-['Fredoka'] font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Tulis Catatan Guru</span>
          </button>

          {onViewAsParent && (
            <button
              onClick={() => onViewAsParent(student)}
              title="Akses akun orang tua untuk melihat tampilan siswa ini"
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>Lihat Akun Orang Tua</span>
            </button>
          )}

          {onResetPractice && (
            <button
              onClick={() => setIsResetPracticeModalOpen(true)}
              title="Hapus / Reset riwayat mode latihan siswa"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Latihan</span>
            </button>
          )}

          {onDeleteStudent && (
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              title="Hapus data siswa ini"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-2xl text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Hapus</span>
            </button>
          )}
        </div>

      </div>

      {/* Navigation Tabs Switcher: "Ringkasan Modul" vs "Menu Catatan Guru" */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('modul')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'modul'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>Kemajuan Modul & Statistik</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catatan')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'catatan'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Menu Catatan Evaluasi Guru</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
            activeTab === 'catatan' ? 'bg-white text-amber-700' : 'bg-amber-100 text-amber-800'
          }`}>
            Aktif
          </span>
        </button>
      </div>

      {/* TAB 1: MODUL & STATISTIK */}
      {activeTab === 'modul' && (
        <div className="space-y-6">
          {/* 3 Metric Cards Grid (Responsive 1 col mobile, 3 col desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Metric 1: Aktivitas Selesai */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Aktivitas Selesai
                </span>
                <div className="w-7 h-7 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl text-slate-900 tabular-nums">
                    {student.completedActivities}
                  </span>
                  <span className="text-sm font-bold text-slate-400">/{student.totalActivities || 0}</span>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  Total kemandirian mencapai <strong className="text-emerald-600">{student.progressPercentage}%</strong>
                </p>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${student.progressPercentage}%` }} />
                </div>
              </div>
            </div>

            {/* Metric 2: Aktivitas Berjalan */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Aktivitas Berjalan
                </span>
                <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-['Fredoka'] font-extrabold text-2xl text-slate-900 truncate">
                  {student.currentActivity || 'Belum Ada Aktivitas'}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {student.completedActivities > 0 ? 'Sesi Latihan Berjalan' : 'Belum Memulai Modul'}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
                  <span className={`w-2 h-2 rounded-full ${student.completedActivities > 0 ? 'bg-sky-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  <span>{student.completedActivities > 0 ? 'Sesi Sedang Berlangsung' : 'Menunggu Sesi Pertama'}</span>
                </div>
              </div>
            </div>

            {/* Metric 3: Permintaan Bantuan */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Permintaan Bantuan
                </span>
                <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-['Fredoka'] font-extrabold text-3xl text-emerald-600">
                  {student.completedActivities === 0 ? '0 Sesi' : (student.assistanceTrend === 'menurun' ? 'Menurun' : 'Stabil')}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {student.completedActivities === 0 ? 'Belum ada sesi bantuan tercatat' : 'Kemandirian berkembang stabil'}
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{student.completedActivities === 0 ? 'Data Awal Bersih' : 'Kemandirian Terpantau'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Kemajuan Modul Bina Diri Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-['Fredoka'] font-bold text-xl text-slate-900">
                  Kemajuan Modul Bina Diri
                </h2>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Pelacakan tahap sensori motorik dan adaptasi harian {student.name}.
                </p>
              </div>

              <button
                onClick={() => setShowReportCard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rapor Siswa</span>
              </button>
            </div>

            {/* 4 Skill Progress Rows */}
            <div className="space-y-5">
              
              {/* Item 1: Cuci Tangan */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-base shrink-0">
                      💧
                    </div>
                    <div>
                      <h4 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                        Cuci Tangan
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-600">
                        {(student.modulesProgress?.cuciTangan ?? 0) === 0 ? 'Belum Dimulai' : ((student.modulesProgress?.cuciTangan ?? 0) >= 80 ? 'Mandiri Penuh' : 'Dalam Latihan')}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 tabular-nums">{student.modulesProgress?.cuciTangan ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${student.modulesProgress?.cuciTangan ?? 0}%` }} />
                </div>
              </div>

              {/* Item 2: Menggosok Gigi */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold text-base shrink-0">
                      🪥
                    </div>
                    <div>
                      <h4 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                        Menggosok Gigi
                      </h4>
                      <span className="text-[11px] font-semibold text-sky-600">
                        {(student.modulesProgress?.menggosokGigi ?? 0) === 0 ? 'Belum Dimulai' : 'Respons Suara Lancar'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-sky-700 tabular-nums">{student.modulesProgress?.menggosokGigi ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-sky-600 h-full rounded-full transition-all" style={{ width: `${student.modulesProgress?.menggosokGigi ?? 0}%` }} />
                </div>
              </div>

              {/* Item 3: Makan Mandiri */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-base shrink-0">
                      🍽️
                    </div>
                    <div>
                      <h4 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                        Makan Mandiri
                      </h4>
                      <span className="text-[11px] font-semibold text-amber-600">
                        {(student.modulesProgress?.makanMandiri ?? 0) === 0 ? 'Belum Dimulai' : 'Pembiasaan Sendok'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 tabular-nums">{student.modulesProgress?.makanMandiri ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${student.modulesProgress?.makanMandiri ?? 0}%` }} />
                </div>
              </div>

              {/* Item 4: Memakai Pakaian */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold text-base shrink-0">
                      👕
                    </div>
                    <div>
                      <h4 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                        Memakai Pakaian
                      </h4>
                      <span className="text-[11px] font-semibold text-orange-600">
                        {(student.modulesProgress?.memakaiPakaian ?? 0) === 0 ? 'Belum Dimulai' : 'Latihan Kancing'}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-orange-700 tabular-nums">{student.modulesProgress?.memakaiPakaian ?? 0}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full transition-all" style={{ width: `${student.modulesProgress?.memakaiPakaian ?? 0}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Quick Catatan Guru Preview Card & Rekaman Audio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Catatan Guru Terkini (Spans 2 cols) */}
            <div className="md:col-span-2 bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold text-xl">“</span>
                    <div>
                      <h3 className="font-['Fredoka'] font-bold text-base text-slate-900">
                        Catatan Guru Terkini
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">
                        {student.latestTeacherNote?.author || student.teacherName || 'Guru SLB'} • {student.latestTeacherNote?.timestamp || 'Hari Ini'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('catatan')}
                    className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-200 transition-colors cursor-pointer"
                  >
                    Buka Menu Catatan Guru →
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed my-2">
                  "{student.latestTeacherNote?.text || `Ananda ${student.name} telah terdaftar di kelas inklusi BISA.`}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-3 flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Terkirim ke Buku Penghubung ({student.parentName})</span>
                </span>

                <button
                  onClick={() => {
                    setAppreciated(!appreciated);
                    soundEffects.playPop();
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    appreciated
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-white hover:bg-amber-50 text-slate-600 border-slate-200'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${appreciated ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
                  <span>{appreciated ? 'Diberi Apresiasi ⭐' : 'Beri Apresiasi ⭐'}</span>
                </button>
              </div>
            </div>

            {/* Rekaman Audio Respon Suara */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-['Fredoka'] font-bold text-sm text-slate-900">
                      Rekaman Audio
                    </h3>
                    <p className="text-[11px] text-slate-500">Respon suara di kelas</p>
                  </div>
                </div>

                {/* Playable Sample Capsule */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 my-3">
                  <button
                    onClick={handlePlayVoiceSample}
                    disabled={!student.latestAudioRecording || student.latestAudioRecording.command === '-' || student.latestAudioRecording.accuracy === 0}
                    className="w-9 h-9 rounded-full bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-xs cursor-pointer shrink-0 transition-transform active:scale-95"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {student.latestAudioRecording && student.latestAudioRecording.command !== '-' && student.latestAudioRecording.accuracy > 0
                        ? `Kata: "${student.latestAudioRecording.command}"`
                        : 'Belum ada rekaman suara'}
                    </p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1 overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all"
                        style={{ width: `${student.latestAudioRecording?.accuracy || 0}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-slate-500 shrink-0">
                    {student.latestAudioRecording?.duration || '00:00'}
                  </span>
                </div>
              </div>

              <div className="text-center pt-2">
                <span className="text-xs font-bold text-emerald-700">
                  Akurasi Artikulasi: <strong className="tabular-nums">
                    {student.latestAudioRecording?.accuracy ? `${student.latestAudioRecording.accuracy}% Jelas` : '0% (Belum Ada Sesi Suara)'}
                  </strong>
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MENU CATATAN EVALUASI GURU (MENU DIAKTIFKAN) */}
      {activeTab === 'catatan' && (
        <div className="space-y-6">
          
          {/* Note Editor Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Menu Catatan & Lembar Evaluasi Guru</span>
                </div>
                <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-900">
                  Tulis & Kelola Catatan Perkembangan {student.name}
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Catatan ini akan tersimpan pada lembar evaluasi siswa dan tersinkron otomatis ke Buku Penghubung Orang Tua ({student.parentName}).
                </p>
              </div>

              {noteSavedFeedback && (
                <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 animate-slideDown">
                  <Check className="w-4 h-4" />
                  <span>Catatan Tersimpan & Disinkronkan!</span>
                </div>
              )}
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Pilih Kategori Evaluasi:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  'Bina Diri Mandiri', 
                  'Sensori & Motorik', 
                  'Respon Suara & Bahasa', 
                  'Pembiasaan di Rumah', 
                  'Rekomendasi Evaluasi'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNoteCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      noteCategory === cat
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates Chips */}
            <div className="space-y-2">
              <span className="block text-[11px] font-bold text-slate-500">
                ⚡ Template Rekomendasi Cepat (Klik untuk menyisipkan):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickTemplates.map((tpl, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setNewNoteText(tpl);
                      soundEffects.playPop();
                    }}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200/80 hover:border-amber-300 text-left text-xs font-medium transition-all cursor-pointer truncate"
                  >
                    "{tpl}"
                  </button>
                ))}
              </div>
            </div>

            {/* Textarea Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Isi Catatan & Rekomendasi Guru:
              </label>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                rows={4}
                className="w-full p-4 text-xs sm:text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium placeholder-slate-400 bg-slate-50/50"
                placeholder={`Tulis pengamatan mendalam mengenai kemandirian, respon artikulasi suara, dan anjuran kolaborasi orang tua untuk ananda ${student.name}...`}
              />
            </div>

            {/* Sync Checkbox & Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={syncToParent}
                  onChange={(e) => setSyncToParent(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Kirim & Sinkronkan langsung ke Buku Penghubung Akun Orang Tua</span>
              </label>

              <button
                type="button"
                onClick={handleSaveNote}
                disabled={!newNoteText.trim()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white rounded-xl font-['Fredoka'] font-bold text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Send className="w-4 h-4" />
                <span>Simpan & Sinkronkan Catatan Guru</span>
              </button>
            </div>
          </div>

          {/* Timeline of Previous Teacher Notes & Evaluations */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                Riwayat Catatan Evaluasi Guru untuk {student.name}
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Tersimpan Permanen
              </span>
            </div>

            <div className="space-y-4">
              {/* Primary Active Note Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <UserAvatar avatar="👩‍🏫" name={student.latestTeacherNote?.author || student.teacherName || 'Guru SLB'} size="sm" />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {student.latestTeacherNote?.author || student.teacherName || 'Guru SLB'}
                      </h4>
                      <p className="text-[10px] text-slate-500">
                        Wali Kelas • {student.latestTeacherNote?.timestamp || 'Hari Ini, Baru saja'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-amber-800 bg-white px-2.5 py-0.5 rounded-full border border-amber-200">
                      {noteCategory}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Tersinkron ke Orang Tua</span>
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white p-3.5 rounded-xl border border-amber-100">
                  “{student.latestTeacherNote?.text || `Ananda ${student.name} telah didaftarkan dan terhubung secara resmi ke kelas bina diri BISA.`}”
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Wali Murid Penerima: <strong>{student.parentName}</strong></span>
                  <button
                    onClick={() => {
                      setNewNoteText(student.latestTeacherNote?.text || '');
                      setIsEditingNote(true);
                      soundEffects.playPop();
                    }}
                    className="text-amber-700 font-bold hover:underline cursor-pointer"
                  >
                    Edit Catatan Ini
                  </button>
                </div>
              </div>

              {/* Connected Parent Account Information Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                    Akses Guru ke Akun Orang Tua Siswa
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900">
                    {student.parentName} (Wali dari {student.name})
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Nomor Kontak: <strong>{student.parentPhone || 'Belum diisi'}</strong> • Kode Ruang: <span className="font-mono font-bold text-slate-700">{student.roomCode}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {student.parentPhone && (
                    <button
                      type="button"
                      onClick={() => handleOpenWhatsApp(student.parentPhone)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hubungi WhatsApp</span>
                    </button>
                  )}

                  {onViewAsParent && (
                    <button
                      type="button"
                      onClick={() => onViewAsParent(student)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-600" />
                      <span>Lihat Portal Orang Tua</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Rapor Modal */}
      {showReportCard && (
        <ReportCardModal student={student} onClose={() => setShowReportCard(false)} />
      )}

      {/* Confirmation Modal to Delete Student */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`Hapus Data Siswa: ${student.name}?`}
        message={`Apakah Anda yakin ingin menghapus data siswa ${student.name} (${student.class})? Semua data catatan evaluasi dan buku penghubung siswa ini akan dihapus permanen.`}
        details={`Kode Ruang: ${student.roomCode} • Wali Murid: ${student.parentName}`}
        confirmLabel="Ya, Hapus Siswa"
        confirmVariant="danger"
        onConfirm={() => {
          if (onDeleteStudent) {
            onDeleteStudent(student);
          }
          setIsDeleteModalOpen(false);
        }}
        onCancel={() => setIsDeleteModalOpen(false)}
      />

      {/* Confirmation Modal to Reset Practice Progress */}
      <ConfirmModal
        isOpen={isResetPracticeModalOpen}
        title={`Reset Mode Latihan: ${student.name}?`}
        message={`Apakah Anda yakin ingin menghapus / mereset seluruh progres mode latihan siswa ${student.name}? Skor modul, total aktivitas selesai, dan bintang mingguan akan dikembalikan ke status awal (0%).`}
        details="Tindakan ini berguna jika siswa ingin mengulang program latihan bina diri dari awal."
        confirmLabel="Ya, Reset Riwayat Latihan"
        confirmVariant="warning"
        onConfirm={() => {
          if (onResetPractice) {
            onResetPractice(student.id);
          }
          setIsResetPracticeModalOpen(false);
        }}
        onCancel={() => setIsResetPracticeModalOpen(false)}
      />

    </div>
  );
};
