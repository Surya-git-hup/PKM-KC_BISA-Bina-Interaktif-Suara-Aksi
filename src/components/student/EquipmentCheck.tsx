import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, RotateCcw, Check, Sparkles, Hand } from 'lucide-react';
import { BinaDiriModule, ActivityEquipment } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface EquipmentCheckProps {
  module: BinaDiriModule;
  onBack: () => void;
  onReadyToStart: () => void;
}

export const EquipmentCheck: React.FC<EquipmentCheckProps> = ({
  module,
  onBack,
  onReadyToStart
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const currentEquipment: ActivityEquipment = module.equipment[currentIndex] || module.equipment[0];

  useEffect(() => {
    // Speak introduction of current equipment
    if (currentEquipment) {
      soundEffects.speakIndonesian(
        `Alat nomor ${currentIndex + 1}: ${currentEquipment.name}. ${currentEquipment.description}`
      );
    }
  }, [currentIndex, currentEquipment]);

  const handlePlaySound = () => {
    setIsPlayingAudio(true);
    soundEffects.playSensorySound(currentEquipment.soundCue);
    soundEffects.speakIndonesian(`${currentEquipment.soundDescription}`, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleNext = () => {
    soundEffects.playPop();
    if (currentIndex < module.equipment.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      soundEffects.playCommandRecognized();
      soundEffects.speakIndonesian('Hebat! Semua alat sudah siap. Sekarang ayo kita mulai langkah latihan!');
      onReadyToStart();
    }
  };

  const handlePrev = () => {
    soundEffects.playPop();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const nextEquipment = module.equipment[currentIndex + 1];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fadeIn">
      
      {/* Top Bar matching screenshot */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="bg-sky-50 text-sky-800 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full border border-sky-200">
          Alat {currentIndex + 1} dari {module.equipment.length}
        </div>
      </div>

      {/* Steps Pill Indicator Bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {module.equipment.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setCurrentIndex(idx)}
            className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              idx === currentIndex
                ? 'bg-[#0284C7] text-white shadow-sm'
                : idx < currentIndex
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-slate-100/70 text-slate-400'
            }`}
          >
            {idx < currentIndex && <Check className="w-3.5 h-3.5" />}
            <span>{idx + 1}. {item.name.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Stage Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-md text-center max-w-lg mx-auto relative overflow-hidden">
        {/* Soft decorative background tint */}
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-sky-50/70 to-transparent pointer-events-none" />

        {/* Circular Avatar Graphic Frame */}
        <div className="relative z-10 mx-auto mb-6 flex flex-col items-center">
          <div 
            onClick={handlePlaySound}
            className="w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-sky-100 to-blue-50 border-4 border-white shadow-inner flex items-center justify-center relative cursor-pointer group hover:scale-105 transition-transform"
          >
            {/* Animated bubbles around soap */}
            <div className="absolute -top-1 -right-2 w-8 h-8 rounded-full bg-sky-200/70 border-2 border-white animate-gentle-pulse"></div>
            <div className="absolute top-8 -left-3 w-6 h-6 rounded-full bg-sky-200/50 border-2 border-white"></div>
            <div className="absolute -bottom-1 right-6 w-7 h-7 rounded-full bg-sky-200/60 border-2 border-white"></div>

            {/* Equipment Icon Graphic */}
            <div className="text-6xl sm:text-7xl group-hover:rotate-6 transition-transform">
              {currentEquipment.iconType === 'soap' && '🧴'}
              {currentEquipment.iconType === 'water' && '🚰'}
              {currentEquipment.iconType === 'towel' && '🧖'}
              {currentEquipment.iconType === 'tissue' && '🧻'}
              {currentEquipment.iconType === 'toothbrush' && '🪥'}
              {currentEquipment.iconType === 'paste' && '🧼'}
              {currentEquipment.iconType === 'cup' && '🥛'}
              {currentEquipment.iconType === 'plate' && '🍽️'}
              {currentEquipment.iconType === 'spoon' && '🥄'}
              {currentEquipment.iconType === 'bib' && '🧣'}
              {currentEquipment.iconType === 'shirt' && '👕'}
              {currentEquipment.iconType === 'mirror' && '🪞'}
              {currentEquipment.iconType === 'hanger' && '🪝'}
              {currentEquipment.iconType === 'basket' && '🧺'}
            </div>
          </div>

          {/* Touch prompt badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <Hand className="w-3.5 h-3.5" />
            <span>Sentuh Gambarku</span>
          </div>
        </div>

        {/* Equipment Name & Description */}
        <div className="space-y-2 mb-8 relative z-10">
          <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-800">
            {currentIndex + 1}. {currentEquipment.name}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
            {currentEquipment.description}
          </p>
        </div>

        {/* Audio Listen Button matching UI designs */}
        <button
          onClick={handlePlaySound}
          disabled={isPlayingAudio}
          className="w-full py-4 px-6 bg-gradient-to-r from-[#0284C7] to-[#0369A1] hover:from-[#0369A1] hover:to-[#075985] text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-3 transition-transform active:scale-95 cursor-pointer"
        >
          <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>Dengarkan Suara {currentEquipment.name.split(' ')[0]}</span>
        </button>

      </div>

      {/* Bottom Nav Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePlaySound}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-700 rounded-full border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Ulangi Suara</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#047857] hover:bg-[#059669] text-white rounded-full font-['Fredoka'] text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 transition-transform active:scale-95 cursor-pointer"
        >
          {nextEquipment ? (
            <>
              <span>Alat Selanjutnya: {nextEquipment.name}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Mulai Langkah Latihan</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};
