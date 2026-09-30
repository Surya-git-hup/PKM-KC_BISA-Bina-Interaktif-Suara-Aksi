import React from 'react';
import { 
  Rocket, 
  ArrowRight, 
  Star, 
  ChevronDown, 
  Sparkles, 
  CheckCircle2, 
  Play 
} from 'lucide-react';
import { BinaDiriModule, StudentProgress, UserSession } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { UserAvatar } from '../common/UserAvatar';

interface StudentActivityPickerProps {
  modules: BinaDiriModule[];
  students: StudentProgress[];
  selectedStudent: StudentProgress | null;
  onSelectStudent: (student: StudentProgress) => void;
  onSelectModule: (module: BinaDiriModule) => void;
  currentUser?: UserSession | null;
  completedCount: number;
}

export const StudentActivityPicker: React.FC<StudentActivityPickerProps> = ({
  modules,
  students,
  selectedStudent,
  onSelectStudent,
  onSelectModule,
  currentUser,
  completedCount
}) => {
  const currentStudent = selectedStudent || (students.length > 0 ? students[0] : null);
  const studentName = currentStudent?.name || currentUser?.childName || currentUser?.name || 'Sobat BISA';
  
  // Get student's call name (nama panggilan)
  const studentNickname = currentStudent?.nickname || currentStudent?.name?.trim().split(/\s+/)[0] || currentUser?.childName?.trim().split(/\s+/)[0] || 'Sobat BISA';

  const handleStartDefault = () => {
    if (modules.length > 0) {
      soundEffects.speakIndonesian(`Ayo kita mulai belajar bersama ${studentNickname}. Pertama kita kenali dulu perlengkapan ${modules[0].title}.`);
      onSelectModule(modules[0]);
    }
  };

  const handleChooseModule = (module: BinaDiriModule) => {
    soundEffects.playPop();
    soundEffects.speakIndonesian(`Hebat! ${studentNickname} memilih kegiatan ${module.title}. Ayo bersiap!`);
    onSelectModule(module);
  };

  // Distinct vibrant color palettes for each module's start button
  const getModuleStyle = (modId: string, index: number) => {
    switch (modId) {
      case 'cuci-tangan':
        return {
          btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30',
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          borderHover: 'group-hover:border-emerald-300'
        };
      case 'gosok-gigi':
        return {
          btnClass: 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/30',
          badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
          borderHover: 'group-hover:border-sky-300'
        };
      case 'memakai-pakaian':
        return {
          btnClass: 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30',
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          borderHover: 'group-hover:border-amber-300'
        };
      case 'makan-mandiri':
        return {
          btnClass: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30',
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
          borderHover: 'group-hover:border-purple-300'
        };
      default: {
        const colorPalette = [
          { btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', hover: 'group-hover:border-emerald-300' },
          { btn: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/30', badge: 'bg-sky-50 text-sky-700 border-sky-200', hover: 'group-hover:border-sky-300' },
          { btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30', badge: 'bg-amber-50 text-amber-700 border-amber-200', hover: 'group-hover:border-amber-300' },
          { btn: 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30', badge: 'bg-purple-50 text-purple-700 border-purple-200', hover: 'group-hover:border-purple-300' },
          { btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30', badge: 'bg-rose-50 text-rose-700 border-rose-200', hover: 'group-hover:border-rose-300' },
          { btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30', badge: 'bg-teal-50 text-teal-700 border-teal-200', hover: 'group-hover:border-teal-300' }
        ];
        const pick = colorPalette[index % colorPalette.length];
        return {
          btnClass: `${pick.btn} text-white`,
          badgeClass: pick.badge,
          borderHover: pick.hover
        };
      }
    }
  };

  // 10 stars calculation
  const totalStarsTarget = 10;
  const currentEarnedStars = Math.min(
    totalStarsTarget,
    currentStudent?.weeklyStars || completedCount || 4
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-fadeIn">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/90 via-sky-50/70 to-emerald-50/90 border border-slate-100 p-6 sm:p-10 shadow-xs">
        
        {/* Soft decorative background glows */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-amber-300/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center text-center space-y-5">
          
          {/* Greeting Capsule with Student Avatar and Student Nickname */}
          <div className="inline-flex items-center gap-3.5 bg-white/95 px-6 py-3 rounded-full shadow-sm border border-slate-100">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shadow-inner">
              <UserAvatar avatar={currentStudent?.avatar} name={studentNickname} size="md" />
            </div>
            <div className="text-left">
              <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-800 leading-tight">
                Halo {studentNickname}!
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-500">
                Yuk berpetualang seru hari ini!
              </p>
            </div>
          </div>

          {/* Student Selector Dropdown (Pilih Siswa yang Akan Belajar) */}
          <div className="w-full sm:w-80 space-y-1.5 text-left">
            <label className="block text-xs font-bold text-slate-600 text-center">
              Pilih Siswa yang Akan Belajar:
            </label>
            <div className="relative">
              <select
                value={currentStudent?.id || ''}
                onChange={(e) => {
                  const found = students.find(s => s.id === e.target.value);
                  if (found) {
                    onSelectStudent(found);
                    soundEffects.playPop();
                  }
                }}
                className="w-full appearance-none pl-11 pr-10 py-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.class})
                  </option>
                ))}
              </select>

              {/* Avatar Icon inside dropdown */}
              <div className="absolute left-3.5 top-2.5 pointer-events-none">
                <UserAvatar avatar={currentStudent?.avatar} name={studentNickname} size="xs" />
              </div>

              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Big Action Button "MULAI BELAJAR" */}
          <button
            onClick={handleStartDefault}
            className="w-full sm:w-80 py-4 px-8 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] active:scale-95 text-white font-['Fredoka'] font-bold text-lg tracking-wider rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer uppercase"
          >
            <span className="text-xl">🚀</span>
            <span>Mulai Belajar</span>
          </button>

        </div>
      </div>

      {/* Section: Pilih Kegiatan Hari Ini */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-amber-500 rounded-full"></span>
          <h3 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Pilih Kegiatan Hari Ini
          </h3>
        </div>

        {/* 4 Cards Grid with distinct colorful buttons per option */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map((mod, idx) => {
            const style = getModuleStyle(mod.id, idx);
            return (
              <div
                key={mod.id}
                className={`bg-white rounded-3xl p-4 border border-slate-100 ${style.borderHover} shadow-sm hover:shadow-md transition-all flex flex-col justify-between group overflow-hidden`}
              >
                <div>
                  {/* Image Frame */}
                  <div className="w-full h-44 rounded-2xl overflow-hidden bg-slate-100 relative mb-4">
                    <img
                      src={mod.image}
                      alt={mod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-xs">
                      {mod.totalSteps} Langkah
                    </div>
                  </div>

                  <h4 className="font-['Fredoka'] font-bold text-lg text-slate-900 text-center mb-1">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-500 text-center mb-4 line-clamp-1">
                    {mod.subtitle}
                  </p>
                </div>

                {/* Mulai Button with colorful styling distinct for each choice */}
                <button
                  onClick={() => handleChooseModule(mod)}
                  className={`w-full py-2.5 px-4 ${style.btnClass} active:scale-95 font-['Fredoka'] font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer`}
                >
                  <span>Mulai</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Progress Card with 10 Stars */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-500 text-lg">⭐</span>
            <h4 className="font-['Fredoka'] font-bold text-base sm:text-lg text-slate-900">
              Progres {studentNickname} Hari Ini: <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">{currentEarnedStars} / {totalStarsTarget} Aktivitas Selesai</span>
            </h4>
          </div>

          <span className="text-xs font-semibold text-slate-400">
            Kumpulkan 10 bintang untuk rapor mingguan bintang emas!
          </span>
        </div>

        {/* 10 Stars Row */}
        <div className="flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto py-2">
          {Array.from({ length: totalStarsTarget }).map((_, i) => {
            const isFilled = i < currentEarnedStars;
            return (
              <div
                key={i}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-amber-400 text-white shadow-md shadow-amber-300/40 scale-105'
                    : 'bg-slate-50 text-slate-300 border border-slate-200/60'
                }`}
              >
                <Star className={`w-5 h-5 sm:w-6 sm:h-6 ${isFilled ? 'fill-white' : ''}`} />
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
