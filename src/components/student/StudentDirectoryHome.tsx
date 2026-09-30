import React, { useState } from 'react';
import { 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  TrendingDown, 
  Printer, 
  Heart, 
  Volume2, 
  Play, 
  Pause,
  ExternalLink,
  Sparkles,
  Camera,
  Search,
  X,
  UserPlus
} from 'lucide-react';
import { StudentProgress, UserRole } from '../../types';
import { UserAvatar } from '../common/UserAvatar';
import { soundEffects } from '../../utils/soundEffects';
import { ReportCardModal } from '../teacher/ReportCardModal';

interface StudentDirectoryHomeProps {
  students: StudentProgress[];
  selectedStudent: StudentProgress | null;
  onSelectStudent: (student: StudentProgress) => void;
  onStartActivityWithStudent: (student: StudentProgress) => void;
  onUpdateStudentPhoto: (studentId: string, photoDataUrl: string) => void;
  onOpenAddStudent?: () => void;
  currentRole?: UserRole;
}

export const StudentDirectoryHome: React.FC<StudentDirectoryHomeProps> = ({
  students,
  selectedStudent,
  onSelectStudent,
  onStartActivityWithStudent,
  onUpdateStudentPhoto,
  onOpenAddStudent,
  currentRole = 'teacher'
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [appreciated, setAppreciated] = useState(false);
  const [showReportCard, setShowReportCard] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // On mobile screen, toggle between list view and detail view
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  // Active student defaults to selected or first student
  const activeStudent = selectedStudent || (students.length > 0 ? students[0] : null);

  const filteredStudents = searchQuery.trim()
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  const handlePlayVoiceSample = (word: string) => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    soundEffects.speakIndonesian(word);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 1800);
  };

  const handleAppreciate = () => {
    setAppreciated(true);
    soundEffects.playStar();
  };

  const getStatusBadge = (student: StudentProgress) => {
    // Dynamic status indicator matching Image 1
    if (student.status === 'mandiri' || student.progressPercentage >= 70) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Aktif - Sesi 12</span>
        </span>
      );
    }
    if (student.status === 'suara' || student.completedActivities > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
          <span>Selesai Sesi</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <span>Belum Sesi</span>
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-fadeIn">
      {/* Outer Grid: Left = Student List, Right = Student Detail Profile (Matching Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Student Cards List (Matches Left of Image 1) */}
        <div className={`lg:col-span-4 space-y-4 ${mobileDetailOpen ? 'hidden lg:block' : 'block'}`}>
          
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900 leading-tight">
                    Daftar Siswa
                  </h2>
                  <p className="text-[11px] font-semibold text-slate-400">
                    Pilih siswa untuk melihat data & evaluasi
                  </p>
                </div>
              </div>

              {onOpenAddStudent && (
                <button
                  onClick={onOpenAddStudent}
                  title="Tambah Siswa Baru"
                  className="w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama siswa..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Student Cards Stack */}
          <div className="space-y-3.5">
            {filteredStudents.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 text-slate-500">
                <p className="text-xs font-bold">Tidak ada siswa ditemukan.</p>
              </div>
            ) : (
              filteredStudents.map((student) => {
                const isSelected = activeStudent?.id === student.id;
                return (
                  <div
                    key={student.id}
                    onClick={() => {
                      onSelectStudent(student);
                      setMobileDetailOpen(true);
                      soundEffects.playPop();
                    }}
                    className={`bg-white rounded-3xl p-5 border transition-all cursor-pointer group shadow-xs hover:shadow-md ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/20 bg-amber-50/20'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          avatar={student.avatar}
                          name={student.name}
                          size="lg"
                          editable={isSelected}
                          onPhotoChange={(newPhoto) => onUpdateStudentPhoto(student.id, newPhoto)}
                          editTooltip="Ganti foto siswa ini"
                        />
                        <div>
                          <h3 className="font-['Fredoka'] font-bold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                            {student.name}
                          </h3>
                          <p className="text-xs font-semibold text-slate-500">
                            {student.class}
                          </p>
                        </div>
                      </div>

                      <div>
                        {getStatusBadge(student)}
                      </div>
                    </div>

                    {/* Pill Button: Lihat Data Siswa */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectStudent(student);
                        setMobileDetailOpen(true);
                        soundEffects.playPop();
                      }}
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold font-['Fredoka'] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-sky-50 hover:bg-sky-100 text-sky-700'
                      }`}
                    >
                      <span>Lihat Data Siswa</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Student Profile Detail (Matches Right of Image 1) */}
        <div className={`lg:col-span-8 space-y-5 ${!mobileDetailOpen ? 'hidden lg:block' : 'block'}`}>
          {activeStudent ? (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
              
              {/* Header: Title + Back Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3.5">
                  <UserAvatar
                    avatar={activeStudent.avatar}
                    name={activeStudent.name}
                    size="xl"
                    editable={true}
                    onPhotoChange={(newPhoto) => onUpdateStudentPhoto(activeStudent.id, newPhoto)}
                    editTooltip="Ubah foto profil siswa ini"
                  />
                  <div>
                    <h1 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
                      Data Siswa {activeStudent.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-0.5 text-xs font-semibold text-slate-500">
                      <span>{activeStudent.class}</span>
                      <span>•</span>
                      <span>{activeStudent.condition}</span>
                      <span>•</span>
                      <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {activeStudent.roomCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Start activity with this student */}
                  <button
                    onClick={() => onStartActivityWithStudent(activeStudent)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Latihan Bersama Siswa</span>
                  </button>

                  {/* Back to List (Mobile view toggle or cancel) */}
                  <button
                    onClick={() => setMobileDetailOpen(false)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Daftar</span>
                  </button>
                </div>
              </div>

              {/* 3 Metric Cards matching Image 1 top right */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* 1. Aktivitas Selesai */}
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                    <span>Aktivitas Selesai</span>
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-['Fredoka'] font-bold text-2xl text-slate-900">
                      {activeStudent.completedActivities} <span className="text-sm font-semibold text-slate-400">/ {activeStudent.totalActivities}</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      Total kemandirian mencapai {activeStudent.progressPercentage}%
                    </p>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${activeStudent.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* 2. Aktivitas Berjalan */}
                <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-900">
                    <span>Aktivitas Berjalan</span>
                    <Clock className="w-4 h-4 text-sky-600" />
                  </div>
                  <div>
                    <div className="font-['Fredoka'] font-bold text-base text-slate-900 leading-snug">
                      {activeStudent.currentActivity}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      Tahap Mandiri 6 Langkah
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100/80 text-sky-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
                    <span>Sesi Sedang Berlangsung</span>
                  </span>
                </div>

                {/* 3. Permintaan Bantuan */}
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                    <span>Permintaan Bantuan</span>
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-['Fredoka'] font-bold text-xl text-emerald-800">
                      Menurun
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      Hanya 1x bantuan guru minggu ini
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800">
                    Kemandirian Meningkat
                  </span>
                </div>

              </div>

              {/* Kemajuan Modul Bina Diri Section (Matches Image 1) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Fredoka'] font-bold text-base text-slate-900">
                    Kemajuan Modul Bina Diri
                  </h3>
                  <button
                    onClick={() => setShowReportCard(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cetak Rapor</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Cuci Tangan */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold text-slate-800">Cuci Tangan</span>
                        <span className="text-[11px] text-slate-400">Mandiri Penuh</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {activeStudent.modulesProgress.cuciTangan}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                        style={{ width: `${activeStudent.modulesProgress.cuciTangan}%` }}
                      />
                    </div>
                  </div>

                  {/* Menggosok Gigi */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span className="font-bold text-slate-800">Menggosok Gigi</span>
                        <span className="text-[11px] text-slate-400">Respon Cepat Lancar</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {activeStudent.modulesProgress.menggosokGigi}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-600 rounded-full transition-all duration-500"
                        style={{ width: `${activeStudent.modulesProgress.menggosokGigi}%` }}
                      />
                    </div>
                  </div>

                  {/* Makan Mandiri */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="font-bold text-slate-800">Makan Mandiri</span>
                        <span className="text-[11px] text-slate-400">Pembiasaan Sendok</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {activeStudent.modulesProgress.makanMandiri}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${activeStudent.modulesProgress.makanMandiri}%` }}
                      />
                    </div>
                  </div>

                  {/* Memakai Pakaian */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                        <span className="font-bold text-slate-800">Memakai Pakaian</span>
                        <span className="text-[11px] text-slate-400">Latihan Kancing</span>
                      </div>
                      <span className="font-bold text-slate-800">
                        {activeStudent.modulesProgress.memakaiPakaian}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${activeStudent.modulesProgress.memakaiPakaian}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Catatan Guru & Rekaman Audio (Matches Image 1 bottom) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Catatan Guru Terkini */}
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-100/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-950">
                      Catatan Guru Terkini
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                      {activeStudent.latestTeacherNote?.author || activeStudent.teacherName || 'Guru SLB'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{activeStudent.latestTeacherNote?.text || `Ananda ${activeStudent.name} sangat aktif dan bersemangat mengikuti sesi bina diri BISA.`}"
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terkirim ke Buku Penghubung</span>
                    </span>

                    <button
                      onClick={handleAppreciate}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        appreciated
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-white hover:bg-rose-50 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${appreciated ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{appreciated ? 'Tersampaikan!' : 'Beri Apresiasi ⭐'}</span>
                    </button>
                  </div>
                </div>

                {/* Rekaman Audio */}
                <div className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100/90 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-950">
                      Rekaman Audio Respon
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-md">
                      Respon Suara di Kelas
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-sky-100">
                    <button
                      onClick={() => handlePlayVoiceSample(activeStudent.latestAudioRecording?.command || 'Lanjut')}
                      className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer shrink-0"
                    >
                      {isPlayingAudio ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">
                          Kata: "{activeStudent.latestAudioRecording?.command || 'Lanjut!'}"
                        </span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {activeStudent.latestAudioRecording?.duration || '00:04'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                        <div className="bg-sky-500 h-full w-4/5 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                    <span>Akurasi Artikulasi:</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      {activeStudent.latestAudioRecording?.accuracy || 92}% Jelas
                    </span>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm text-slate-500">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-['Fredoka'] font-bold text-lg text-slate-800">
                Pilih Siswa dari Daftar
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Klik salah satu kartu siswa di sebelah kiri untuk melihat rapor kemajuan dan profil lengkapnya.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Report Card Modal */}
      {showReportCard && activeStudent && (
        <ReportCardModal
          student={activeStudent}
          onClose={() => setShowReportCard(false)}
        />
      )}
    </div>
  );
};
