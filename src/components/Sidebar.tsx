import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  BookOpen, 
  Settings, 
  Mic, 
  LogOut,
  GraduationCap,
  BarChart3,
  UserPlus,
  Eye,
  ShieldCheck,
  UserCheck,
  X
} from 'lucide-react';
import { AppView, UserRole, UserSession, StudentProgress } from '../types';
import { soundEffects } from '../utils/soundEffects';
import { BisaAvatar } from './common/BisaAvatar';
import { TeacherProfileModal } from './common/TeacherProfileModal';
import { ParentAccountsModal } from './teacher/ParentAccountsModal';

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  onOpenAddStudent?: () => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
  students?: StudentProgress[];
  onViewAsParent?: (student: StudentProgress) => void;
  onOpenHandbookForStudent?: (studentId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  onRoleChange,
  currentView,
  onNavigate,
  currentUser,
  onLogout,
  onOpenAddStudent,
  isOpenOnMobile = false,
  onCloseMobile,
  students = [],
  onViewAsParent,
  onOpenHandbookForStudent
}) => {
  const [isTeacherProfileOpen, setIsTeacherProfileOpen] = useState(false);
  const [isParentAccountsOpen, setIsParentAccountsOpen] = useState(false);

  const roomCode = currentUser?.roomCode || 'SLB-BUDI-01';
  const teacherName = currentUser?.role === 'teacher' ? currentUser.name : (currentUser?.teacherName || 'Ibu Ratna, S.Pd');
  const schoolName = currentUser?.school || 'SLB Budi Kasih Bengkulu';

  const handleNavClick = (view: AppView) => {
    onNavigate(view);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay when sidebar is open on phones */}
      {isOpenOnMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden animate-fadeIn"
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 min-h-screen
        transform transition-transform duration-200 ease-in-out
        ${isOpenOnMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Brand & Portal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                <BisaAvatar size={40} showShadow={false} />
              </div>
              <div className="min-w-0">
                <h1 className="font-['Fredoka'] font-bold text-xl text-slate-900 tracking-tight leading-none truncate">
                  BISA
                </h1>
                <p className="text-xs font-semibold text-slate-500 mt-1 truncate">Portal Evaluasi</p>
              </div>
            </div>

            {/* Mobile close drawer button */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dual Perspective Menu: [ Guru SLB | Orang Tua ]
              - On Akun Guru: "Guru SLB" is active; clicking "Orang Tua" opens Akun Orang Tua (Parent Accounts Modal).
                (Deleted: "Kode: SLB-BUDI-01 \n Akun Wali Murid →")
              - On Akun Orang Tua: "Orang Tua" is active; clicking "Guru SLB" opens Profil Guru Kelas (Teacher Profile Modal).
                (Deleted: "Peran: Orang Tua Murid \n Wali Murid \n Lihat Profil Guru Kelas")
          */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                if (currentRole === 'teacher') {
                  onRoleChange('teacher');
                  handleNavClick('teacher_dashboard');
                } else {
                  // Pada akun orang tua: dialihkan ke Profil Guru Kelas
                  setIsTeacherProfileOpen(true);
                }
              }}
              title={currentRole === 'parent' ? "Lihat Profil Guru Kelas" : "Dashboard Guru SLB"}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                currentRole === 'teacher'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
              <span>Guru SLB</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundEffects.playPop();
                if (currentRole === 'parent') {
                  onRoleChange('parent');
                  handleNavClick('parent_dashboard');
                } else {
                  // Pada akun guru: dialihkan ke Akun Orang Tua (Parent Accounts Modal)
                  setIsParentAccountsOpen(true);
                }
              }}
              title={currentRole === 'teacher' ? "Akses Akun Orang Tua Murid" : "Dashboard Orang Tua"}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                currentRole === 'parent'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Orang Tua</span>
            </button>
          </div>

        </div>

        {/* Nav Menu Links */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <button
            onClick={() => handleNavClick(currentRole === 'teacher' ? 'teacher_dashboard' : 'parent_dashboard')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'teacher_dashboard' || currentView === 'parent_dashboard'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          {currentRole === 'teacher' && (
            <>
              <button
                onClick={() => handleNavClick('teacher_student_detail')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentView === 'teacher_student_detail'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Evaluasi Siswa</span>
              </button>

              <button
                onClick={() => handleNavClick('teacher_analytics')}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  currentView === 'teacher_analytics'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <span>Analitik & Nilai</span>
              </button>
            </>
          )}

          <button
            onClick={() => handleNavClick('student_home')}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Aktivitas Siswa</span>
          </button>

          <button
            onClick={() => handleNavClick('handbook')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'handbook'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-500" />
            <span>Buku Penghubung</span>
          </button>

          <button
            onClick={() => handleNavClick('settings')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              currentView === 'settings'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Pengaturan</span>
          </button>

          {currentRole === 'teacher' && onOpenAddStudent && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenAddStudent();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold border border-amber-200 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-amber-600" />
                <span>Tambah Siswa Baru</span>
              </button>
            </div>
          )}
        </nav>

        {/* Footer: User Information Capsule & Logout */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-amber-800 shrink-0">
                {currentUser?.avatar || (currentRole === 'teacher' ? '👩‍🏫' : '👩')}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {currentUser?.name || (currentRole === 'teacher' ? 'Ibu Ratna, S.Pd' : 'Orang Tua Murid')}
                </p>
                <p className="text-[10px] text-slate-400 capitalize truncate">
                  {currentRole === 'teacher' ? 'Wali Kelas' : (currentUser?.childName ? `Wali ${currentUser.childName}` : 'Wali Murid')}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Keluar"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </aside>

      {/* Teacher Profile Viewer Modal (Available for Parents) */}
      <TeacherProfileModal
        isOpen={isTeacherProfileOpen}
        onClose={() => setIsTeacherProfileOpen(false)}
        roomCode={roomCode}
        teacherName={teacherName}
        schoolName={schoolName}
      />

      {/* Parent Accounts Access Modal (Available for Teachers) */}
      <ParentAccountsModal
        isOpen={isParentAccountsOpen}
        onClose={() => setIsParentAccountsOpen(false)}
        students={students}
        roomCode={roomCode}
        onViewAsParent={onViewAsParent}
        onOpenHandbookForStudent={onOpenHandbookForStudent}
      />
    </>
  );
};
