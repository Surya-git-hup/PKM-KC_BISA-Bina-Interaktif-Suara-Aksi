import React from 'react';
import { BellRing, Check, HeartHandshake, X } from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';

interface HelpAssistanceModalProps {
  stepNumber: number;
  onClose: () => void;
  onContinue: () => void;
}

export const HelpAssistanceModal: React.FC<HelpAssistanceModalProps> = ({
  stepNumber,
  onClose,
  onContinue
}) => {
  React.useEffect(() => {
    soundEffects.speakIndonesian(
      'Jangan khawatir. Guru dan pendamping sudah diberitahu untuk membantumu di langkah ini. Tarik nafas dan santai ya.'
    );
  }, [stepNumber]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-rose-100 shadow-2xl text-center relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Bell Alert Icon */}
        <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 mx-auto mb-4 flex items-center justify-center shadow-inner animate-gentle-pulse">
          <BellRing className="w-10 h-10" />
        </div>

        <h3 className="font-['Fredoka'] font-bold text-2xl text-slate-800 mb-2">
          Panggilan Bantuan Terkirim!
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          Guru kelas & pendamping telah menerima sinyal pemberitahuan pada langkah ke-{stepNumber}. Kamu sangat pintar telah memanggil bantuan saat membutuhkan.
        </p>

        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-200/60 mb-6 text-left flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900 font-medium leading-relaxed">
            <strong>Tips Pendamping:</strong> Berikan physical prompt perlahan tanpa memaksa, lalu puji usaha anak saat mencoba kembali.
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-['Fredoka'] font-bold text-base rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <Check className="w-5 h-5" />
          <span>Saya Siap Lanjut Lagi</span>
        </button>

      </div>
    </div>
  );
};
