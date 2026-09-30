import React, { useState } from 'react';
import { X, UserPlus, Sparkles, KeyRound, Shield, Phone, Heart } from 'lucide-react';
import { StudentProgress, UserSession } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface AddStudentModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: StudentProgress) => void;
  currentUser?: UserSession | null;
}

const AVATAR_OPTIONS = ['👦', '👧', '🧒', '👶', '🧑', '👧🏽', '👦🏻', '🧒🏼'];

const NEED_OPTIONS = [
  'Tunagrahita Ringan',
  'Tunagrahita Sedang',
  'Disabilitas Intelektual Ringan',
  'Autisme & Disabilitas Intelektual',
  'Down Syndrome',
  'Lambat Belajar (Slow Learner)'
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  onClose,
  onAddStudent,
  currentUser
}) => {
  const [name, setName] = useState('');
  const [cls, setCls] = useState('Kelas 1 SLB');
  const [condition, setCondition] = useState('Tunagrahita Ringan');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');
  
  // Use teacher's active room code or auto-generate fallback
  const generateRoomCode = (studentName: string) => {
    if (currentUser?.roomCode) return currentUser.roomCode;
    const clean = studentName.trim().toUpperCase().split(' ')[0] || 'SISWA';
    const rand = Math.floor(10 + Math.random() * 89);
    return `SLB-${clean.slice(0, 4)}-${rand}`;
  };

  const [roomCode, setRoomCode] = useState(currentUser?.roomCode || generateRoomCode(''));

  const handleNameChange = (val: string) => {
    setName(val);
    if (!currentUser?.roomCode && (!roomCode || roomCode.startsWith('SLB-SISW'))) {
      setRoomCode(generateRoomCode(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !parentName.trim()) return;

    soundEffects.playCommandRecognized();
    const effectiveCode = (roomCode || currentUser?.roomCode || 'SLB-BUDI-01').trim().toUpperCase();
    const teacherName = currentUser?.name || 'Guru SLB';
    const schoolName = currentUser?.school || 'SLB Budi Kasih Bengkulu';

    const newStudent: StudentProgress = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      roomCode: effectiveCode,
      avatar: selectedAvatar,
      class: cls,
      condition,
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim() || '0812-3456-7890',
      school: schoolName,
      teacherName: teacherName,
      currentActivity: 'Belum Ada Aktivitas',
      status: 'butuh_bantuan',
      progressPercentage: 0,
      completedActivities: 0,
      totalActivities: 0,
      weeklyStars: 0,
      maxWeeklyStars: 10,
      assistanceTrend: 'stabil',
      modulesProgress: {
        cuciTangan: 0,
        menggosokGigi: 0,
        makanMandiri: 0,
        memakaiPakaian: 0
      },
      latestTeacherNote: {
        author: teacherName,
        role: 'Wali Kelas',
        timestamp: 'Baru saja',
        text: `Peserta didik ${name} berhasil didaftarkan ke kelas inklusi. Siap memulai modul adaptif dengan kendali suara BISA.`,
        synced: true
      },
      latestAudioRecording: {
        command: '-',
        duration: '00:00',
        accuracy: 0
      },
      gradeHistory: []
    };

    onAddStudent(newStudent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-slate-900">
              Tambah Peserta Didik Baru
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Daftarkan anak berkebutuhan khusus untuk pantauan kelas inklusi BISA
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Avatar Karakter Ceria
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                    selectedAvatar === av
                      ? 'bg-amber-400 border-2 border-amber-600 scale-110 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Murid *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Contoh: Aditya Pratama"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
            />
          </div>

          {/* Class & Special Needs Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tingkat Kelas
              </label>
              <select
                value={cls}
                onChange={(e) => setCls(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              >
                <option value="Kelas 1 SLB">Kelas 1 SLB (Fase A)</option>
                <option value="Kelas 2 SLB">Kelas 2 SLB (Fase A)</option>
                <option value="Kelas 3 SLB">Kelas 3 SLB (Fase B)</option>
                <option value="Kelas Persiapan">Kelas Persiapan Mandiri</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Kondisi Kebutuhan Khusus
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              >
                {NEED_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Parent Guardian Name & WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Orang Tua / Wali *
              </label>
              <input
                type="text"
                required
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Contoh: Ibu Rina"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. WhatsApp (Notifikasi Otomatis)
              </label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
            </div>
          </div>

          {/* Auto-Generated Room Code for Parent Login */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                  Kode Ruang Login Orang Tua
                </span>
                <span className="font-mono font-bold text-base text-amber-900">
                  {roomCode}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRoomCode(generateRoomCode(name))}
                className="text-xs font-bold text-amber-700 underline"
              >
                Acak Ulang
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Kode ini diberikan kepada orang tua murid untuk masuk ke Portal Orang Tua.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-['Fredoka'] font-bold text-sm rounded-xl shadow-md shadow-amber-500/25 cursor-pointer"
            >
              Simpan & Daftarkan Murid
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
