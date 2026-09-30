import React, { useState } from 'react';
import { 
  User, 
  School, 
  Calendar, 
  Mic, 
  RefreshCw, 
  Check, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  MapPin, 
  BookOpen, 
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
  Copy
} from 'lucide-react';
import { UserRole, UserSession, SchoolSettings } from '../../types';
import { soundEffects } from '../../utils/soundEffects';
import { syncService } from '../../utils/syncService';
import { VoiceMicTester } from '../hardware/VoiceMicTester';
import { ConfirmModal } from '../common/ConfirmModal';
import { UserAvatar } from '../common/UserAvatar';

interface SettingsPageProps {
  currentRole: UserRole;
  currentUser: UserSession | null;
  onUpdateUserProfile: (updated: Partial<UserSession>) => void;
  schoolSettings: SchoolSettings;
  onUpdateSchoolSettings: (updated: Partial<SchoolSettings>) => void;
  isOnline: boolean;
  pendingSyncCount: number;
  onResetAllPracticeProgress?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentRole,
  currentUser,
  onUpdateUserProfile,
  schoolSettings,
  onUpdateSchoolSettings,
  isOnline,
  pendingSyncCount,
  onResetAllPracticeProgress
}) => {
  type SettingsTab = 'profil' | 'voice_mic' | 'tahun_ajaran' | 'sinkronisasi' | 'reset_latihan';
  const [activeTab, setActiveTab] = useState<SettingsTab>('profil');

  // Teacher Profile Form State
  const [teacherName, setTeacherName] = useState(currentUser?.name || 'Ibu Ratna, S.Pd');
  const [teacherNip, setTeacherNip] = useState(currentUser?.nip || '19850314 201001 2 021');
  const [teacherClass, setTeacherClass] = useState(currentUser?.className || 'Kelas C1 Inklusi (Fase A)');
  const [teacherSchool, setTeacherSchool] = useState(currentUser?.school || 'SLB Negeri Budi Kasih');
  const [teacherEmail, setTeacherEmail] = useState(currentUser?.email || 'guru@slb-budikasih.sch.id');
  const [teacherPhone, setTeacherPhone] = useState(currentUser?.phone || '0812-3456-7890');
  const [teacherAvatar, setTeacherAvatar] = useState(currentUser?.avatar || '👩‍🏫');
  const [teacherRoomCode, setTeacherRoomCode] = useState(currentUser?.roomCode || 'SLB-BUDI-01');
  const [copiedCode, setCopiedCode] = useState(false);

  // Parent Profile Form State
  const [parentName, setParentName] = useState(currentUser?.name || 'Ibu Dewi Pratama');
  const [parentRelation, setParentRelation] = useState(currentUser?.parentRelation || 'Ibu Kandung');
  const [parentPhone, setParentPhone] = useState(currentUser?.phone || '0812-9876-5432');
  const [parentAddress, setParentAddress] = useState(currentUser?.address || 'Jl. Melati Indah No. 14, Jakarta Selatan');
  const [parentAvatar, setParentAvatar] = useState(currentUser?.avatar || '👩');

  // Academic Settings Form State
  const [academicYear, setAcademicYear] = useState(schoolSettings.academicYear || '2026/2027');
  const [semester, setSemester] = useState<'Ganjil' | 'Genap'>(schoolSettings.semester || 'Ganjil');
  const [schoolName, setSchoolName] = useState(schoolSettings.schoolName || 'SLB Negeri Budi Kasih');

  // Auto Sync State
  const [autoSync, setAutoSync] = useState(schoolSettings.autoSyncEnabled);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  // Notification / Feedback Toast
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  // Confirm Reset Modal
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMsg({ text, type });
    soundEffects.playPop();
    setTimeout(() => {
      setToastMsg(null);
    }, 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole === 'teacher') {
      const cleanCode = (teacherRoomCode || 'SLB-BUDI-01').trim().toUpperCase();
      onUpdateUserProfile({
        name: teacherName.trim(),
        nip: teacherNip.trim(),
        className: teacherClass.trim(),
        school: teacherSchool.trim(),
        email: teacherEmail.trim(),
        phone: teacherPhone.trim(),
        avatar: teacherAvatar,
        roomCode: cleanCode
      });

      // Persist invite code to backend database so teacher never has to re-generate it
      try {
        fetch('/api/teacher/update-invite-code', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            teacherId: currentUser?.id || 1,
            roomCode: cleanCode,
            roomName: teacherClass.trim() || 'Kelas Inklusi',
            teacherName: teacherName.trim()
          })
        }).catch(() => {});
      } catch {}

      showToast('Profil Guru SLB & Kode Undangan berhasil disimpan secara permanen!');
    } else {
      onUpdateUserProfile({
        name: parentName.trim(),
        parentRelation: parentRelation.trim(),
        phone: parentPhone.trim(),
        address: parentAddress.trim(),
        avatar: parentAvatar
      });
      showToast('Profil Orang Tua berhasil diperbarui!');
    }
  };

  const handleSaveAcademic = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSchoolSettings({
      academicYear,
      semester,
      schoolName: schoolName.trim()
    });
    showToast('Tahun Ajaran & Identitas Sekolah berhasil disimpan!');
  };

  const handleToggleAutoSync = () => {
    const next = !autoSync;
    setAutoSync(next);
    syncService.setAutoSyncEnabled(next);
    onUpdateSchoolSettings({ autoSyncEnabled: next });
    if (next) {
      showToast('Sinkronisasi Otomatis DIAKTIFKAN. Perubahan akan tersinkron berkala.');
    } else {
      showToast('Sinkronisasi Otomatis DINONAKTIFKAN. Mode data lokal mandiri aktif.', 'info');
    }
  };

  const handleManualSyncNow = async () => {
    if (!isOnline) {
      showToast('Perangkat sedang offline. Sambungkan internet untuk sinkronisasi.', 'info');
      return;
    }
    setIsManualSyncing(true);
    soundEffects.playPop();
    try {
      const res = await syncService.triggerCloudSync();
      showToast(`Sinkronisasi manual berhasil! ${res.syncedCount} item berhasil dikirim.`);
    } catch {
      showToast('Gagal melakukan sinkronisasi.', 'info');
    } finally {
      setIsManualSyncing(false);
    }
  };

  const handleConfirmResetPractice = () => {
    if (onResetAllPracticeProgress) {
      onResetAllPracticeProgress();
      setIsResetModalOpen(false);
      showToast('Seluruh progres dan riwayat mode latihan siswa berhasil direset ke 0%.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-16 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-xl text-xs font-bold border border-slate-700 animate-slideDown">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Pengaturan Sistem BISA
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Konfigurasi profil {currentRole === 'teacher' ? 'Guru' : 'Orang Tua'}, uji mikrofon suara, sinkronisasi, dan tahun ajaran
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border ${
            autoSync 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${autoSync ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>Auto-Sync: {autoSync ? 'Aktif' : 'Nonaktif'}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>TA: {academicYear} ({semester})</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profil')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profil'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>{currentRole === 'teacher' ? 'Profil Guru' : 'Profil Orang Tua'}</span>
        </button>

        <button
          onClick={() => setActiveTab('voice_mic')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'voice_mic'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Mic className="w-4 h-4 text-sky-500" />
          <span>Uji Voice Mic</span>
        </button>

        <button
          onClick={() => setActiveTab('tahun_ajaran')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'tahun_ajaran'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>Tahun Ajaran & Sekolah</span>
        </button>

        <button
          onClick={() => setActiveTab('sinkronisasi')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sinkronisasi'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-amber-500" />
          <span>Sinkronisasi Otomatis</span>
        </button>

        <button
          onClick={() => setActiveTab('reset_latihan')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'reset_latihan'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-rose-500" />
          <span>Reset Latihan</span>
        </button>
      </div>

      {/* Tab 1: Profil Guru atau Profil Orang Tua */}
      {activeTab === 'profil' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-slate-900">
                  {currentRole === 'teacher' ? 'Profil Guru SLB / Inklusi' : 'Profil Orang Tua / Wali'}
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola informasi akun Anda yang tampil pada Buku Penghubung dan Rapor Evaluasi
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Akun: {currentRole === 'teacher' ? 'Guru' : 'Orang Tua'}
            </span>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            {currentRole === 'teacher' ? (
              <>
                {/* Avatar & Custom Photo Picker for Teacher */}
                <div className="p-4 bg-amber-50/40 rounded-2xl border border-amber-100/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        Foto Profil Guru SLB
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Gunakan foto sendiri dari perangkat atau pilih ikon avatar kartun
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatar={teacherAvatar}
                        name={teacherName}
                        size="xl"
                        editable={true}
                        onPhotoChange={(newPhoto) => {
                          setTeacherAvatar(newPhoto);
                          showToast('Foto profil guru berhasil diunggah!');
                        }}
                        editTooltip="Klik untuk unggah foto guru sendiri"
                      />
                      {teacherAvatar && (teacherAvatar.startsWith('data:') || teacherAvatar.startsWith('http')) && (
                        <button
                          type="button"
                          onClick={() => setTeacherAvatar('👩‍🏫')}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-2">
                      Atau Pilih Karakter Avatar:
                    </span>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {['👩‍🏫', '👨‍🏫', '👩', '🧑', '🌟', '📚', '🌻'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setTeacherAvatar(emoji)}
                          className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                            teacherAvatar === emoji
                              ? 'border-amber-500 bg-amber-100 scale-105 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap & Gelar *
                    </label>
                    <input
                      type="text"
                      required
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Contoh: Ibu Ratna, S.Pd"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      NIP / NUPTK Guru
                    </label>
                    <input
                      type="text"
                      value={teacherNip}
                      onChange={(e) => setTeacherNip(e.target.value)}
                      placeholder="Contoh: 19850314 201001 2 021"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Wali Kelas / Jenjang
                    </label>
                    <input
                      type="text"
                      value={teacherClass}
                      onChange={(e) => setTeacherClass(e.target.value)}
                      placeholder="Contoh: Kelas C1 Inklusi (Fase A)"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Satuan Pendidikan (SLB / Inklusi)
                    </label>
                    <input
                      type="text"
                      value={teacherSchool}
                      onChange={(e) => setTeacherSchool(e.target.value)}
                      placeholder="Contoh: SLB Negeri Budi Kasih"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="guru@slb.sch.id"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor WhatsApp / Kontak
                    </label>
                    <input
                      type="text"
                      value={teacherPhone}
                      onChange={(e) => setTeacherPhone(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>

                  {/* Kode Undangan Ruang Belajar Persisten di Profil Guru */}
                  <div className="md:col-span-2 p-5 bg-gradient-to-r from-amber-50 via-white to-amber-100/40 rounded-2xl border-2 border-amber-300 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 bg-white px-2.5 py-0.5 rounded-full border border-amber-200 mb-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Kode Undangan Tersimpan di Profil Guru</span>
                        </div>
                        <h4 className="font-['Fredoka'] font-bold text-base text-slate-900">
                          Kode Masuk Ruang Belajar untuk Orang Tua Murid
                        </h4>
                        <p className="text-xs text-slate-600">
                          Kode ini tersimpan di profil guru agar Anda tidak perlu login ulang untuk membuat kode undangan baru. Bagikan kode ini kepada orang tua saat pendaftaran.
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-base sm:text-lg bg-white px-4 py-2 rounded-xl border border-amber-300 text-amber-900 tracking-wider shadow-2xs">
                          {teacherRoomCode || 'SLB-BUDI-01'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(teacherRoomCode || 'SLB-BUDI-01');
                            setCopiedCode(true);
                            soundEffects.playPop();
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
                          title="Salin Kode Undangan"
                        >
                          {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Kustomisasi / Ubah Kode Undangan Kelas:
                      </label>
                      <input
                        type="text"
                        value={teacherRoomCode}
                        onChange={(e) => setTeacherRoomCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: SLB-BUDI-01 atau BISA-KELAS-82"
                        className="w-full px-4 py-2.5 bg-white border border-amber-300 rounded-xl font-mono font-bold text-xs sm:text-sm text-slate-800 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Avatar & Custom Photo Picker for Parent */}
                <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-100/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-800">
                        Foto Profil Orang Tua / Wali
                      </label>
                      <p className="text-[11px] text-slate-500">
                        Gunakan foto sendiri dari perangkat atau pilih ikon avatar kartun
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <UserAvatar
                        avatar={parentAvatar}
                        name={parentName}
                        size="xl"
                        editable={true}
                        onPhotoChange={(newPhoto) => {
                          setParentAvatar(newPhoto);
                          showToast('Foto profil orang tua berhasil diunggah!');
                        }}
                        editTooltip="Klik untuk unggah foto orang tua sendiri"
                      />
                      {parentAvatar && (parentAvatar.startsWith('data:') || parentAvatar.startsWith('http')) && (
                        <button
                          type="button"
                          onClick={() => setParentAvatar('👩')}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
                        >
                          Hapus Foto
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-2">
                      Atau Pilih Karakter Avatar:
                    </span>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {['👩', '👨', '👵', '🧕', '🌸', '✨', '☕'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setParentAvatar(emoji)}
                          className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                            parentAvatar === emoji
                              ? 'border-emerald-500 bg-emerald-100 scale-105 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap Orang Tua / Wali *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Contoh: Ibu Dewi Pratama"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Hubungan Keluarga dengan Siswa
                    </label>
                    <select
                      value={parentRelation}
                      onChange={(e) => setParentRelation(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    >
                      <option value="Ibu Kandung">Ibu Kandung</option>
                      <option value="Ayah Kandung">Ayah Kandung</option>
                      <option value="Wali Murid">Wali Murid</option>
                      <option value="Kakek / Nenek">Kakek / Nenek</option>
                      <option value="Pendamping Khusus (Shadow Teacher)">Pendamping Khusus (Shadow Teacher)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor WhatsApp Aktif *
                    </label>
                    <input
                      type="text"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="0812-9876-5432"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Alamat Domisili
                    </label>
                    <input
                      type="text"
                      value={parentAddress}
                      onChange={(e) => setParentAddress(e.target.value)}
                      placeholder="Jl. Melati Indah No. 14, Jakarta Selatan"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Uji Voice Mic */}
      {activeTab === 'voice_mic' && (
        <div className="space-y-4">
          <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex items-center gap-3 text-xs text-sky-900 font-semibold">
            <Mic className="w-5 h-5 text-sky-600 shrink-0" />
            <span>
              Uji Voice Mic memungkinkan Anda menguji sensitivitas mikrofon dan akurasi rekognisi kata kunci anak ("Lanjut", "Ulangi", "Bantuan", "Selesai") secara langsung.
            </span>
          </div>
          <VoiceMicTester />
        </div>
      )}

      {/* Tab 3: Tahun Ajaran & Identitas Sekolah */}
      {activeTab === 'tahun_ajaran' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-slate-900">
                  Tahun Ajaran & Identitas Satuan Pendidikan
                </h2>
                <p className="text-xs text-slate-500">
                  Atur kalender akademik dan nama sekolah yang tertera pada laporan evaluasi
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveAcademic} className="space-y-6 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tahun Ajaran Aktif *
                </label>
                <select
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                >
                  <option value="2024/2025">2024/2025</option>
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                  <option value="2027/2028">2027/2028</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Semester Aktif *
                </label>
                <div className="flex items-center gap-3 pt-1">
                  {(['Ganjil', 'Genap'] as const).map((sem) => (
                    <label
                      key={sem}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        semester === sem
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="semester"
                        value={sem}
                        checked={semester === sem}
                        onChange={() => setSemester(sem)}
                        className="hidden"
                      />
                      <span>Semester {sem}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Nama Sekolah SLB / Sekolah Penyelenggara Inklusi *
              </label>
              <input
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SLB Negeri Budi Kasih"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <p className="text-xs font-bold text-slate-800">
                Penyelarasan Kurikulum:
              </p>
              <p className="text-xs text-slate-600">
                Kurikulum Merdeka SLB — Program Kebutuhan Khusus: <strong>Pengembangan Diri (Bina Diri) Fase A</strong> (Tunagrahita Ringan & Sedang).
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Akademik</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 4: Singkronisasi Otomatis */}
      {activeTab === 'sinkronisasi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-slate-900">
                  Pengaturan Singkronisasi Otomatis
                </h2>
                <p className="text-xs text-slate-500">
                  Kontrol sinkronisasi realtime antara perangkat sekolah dan portal orang tua
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* Toggle Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    Singkronisasi Otomatis Cloud
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    autoSync 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {autoSync ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Jika aktif, setiap progres aktivitas bina diri, respon suara, dan catatan buku penghubung langsung disinkronkan ke server secara berkala.
                </p>
              </div>

              {/* Big Interactive Switch */}
              <button
                type="button"
                onClick={handleToggleAutoSync}
                aria-label={autoSync ? 'Nonaktifkan Singkronisasi Otomatis' : 'Aktifkan Singkronisasi Otomatis'}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  autoSync ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    autoSync ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sync Status Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Status Jaringan
                </span>
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  <span className="font-bold text-sm text-slate-800">
                    {isOnline ? 'Terhubung (Online)' : 'Terputus (Offline)'}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Antrean Tertunda
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-['Fredoka'] font-bold text-lg text-slate-900">
                    {pendingSyncCount} Item
                  </span>
                  <span className="text-xs text-slate-500">
                    {pendingSyncCount === 0 ? 'Semua tersinkron' : 'Menunggu sinkron'}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Sync Trigger */}
            <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-sky-900">
                  Sinkronisasi Manual
                </h4>
                <p className="text-xs text-sky-700 mt-0.5">
                  Paksa pengiriman seluruh data lokal yang belum tersimpan ke server MySQL
                </p>
              </div>

              <button
                type="button"
                onClick={handleManualSyncNow}
                disabled={isManualSyncing || !isOnline}
                className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all cursor-pointer shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isManualSyncing ? 'animate-spin' : ''}`} />
                <span>{isManualSyncing ? 'Menyinkronkan...' : 'Sinkronkan Sekarang'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Penyimpanan lokal terenkripsi AES-256 aman dan mematuhi privasi siswa berkebutuhan khusus.</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Reset Riwayat Latihan */}
      {activeTab === 'reset_latihan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-['Fredoka'] font-bold text-lg sm:text-xl text-slate-900">
                  Reset Riwayat Latihan Siswa
                </h2>
                <p className="text-xs text-slate-500">
                  Hapus atau reset progres dan riwayat sesi latihan bina diri siswa
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            {/* Reset All Practice Progress */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div>
                <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Hapus & Reset Seluruh Riwayat Latihan Siswa</span>
                </h4>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  Menghapus semua capaian bintang mingguan, skor modul bina diri, dan riwayat rekaman suara untuk seluruh siswa agar sesi latihan dapat diulang dari awal semester.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset Riwayat Latihan Semua Siswa</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Resetting Practice Progress */}
      <ConfirmModal
        isOpen={isResetModalOpen}
        title="Reset Riwayat Latihan Siswa?"
        message="Apakah Anda yakin ingin menghapus seluruh riwayat mode latihan siswa? Progres kemandirian modul (cuci tangan, sikat gigi, dll) akan dikembalikan ke 0% untuk memulai latihan baru."
        details="Catatan: Data profil siswa dan akun orang tua tidak akan terhapus, hanya skor sesi latihan yang direset."
        confirmLabel="Ya, Reset Riwayat Latihan"
        confirmVariant="danger"
        onConfirm={handleConfirmResetPractice}
        onCancel={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};
