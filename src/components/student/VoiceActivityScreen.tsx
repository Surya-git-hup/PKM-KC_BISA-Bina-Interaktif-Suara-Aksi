import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Mic, 
  RotateCcw, 
  Play, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Ear,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { BinaDiriModule, VoiceCommand, StudentProgress } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { bisaSpeech, SpeechEventData } from '../../utils/speechRecognition';
import { UserAvatar } from '../common/UserAvatar';

interface VoiceActivityScreenProps {
  module: BinaDiriModule;
  currentStepNumber: number;
  onNextStep: () => void;
  onRepeatStep: () => void;
  onPrevStep?: () => void;
  onStepChange?: (stepNumber: number) => void;
  onTriggerHelp: () => void;
  onCompleteActivity: () => void;
  onBack: () => void;
  studentName?: string;
  selectedStudent?: StudentProgress | null;
  allModules?: BinaDiriModule[];
  onSelectModule?: (mod: BinaDiriModule) => void;
}

export const VoiceActivityScreen: React.FC<VoiceActivityScreenProps> = ({
  module,
  currentStepNumber,
  onNextStep,
  onRepeatStep,
  onPrevStep,
  onStepChange,
  onTriggerHelp,
  onCompleteActivity,
  onBack,
  studentName = 'Budi',
  selectedStudent,
  allModules,
  onSelectModule
}) => {
  const [isListening, setIsListening] = useState(true);
  const [detectedCommand, setDetectedCommand] = useState<VoiceCommand | null>(null);
  const [micVolume, setMicVolume] = useState<number>(0.4);
  const [autoExecuteProgress, setAutoExecuteProgress] = useState<number>(0);
  const autoConfirmTimerRef = useRef<NodeJS.Timeout | null>(null);
  const detectedCommandRef = useRef<VoiceCommand | null>(detectedCommand);

  useEffect(() => {
    detectedCommandRef.current = detectedCommand;
  }, [detectedCommand]);

  const totalSteps = module.totalSteps || module.steps?.length || 6;
  const currentStep = module.steps?.find(s => s.stepNumber === currentStepNumber) || module.steps?.[0] || {
    id: 1,
    stepNumber: currentStepNumber,
    instruction: `Langkah ${currentStepNumber} dari modul ${module.title}`,
    voiceText: `Ayo lakukan langkah ${currentStepNumber} untuk ${module.title}.`,
    image: module.image,
    tip: 'Lakukan dengan tenang dan mandiri.'
  };

  const nextStep = module.steps?.find(s => s.stepNumber === currentStepNumber + 1);

  // Play voice instruction on mount or when step changes
  useEffect(() => {
    soundEffects.speakIndonesian(
      `Aktivitas ${module.title}. Langkah ${currentStepNumber}: ${currentStep.instruction}. Katakan "Lanjut" bila sudah selesai.`
    );
  }, [currentStepNumber, module.id]);

  // Start speech recognition listening loop
  useEffect(() => {
    if (isListening) {
      bisaSpeech.startListening(
        (data: SpeechEventData) => {
          soundEffects.playCommandRecognized();
          setDetectedCommand(data.command);
          setAutoExecuteProgress(0);
        },
        () => {},
        (vol) => {
          setMicVolume(Math.max(0.18, vol));
        }
      );
    } else {
      bisaSpeech.stopListening();
    }

    return () => {
      bisaSpeech.stopListening();
      if (autoConfirmTimerRef.current) {
        clearInterval(autoConfirmTimerRef.current);
        autoConfirmTimerRef.current = null;
      }
    };
  }, [isListening]);

  // Action execution corresponding to previous activity selection
  const handleConfirmCommand = () => {
    if (autoConfirmTimerRef.current) {
      clearInterval(autoConfirmTimerRef.current);
      autoConfirmTimerRef.current = null;
    }

    const cmd = detectedCommandRef.current || detectedCommand;
    if (!cmd) return;

    soundEffects.playPop();

    if (cmd === 'lanjut') {
      if (currentStepNumber >= totalSteps) {
        soundEffects.speakIndonesian(`Hebat sekali ${studentName}! Semua langkah ${module.title} sudah selesai dengan sempurna!`);
        onCompleteActivity();
      } else {
        soundEffects.speakIndonesian(`Bagus sekali! Lanjut ke langkah ${currentStepNumber + 1}.`);
        onNextStep();
        setDetectedCommand(null);
        setAutoExecuteProgress(0);
      }
    } else if (cmd === 'ulangi') {
      soundEffects.speakIndonesian(`Mengulang langkah ${currentStepNumber}: ${currentStep.instruction}. ${currentStep.tip}`);
      onRepeatStep();
      setDetectedCommand(null);
      setAutoExecuteProgress(0);
    } else if (cmd === 'bantuan') {
      soundEffects.speakIndonesian(`Guru pendamping sedang menuju ke tempat ${studentName}.`);
      onTriggerHelp();
      setDetectedCommand(null);
      setAutoExecuteProgress(0);
    } else if (cmd === 'selesai') {
      soundEffects.speakIndonesian(`Selamat ${studentName}! Aktivitas ${module.title} telah selesai!`);
      onCompleteActivity();
    }
  };

  // Animate progress bar when command is detected
  useEffect(() => {
    if (!detectedCommand) {
      setAutoExecuteProgress(0);
      if (autoConfirmTimerRef.current) {
        clearInterval(autoConfirmTimerRef.current);
        autoConfirmTimerRef.current = null;
      }
      return;
    }

    // Smoothly fill progress bar over 3.5 seconds
    const intervalTime = 50;
    const totalDuration = 3500;
    const increment = (intervalTime / totalDuration) * 100;
    let accumulated = 0;

    autoConfirmTimerRef.current = setInterval(() => {
      accumulated += increment;
      if (accumulated >= 100) {
        if (autoConfirmTimerRef.current) {
          clearInterval(autoConfirmTimerRef.current);
          autoConfirmTimerRef.current = null;
        }
        setAutoExecuteProgress(100);
        setTimeout(() => {
          handleConfirmCommand();
        }, 10);
      } else {
        setAutoExecuteProgress(accumulated);
      }
    }, intervalTime);

    return () => {
      if (autoConfirmTimerRef.current) {
        clearInterval(autoConfirmTimerRef.current);
        autoConfirmTimerRef.current = null;
      }
    };
  }, [detectedCommand, currentStepNumber]);

  const handleRejectCommand = () => {
    if (autoConfirmTimerRef.current) {
      clearInterval(autoConfirmTimerRef.current);
    }
    soundEffects.playPop();
    setDetectedCommand(null);
    setAutoExecuteProgress(0);
    setIsListening(true);
    bisaSpeech.startListening(
      (data) => {
        soundEffects.playCommandRecognized();
        setDetectedCommand(data.command);
      },
      () => {},
      (vol) => setMicVolume(Math.max(0.18, vol))
    );
  };

  const handleSimulateCommand = (cmd: VoiceCommand) => {
    soundEffects.playCommandRecognized();
    setDetectedCommand(cmd);
    setAutoExecuteProgress(0);
  };

  const handleSpeakInstructionAgain = () => {
    soundEffects.speakIndonesian(
      `Langkah ${currentStepNumber}: ${currentStep.instruction}. ${currentStep.tip}`
    );
  };

  const getCommandDisplayLabel = (cmd: VoiceCommand) => {
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
        return 'Lanjut';
    }
  };

  const getCommandActionText = (cmd: VoiceCommand) => {
    switch (cmd) {
      case 'lanjut':
        return currentStepNumber >= totalSteps 
          ? `Menyelesaikan aktivitas ${module.title}...` 
          : nextStep 
            ? `Lanjut ke langkah ${currentStepNumber + 1}: ${nextStep.instruction}`
            : 'Memulai langkah selanjutnya...';
      case 'ulangi':
        return `Mengulang instruksi: "${currentStep.instruction}"`;
      case 'bantuan':
        return 'Menghubungkan ke guru pendamping untuk bantuan...';
      case 'selesai':
        return `Mengakhiri ${module.title} dan melihat perolehan bintang...`;
      default:
        return 'Memproses instruksi suara...';
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto relative select-none animate-fadeIn">
      
      {/* Background radial glows matching Image designs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-6 w-60 h-60 bg-emerald-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar matching design */}
      <div className="flex items-center justify-between gap-3 relative z-10 w-full mb-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 font-['Fredoka'] font-bold text-xs sm:text-sm shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali</span>
        </button>

        {/* Center Pill: Modul [Title] • Langkah [N] */}
        <div className="inline-flex items-center gap-2 bg-white/95 px-5 py-2 rounded-full border border-slate-200/80 shadow-xs font-['Fredoka'] font-bold text-xs sm:text-sm text-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Modul {module.title} • Langkah {currentStepNumber}</span>
          <span className="text-slate-400 font-normal">dari {totalSteps}</span>
        </div>

        {/* Right Button: Audio Help / Replay */}
        <button
          onClick={handleSpeakInstructionAgain}
          title="Dengarkan instruksi langkah ini lagi"
          aria-label="Dengarkan instruksi langkah ini lagi"
          className="w-10 h-10 rounded-full bg-white hover:bg-sky-50 border border-slate-200 text-sky-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <Ear className="w-5 h-5 text-sky-600" />
        </button>
      </div>

      {/* Current Activity Step Visual Card */}
      <div className="relative z-10 max-w-xl mx-auto w-full mb-3">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-sm flex items-center gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-xs">
            <img
              src={currentStep.image || module.image}
              alt={currentStep.instruction}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = module.image;
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                Langkah {currentStepNumber} / {totalSteps}
              </span>
              <span className="text-[11px] font-bold text-slate-500 truncate">
                {module.title}
              </span>
            </div>
            <p className="font-['Fredoka'] font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
              {currentStep.instruction}
            </p>
            {currentStep.tip && (
              <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                💡 {currentStep.tip}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Center Voice Mic & Equalizer Visualizer matching Image */}
      <div className="flex flex-col items-center justify-center relative z-10 my-auto space-y-4">
        
        {/* Big Circular Microphone Button */}
        <div className="relative flex items-center justify-center">
          {/* Animated pulse halo */}
          {isListening && (
            <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-sky-300/30 animate-ping absolute pointer-events-none" />
          )}

          {/* Outer glow ring */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-sky-200 via-sky-300 to-emerald-200 p-2 flex items-center justify-center shadow-2xl shadow-sky-400/40">
            {/* Center Mic Button */}
            <button
              type="button"
              onClick={() => setIsListening(!isListening)}
              title={isListening ? "Klik untuk jeda dengar" : "Klik untuk mulai mendengarkan"}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white flex items-center justify-center shadow-xl border-4 border-white transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mic className="w-14 h-14 text-white stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Colorful Animated Equalizer Sound Bars (Cyan, Sky Blue, Green, Amber, Brown) */}
        <div className="flex items-center justify-center gap-1.5 h-12 py-1">
          {/* Bar 1: Cyan */}
          <div
            className="w-2.5 rounded-full bg-[#06b6d4] transition-all duration-150"
            style={{ height: isListening ? `${14 + micVolume * 36}px` : '10px' }}
          />
          {/* Bar 2: Sky Blue */}
          <div
            className="w-2.5 rounded-full bg-[#0284c7] transition-all duration-150 delay-75"
            style={{ height: isListening ? `${20 + micVolume * 44}px` : '14px' }}
          />
          {/* Bar 3: Green */}
          <div
            className="w-2.5 rounded-full bg-[#10b981] transition-all duration-150 delay-100"
            style={{ height: isListening ? `${16 + micVolume * 38}px` : '12px' }}
          />
          {/* Bar 4: Amber / Yellow */}
          <div
            className="w-2.5 rounded-full bg-[#f59e0b] transition-all duration-150 delay-50"
            style={{ height: isListening ? `${22 + micVolume * 40}px` : '14px' }}
          />
          {/* Bar 5: Brown / Gold */}
          <div
            className="w-2.5 rounded-full bg-[#b45309] transition-all duration-150 delay-120"
            style={{ height: isListening ? `${12 + micVolume * 32}px` : '10px' }}
          />
        </div>

        {/* Titles matching Image design */}
        <div className="text-center">
          <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            {isListening ? 'Saya Mendengarkan...' : 'Mikrofon Dijeda'}
          </h2>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-1">
            Katakan perintahmu dengan santai, {studentName}
          </p>
        </div>

        {/* Detected Command Card (Shown when command is detected) */}
        {detectedCommand ? (
          <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl max-w-md w-full text-center space-y-3.5 backdrop-blur-xs animate-scaleUp">
            {/* Green Badge: ✓ PERINTAH TERDETEKSI */}
            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#10b981] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Perintah Terdeteksi</span>
            </div>

            {/* Giant Command Word in quotes */}
            <div className="font-['Fredoka'] font-bold text-3xl sm:text-4xl text-[#00609C] tracking-wide my-1">
              “ {getCommandDisplayLabel(detectedCommand)} ”
            </div>

            {/* Action Text & Auto Progress Bar */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 leading-tight">
                {getCommandActionText(detectedCommand)}
              </p>
              <div className="w-64 h-1.5 bg-sky-100 rounded-full overflow-hidden mx-auto">
                <div
                  className="h-full bg-[#0284c7] rounded-full transition-all"
                  style={{ width: `${autoExecuteProgress}%` }}
                />
              </div>
            </div>

            {/* 2 Big Action Buttons matching Image */}
            <div className="flex items-center justify-center gap-3 pt-2">
              {/* Primary: Ya, Benar! ▶ */}
              <button
                type="button"
                onClick={handleConfirmCommand}
                className="flex-1 max-w-44 py-3 px-5 bg-[#00609C] hover:bg-[#004e80] active:scale-95 text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-full shadow-md shadow-sky-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Ya, Benar!</span>
                <Play className="w-4 h-4 fill-white" />
              </button>

              {/* Secondary: 🔄 Bukan, Ucapkan Lagi */}
              <button
                type="button"
                onClick={handleRejectCommand}
                className="flex-1 max-w-44 py-3 px-4 bg-white hover:bg-slate-50 active:scale-95 border border-slate-200 text-slate-700 font-['Fredoka'] font-bold text-xs sm:text-sm rounded-full shadow-2xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="leading-tight">Bukan, Ucapkan Lagi</span>
              </button>
            </div>
          </div>
        ) : (
          /* When waiting for speech, show prompt chips */
          <div className="bg-white/80 rounded-2xl p-4 border border-slate-100 shadow-sm max-w-md w-full text-center space-y-2">
            <p className="text-xs font-bold text-slate-600">
              Ucapkan suara atau ketuk salah satu kata untuk mencoba:
            </p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {(['lanjut', 'ulangi', 'bantuan', 'selesai'] as VoiceCommand[]).map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleSimulateCommand(cmd)}
                  className="px-3.5 py-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-['Fredoka'] font-bold cursor-pointer transition-all hover:scale-105"
                >
                  "{getCommandDisplayLabel(cmd)}"
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Step Navigation Dots & Previous/Next Buttons */}
      <div className="flex items-center justify-between gap-3 relative z-10 pt-4 max-w-xl mx-auto w-full">
        {/* Previous Step Button */}
        <button
          onClick={() => {
            if (currentStepNumber > 1 && onStepChange) {
              onStepChange(currentStepNumber - 1);
            } else if (onPrevStep) {
              onPrevStep();
            }
          }}
          disabled={currentStepNumber <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold cursor-pointer transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Langkah Sebelumnya</span>
        </button>

        {/* Step Indicator Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => {
            const stepNum = i + 1;
            const isCurrent = stepNum === currentStepNumber;
            const isDone = stepNum < currentStepNumber;
            return (
              <button
                key={stepNum}
                onClick={() => onStepChange && onStepChange(stepNum)}
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  isCurrent 
                    ? 'w-7 bg-sky-600' 
                    : isDone 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-200'
                }`}
                title={`Pindah ke langkah ${stepNum}`}
              />
            );
          })}
        </div>

        {/* Next Step Button */}
        <button
          onClick={() => {
            if (currentStepNumber < totalSteps && onStepChange) {
              onStepChange(currentStepNumber + 1);
            } else {
              handleConfirmCommand();
            }
          }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer transition-all"
        >
          <span>{currentStepNumber >= totalSteps ? 'Selesai' : 'Langkah Selanjutnya'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
