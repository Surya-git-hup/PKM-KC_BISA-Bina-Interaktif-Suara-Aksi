import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, Volume2, Home, RotateCcw, Award, ThumbsUp, Sparkles } from 'lucide-react';
import { BinaDiriModule } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface ActivityCelebrationProps {
  module: BinaDiriModule;
  onHome: () => void;
  onRestart: () => void;
  starsEarned?: number;
  totalCollectedStars?: number;
}

export const ActivityCelebration: React.FC<ActivityCelebrationProps> = ({
  module,
  onHome,
  onRestart,
  starsEarned = 3,
  totalCollectedStars = 5
}) => {
  const teacherPraise = `Kamu luar biasa! Kamu sudah bisa membuka keran dan menyelesaikan latihan ${module.title.toLowerCase()} sendiri hari ini.`;

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });

    soundEffects.playCelebrationFanfare();
    soundEffects.speakIndonesian(`Hebat sekali! ${teacherPraise}`);
  }, [module.title, teacherPraise]);

  const handleReplayVoice = () => {
    soundEffects.playPop();
    soundEffects.speakIndonesian(teacherPraise);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 text-center animate-fadeIn">
      
      {/* Top Completion Pill */}
      <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-xs">
        <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
        <span>Aktivitas Selesai!</span>
        <Star className="w-4 h-4 text-amber-600 fill-amber-500" />
      </div>

      {/* Main Golden Trophy Medallion */}
      <div className="relative mx-auto flex flex-col items-center">
        <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-br from-amber-100 via-amber-50 to-orange-50 border-4 border-white shadow-xl flex items-center justify-center relative">
          
          {/* Top-right star badge */}
          <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md animate-bounce">
            <Star className="w-5 h-5 fill-white" />
          </div>

          {/* Bottom-left thumbs up badge */}
          <div className="absolute bottom-2 left-2 w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-md">
            <ThumbsUp className="w-5 h-5 fill-white" />
          </div>

          {/* SVG Golden Trophy with Smiling Face */}
          <div className="w-28 h-28 sm:w-32 sm:h-32 text-amber-500 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              {/* Handles */}
              <path d="M 25 35 Q 10 35 15 50 Q 20 62 30 60" fill="none" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
              <path d="M 75 35 Q 90 35 85 50 Q 80 62 70 60" fill="none" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
              {/* Cup */}
              <path d="M 28 25 L 72 25 L 68 65 Q 50 78 32 65 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="4" />
              {/* Base stem */}
              <rect x="44" y="70" width="12" height="12" fill="#D97706" />
              <path d="M 32 82 L 68 82 L 72 92 L 28 92 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="3" />
              {/* Cute smiling face */}
              <circle cx="43" cy="45" r="3" fill="#78350F" />
              <circle cx="57" cy="45" r="3" fill="#78350F" />
              <path d="M 45 52 Q 50 57 55 52" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
              {/* Rosy cheeks */}
              <circle cx="39" cy="49" r="2.5" fill="#F87171" />
              <circle cx="61" cy="49" r="2.5" fill="#F87171" />
            </svg>
          </div>

        </div>

        {/* Title: Hebat, Rian! */}
        <h1 className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl text-slate-800 mt-5">
          Hebat, Rian!
        </h1>
      </div>

      {/* Voice Message Box: Pesan Guru Suara */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 text-xl font-bold">
            👩‍🏫
          </div>
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
              Pesan Guru Suara
            </span>
            <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
              "{teacherPraise}"
            </p>
          </div>
        </div>

        <button
          onClick={handleReplayVoice}
          className="flex items-center gap-2 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-full border border-sky-200 text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Volume2 className="w-4 h-4 text-sky-600" />
          <span>Dengarkan Lagi</span>
        </button>
      </div>

      {/* 2 Badges & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
        
        {/* Card 1: Hadiah Aktivitas */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                Hadiah Aktivitas
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </div>
            </div>
            <h3 className="font-['Fredoka'] font-bold text-lg text-slate-800 mb-3">
              +{starsEarned} Bintang Baru
            </h3>

            {/* Stars visual */}
            <div className="flex items-center gap-1.5 mb-4">
              {[1, 2, 3].map((s) => (
                <Star key={s} className="w-6 h-6 text-amber-400 fill-amber-400 animate-pulse" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1.5">
              <span>Koleksi Rian Hari Ini</span>
              <span className="font-bold text-slate-800">{totalCollectedStars} dari 10 Bintang</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-400 to-emerald-500 h-full rounded-full"
                style={{ width: `${(totalCollectedStars / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Lencana Kemandirian */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/60">
                Lencana Kemandirian
              </span>
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <h3 className="font-['Fredoka'] font-bold text-lg text-slate-800 mb-2">
              {module.badgeName}
            </h3>

            {/* Circular badge illustration */}
            <div className="w-14 h-14 rounded-full bg-sky-100/80 border-2 border-sky-200 flex items-center justify-center text-2xl my-2 mx-auto sm:mx-0">
              {module.badgeIcon}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {module.badgeDesc}
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Nav Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-xl mx-auto">
        <button
          onClick={onHome}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-['Fredoka'] font-bold text-base rounded-2xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Home className="w-5 h-5" />
          <span>Kembali ke Beranda</span>
        </button>

        <button
          onClick={onRestart}
          className="w-full sm:w-auto flex-1 py-3.5 px-6 bg-white hover:bg-slate-50 text-slate-700 font-['Fredoka'] font-bold text-base rounded-2xl border border-slate-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-5 h-5 text-slate-500" />
          <span>Ulangi Latihan</span>
        </button>
      </div>

    </div>
  );
};
