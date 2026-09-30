import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Activity, 
  Search, 
  X, 
  Trash2,
  Copy,
  Check,
  UserCheck,
  Eye,
  Phone
} from 'lucide-react';
import { StudentProgress, UserSession } from '../../types';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserAvatar } from '../common/UserAvatar';
import { soundEffects } from '../../utils/soundEffects';
import { ParentAccountsModal } from './ParentAccountsModal';

interface TeacherDashboardProps {
  students: StudentProgress[];
  onSelectStudent: (student: StudentProgress) => void;
  pendingHelpCount: number;
  onOpenAddStudent?: () => void;
  onOpenAnalytics?: () => void;
  onDeleteStudent?: (student: StudentProgress) => void;
  currentUser?: UserSession | null;
  onViewAsParent?: (student: StudentProgress) => void;
  onOpenHandbookForStudent?: (studentId: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  students,
  onSelectStudent,
  pendingHelpCount,
  onOpenAddStudent,
  onOpenAnalytics,
  onDeleteStudent,
  currentUser,
  onViewAsParent,
  onOpenHandbookForStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<StudentProgress | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isParentAccountsOpen, setIsParentAccountsOpen] = useState(false);

  const roomCode = currentUser?.roomCode || 'SLB-BUDI-01';
  const totalCompleted = students.reduce((acc, curr) => acc + curr.completedActivities, 0);

  const filteredStudents = searchQuery.trim()
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  const handleDeleteConfirm = () => {
    if (studentToDelete && onDeleteStudent) {
      onDeleteStudent(studentToDelete);
      setStudentToDelete(null);
    }
  };

  const handleCopyInviteCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopiedCode(true);
    soundEffects.playPop();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getStatusBadge = (status: StudentProgress['status']) => {
    switch (status) {
      case 'mandiri':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>Mandiri</span>
          </span>
        );
      case 'suara':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
            <Sparkles className="w-3 h-3" />
            <span>Suara</span>
          </span>
        );
      case 'butuh_bantuan':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            <AlertCircle className="w-3 h-3" />
            <span>Butuh Bantuan</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 w-full max-w-full">
      
      {/* Header Banner with Persistent Invite Code (Responsive) */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80 rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-100 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Dashboard Guru
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Pantauan Pembelajaran Bina Diri Kelas Inklusi • {currentUser?.school || 'SLB Negeri Budi Kasih'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
          {/* Persistent Room Code Card with Copy */}
          <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold">Kode Undangan:</span>
            <span className="font-mono font-extrabold text-xs sm:text-sm text-amber-900 tracking-wider">
              {roomCode}
            </span>
            <button
              type="button"
              onClick={handleCopyInviteCode}
              title="Salin Kode Undangan Kelas"
              className="p-1 rounded-md text-amber-600 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Teacher access to parent accounts */}
          <button
            onClick={() => setIsParentAccountsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Akun Orang Tua</span>
          </button>

          {onOpenAddStudent && (
            <button
              onClick={onOpenAddStudent}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>+ Tambah Siswa</span>
            </button>
          )}

          {onOpenAnalytics && (
            <button
              onClick={onOpenAnalytics}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
            >
              <span>Analitik</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Metric Cards Grid (Responsive 1 col on mobile, 3 cols on desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        
        {/* Card 1: Jumlah Siswa */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Jumlah Siswa
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Fredoka'] font-extrabold text-2xl sm:text-4xl text-slate-900 tabular-nums">
                  {students.length}
                </span>
                <span className="text-xs font-bold text-slate-500">Siswa Terdaftar</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Aktivitas Hari Ini */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Aktivitas Hari Ini
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Fredoka'] font-extrabold text-2xl sm:text-4xl text-slate-900 tabular-nums">
                  {totalCompleted}
                </span>
                <span className="text-xs font-bold text-slate-500">Sesi Tuntas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Permintaan Bantuan */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex items-center justify-between sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                Permintaan Bantuan
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-['Fredoka'] font-extrabold text-2xl sm:text-4xl text-rose-600 tabular-nums">
                  {pendingHelpCount}
                </span>
                <span className="text-xs font-bold text-rose-700">Perlu Respon</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Progress Siswa Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-slate-900">
                Progress Siswa & Catatan Evaluasi
              </h2>
              <p className="text-xs text-slate-500">
                Pilih siswa untuk melihat profil evaluasi, menulis catatan guru, dan memantau respon audio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari siswa berdasarkan nama..."
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Student Cards Grid (Responsive 1 col mobile, 2 col tablet/desktop) */}
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
              🧑‍🎓
            </div>
            <p className="text-sm font-bold text-slate-700">
              {searchQuery ? 'Tidak ada siswa yang sesuai dengan pencarian' : 'Belum Ada Siswa Terdaftar'}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchQuery 
                ? 'Coba gunakan kata kunci pencarian nama atau kelas yang lain.' 
                : `Akun guru baru aktif tanpa data awal. Bagikan kode undangan (${roomCode}) kepada wali murid atau tambahkan siswa pertama Anda.`}
            </p>
            {onOpenAddStudent && (
              <button
                onClick={onOpenAddStudent}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>+ Tambah Siswa Baru</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudent(student)}
                className="p-4 sm:p-5 rounded-2xl border border-slate-100 bg-white hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <UserAvatar avatar={student.avatar} name={student.name} size="lg" />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-['Fredoka'] font-bold text-base sm:text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                          {student.name}
                        </h3>
                        {getStatusBadge(student.status)}
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        {student.class} • Wali: <strong className="text-slate-700">{student.parentName}</strong>
                      </p>
                    </div>
                  </div>

                  {onDeleteStudent && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setStudentToDelete(student);
                      }}
                      title="Hapus Siswa"
                      className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Progress bar and activity info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 truncate max-w-[200px]">
                      Aktivitas: {student.currentActivity || 'Belum Ada'}
                    </span>
                    <span className="text-emerald-700 tabular-nums">
                      {student.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full transition-all"
                      style={{ width: `${student.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">
                    ⭐ {student.weeklyStars || 0}/10 Bintang
                  </span>
                  <span className="text-amber-600 font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Buka Lembar Evaluasi & Catatan</span>
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <ConfirmModal
          isOpen={true}
          title={`Hapus Siswa: ${studentToDelete.name}?`}
          message={`Apakah Anda yakin ingin menghapus data siswa ${studentToDelete.name}? Seluruh riwayat latihan dan catatan evaluasi akan dihapus permanen.`}
          confirmLabel="Ya, Hapus Siswa"
          confirmVariant="danger"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setStudentToDelete(null)}
        />
      )}

      {/* Parent Accounts Modal for Teachers */}
      <ParentAccountsModal
        isOpen={isParentAccountsOpen}
        onClose={() => setIsParentAccountsOpen(false)}
        students={students}
        roomCode={roomCode}
        onViewAsParent={onViewAsParent}
        onOpenHandbookForStudent={onOpenHandbookForStudent}
      />

    </div>
  );
};
