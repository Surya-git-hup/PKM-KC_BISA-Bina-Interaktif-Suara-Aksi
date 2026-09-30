import React, { useState } from 'react';
import { Bell, Check, Sparkles, CheckCircle2, AlertCircle, CloudCheck, X, Trash2 } from 'lucide-react';
import { DailyNotification } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface NotificationCenterProps {
  notifications: DailyNotification[];
  onMarkAllAsRead: () => void;
  onClear: () => void;
  onDeleteNotification?: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAllAsRead,
  onClear,
  onDeleteNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleToggle = () => {
    soundEffects.playPop();
    setIsOpen(!isOpen);
  };

  const getIcon = (type: DailyNotification['type']) => {
    switch (type) {
      case 'activity_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'help_requested':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'teacher_note':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'sync_success':
        return <span className="text-xs">☁️</span>;
    }
  };

  return (
    <div className="relative">
      
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        aria-label="Notifikasi Progres Harian Otomatis"
        className="relative w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-2xl z-50 p-4 space-y-3 animate-fadeIn">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="font-['Fredoka'] font-bold text-sm text-slate-900">
                Notifikasi Progres Otomatis
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Harian
              </span>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={onMarkAllAsRead}
                  className="text-[11px] font-bold text-sky-700 hover:underline cursor-pointer"
                >
                  Tandai Dibaca
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onClear();
                  }}
                  title="Hapus semua notifikasi agar tidak menumpuk"
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Semua</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-slate-400 py-6">
                Belum ada notifikasi baru hari ini.
              </p>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-2xl border transition-colors relative group ${
                    notif.read
                      ? 'bg-slate-50/60 border-slate-100 text-slate-600'
                      : 'bg-amber-50/50 border-amber-200/80 text-slate-800 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="text-xs font-bold truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                    {onDeleteNotification && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundEffects.playPop();
                          onDeleteNotification(notif.id);
                        }}
                        title="Hapus notifikasi ini"
                        aria-label="Hapus notifikasi ini"
                        className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer self-start"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <span className="text-[10px] font-semibold text-slate-400">
              Notifikasi tersinkron otomatis antar guru dan orang tua
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
