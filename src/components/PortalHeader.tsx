import React, { useState } from 'react';
import { Search, LogOut, ShieldCheck, RefreshCw, X, ChevronRight, Users, Menu } from 'lucide-react';
import { DailyNotification, UserSession, StudentProgress } from '../types';
import { NotificationCenter } from './notifications/NotificationCenter';
import { UserAvatar } from './common/UserAvatar';

interface PortalHeaderProps {
  onBackToStudent?: () => void;
  notifications: DailyNotification[];
  onMarkNotificationsRead: () => void;
  onClearNotifications?: () => void;
  onDeleteNotification?: (id: string) => void;
  currentUser: UserSession | null;
  onLogout: () => void;
  isOnline: boolean;
  pendingSyncCount: number;
  academicYear?: string;
  autoSyncEnabled?: boolean;
  onToggleAutoSync?: () => void;
  showStudentModeButton?: boolean;
  students?: StudentProgress[];
  onSelectStudent?: (student: StudentProgress) => void;
  onToggleMobileSidebar?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({
  onBackToStudent,
  notifications,
  onMarkNotificationsRead,
  onClearNotifications,
  onDeleteNotification,
  currentUser,
  onLogout,
  isOnline,
  pendingSyncCount,
  academicYear = '2026/2027',
  autoSyncEnabled = true,
  onToggleAutoSync,
  showStudentModeButton = false,
  students = [],
  onSelectStudent,
  onToggleMobileSidebar
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = searchQuery.trim()
    ? students.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.roomCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : students;

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-slate-100 px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: Mobile Sidebar Hamburger + Academic Year + Realtime Sync Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              aria-label="Buka Menu Portal"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 md:hidden cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs font-semibold text-slate-700 bg-slate-100/90 px-3 py-1 rounded-full border border-slate-200/60 hidden sm:inline">
            Tahun Ajaran {academicYear}
          </span>

          {/* Sync indicator with direct click toggle */}
          <button
            type="button"
            onClick={onToggleAutoSync}
            title={autoSyncEnabled ? "Klik untuk nonaktifkan sinkronisasi otomatis" : "Klik untuk aktifkan sinkronisasi otomatis"}
            className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border transition-all cursor-pointer ${
              !isOnline
                ? 'text-amber-800 bg-amber-50 border-amber-200/60'
                : autoSyncEnabled
                ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200/60'
                : 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              !isOnline 
                ? 'bg-amber-500' 
                : autoSyncEnabled 
                ? 'bg-emerald-500 animate-pulse' 
                : 'bg-slate-400'
            }`} />
            <span>
              {!isOnline 
                ? `Mode Offline (${pendingSyncCount} Tertunda)` 
                : autoSyncEnabled 
                ? 'Auto-Sync Aktif' 
                : 'Auto-Sync Nonaktif'}
            </span>
          </button>

          <div className="hidden xl:flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AES-256</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Automatic Daily Notification Center */}
          <NotificationCenter
            notifications={notifications}
            onMarkAllAsRead={onMarkNotificationsRead}
            onClear={() => {
              if (onClearNotifications) onClearNotifications();
            }}
            onDeleteNotification={onDeleteNotification}
          />

          {/* Active Search Button */}
          <button 
            type="button"
            onClick={() => setIsSearchOpen(true)}
            title="Cari siswa berdasarkan nama"
            aria-label="Cari siswa berdasarkan nama"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-100 hover:text-amber-800 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Info Capsule & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser?.name || 'Ibu Ratna, S.Pd'}
              </p>
              <p className="text-[10px] text-slate-400 capitalize">
                {currentUser?.role === 'teacher' ? 'Guru SLB' : 'Wali Murid'}
              </p>
            </div>

            <div onClick={onLogout} title="Klik untuk keluar / ganti akun" className="cursor-pointer">
              <UserAvatar avatar={currentUser?.avatar} name={currentUser?.name || 'User'} size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Student Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-scaleUp">
            {/* Search Input Bar */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3">
              <Search className="w-5 h-5 text-amber-500 shrink-0 ml-1" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama siswa yang ingin dicari..."
                className="w-full text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 rounded-lg cursor-pointer"
              >
                ESC
              </button>
            </div>

            {/* Search Results List */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Hasil Pencarian Siswa ({filteredStudents.length})</span>
                {searchQuery && <span className="text-amber-600">Kata kunci: "{searchQuery}"</span>}
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 px-4 text-slate-500">
                  <p className="text-xs font-semibold">Tidak ditemukan siswa dengan nama "{searchQuery}".</p>
                  <p className="text-[11px] text-slate-400 mt-1">Pastikan ejaan nama sudah benar.</p>
                </div>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (onSelectStudent) {
                        onSelectStudent(s);
                      }
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200 transition-all text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <UserAvatar avatar={s.avatar} name={s.name} size="md" />
                      <div>
                        <h4 className="font-['Fredoka'] font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                          {s.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{s.class}</span>
                          <span>•</span>
                          <span className="font-mono text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                            {s.roomCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-700 bg-slate-100 group-hover:bg-amber-100 px-2.5 py-1 rounded-full">
                        {s.progressPercentage}% Mandiri
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

