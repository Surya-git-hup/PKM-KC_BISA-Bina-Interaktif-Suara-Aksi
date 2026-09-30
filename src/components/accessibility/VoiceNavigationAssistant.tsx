import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  Wifi, 
  WifiOff, 
  Eye, 
  Sparkles, 
  RefreshCw, 
  Layers,
  HelpCircle,
  X
} from 'lucide-react';
import { AppView, UserRole } from '../../types';
import { bisaSpeech, SpeechEventData } from '../../utils/speechRecognition';
import { soundEffects } from '../../utils/soundEffects';
import { syncService } from '../../utils/syncService';

interface VoiceNavigationAssistantProps {
  onNavigate: (view: AppView) => void;
  onRoleChange: (role: UserRole) => void;
  isOnline: boolean;
  onToggleOfflineMode: () => void;
  pendingSyncCount: number;
}

export const VoiceNavigationAssistant: React.FC<VoiceNavigationAssistantProps> = ({
  onNavigate,
  onRoleChange,
  isOnline,
  onToggleOfflineMode,
  pendingSyncCount
}) => {
  const [isVoiceNavActive, setIsVoiceNavActive] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const [showHelperModal, setShowHelperModal] = useState(false);

  useEffect(() => {
    if (isVoiceNavActive) {
      bisaSpeech.startListening(
        (data: SpeechEventData) => {
          const raw = data.transcript.toLowerCase();
          setLastHeard(data.transcript);

          // Global voice navigation mapping
          if (raw.includes('beranda') || raw.includes('home') || raw.includes('depan')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka beranda belajar.');
            onNavigate('student_home');
          } else if (raw.includes('guru') || raw.includes('evaluasi') || raw.includes('kelas')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka dashboard evaluasi guru.');
            onRoleChange('teacher');
            onNavigate('teacher_dashboard');
          } else if (raw.includes('orang tua') || raw.includes('wali') || raw.includes('bunda')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka dashboard orang tua.');
            onRoleChange('parent');
            onNavigate('parent_dashboard');
          } else if (raw.includes('buku') || raw.includes('penghubung') || raw.includes('catatan')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka buku penghubung.');
            onNavigate('handbook');
          } else if (raw.includes('analitik') || raw.includes('nilai') || raw.includes('grafik')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka analitik nilai.');
            onNavigate('teacher_analytics');
          } else if (raw.includes('mic') || raw.includes('suara') || raw.includes('uji')) {
            soundEffects.playCommandRecognized();
            soundEffects.speakIndonesian('Membuka laboratorium uji mikrofon.');
            onNavigate('hardware_tester');
          }
        },
        () => {},
        () => {}
      );
    }

    return () => {
      if (isVoiceNavActive) {
        bisaSpeech.stopListening();
      }
    };
  }, [isVoiceNavActive, onNavigate, onRoleChange]);

  const toggleVoiceNav = () => {
    soundEffects.playPop();
    const next = !isVoiceNavActive;
    setIsVoiceNavActive(next);
    if (next) {
      soundEffects.speakIndonesian('Navigasi suara diaktifkan. Anda bisa mengucapkan: Buka Beranda, Dashboard Guru, atau Buku Penghubung.');
    } else {
      soundEffects.speakIndonesian('Navigasi suara dimatikan.');
    }
  };

  return (
    <>
      {/* Floating Bottom Accessibility Dock */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl border border-slate-200/90 shadow-xl text-xs font-bold text-slate-700">
        
        {/* Offline / Online Network Indicator & Toggle */}
        <button
          onClick={onToggleOfflineMode}
          title={isOnline ? 'Online (Klik untuk simulasi mode offline)' : 'Offline (Data tersimpan di perangkat lokal)'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
          }`}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-amber-600" />}
          <span>{isOnline ? 'Online' : 'Mode Offline'}</span>
          {pendingSyncCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
              {pendingSyncCount}
            </span>
          )}
        </button>

        {/* Voice Navigation Toggle Button */}
        <button
          onClick={toggleVoiceNav}
          title="Navigasi Berbasis Suara untuk Penyandang Disabilitas"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
            isVoiceNavActive
              ? 'bg-sky-600 text-white border-sky-600 shadow-sm animate-pulse'
              : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
          }`}
        >
          {isVoiceNavActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>{isVoiceNavActive ? 'Navigasi Suara Aktif' : 'Nav Suara'}</span>
        </button>

        {/* Helper info modal trigger */}
        <button
          onClick={() => setShowHelperModal(true)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Bantuan Perintah Suara & Aksesibilitas"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

      </div>

      {/* Voice Navigation Helper Modal */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setShowHelperModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                  Panduan Navigasi Suara BISA
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Akses ramah disabilitas motorik & sensori
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p className="font-bold text-slate-800 mb-1">Katakan kalimat ini kapan saja:</p>
              <ul className="space-y-1.5 text-slate-600 font-medium">
                <li>• <strong className="text-sky-700">"Buka Beranda"</strong> &rarr; Ke halaman aktivitas siswa</li>
                <li>• <strong className="text-sky-700">"Dashboard Guru"</strong> &rarr; Ke portal guru SLB</li>
                <li>• <strong className="text-sky-700">"Portal Orang Tua"</strong> &rarr; Ke pantauan anak</li>
                <li>• <strong className="text-sky-700">"Buku Penghubung"</strong> &rarr; Ke catatan komunikasi</li>
                <li>• <strong className="text-sky-700">"Analitik Nilai"</strong> &rarr; Ke dasbor nilai berkala</li>
                <li>• <strong className="text-sky-700">"Uji Suara"</strong> &rarr; Ke laboratorium Voice Mic</li>
              </ul>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 font-medium">
              💡 <strong>Fitur Offline:</strong> Aplikasi BISA tetap dapat memutar audio dan mencatat progres di memori lokal terenkripsi jika koneksi internet terputus.
            </div>

            <button
              onClick={() => setShowHelperModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
