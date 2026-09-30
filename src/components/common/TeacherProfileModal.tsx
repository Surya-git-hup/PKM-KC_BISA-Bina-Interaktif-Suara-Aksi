import React, { useEffect, useState } from 'react';
import { 
  X, 
  GraduationCap, 
  School, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  MessageCircle, 
  Copy, 
  Check, 
  Sparkles,
  BookOpen,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { UserAvatar } from './UserAvatar';

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode?: string;
  teacherName?: string;
  schoolName?: string;
}

export const TeacherProfileModal: React.FC<TeacherProfileModalProps> = ({
  isOpen,
  onClose,
  roomCode = 'SLB-BUDI-01',
  teacherName,
  schoolName
}) => {
  const [copied, setCopied] = useState(false);
  const [teacherData, setTeacherData] = useState<{
    name: string;
    email: string;
    school: string;
    nip: string;
    phone: string;
    roomName: string;
    invitationCode: string;
    academicYear: string;
    bio: string;
  }>({
    name: teacherName || 'Ibu Ratna, S.Pd',
    email: 'ratna@slb-budikasih.sch.id',
    school: schoolName || 'SLB Budi Kasih Bengkulu',
    nip: '19850314 201001 2 021',
    phone: '0812-3456-7890',
    roomName: 'Kelas Inklusi C1',
    invitationCode: roomCode || 'SLB-BUDI-01',
    academicYear: '2024/2025',
    bio: 'Guru Pendidikan Khusus (SLB) berdedikasi membimbing ananda menuju kemandirian bina diri dan adaptasi sensori-motorik melalui instruksi suara BISA.'
  });

  useEffect(() => {
    if (!isOpen) return;
    const fetchTeacher = async () => {
      try {
        const res = await fetch(`/api/teacher/profile-by-code/${encodeURIComponent(roomCode)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && json.data) {
            setTeacherData(prev => ({
              ...prev,
              ...json.data,
              name: json.data.name || teacherName || prev.name,
              school: json.data.school || schoolName || prev.school
            }));
          }
        }
      } catch (err) {
        console.warn('Teacher profile fetch fallback:', err);
      }
    };
    fetchTeacher();
  }, [isOpen, roomCode, teacherName, schoolName]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(teacherData.invitationCode || roomCode);
    setCopied(true);
    soundEffects.playPop();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    soundEffects.playPop();
    const cleanPhone = teacherData.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const message = encodeURIComponent(`Halo ${teacherData.name}, saya orang tua murid ananda di ${teacherData.roomName}. Ingin berkonsultasi mengenai perkembangan bina diri ananda di aplikasi BISA.`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div className="relative bg-gradient-to-r from-amber-500 via-amber-600 to-sky-600 p-6 sm:p-7 text-white rounded-t-3xl overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            aria-label="Tutup Profil Guru"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center shadow-lg shrink-0">
              <UserAvatar avatar="👩‍🏫" name={teacherData.name} size="xl" />
            </div>

            <div className="space-y-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                <span>Profil Resmi Guru Kelas SLB</span>
              </div>
              <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-white truncate">
                {teacherData.name}
              </h2>
              <p className="text-xs sm:text-sm text-amber-100 font-medium truncate">
                {teacherData.school}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Room & Invitation Code Card */}
          <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Ruang Belajar & Kode Undangan Kelas
              </span>
              <p className="text-xs font-bold text-slate-800">
                {teacherData.roomName} • Tahun Ajaran {teacherData.academicYear}
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Kode yang menghubungkan akun Orang Tua ke guru ini
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-2 bg-white rounded-xl border border-amber-300 font-mono font-extrabold text-sm sm:text-base text-amber-900 tracking-wider shadow-2xs">
                {teacherData.invitationCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Salin Kode Undangan"
                className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Teacher Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold">NIP / NUPTK</p>
                <p className="font-bold text-slate-800 truncate">{teacherData.nip}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <School className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold">Satuan Pendidikan</p>
                <p className="font-bold text-slate-800 truncate">{teacherData.school}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold">Kontak WhatsApp</p>
                <p className="font-bold text-slate-800 truncate">{teacherData.phone}</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-slate-400 font-semibold">Email Edukasi</p>
                <p className="font-bold text-slate-800 truncate">{teacherData.email}</p>
              </div>
            </div>
          </div>

          {/* Teacher Message / Bio for Parents */}
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h4 className="font-['Fredoka'] font-bold text-sm text-sky-900">
                Pesan Guru untuk Orang Tua Murid
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              “{teacherData.bio} Kami sangat menganjurkan orang tua untuk konsisten mendampingi ananda berlatih 10 menit setiap hari di rumah menggunakan modul bina diri BISA.”
            </p>
          </div>

          {/* Consultation Hours */}
          <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <p className="font-bold text-slate-700">Waktu Konsultasi Wali Murid:</p>
              <p className="text-[11px] text-slate-500">Senin - Jumat, 13:00 - 15:30 WIB (atau melalui Buku Penghubung)</p>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
            🔒 Mode Baca Saja: Akun orang tua tidak dapat mengubah data guru.
          </p>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
