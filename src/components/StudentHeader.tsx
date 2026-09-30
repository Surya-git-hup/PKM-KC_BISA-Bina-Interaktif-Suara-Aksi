import React, { useState } from 'react';
import { Volume2, VolumeX, User, Sparkles, SlidersHorizontal, LogOut, Menu, X } from 'lucide-react';
import { AppView, UserRole, UserSession, StudentProgress } from '../types';
import { UserAvatar } from './common/UserAvatar';
import { BisaAvatar } from './common/BisaAvatar';

interface StudentHeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  onSwitchRole: (role: UserRole) => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  onOpenHelp: () => void;
  currentUser?: UserSession | null;
  selectedStudent?: StudentProgress | null;
  onLogout?: () => void;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  currentView,
  onNavigate,
  onSwitchRole,
  isSoundOn,
  onToggleSound,
  onOpenHelp,
  currentUser,
  selectedStudent,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const studentNickname = selectedStudent?.nickname || selectedStudent?.name?.trim().split(/\s+/)[0];
  const displayName = studentNickname || currentUser?.childName || currentUser?.name?.split(' ')[0] || 'Sobat BISA';
  const displayAvatar = selectedStudent?.avatar || currentUser?.avatar || '😊';

  const handlePortalNavigate = () => {
    // SECURITY: Parent can NEVER be switched to teacher!
    if (currentUser?.role === 'parent') {
      onSwitchRole('parent');
      onNavigate('parent_dashboard');
    } else {
      onSwitchRole('teacher');
      onNavigate('teacher_dashboard');
    }
  };

  const navItems: { view: AppView; label: string }[] = [
    { view: 'student_home', label: 'Beranda' },
    { view: 'student_activities', label: 'Pilih Aktivitas' },
    { view: 'student_equipment', label: 'Belajar' },
    { view: 'student_voice', label: 'Suara' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs px-3 sm:px-6 md:px-8 py-2.5 sm:py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => onNavigate('student_home')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
            <BisaAvatar size={38} showShadow={false} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-['Fredoka'] font-bold text-xl sm:text-2xl tracking-tight text-slate-800">BISA</span>
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-amber-400" />
            </div>
          </div>
        </div>

        {/* Center: Desktop Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/60">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                currentView === item.view || (item.view === 'student_equipment' && (currentView === 'student_activity' || currentView === 'student_celebration'))
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={onOpenHelp}
            className="px-4 py-1.5 rounded-full text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
          >
            Bantuan
          </button>
        </nav>

        {/* Right: Sound Toggle + User Capsule + Portal + Mobile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Sound toggle button */}
          <button
            onClick={onToggleSound}
            aria-label="Toggle Sound"
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              isSoundOn
                ? 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 shadow-xs'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />}
            <span className="hidden sm:inline whitespace-nowrap">{isSoundOn ? 'Suara On' : 'Suara Off'}</span>
          </button>

          {/* User profile capsule: Halo [Name]! */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-50/80 border border-amber-200/70 rounded-full pl-2.5 sm:pl-3 pr-1 py-0.5">
            <span className="text-xs font-bold text-amber-900 whitespace-nowrap max-w-[90px] sm:max-w-none truncate">
              Halo {displayName}!
            </span>
            <UserAvatar avatar={displayAvatar} name={displayName} size="xs" />
          </div>

          {/* Quick Portal Switcher (Secured: No parent access to teacher role) */}
          <button
            onClick={handlePortalNavigate}
            title={currentUser?.role === 'parent' ? 'Buka Portal Orang Tua' : 'Buka Dashboard Guru'}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              title="Keluar"
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors cursor-pointer hidden sm:block"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl bg-slate-100 text-slate-700 md:hidden cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Dropdown for small screens */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5 animate-fadeIn pb-1">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => {
                onNavigate(item.view);
                setIsMobileMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === item.view
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onOpenHelp();
              setIsMobileMenuOpen(false);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 cursor-pointer"
          >
            Bantuan
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-rose-600 cursor-pointer"
            >
              Keluar
            </button>
          )}
        </div>
      )}
    </header>
  );
};
