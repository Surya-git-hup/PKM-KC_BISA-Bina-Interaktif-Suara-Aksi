import React, { useEffect } from 'react';
import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { VoiceCommand } from '../../types';

interface VoiceCommandModalProps {
  command: VoiceCommand;
  transcript: string;
  onConfirm: () => void;
  onCancel: () => void;
  autoExecuteMs?: number;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  command,
  transcript,
  onConfirm,
  onCancel,
  autoExecuteMs = 2800
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onConfirm();
    }, autoExecuteMs);
    return () => clearTimeout(timer);
  }, [onConfirm, autoExecuteMs]);

  const getCommandLabel = (cmd: VoiceCommand) => {
    switch (cmd) {
      case 'lanjut':
        return 'Lanjut';
      case 'ulangi':
        return 'Ulangi';
      case 'bantuan':
        return 'Bantuan';
      case 'selesai':
        return 'Selesai';
      default:
        return cmd;
    }
  };

  const getCommandActionText = (cmd: VoiceCommand) => {
    switch (cmd) {
      case 'lanjut':
        return 'Memulai langkah selanjutnya...';
      case 'ulangi':
        return 'Mengulang kembali suara instruksi...';
      case 'bantuan':
        return 'Menghubungkan ke guru pembimbing...';
      case 'selesai':
        return 'Menyimpan progres latihan mandiri...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gradient-to-b from-sky-50 via-white to-white rounded-3xl p-8 sm:p-10 max-w-md w-full border border-sky-100 shadow-2xl text-center relative overflow-hidden">
        
        {/* Soft background ambient blurs */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Big Pulsing Mic Icon Frame (as in IMG-20260926-WA0016.jpg) */}
        <div className="relative mx-auto mb-5 flex flex-col items-center">
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-sky-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-sky-400/30 ring-8 ring-sky-100 animate-gentle-pulse">
            <svg viewBox="0 0 24 24" className="w-14 h-14 fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
              <line x1="12" x2="12" y1="19" y2="22"/>
            </svg>
          </div>

          {/* Sound wave bars */}
          <div className="flex items-center gap-1.5 h-8 mt-4">
            <span className="w-1.5 bg-sky-400 rounded-full animate-wave-1"></span>
            <span className="w-1.5 bg-teal-400 rounded-full animate-wave-2"></span>
            <span className="w-1.5 bg-amber-400 rounded-full animate-wave-3"></span>
            <span className="w-1.5 bg-emerald-400 rounded-full animate-wave-4"></span>
            <span className="w-1.5 bg-sky-500 rounded-full animate-wave-5"></span>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-1 mb-6">
          <h3 className="font-['Fredoka'] font-bold text-2xl text-slate-800">
            Saya Mendengarkan...
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Katakan perintahmu dengan santai
          </p>
        </div>

        {/* Detected Command Container matching design */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4 mb-6">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            <span>Perintah Terdeteksi</span>
          </div>

          <div className="font-['Fredoka'] font-extrabold text-3xl sm:text-4xl text-[#0369A1]">
            "{getCommandLabel(command)}"
          </div>

          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-[2800ms] ease-linear"
                style={{ width: '100%' }}
              />
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {getCommandActionText(command)}
            </p>
          </div>
        </div>

        {/* Action Confirmation Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-[#0369A1] hover:bg-[#0284C7] text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-2xl shadow-sm shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
          >
            <span>Ya, Benar!</span>
            <Sparkles className="w-4 h-4 fill-white" />
          </button>

          <button
            onClick={onCancel}
            className="flex-1 py-3 px-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-['Fredoka'] font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bukan, Ucapkan Lagi</span>
          </button>
        </div>

      </div>
    </div>
  );
};
