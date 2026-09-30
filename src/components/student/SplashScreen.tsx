import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  UserCheck
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { UserSession } from '../../types';
import { BisaAvatar } from '../common/BisaAvatar';

interface SplashScreenProps {
  currentUser?: UserSession | null;
  onNavigateHome: () => void;
  onNavigateRegister: () => void;
  onNavigateLogin?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  currentUser,
  onNavigateHome,
  onNavigateRegister,
  onNavigateLogin
}) => {
  const isLoggedIn = !!currentUser;

  const handlePrimaryClick = () => {
    soundEffects.playListenPing();
    if (isLoggedIn) {
      onNavigateHome();
    } else {
      onNavigateRegister();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F3F8FE] via-[#FFFFFF] to-[#EFFBF4] flex flex-col items-center justify-between p-6 sm:p-8 relative overflow-hidden select-none">
      
      {/* Decorative Ambient Background Pastel Glow Orbs */}
      <div className="absolute -top-12 -left-12 w-80 h-80 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-16 w-72 h-72 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -right-16 w-88 h-88 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 right-1/4 w-72 h-72 rounded-full bg-sky-200/35 blur-2xl pointer-events-none" />

      {/* Spacer */}
      <div className="pt-4" />

      {/* Center Hero Section */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full text-center my-auto py-4">
        
        {/* Mascot Circular Avatar matching reference image */}
        <div className="relative mb-8 group">
          <div className="transform group-hover:scale-105 transition-all duration-300">
            <BisaAvatar size={270} showShadow={true} />
          </div>
        </div>

        {/* Brand Title: BISA */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-['Fredoka'] font-black text-5xl sm:text-6xl text-[#0284C7] tracking-tight drop-shadow-xs">
              BISA
            </h1>
            <span className="text-3xl sm:text-4xl text-amber-400 animate-pulse">✨</span>
          </div>

          {/* Tagline Pill */}
          <div>
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-sky-50 border border-sky-200/70 text-sky-800 text-xs sm:text-sm font-bold tracking-wide">
              Bina Interaktif Suara-Aksi
            </div>
          </div>
        </div>

        {/* Logged In Status Banner */}
        {isLoggedIn && (
          <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-3 mb-5 border border-sky-100 shadow-sm flex items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
                {currentUser?.avatar || (currentUser?.role === 'teacher' ? '👩‍🏫' : '👨‍👩‍👧')}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Akun Tersimpan:</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                    <UserCheck className="w-3 h-3" />
                    {currentUser?.role === 'teacher' ? 'Guru SLB' : 'Orang Tua'}
                  </span>
                </div>
                <div className="font-['Fredoka'] font-bold text-slate-800 text-sm">
                  {currentUser?.name}
                </div>
              </div>
            </div>
            <span className="text-[11px] text-sky-700 font-bold bg-sky-50 border border-sky-200/60 px-2 py-1 rounded-lg">
              Sudah Login
            </span>
          </div>
        )}

        {/* Primary Action Button */}
        {/* Logic:
            - If user already logged in -> Navigate directly to Beranda (student_home / teacher_dashboard / parent_dashboard)
            - If first time -> Navigate to Registration */}
        <button
          onClick={handlePrimaryClick}
          className="w-full sm:w-80 py-4 px-8 bg-gradient-to-r from-[#0284C7] via-[#0369A1] to-[#0284C7] hover:from-[#0369A1] hover:to-[#075985] text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 transition-all duration-200 transform hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span>
            {isLoggedIn ? 'Masuk ke Beranda' : 'Mulai Sekarang'}
          </span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>

        {/* Secondary Sub-action Link */}
        <div className="mt-4 text-xs font-bold">
          {isLoggedIn ? (
            <button
              onClick={() => {
                soundEffects.playPop();
                if (onNavigateRegister) onNavigateRegister();
              }}
              className="text-sky-700 hover:text-sky-900 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Ganti Akun / Daftarkan Pengguna Baru
            </button>
          ) : (
            <button
              onClick={() => {
                soundEffects.playPop();
                if (onNavigateLogin) {
                  onNavigateLogin();
                } else {
                  onNavigateRegister();
                }
              }}
              className="text-sky-700 hover:text-sky-900 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Sudah punya akun? Masuk di sini
            </button>
          )}
        </div>
      </div>

      {/* Bottom Pagination / Indicator Dots */}
      <div className="relative z-10 flex items-center justify-center gap-2 py-2">
        <span className="w-2 h-2 rounded-full bg-teal-400/80"></span>
        <span className="w-6 h-2 rounded-full bg-sky-500 shadow-xs"></span>
        <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
      </div>

    </div>
  );
};
