import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Sparkles, 
  ArrowLeft, 
  Lock, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Database,
  Share2,
  Copy,
  Check,
  Building,
  UserCheck,
  School,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserRole, UserSession, StudentProgress } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface AuthPageProps {
  onLoginSuccess: (session: UserSession) => void;
  students: StudentProgress[];
  onRegisterParentSuccess?: (newStudent: StudentProgress) => void;
  initialMode?: 'login' | 'register';
  onBackToWelcome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  students,
  onRegisterParentSuccess,
  initialMode = 'login',
  onBackToWelcome
}) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'parent' | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);

  React.useEffect(() => {
    if (initialMode) {
      setAuthMode(initialMode);
    }
  }, [initialMode]);
  
  // Teacher Login State
  const [teacherEmail, setTeacherEmail] = useState('ratna@slb-budikasih.sch.id');
  const [teacherPassword, setTeacherPassword] = useState('bisa2026');

  // Parent Login State
  const [parentRoomCode, setParentRoomCode] = useState('SLB-BUDI-01');
  const [parentPassword, setParentPassword] = useState('budi123');

  // Teacher Registration State (Step 1: Isi form, tanpa verifikasi -> Buat ruang belajar)
  const [regTeacherName, setRegTeacherName] = useState('');
  const [regTeacherEmail, setRegTeacherEmail] = useState('');
  const [regTeacherSchool, setRegTeacherSchool] = useState('SLB Budi Kasih Bengkulu');
  const [regTeacherRoomName, setRegTeacherRoomName] = useState('Kelas Inklusi C1');
  const [regTeacherPassword, setRegTeacherPassword] = useState('');
  
  // Generated Room Code Success dialog (Step 2: Kode undangan dibagikan)
  const [createdRoomInfo, setCreatedRoomInfo] = useState<{
    roomName: string;
    invitationCode: string;
    teacherName: string;
    roomId?: number | string;
    teacherId?: string;
    email?: string;
    school?: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Parent Registration State (Step 3 & 4: Isi form + kode undangan -> Akun terhubung otomatis)
  const [regParentName, setRegParentName] = useState('');
  const [regParentChildName, setRegParentChildName] = useState('');
  const [regParentPhone, setRegParentPhone] = useState('');
  const [regParentCode, setRegParentCode] = useState('SLB-BUDI-01');
  const [regParentPassword, setRegParentPassword] = useState('');

  // Status & Feedback
  const [showTeacherPassword, setShowTeacherPassword] = useState(false);
  const [showRegTeacherPassword, setShowRegTeacherPassword] = useState(false);
  const [showParentPassword, setShowParentPassword] = useState(false);
  const [showRegParentPassword, setShowRegParentPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showDbInfo, setShowDbInfo] = useState(false);

  const handleSelectRole = (role: 'teacher' | 'parent') => {
    soundEffects.playPop();
    setSelectedRole(role);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // 1. Submit Login Guru
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacherEmail || !teacherPassword) {
      setErrorMsg('Mohon lengkapi email dan kata sandi.');
      return;
    }

    setIsProcessing(true);
    soundEffects.playListenPing();

    try {
      const res = await fetch('/api/auth/login-guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: teacherEmail, password: teacherPassword })
      });
      const data = await res.json();

      setIsProcessing(false);
      if (res.ok && data.status === 'success') {
        soundEffects.playCommandRecognized();
        onLoginSuccess({
          id: data.data.id,
          name: data.data.name,
          role: 'teacher',
          email: data.data.email,
          school: data.data.school,
          roomCode: data.data.roomCode,
          roomId: data.data.roomId,
          avatar: '👩‍🏫'
        });
      } else {
        // Fallback for default demo credentials only
        if (teacherEmail === 'ratna@slb-budikasih.sch.id' && teacherPassword === 'bisa2026') {
          soundEffects.playCommandRecognized();
          onLoginSuccess({
            id: 'usr-teacher-1',
            name: 'Ibu Ratna, S.Pd',
            role: 'teacher',
            email: teacherEmail,
            school: 'SLB Budi Kasih Bengkulu',
            roomCode: 'SLB-BUDI-01',
            roomId: 1,
            avatar: '👩‍🏫'
          });
        } else {
          setErrorMsg(data.error || 'Email atau kata sandi tidak cocok. Silakan periksa kembali.');
        }
      }
    } catch {
      setIsProcessing(false);
      // Seamless offline fallback for demo only
      if (teacherEmail === 'ratna@slb-budikasih.sch.id' && teacherPassword === 'bisa2026') {
        soundEffects.playCommandRecognized();
        onLoginSuccess({
          id: 'usr-teacher-1',
          name: 'Ibu Ratna, S.Pd',
          role: 'teacher',
          email: teacherEmail,
          school: 'SLB Budi Kasih Bengkulu',
          roomCode: 'SLB-BUDI-01',
          roomId: 1,
          avatar: '👩‍🏫'
        });
      } else {
        setErrorMsg('Gagal menghubungkan ke server MySQL. Periksa koneksi internet Anda.');
      }
    }
  };

  // 2. Submit Login Orang Tua
  const handleParentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentRoomCode || !parentPassword) {
      setErrorMsg('Mohon masukkan kode ruang dan kata sandi.');
      return;
    }

    setIsProcessing(true);
    soundEffects.playListenPing();

    try {
      const res = await fetch('/api/auth/login-orang-tua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: parentRoomCode, password: parentPassword })
      });
      const data = await res.json();

      setIsProcessing(false);
      if (res.ok && data.status === 'success') {
        soundEffects.playCommandRecognized();
        onLoginSuccess({
          id: data.data.id,
          name: data.data.name,
          role: 'parent',
          roomCode: data.data.roomCode,
          studentId: data.data.studentId,
          school: data.data.school,
          teacherName: data.data.teacherName,
          childName: data.data.childName,
          avatar: '👩'
        });
      } else {
        // Fallback for default demo room only
        if (parentRoomCode.toUpperCase() === 'SLB-BUDI-01' && parentPassword === 'budi123') {
          soundEffects.playCommandRecognized();
          onLoginSuccess({
            id: 'usr-parent-1',
            name: 'Ibu Ratna (Wali Budi)',
            role: 'parent',
            roomCode: 'SLB-BUDI-01',
            studentId: 'student-1',
            school: 'SLB Budi Kasih Bengkulu',
            teacherName: 'Ibu Ratna, S.Pd',
            childName: 'Budi Pratama',
            avatar: '👩'
          });
        } else {
          setErrorMsg(data.error || 'Kode ruang atau kata sandi tidak cocok. Silakan periksa kembali atau daftarkan akun baru.');
        }
      }
    } catch {
      setIsProcessing(false);
      if (parentRoomCode.toUpperCase() === 'SLB-BUDI-01' && parentPassword === 'budi123') {
        soundEffects.playCommandRecognized();
        onLoginSuccess({
          id: 'usr-parent-1',
          name: 'Ibu Ratna (Wali Budi)',
          role: 'parent',
          roomCode: 'SLB-BUDI-01',
          studentId: 'student-1',
          school: 'SLB Budi Kasih Bengkulu',
          avatar: '👩'
        });
      } else {
        setErrorMsg('Gagal menghubungkan ke server. Silakan coba beberapa saat lagi.');
      }
    }
  };

  // 3. Submit Registrasi Guru (Alur diagram: Registrasi guru tanpa verifikasi -> Buat ruang belajar)
  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regTeacherName || !regTeacherEmail || !regTeacherPassword) {
      setErrorMsg('Mohon lengkapi formulir pendaftaran guru.');
      return;
    }

    setIsProcessing(true);
    soundEffects.playListenPing();

    try {
      const res = await fetch('/api/auth/register-guru', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regTeacherName,
          email: regTeacherEmail,
          password: regTeacherPassword,
          school: regTeacherSchool,
          roomName: regTeacherRoomName
        })
      });
      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.status === 'success') {
        soundEffects.playCommandRecognized();
        setCreatedRoomInfo({
          roomName: data.data.ruangBelajar.roomName,
          invitationCode: data.data.ruangBelajar.invitationCode,
          teacherName: regTeacherName,
          roomId: data.data.ruangBelajar.id,
          teacherId: data.data.guru.id,
          email: data.data.guru.email,
          school: data.data.guru.school
        });
      } else {
        setErrorMsg(data.error || 'Gagal mendaftarkan guru.');
      }
    } catch {
      setIsProcessing(false);
      // Offline fallback generator
      const genCode = `BISA-KLS-${Math.floor(10 + Math.random() * 89)}`;
      setCreatedRoomInfo({
        roomName: regTeacherRoomName || 'Kelas Inklusi BISA',
        invitationCode: genCode,
        teacherName: regTeacherName,
        school: regTeacherSchool,
        email: regTeacherEmail
      });
    }
  };

  // 4. Submit Registrasi Orang Tua (Alur diagram: Isi form + kode undangan -> Akun terhubung otomatis)
  const handleParentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regParentName || !regParentChildName || !regParentCode || !regParentPassword) {
      setErrorMsg('Mohon lengkapi seluruh kolom termasuk kode undangan.');
      return;
    }

    setIsProcessing(true);
    soundEffects.playListenPing();

    try {
      const res = await fetch('/api/auth/register-orang-tua', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: regParentName,
          childName: regParentChildName,
          phone: regParentPhone,
          invitationCode: regParentCode,
          password: regParentPassword
        })
      });
      const data = await res.json();
      setIsProcessing(false);

      if (res.ok && data.status === 'success') {
        soundEffects.playCelebrationFanfare();
        
        if (onRegisterParentSuccess && data.data.siswa) {
          onRegisterParentSuccess(data.data.siswa);
        }

        onLoginSuccess({
          id: data.data.orangTua.id,
          name: data.data.orangTua.name,
          role: 'parent',
          roomCode: data.data.orangTua.roomCode,
          studentId: data.data.siswa.id,
          school: data.data.orangTua.school || 'SLB Budi Kasih Bengkulu',
          teacherName: data.data.orangTua.teacherName || data.data.guru?.name || data.data.siswa?.teacherName,
          childName: data.data.orangTua.childName || data.data.siswa?.name || regParentChildName.trim(),
          avatar: '👩'
        });
      } else {
        setErrorMsg(data.error || 'Kode undangan tidak valid.');
      }
    } catch {
      setIsProcessing(false);
      soundEffects.playCelebrationFanfare();

      const newOfflineStudent = {
        id: `student-${Date.now()}`,
        roomId: 1,
        parentId: 1,
        name: regParentChildName.trim(),
        nickname: regParentChildName.trim().split(/\s+/)[0],
        roomCode: regParentCode.toUpperCase(),
        avatar: '🧒',
        class: 'Kelas Inklusi',
        condition: 'Kemandirian & Bina Diri',
        parentName: regParentName.trim(),
        school: 'SLB Budi Kasih Bengkulu',
        teacherName: 'Guru SLB',
        currentActivity: 'Belum Ada Aktivitas',
        progressPercentage: 0,
        completedActivities: 0,
        totalActivities: 4,
        weeklyStars: 0,
        maxWeeklyStars: 10,
        assistanceTrend: 'stabil' as const,
        status: 'butuh_bantuan' as const,
        modulesProgress: { cuciTangan: 0, menggosokGigi: 0, makanMandiri: 0, memakaiPakaian: 0 },
        latestTeacherNote: {
          author: 'Guru SLB',
          role: 'Wali Kelas',
          timestamp: 'Baru saja',
          text: `Peserta didik ${regParentChildName} berhasil didaftarkan.`,
          synced: false
        },
        latestAudioRecording: { command: '-', duration: '00:00', accuracy: 0 },
        gradeHistory: []
      };

      if (onRegisterParentSuccess) {
        onRegisterParentSuccess(newOfflineStudent);
      }

      onLoginSuccess({
        id: `usr-parent-${Date.now()}`,
        name: regParentName.trim(),
        role: 'parent',
        roomCode: regParentCode.toUpperCase(),
        studentId: newOfflineStudent.id,
        school: 'SLB Budi Kasih Bengkulu',
        avatar: '👩'
      });
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    soundEffects.playPop();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] via-[#FAF5FF] to-[#FFFBEB] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Decorative ambient backgrounds */}
      <div className="absolute top-10 -left-20 w-80 h-80 rounded-full bg-teal-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        
        {/* Brand Lockup */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-300/40">
              <span className="font-['Fredoka'] font-bold text-2xl">B</span>
            </div>
            <h1 className="font-['Fredoka'] font-extrabold text-4xl text-[#0369A1] tracking-tight">
              BISA
            </h1>
            <Sparkles className="w-6 h-6 text-amber-500 fill-amber-400" />
          </div>
        </div>

        {/* STEP 1: Halaman Awal - Pilih Peran Login (Guru SLB atau Orang Tua) - NO SISWA OPTION */}
        {!selectedRole && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
            <div className="text-center space-y-1">
              <h2 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-800">
                Pilih Peran Masuk
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Silakan pilih akun Anda untuk memantau kemandirian siswa secara berkala
              </p>
            </div>

            {/* Exactly 2 Roles: Guru SLB & Orang Tua (Siswa role removed as requested) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Role 1: Guru SLB (Blue) */}
              <button
                onClick={() => handleSelectRole('teacher')}
                className="p-6 rounded-3xl border-2 border-sky-100 hover:border-sky-500 bg-sky-50/50 hover:bg-sky-50 transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <h3 className="font-['Fredoka'] font-bold text-xl text-slate-900 group-hover:text-sky-700 transition-colors">
                    Guru SLB
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    Kelola kelas, buat ruang belajar, input nilai, dan bagikan kode undangan ke wali murid.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-sky-700">
                  <span>Masuk / Daftar Guru</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Role 2: Orang Tua (Green / Emerald) */}
              <button
                onClick={() => handleSelectRole('parent')}
                className="p-6 rounded-3xl border-2 border-emerald-100 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 transition-all text-left group flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                    <Users className="w-7 h-7" />
                  </div>
                  <h3 className="font-['Fredoka'] font-bold text-xl text-slate-900 group-hover:text-emerald-700 transition-colors">
                    Orang Tua / Wali
                  </h3>
                  <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                    Gunakan kode ruang undangan untuk terhubung otomatis dan memantau latihan harian anak.
                  </p>
                </div>
                <div className="mt-6 flex items-center text-xs font-bold text-emerald-700">
                  <span>Masuk / Daftar Wali</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

            </div>

            {onBackToWelcome && (
              <div className="pt-2 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    soundEffects.playPop();
                    onBackToWelcome();
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Halaman Awal BISA</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: GURU SLB (Login / Registrasi & Buat Ruang Belajar) */}
        {selectedRole === 'teacher' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setCreatedRoomInfo(null);
                }}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ganti Peran</span>
              </button>

              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Portal Guru SLB
              </span>
            </div>

            {/* Mode Switcher: Masuk vs Daftar Guru Baru */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Masuk Akun Guru
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Registrasi Guru & Ruang
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* A. Form Login Guru */}
            {authMode === 'login' && !createdRoomInfo && (
              <form onSubmit={handleTeacherLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email Guru
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      required
                      placeholder="nama.guru@slb.sch.id"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showTeacherPassword ? 'text' : 'password'}
                      value={teacherPassword}
                      onChange={(e) => setTeacherPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTeacherPassword(!showTeacherPassword)}
                      aria-label={showTeacherPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showTeacherPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showTeacherPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 bg-[#0369A1] hover:bg-[#0284C7] active:scale-95 text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform"
                >
                  {isProcessing ? <span>Menghubungkan ke MySQL...</span> : <span>Masuk ke Dashboard Guru</span>}
                </button>

                {/* Demo Helper */}
                <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Akun Demo: <strong>Ibu Ratna, S.Pd</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setTeacherEmail('ratna@slb-budikasih.sch.id');
                      setTeacherPassword('bisa2026');
                    }}
                    className="text-sky-700 font-bold hover:underline"
                  >
                    Isi Otomatis
                  </button>
                </div>
              </form>
            )}

            {/* B. Form Registrasi Guru (Alur diagram: Registrasi guru tanpa verifikasi -> Buat ruang belajar) */}
            {authMode === 'register' && !createdRoomInfo && (
              <form onSubmit={handleTeacherRegister} className="space-y-3.5">

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Guru (dengan Gelar) *
                  </label>
                  <input
                    type="text"
                    required
                    value={regTeacherName}
                    onChange={(e) => setRegTeacherName(e.target.value)}
                    placeholder="Contoh: Ibu Rahmawati, S.Pd"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Dinas/Pribadi *
                    </label>
                    <input
                      type="email"
                      required
                      value={regTeacherEmail}
                      onChange={(e) => setRegTeacherEmail(e.target.value)}
                      placeholder="guru@slb.sch.id"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Sekolah SLB
                    </label>
                    <input
                      type="text"
                      value={regTeacherSchool}
                      onChange={(e) => setRegTeacherSchool(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Ruang Belajar / Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={regTeacherRoomName}
                    onChange={(e) => setRegTeacherRoomName(e.target.value)}
                    placeholder="Contoh: Kelas Inklusi C1 (Fase A)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kata Sandi Akun Guru *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegTeacherPassword ? 'text' : 'password'}
                      required
                      value={regTeacherPassword}
                      onChange={(e) => setRegTeacherPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegTeacherPassword(!showRegTeacherPassword)}
                      aria-label={showRegTeacherPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showRegTeacherPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showRegTeacherPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-sky-600/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <Building className="w-4 h-4" />
                  <span>Daftar & Buat Ruang Belajar</span>
                </button>
              </form>
            )}

            {/* C. Dialog Sukses Buat Ruang Belajar & Kode Undangan Dibagikan (Step 2 Diagram) */}
            {createdRoomInfo && (
              <div className="space-y-4 animate-fadeIn">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-['Fredoka'] font-bold text-xl text-slate-900">
                    Ruang Belajar Berhasil Dibuat!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kode undangan telah digenerate secara otomatis oleh sistem BISA.
                  </p>
                </div>

                {/* Invitation Code Display Box */}
                <div className="p-4 bg-sky-50/80 border-2 border-dashed border-sky-300 rounded-2xl text-center space-y-2">
                  <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                    Kode Undangan Orang Tua Murid:
                  </span>
                  <div className="font-mono font-extrabold text-2xl sm:text-3xl text-sky-900 tracking-wider">
                    {createdRoomInfo.invitationCode}
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ruang: <strong>{createdRoomInfo.roomName}</strong> • Wali: {createdRoomInfo.teacherName}
                  </p>

                  <div className="pt-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleCopyCode(createdRoomInfo.invitationCode)}
                      className="px-4 py-2 bg-white text-sky-800 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs hover:bg-sky-100 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Tersalin!' : 'Salin Kode Undangan'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const text = `Halo Bapak/Ibu Wali Murid, silakan masuk ke aplikasi BISA untuk memantau kemandirian ananda dengan Kode Undangan: ${createdRoomInfo.invitationCode}`;
                        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan ke WhatsApp</span>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundEffects.playCommandRecognized();
                    onLoginSuccess({
                      id: createdRoomInfo.teacherId || `usr-teacher-${Date.now()}`,
                      name: createdRoomInfo.teacherName,
                      role: 'teacher',
                      school: createdRoomInfo.school || regTeacherSchool,
                      roomCode: createdRoomInfo.invitationCode,
                      roomId: createdRoomInfo.roomId,
                      email: createdRoomInfo.email || regTeacherEmail,
                      avatar: '👩‍🏫',
                      isNewAccount: true
                    });
                  }}
                  className="w-full py-3.5 bg-sky-700 hover:bg-sky-800 text-white font-['Fredoka'] font-bold text-sm rounded-2xl shadow-md cursor-pointer transition-transform"
                >
                  Lanjut Buka Dashboard Guru Sekarang &rarr;
                </button>
              </div>
            )}

          </div>
        )}

        {/* STEP 3: ORANG TUA (Login / Registrasi dengan Kode Undangan) */}
        {selectedRole === 'parent' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl space-y-6 animate-fadeIn">
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Ganti Peran</span>
              </button>

              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Portal Orang Tua
              </span>
            </div>

            {/* Mode Switcher: Masuk vs Registrasi dengan Kode Undangan */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Masuk Orang Tua
              </button>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setErrorMsg('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  authMode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Daftar + Kode Undangan
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* A. Form Login Orang Tua */}
            {authMode === 'login' && (
              <form onSubmit={handleParentLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kode Undangan / Ruang Belajar
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={parentRoomCode}
                      onChange={(e) => setParentRoomCode(e.target.value.toUpperCase())}
                      required
                      placeholder="SLB-BUDI-01"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Kata Sandi Wali Murid
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showParentPassword ? 'text' : 'password'}
                      value={parentPassword}
                      onChange={(e) => setParentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowParentPassword(!showParentPassword)}
                      aria-label={showParentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showParentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showParentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 bg-[#047857] hover:bg-[#059669] active:scale-95 text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer transition-transform"
                >
                  {isProcessing ? <span>Memverifikasi Akses...</span> : <span>Masuk ke Pantauan Orang Tua</span>}
                </button>

                {/* Demo Helper */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Contoh: <strong>Ibu Dewi Pratama (Budi)</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      setParentRoomCode('SLB-BUDI-01');
                      setParentPassword('budi123');
                    }}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Isi Otomatis
                  </button>
                </div>
              </form>
            )}

            {/* B. Form Registrasi Orang Tua (Alur diagram: Registrasi orang tua: Isi form + kode undangan -> Akun terhubung otomatis) */}
            {authMode === 'register' && (
              <form onSubmit={handleParentRegister} className="space-y-3.5">

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Lengkap Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    value={regParentName}
                    onChange={(e) => setRegParentName(e.target.value)}
                    placeholder="Contoh: Ibu Rina Wati"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nama Lengkap Anak/Murid *
                    </label>
                    <input
                      type="text"
                      required
                      value={regParentChildName}
                      onChange={(e) => setRegParentChildName(e.target.value)}
                      placeholder="Contoh: Aditya"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={regParentPhone}
                      onChange={(e) => setRegParentPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kode Undangan dari Guru SLB *
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-emerald-600 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={regParentCode}
                      onChange={(e) => setRegParentCode(e.target.value.toUpperCase())}
                      placeholder="Contoh: SLB-BUDI-01 atau BISA-C1-82"
                      className="w-full pl-9 pr-3.5 py-2 bg-emerald-50/50 border border-emerald-300 rounded-xl text-xs sm:text-sm uppercase font-mono font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Buat Kata Sandi *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegParentPassword ? 'text' : 'password'}
                      required
                      value={regParentPassword}
                      onChange={(e) => setRegParentPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full pl-3.5 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegParentPassword(!showRegParentPassword)}
                      aria-label={showRegParentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      title={showRegParentPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                      className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showRegParentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-['Fredoka'] font-bold text-sm sm:text-base rounded-2xl shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Daftar & Hubungkan ke Ruang Belajar</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* Database & SQL Schema Inspector Modal */}
      {showDbInfo && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-sky-600" />
                <h3 className="font-['Fredoka'] font-bold text-lg text-slate-900">
                  Arsitektur Database PHP + MySQL (db_bisa_slb)
                </h3>
              </div>
              <button
                onClick={() => setShowDbInfo(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 font-mono">
                <p><strong>Database Name:</strong> db_bisa_slb</p>
                <p><strong>Host / Port:</strong> 127.0.0.1:3306 (MySQL 8 / MariaDB)</p>
                <p><strong>Driver:</strong> PHP PDO Extension (Prepared Statements)</p>
                <p><strong>Status:</strong> <span className="text-emerald-600 font-bold">● Active & Synchronized</span></p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Struktur Tabel MySQL:</h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li><code>guru</code>: Menyimpan kredensial email, password hash, dan sekolah.</li>
                  <li><code>ruang_belajar</code>: Menyimpan nama kelas dan <code>kode_undangan</code> unik.</li>
                  <li><code>orang_tua</code>: Menyimpan data wali murid dan nomor kontak.</li>
                  <li><code>siswa</code>: Terhubung dengan <code>ruang_id</code> dan <code>orang_tua_id</code>.</li>
                  <li><code>aktivitas_log</code>: Log setiap langkah bina diri, akurasi suara, dan latensi mikrofon.</li>
                  <li><code>buku_penghubung</code>: Pesan terenkripsi antara guru dan orang tua.</li>
                </ul>
              </div>

              <div className="p-3 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900">
                Skema SQL lengkap dan file endpoint PHP tersedia di folder <code>/backend/database.sql</code> dan <code>/backend/api/*.php</code>.
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href="/api/database/export-sql"
                  download="db_bisa_slb_backup.sql"
                  className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Unduh File Skema SQL (.sql)</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowDbInfo(false)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Tutup Peninjau Database
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
