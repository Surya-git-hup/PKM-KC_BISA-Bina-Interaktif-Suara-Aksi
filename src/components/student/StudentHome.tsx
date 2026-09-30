import React from 'react';
import { ArrowRight, Star, BellRing, Sparkles, Play } from 'lucide-react';
import { BinaDiriModule } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface StudentHomeProps {
  modules: BinaDiriModule[];
  onSelectModule: (module: BinaDiriModule) => void;
  onOpenHelp: () => void;
  completedCount: number;
  studentName?: string;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  modules,
  onSelectModule,
  onOpenHelp,
  completedCount,
  studentName = 'Sobat BISA'
}) => {
  const handleStartDefault = () => {
    if (modules.length > 0) {
      soundEffects.speakIndonesian(`Ayo kita mulai latihan ${modules[0].title}. Pertama kita kenali dulu alat-alatnya.`);
      onSelectModule(modules[0]);
    }
  };

  const handleChooseModule = (module: BinaDiriModule) => {
    soundEffects.playPop();
    soundEffects.speakIndonesian(`Hebat! Kamu memilih modul ${module.title}. Ayo kita siapkan peralatannya.`);
    onSelectModule(module);
  };

  const getButtonColor = (index: number) => {
    switch (index % 4) {
      case 0:
        return 'bg-[#0369A1] hover:bg-[#0284C7] shadow-sky-600/20';
      case 1:
        return 'bg-[#047857] hover:bg-[#059669] shadow-emerald-600/20';
      case 2:
        return 'bg-[#D97706] hover:bg-[#F59E0B] shadow-amber-600/20';
      case 3:
        return 'bg-[#2563EB] hover:bg-[#3B82F6] shadow-blue-600/20';
      default:
        return 'bg-sky-600 hover:bg-sky-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner (as in IMG-20260926-WA0009.jpg) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-50/90 via-amber-50/70 to-emerald-50/90 border border-slate-100 p-6 sm:p-10 flex flex-col items-center text-center shadow-xs">
        {/* Soft background radial glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center">
          {/* Greeting Capsule with Avatar */}
          <div className="inline-flex items-center gap-3.5 bg-white/95 px-5 py-2.5 rounded-full shadow-sm border border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center text-xl shadow-inner">
              🧒
            </div>
            <div className="text-left">
              <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-800 leading-tight">
                Halo {studentName}!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Yuk berpetualang seru hari ini!
              </p>
            </div>
          </div>

          {/* Big Action Button "MULAI BELAJAR" */}
          <button
            onClick={handleStartDefault}
            className="w-full sm:w-72 py-3.5 px-6 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-['Fredoka'] font-bold text-base sm:text-lg tracking-wide rounded-2xl shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer uppercase"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Mulai Belajar</span>
          </button>
        </div>
      </div>

      {/* Section: Pilih Kegiatan Hari Ini */}
      <div>
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-2 h-6 bg-amber-500 rounded-full"></span>
          <h3 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Pilih Kegiatan Hari Ini
          </h3>
        </div>

        {/* 4 Cards Grid matching screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod, idx) => (
            <div
              key={mod.id}
              className="bg-white rounded-3xl p-4 border border-slate-100/90 shadow-sm hover:shadow-md transition-all flex flex-col group overflow-hidden"
            >
              {/* Image Frame */}
              <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 relative mb-4">
                <img
                  src={mod.image}
                  alt={mod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                  {mod.totalSteps} Langkah
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-4 flex-1">
                <h4 className="font-['Fredoka'] font-bold text-lg text-slate-800">
                  {mod.title}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {mod.subtitle}
                </p>
              </div>

              {/* CTA Button matching UI designs */}
              <button
                onClick={() => handleChooseModule(mod)}
                className={`w-full py-2.5 px-4 rounded-xl text-white font-['Fredoka'] font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer ${getButtonColor(idx)}`}
              >
                <span>Mulai</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Progress Card: Progres Budi Hari Ini */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* Left: Star Progress Counter */}
        <div className="space-y-3 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-['Fredoka'] font-bold text-base sm:text-lg text-slate-800">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Progres {studentName} Hari Ini</span>
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full">
              {completedCount} / 10 Aktivitas Selesai
            </span>
          </div>

          {/* 10 Stars row */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                  i < completedCount
                    ? 'bg-amber-400 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                <Star
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    i < completedCount ? 'fill-white text-white' : 'text-slate-300'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Emergency Help / Teacher Assistance Call Button */}
        <button
          onClick={onOpenHelp}
          className="w-full md:w-auto py-3 px-6 bg-rose-50 hover:bg-rose-100 text-rose-700 font-['Fredoka'] font-bold text-sm rounded-2xl border border-rose-200/80 flex items-center justify-center gap-2.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <BellRing className="w-4 h-4 text-rose-500" />
          <span>Panggil Guru / Bantuan</span>
        </button>

      </div>

    </div>
  );
};
