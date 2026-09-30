/**
 * Speech Recognition Service for BISA Voice Mic
 * Uses Web Speech API (SpeechRecognition / webkitSpeechRecognition) with Indonesian ('id-ID')
 */

import { VoiceCommand } from '../types';

export interface SpeechEventData {
  command: VoiceCommand;
  transcript: string;
  confidence: number;
  latencyMs: number;
}

// Typing for Web Speech API
interface IWindow extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

export class BisaspeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onCommandCallback: ((data: SpeechEventData) => void) | null = null;
  private onVolumeChangeCallback: ((volume: number) => void) | null = null;
  private onStatusChangeCallback: ((isListening: boolean, error?: string) => void) | null = null;
  private speechStartTime: number = 0;
  private audioStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.lang = 'id-ID';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 3;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.speechStartTime = performance.now();
        this.onStatusChangeCallback?.(true);
      };

      this.recognition.onend = () => {
        // If we want continuous active listening during learning, restart if still supposed to listen
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            this.isListening = false;
            this.onStatusChangeCallback?.(false);
          }
        } else {
          this.onStatusChangeCallback?.(false);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (event.error !== 'no-speech') {
          this.onStatusChangeCallback?.(this.isListening, event.error);
        }
      };

      this.recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTranscript += res[0].transcript;
            confidence = res[0].confidence || 0.9;
          } else {
            interimTranscript += res[0].transcript;
          }
        }

        const heardText = (finalTranscript || interimTranscript).toLowerCase().trim();
        if (!heardText) return;

        const detectedCommand = this.mapTextToCommand(heardText);
        if (detectedCommand) {
          const latencyMs = Math.round(performance.now() - (this.speechStartTime || performance.now()));
          this.onCommandCallback?.({
            command: detectedCommand,
            transcript: heardText,
            confidence: Math.round(confidence * 100),
            latencyMs: latencyMs > 0 && latencyMs < 4000 ? latencyMs : 280
          });
          // Reset speech start timestamp
          this.speechStartTime = performance.now();
        }
      };
    }
  }

  public mapTextToCommand(text: string): VoiceCommand | null {
    const clean = text.toLowerCase();
    
    // Command 1: Lanjut
    if (
      clean.includes('lanjut') || 
      clean.includes('selanjutnya') || 
      clean.includes('berikut') || 
      clean.includes('maju') || 
      clean.includes('next') ||
      clean.includes('oke') ||
      clean.includes('bisa')
    ) {
      return 'lanjut';
    }

    // Command 2: Ulangi
    if (
      clean.includes('ulang') || 
      clean.includes('ulangi') || 
      clean.includes('lagi') || 
      clean.includes('baca lagi') || 
      clean.includes('putar lagi') ||
      clean.includes('repeat')
    ) {
      return 'ulangi';
    }

    // Command 3: Bantuan
    if (
      clean.includes('bantu') || 
      clean.includes('bantuan') || 
      clean.includes('tolong') || 
      clean.includes('guru') || 
      clean.includes('ibu guru') || 
      clean.includes('help')
    ) {
      return 'bantuan';
    }

    // Command 4: Selesai
    if (
      clean.includes('selesai') || 
      clean.includes('sudah') || 
      clean.includes('beres') || 
      clean.includes('tuntas') || 
      clean.includes('finish')
    ) {
      return 'selesai';
    }

    return null;
  }

  public startListening(
    onCommand: (data: SpeechEventData) => void,
    onStatusChange?: (isListening: boolean, error?: string) => void,
    onVolumeChange?: (vol: number) => void
  ) {
    this.onCommandCallback = onCommand;
    this.onStatusChangeCallback = onStatusChange || null;
    this.onVolumeChangeCallback = onVolumeChange || null;
    this.isListening = true;

    // Start Audio Analyser for visual waves
    this.startAudioAnalyser();

    if (this.recognition) {
      try {
        this.recognition.start();
      } catch (e) {
        // Recognition already started or busy
      }
    } else {
      this.onStatusChangeCallback?.(true);
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {}
    }
    this.stopAudioAnalyser();
    this.onStatusChangeCallback?.(false);
  }

  public simulateCommand(command: VoiceCommand) {
    this.onCommandCallback?.({
      command,
      transcript: command,
      confidence: 96,
      latencyMs: 180 + Math.floor(Math.random() * 80)
    });
  }

  private async startAudioAnalyser() {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      if (!this.audioStream) {
        this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(this.audioStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      source.connect(this.analyser);

      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const updateVolume = () => {
        if (!this.analyser || !this.isListening) return;
        this.analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(1, average / 100);
        this.onVolumeChangeCallback?.(normalized);
        this.animFrameId = requestAnimationFrame(updateVolume);
      };
      updateVolume();
    } catch (e) {
      // If mic permission blocked, create simulated breathing volume oscillation for visual feedback
      this.simulateVolumeLoop();
    }
  }

  private simulateVolumeLoop() {
    const loop = () => {
      if (!this.isListening) return;
      const vol = 0.25 + 0.4 * Math.sin(Date.now() / 250);
      this.onVolumeChangeCallback?.(Math.max(0.1, vol));
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  private stopAudioAnalyser() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.audioStream) {
      this.audioStream.getTracks().forEach(t => t.stop());
      this.audioStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    this.analyser = null;
  }
}

export const bisaSpeech = new BisaspeechService();
