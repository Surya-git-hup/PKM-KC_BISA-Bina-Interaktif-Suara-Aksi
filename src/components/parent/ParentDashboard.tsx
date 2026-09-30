import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Star, 
  MessageSquare, 
  Volume2, 
  Heart, 
  Play, 
  Sparkles,
  ChevronRight,
  GraduationCap,
  Eye,
  Phone,
  UserCheck
} from 'lucide-react';
import { StudentProgress, UserSession, HandbookEntry } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { TeacherProfileModal } from '../common/TeacherProfileModal';

interface ParentDashboardProps {
  student?: StudentProgress | null;
  currentUser?: UserSession | null;
  latestHandbookEntry?: HandbookEntry | null;
  onOpenVoicePractice: () => void;
  onOpenHandbook: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  student,
  currentUser,
  latestHandbookEntry,
  onOpenVoicePractice,
  onOpenHandbook
}) => {
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [fetchedTeacherName, setFetchedTeacherName] = useState<string>('');
  const [fetchedSchoolName, setFetchedSchoolName] = useState<string>('');

  const effectiveRoomCode = student?.roomCode || currentUser?.roomCode || 'SLB-BUDI-01';

  // Pastikan nama guru sesuai dengan nama guru yang memberikan kode undangan
  useEffect(() => {
    let isMounted = true;
    const fetchTeacherByCode = async () => {
      try {
        const res = await fetch(`/api/teacher/profile-by-code/${encodeURIComponent(effectiveRoomCode)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && json.data?.name && isMounted) {
            setFetchedTeacherName(json.data.name);
            if (json.data.school) setFetchedSchoolName(json.data.school);
          }
        }
      } catch (err) {
        console.warn('Could not fetch teacher profile by room code:', err);
      }
    };
    fetchTeacherByCode();
    return () => { isMounted = false; };
  }, [effectiveRoomCode]);

  // Dynamic names
  const effectiveStudentName = student?.name || currentUser?.childName || 'Ananda';
  const effectiveTeacherName = fetchedTeacherName || student?.teacherName || currentUser?.teacherName || student?.latestTeacherNote?.author || 'Guru SLB';
  const effectiveSchoolName = fetchedSchoolName || student?.school || currentUser?.school || 'SLB Budi Kasih Bengkulu';

  const isDisconnected = !student || currentUser?.syncedWithTeacher === false;

  if (isDisconnected) {
    return (
      <div className="space-y-6 animate-fadeIn p-4 sm:p-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-200/80 shadow-md text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 text-3xl shadow-xs">
            ⚠️
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold mb-3">
            <span>Status: Tidak Tersingkron</span>
          </div>
          <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-800 mb-2">
            Akun Orang Tua Tidak Tersingkron
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            Data peserta didik telah dihapus oleh Guru Kelas atau akun belum terhubung dengan siswa di ruang belajar. Akun wali murid saat ini tidak lagi tersingkron dengan akun guru. Silakan hubungi guru kelas untuk memperoleh kode undangan ruang belajar yang baru.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button
              onClick={onOpenVoicePractice}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Coba Sesi Latihan Suara
            </button>
            <button
              onClick={() => setIsTeacherModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Lihat Profil Guru Kelas
            </button>
          </div>
        </div>

        <TeacherProfileModal
          isOpen={isTeacherModalOpen}
          onClose={() => setIsTeacherModalOpen(false)}
          roomCode={effectiveRoomCode}
          teacherName={effectiveTeacherName}
          schoolName={effectiveSchoolName}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full max-w-full">
      
      {/* Top Welcome Banner (Responsive layout) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 border-2 border-amber-300 flex items-center justify-center text-2xl sm:text-3xl shadow-inner shrink-0">
            👩
          </div>
          <div>
            <h1 className="font-['Fredoka'] font-bold text-xl sm:text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-2">
              <span>Halo, {student.parentName || currentUser?.name || 'Bunda / Ayah'}</span>
              <span>👋</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Pantau kemandirian <strong className="text-slate-700 font-bold">{effectiveStudentName}</strong> hari ini.
            </p>
          </div>
        </div>

        {/* Teacher in charge badge with "Lihat Profil Guru" action */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-sky-50 to-amber-50/60 border border-slate-200/80 px-4 py-2.5 rounded-2xl w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-slate-800 leading-tight">{effectiveTeacherName}</p>
              <p className="text-slate-500 text-[11px]">Guru Kelas • {effectiveSchoolName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              soundEffects.playPop();
              setIsTeacherModalOpen(true);
            }}
            className="px-3 py-1.5 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Eye className="w-3.5 h-3.5 text-sky-600" />
            <span>Profil Guru</span>
          </button>
        </div>
      </div>

      {/* 4 Cards Grid (Responsive 1 col mobile, 2 col tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Aktivitas Hari Ini */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                📅
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                  Aktivitas Hari Ini
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Ritual Kemandirian Harian
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Task 1: Cuci Tangan */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shrink-0">
                    🧼
                  </div>
                  <div>
                    <h3 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                      Cuci Tangan
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {student.completedActivities > 0 ? 'Selesai Mandiri ⭐' : 'Belum Dimulai'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                  student.completedActivities > 0
                    ? 'text-emerald-700 bg-emerald-100'
                    : 'text-slate-500 bg-slate-100'
                }`}>
                  {student.completedActivities > 0 ? 'Selesai' : 'Belum Mulai'}
                </span>
              </div>

              {/* Task 2: Gosok Gigi */}
              <div className="p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center text-lg shrink-0">
                    🦷
                  </div>
                  <div>
                    <h3 className="font-['Fredoka'] font-bold text-sm text-slate-800">
                      Gosok Gigi
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      {(student.modulesProgress?.menggosokGigi ?? 0) > 0 ? 'Aktif Terjadwal' : 'Belum Dimulai'}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full shrink-0 ${
                  (student.modulesProgress?.menggosokGigi ?? 0) > 0
                    ? 'text-sky-700 bg-sky-100'
                    : 'text-slate-500 bg-slate-100'
                }`}>
                  {(student.modulesProgress?.menggosokGigi ?? 0) > 0 ? 'Aktif' : 'Belum Mulai'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Kemajuan Siswa */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  ⭐
                </div>
                <div>
                  <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                    Kemajuan {effectiveStudentName}
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Pencapaian Pekan Ini
                  </p>
                </div>
              </div>

              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                student.weeklyStars > 0
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-slate-600 bg-slate-100 border-slate-200'
              }`}>
                {student.weeklyStars > 0 ? 'Hebat!' : 'Mulai Latihan'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <span className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {student.weeklyStars || 0} dari {student.maxWeeklyStars || 10} Bintang
                </span>
              </div>

              {/* 10 Stars row */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: student.maxWeeklyStars || 10 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      i < (student.weeklyStars || 0)
                        ? 'bg-amber-400 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-300'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${i < (student.weeklyStars || 0) ? 'fill-white text-white' : 'text-slate-300'}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-sky-50/70 rounded-2xl border border-sky-100 flex items-center gap-2.5 text-xs text-sky-900 font-semibold">
            <span>{student.weeklyStars > 0 ? '😊' : '🌟'}</span>
            <span>
              {student.weeklyStars > 0
                ? `${effectiveStudentName} semakin mandiri mendengarkan instruksi suara!`
                : `Ajak ananda memulai modul bina diri suara untuk mengumpulkan bintang pertamanya!`}
            </span>
          </div>
        </div>

        {/* Card 3: Catatan Guru (Buku Penghubung) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                    Catatan Guru
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold">
                    Buku Penghubung
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {latestHandbookEntry?.timestamp || student.latestTeacherNote?.timestamp || 'Hari Ini'}
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 mb-4">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-md">
                  GURU
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {latestHandbookEntry?.authorName || effectiveTeacherName}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                “{latestHandbookEntry?.content || student.latestTeacherNote?.text || `Ananda ${effectiveStudentName} telah terdaftar di kelas inklusi BISA.`}”
              </p>
            </div>
          </div>

          <button
            onClick={onOpenHandbook}
            className="w-full py-2.5 px-4 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-sky-200 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-sky-600" />
            <span>Balas Pesan Guru di Buku Penghubung</span>
          </button>
        </div>

        {/* Card 4: Latihan di Rumah (Fully Dynamic with Student Name) */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                🏠
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                  Latihan di Rumah
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Panduan Santai Bunda / Ayah
                </p>
              </div>
            </div>

            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 mb-4">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1">
                <span>💡</span>
                <span>Tips Santai:</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                “Ajak {effectiveStudentName} memegang sabun dan memutar keran air secara mandiri saat sebelum makan.”
              </p>
            </div>
          </div>

          <button
            onClick={onOpenVoicePractice}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-['Fredoka'] font-bold text-sm rounded-xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Buka Panduan Suara Mandiri</span>
            <Play className="w-4 h-4 fill-white" />
          </button>
        </div>

      </div>

      {/* Encouraging Footer Note (Dynamic Student Name) */}
      <div className="text-center p-4 bg-white/70 rounded-2xl border border-slate-100 shadow-2xs">
        <p className="text-xs sm:text-sm font-semibold text-slate-600 flex items-center justify-center gap-1.5 flex-wrap">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-400" />
          <span>Setiap langkah kecil {effectiveStudentName} adalah kemenangan besar. Nikmati prosesnya dengan senyuman.</span>
        </p>
      </div>

      {/* Teacher Profile Viewer Modal for Parents */}
      <TeacherProfileModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        roomCode={effectiveRoomCode}
        teacherName={effectiveTeacherName}
        schoolName={effectiveSchoolName}
      />

    </div>
  );
};
