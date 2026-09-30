import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  Play, 
  Volume2, 
  Mic, 
  HelpCircle, 
  CheckCircle2, 
  Flag,
  Sparkles,
  VolumeX
} from 'lucide-react';
import { BinaDiriModule, ActivityStep, VoiceCommand, ScaffoldingLevel } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { bisaSpeech, SpeechEventData } from '../../utils/speechRecognition';
import { VoiceCommandModal } from './VoiceCommandModal';

interface StepActivityPlayerProps {
  module: BinaDiriModule;
  onBack: () => void;
  onComplete: () => void;
  onTriggerHelp: (stepNumber: number) => void;
  scaffoldingLevel: ScaffoldingLevel;
}

export const StepActivityPlayer: React.FC<StepActivityPlayerProps> = ({
  module,
  onBack,
  onComplete,
  onTriggerHelp,
  scaffoldingLevel
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [detectedCommandData, setDetectedCommandData] = useState<SpeechEventData | null>(null);

  const currentStep: ActivityStep = module.steps[currentStepIdx] || module.steps[0];
  const totalSteps = module.steps.length;

  // Speak step instruction
  const speakCurrentStep = useCallback(() => {
    setIsSpeaking(true);
    let promptToSpeak = currentStep.voiceText;
    if (scaffoldingLevel === 'petunjuk_ringkas') {
      promptToSpeak = currentStep.instruction;
    } else if (scaffoldingLevel === 'coba_mandiri') {
      promptToSpeak = `Langkah ${currentStep.stepNumber}. Ayo coba sendiri.`;
    }

    soundEffects.speakIndonesian(promptToSpeak, () => {
      setIsSpeaking(false);
    });
  }, [currentStep, scaffoldingLevel]);

  // Initial step speech & voice recognition mount
  useEffect(() => {
    speakCurrentStep();

    // Start speech recognition
    bisaSpeech.startListening(
      (data: SpeechEventData) => {
        soundEffects.playCommandRecognized();
        setDetectedCommandData(data);
      },
      (listening) => {
        setIsListening(listening);
      },
      (vol) => {
        setAudioVolume(vol);
      }
    );

    return () => {
      soundEffects.stopSpeaking();
      bisaSpeech.stopListening();
    };
  }, [currentStepIdx, speakCurrentStep]);

  // Handle Command Execution
  const executeCommand = (cmd: VoiceCommand) => {
    setDetectedCommandData(null);

    switch (cmd) {
      case 'lanjut':
        soundEffects.playPop();
        if (currentStepIdx < totalSteps - 1) {
          setCurrentStepIdx(prev => prev + 1);
        } else {
          onComplete();
        }
        break;

      case 'ulangi':
        speakCurrentStep();
        break;

      case 'bantuan':
        soundEffects.playPop();
        onTriggerHelp(currentStep.stepNumber);
        break;

      case 'selesai':
        soundEffects.playCelebrationFanfare();
        onComplete();
        break;
    }
  };

  const handleSimulateVoice = (cmd: VoiceCommand) => {
    bisaSpeech.simulateCommand(cmd);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5 animate-fadeIn">
      
      {/* Top Bar matching IMG-20260926-WA0014.jpg */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 p-3 sm:p-4 rounded-2xl border border-slate-100 shadow-xs">
        
        {/* Step Counter & Activity Title */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Kembali"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
              <h2 className="font-['Fredoka'] font-bold text-base sm:text-lg text-slate-800">
                Langkah {currentStepIdx + 1} dari {totalSteps}{' '}
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  (Bina Diri: {module.title})
                </span>
              </h2>
            </div>

            {/* Stepper Progress Dots */}
            <div className="flex items-center gap-1.5 mt-1.5">
              {module.steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStepIdx
                      ? 'w-7 bg-sky-600'
                      : i < currentStepIdx
                      ? 'w-4 bg-emerald-500'
                      : 'w-4 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Audio Speaking Badge Status */}
        <div className="flex items-center gap-2">
          {isSpeaking ? (
            <div className="flex items-center gap-2 bg-sky-50 text-sky-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-sky-200/80 animate-pulse">
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>BISA sedang bersuara...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200/80">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>Siap mendengar suaramu</span>
            </div>
          )}
        </div>

      </div>

      {/* Main Visual Stage Card (IMG-20260926-WA0014.jpg) */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-md flex flex-col items-center text-center relative overflow-hidden">
        
        {/* Soft background glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-sky-50/70 to-transparent pointer-events-none" />

        {/* 3D Visual Instruction Frame */}
        <div className="w-full max-w-lg h-60 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 relative mb-6 shadow-inner border border-slate-100">
          <img
            src={currentStep.image}
            alt={currentStep.instruction}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />

          {/* Scaffolding tip badge */}
          {currentStep.tip && (
            <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-sm text-xs font-semibold text-slate-700 border border-slate-200/60">
              💡 {currentStep.tip}
            </div>
          )}
        </div>

        {/* Big Instruction Text & Repeat Audio Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-2">
          <h1 className="font-['Fredoka'] font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 tracking-tight">
            {currentStep.instruction}
          </h1>

          <button
            onClick={speakCurrentStep}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full border border-amber-200 text-xs sm:text-sm font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>Ulangi Suara</span>
          </button>
        </div>

      </div>

      {/* Listening Banner & Soundwave Bar (as shown in UI design) */}
      <div className="bg-gradient-to-r from-sky-50 via-white to-sky-50 rounded-2xl p-4 border border-sky-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left: Pulsing Mic & Prompt */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20 animate-gentle-pulse shrink-0">
            <Mic className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">Mendengarkan...</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Katakan <strong className="text-sky-700">"Lanjut"</strong> untuk berpindah langkah
            </p>
          </div>
        </div>

        {/* Right: Dynamic Audio Wave Visualizer */}
        <div className="flex items-center gap-1.5 h-10 px-4 bg-white rounded-xl border border-slate-100 shadow-inner">
          {[0.5, 0.9, 1.4, 0.7, 1.1, 0.6].map((mult, idx) => (
            <span
              key={idx}
              className="w-1.5 bg-gradient-to-t from-sky-500 to-teal-400 rounded-full transition-all duration-75"
              style={{
                height: `${Math.max(8, Math.min(36, audioVolume * 36 * mult))}px`
              }}
            />
          ))}
        </div>

      </div>

      {/* 4 Big Action Buttons matching the screenshot (IMG-20260926-WA0014.jpg) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        
        {/* Button 1: Lanjut (Deep Blue) */}
        <button
          onClick={() => executeCommand('lanjut')}
          className="py-4 px-4 bg-[#0284C7] hover:bg-[#0369A1] active:scale-95 text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Lanjut</span>
          <Play className="w-5 h-5 fill-white" />
        </button>

        {/* Button 2: Ulangi (Amber / Orange) */}
        <button
          onClick={() => executeCommand('ulangi')}
          className="py-4 px-4 bg-[#D97706] hover:bg-[#B45309] active:scale-95 text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Ulangi</span>
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Button 3: Bantuan (Pink / Red) */}
        <button
          onClick={() => executeCommand('bantuan')}
          className="py-4 px-4 bg-[#F43F5E] hover:bg-[#E11D48] active:scale-95 text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Bantuan</span>
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Button 4: Selesai (Emerald Green) */}
        <button
          onClick={() => executeCommand('selesai')}
          className="py-4 px-4 bg-[#059669] hover:bg-[#047857] active:scale-95 text-white font-['Fredoka'] font-bold text-base sm:text-lg rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <span>Selesai</span>
          <Flag className="w-5 h-5" />
        </button>

      </div>

      {/* Voice Simulator Helper Bar (for PKM testing or quiet classroom environments) */}
      <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1.5">
          <Mic className="w-3.5 h-3.5 text-sky-600" />
          <span>Simulasi BISA Voice Mic:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => handleSimulateVoice('lanjut')}
            className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-800 border border-slate-200 rounded-lg font-bold"
          >
            Ucapkan "Lanjut"
          </button>
          <button
            onClick={() => handleSimulateVoice('ulangi')}
            className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 rounded-lg font-bold"
          >
            Ucapkan "Ulangi"
          </button>
          <button
            onClick={() => handleSimulateVoice('bantuan')}
            className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-800 border border-slate-200 rounded-lg font-bold"
          >
            Ucapkan "Bantuan"
          </button>
          <button
            onClick={() => handleSimulateVoice('selesai')}
            className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 rounded-lg font-bold"
          >
            Ucapkan "Selesai"
          </button>
        </div>
      </div>

      {/* Detected Command Modal Overlay (IMG-20260926-WA0016.jpg) */}
      {detectedCommandData && (
        <VoiceCommandModal
          command={detectedCommandData.command}
          transcript={detectedCommandData.transcript}
          onConfirm={() => executeCommand(detectedCommandData.command)}
          onCancel={() => setDetectedCommandData(null)}
        />
      )}

    </div>
  );
};
