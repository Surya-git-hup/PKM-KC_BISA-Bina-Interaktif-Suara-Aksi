import React, { useEffect, useState } from 'react';
import { 
  X, 
  Users, 
  Phone, 
  Calendar, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  Search, 
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building,
  GraduationCap,
  Sparkles,
  Heart,
  ChevronRight,
  Send
} from 'lucide-react';
import { soundEffects } from '../../utils/soundEffects';
import { UserAvatar } from '../common/UserAvatar';
import { StudentProgress } from '../../types';

export interface ParentAccountItem {
  id: string | number;
  name: string;
  phone?: string;
  childName: string;
  studentId?: string | null;
  roomCode?: string;
  roomName?: string;
  school?: string;
  teacherName?: string;
  class?: string;
  condition?: string;
  createdAt?: string;
  registeredAt?: string;
  status?: string;
}

interface ParentAccountsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentProgress[];
  roomCode?: string;
  onViewAsParent?: (student: StudentProgress) => void;
  onOpenHandbookForStudent?: (studentId: string) => void;
}

export const ParentAccountsModal: React.FC<ParentAccountsModalProps> = ({
  isOpen,
  onClose,
  students,
  roomCode = 'SLB-BUDI-01',
  onViewAsParent,
  onOpenHandbookForStudent
}) => {
  const [parentAccounts, setParentAccounts] = useState<ParentAccountItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBiodataParent, setSelectedBiodataParent] = useState<ParentAccountItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchParents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/teacher/parent-accounts?roomCode=${encodeURIComponent(roomCode)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data)) {
            setParentAccounts(json.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Parent accounts fetch fallback:', err);
      }

      // Fallback from students list
      const derived: ParentAccountItem[] = students.map((s, idx) => ({
        id: `p-${idx + 1}`,
        name: s.parentName || 'Orang Tua Murid',
        phone: s.parentPhone || '0812-3456-7890',
        childName: s.name,
        studentId: s.id,
        roomCode: s.roomCode || roomCode,
        roomName: s.class || 'Kelas Inklusi BISA',
        school: s.school || 'SLB Negeri Pembina',
        teacherName: s.teacherName || 'Ibu Ratna, S.Pd',
        class: s.class,
        condition: s.condition || 'Kemandirian & Bina Diri',
        createdAt: '2026-09-26 10:00:00',
        registeredAt: '2026-09-26 10:00:00',
        status: 'Terhubung'
      }));
      setParentAccounts(derived);
      setLoading(false);
    };

    fetchParents();
  }, [isOpen, roomCode, students]);

  if (!isOpen) return null;

  const filtered = searchQuery.trim()
    ? parentAccounts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.childName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.phone && p.phone.includes(searchQuery))
      )
    : parentAccounts;

  const handleOpenWhatsApp = (phone?: string, parentName?: string, childName?: string) => {
    if (!phone) return;
    soundEffects.playPop();
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
    const msg = encodeURIComponent(`Halo ${parentName || 'Bapak/Ibu'}, saya guru kelas ananda ${childName || ''} di BISA SLB. Ingin menyampaikan kabar perkembangan bina diri ananda.`);
    window.open(`https://wa.me/${phoneWithCountry}?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col animate-scaleUp relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-700 to-indigo-700 p-6 text-white rounded-t-3xl relative shrink-0">
          <button
            onClick={() => {
              soundEffects.playPop();
              onClose();
            }}
            aria-label="Tutup Akses Akun Orang Tua"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-white transition-all cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner shrink-0">
              👥
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold text-sky-100 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-200" />
                <span>Akses Eksklusif Guru Kelas SLB</span>
              </div>
              <h2 className="font-['Fredoka'] font-bold text-xl sm:text-2xl text-white">
                Kelola & Akses Akun Orang Tua Murid
              </h2>
              <p className="text-xs text-sky-100 font-medium">
                Daftar wali murid yang terhubung dengan kode undangan: <strong className="font-mono bg-white/20 px-2 py-0.5 rounded-md">{roomCode}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3 shrink-0">
          <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan nama orang tua, nama anak, atau nomor WhatsApp..."
            className="flex-1 bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Content Body: List of Parent Accounts */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Memuat data akun orang tua...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl">
                👥
              </div>
              <p className="text-xs font-bold text-slate-700">Belum Ada Akun Orang Tua Ditemukan</p>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                Orang tua dapat menghubungkan akunnya dengan memasukkan kode undangan <strong>{roomCode}</strong> saat mendaftar.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filtered.map((item, idx) => {
                const matchedStudent = students.find(s => s.id === item.studentId || s.name.toLowerCase() === item.childName.toLowerCase());

                return (
                  <div 
                    key={item.id || idx}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <UserAvatar avatar="👩" name={item.name} size="md" />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-['Fredoka'] font-bold text-base text-slate-900">
                              {item.name}
                            </h3>
                            {item.status === 'Tidak Tersingkron' || !matchedStudent ? (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                                ✕ Tidak Tersingkron
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                ✓ Terhubung
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-500">
                            Wali dari: <strong className="text-slate-800 font-bold">{item.childName}</strong> • {item.class || 'Kelas Inklusi'}
                          </p>
                        </div>
                      </div>

                      {/* Contact & Phone */}
                      {item.phone && (
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(item.phone, item.name, item.childName)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{item.phone}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Teacher */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2 flex-wrap">
                      <div className="text-[11px] text-slate-400 font-medium">
                        Kode Ruang: <span className="font-mono font-bold text-slate-600">{item.roomCode || roomCode}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Ubah fitur "lihat tampilan orang tua" menjadi menampilkan biodata orang tua sesuai data registrasi */}
                        <button
                          type="button"
                          onClick={() => {
                            soundEffects.playPop();
                            setSelectedBiodataParent(item);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all cursor-pointer"
                          title="Lihat biodata orang tua lengkap sesuai data registrasi"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                          <span>Biodata Orang Tua</span>
                        </button>

                        {onOpenHandbookForStudent && (
                          <button
                            type="button"
                            onClick={() => {
                              onOpenHandbookForStudent(item.studentId || matchedStudent?.id || '');
                              onClose();
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                            <span>Buka Buku Penghubung</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Total: <strong>{filtered.length}</strong> Akun Wali Murid Terhubung</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
          >
            Tutup
          </button>
        </div>

        {/* Modal Pop-up Biodata Orang Tua Sesuai Data Registrasi */}
        {selectedBiodataParent && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
            <div 
              className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 space-y-5 animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Biodata */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-sky-500/20">
                    👩
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-['Fredoka'] font-bold text-xl text-slate-900">
                        Biodata Orang Tua
                      </h2>
                      {selectedBiodataParent.status === 'Tidak Tersingkron' ? (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                          ✕ Tidak Tersingkron
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          ✓ Terdaftar & Sinkron
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Sesuai Data Pendaftaran & Registrasi Akun BISA
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBiodataParent(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Data Orang Tua / Wali */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-sky-800 tracking-wide uppercase flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-sky-600" />
                  <span>Identitas Orang Tua / Wali</span>
                </h3>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Nama Lengkap Orang Tua:</span>
                    <span className="font-bold text-slate-900">{selectedBiodataParent.name}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Peran / Hubungan:</span>
                    <span className="font-semibold text-slate-800">Wali Murid / Orang Tua Kandung</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Nomor WhatsApp / HP:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold font-mono text-slate-900">{selectedBiodataParent.phone || '0812-3456-7890'}</span>
                      {selectedBiodataParent.phone && (
                        <button
                          type="button"
                          onClick={() => handleOpenWhatsApp(selectedBiodataParent.phone, selectedBiodataParent.name, selectedBiodataParent.childName)}
                          className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Chat WA
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">Tanggal Registrasi Akun:</span>
                    <span className="font-medium text-slate-700">
                      {selectedBiodataParent.registeredAt || selectedBiodataParent.createdAt || '26 September 2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Murid / Anak yang Terhubung */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-amber-800 tracking-wide uppercase flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Data Peserta Didik (Anak)</span>
                </h3>

                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-200/80 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
                    <span className="text-slate-600 font-medium">Nama Peserta Didik:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedBiodataParent.childName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
                    <span className="text-slate-600 font-medium">Kelas Siswa:</span>
                    <span className="font-semibold text-slate-800">{selectedBiodataParent.class || 'Kelas 1 SLB'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-amber-200/50">
                    <span className="text-slate-600 font-medium">ID Registrasi Siswa:</span>
                    <span className="font-mono text-[11px] text-slate-700">{selectedBiodataParent.studentId || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 font-medium">Fokus Pembelajaran:</span>
                    <span className="font-semibold text-amber-900">{selectedBiodataParent.condition || 'Kemandirian & Bina Diri (Fase Fondasi)'}</span>
                  </div>
                </div>
              </div>

              {/* Data Ruang Belajar & Guru Kelas */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-emerald-800 tracking-wide uppercase flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ruang Kelas & Guru Pembimbing</span>
                </h3>

                <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-200/80 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                    <span className="text-slate-600 font-medium">Kode Undangan Terdaftar:</span>
                    <span className="font-mono font-extrabold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {selectedBiodataParent.roomCode || roomCode}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-emerald-200/50">
                    <span className="text-slate-600 font-medium">Guru Wali Kelas:</span>
                    <span className="font-bold text-slate-900">{selectedBiodataParent.teacherName || 'Ibu Ratna, S.Pd'}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-600 font-medium">Sekolah SLB:</span>
                    <span className="font-medium text-slate-700">{selectedBiodataParent.school || 'SLB Budi Kasih Bengkulu'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons inside Biodata Modal */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                {onOpenHandbookForStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      soundEffects.playPop();
                      onOpenHandbookForStudent(selectedBiodataParent.studentId || '');
                      setSelectedBiodataParent(null);
                      onClose();
                    }}
                    className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-['Fredoka'] font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Buka Buku Penghubung</span>
                  </button>
                )}

                {selectedBiodataParent.phone && (
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(selectedBiodataParent.phone, selectedBiodataParent.name, selectedBiodataParent.childName)}
                    className="w-full sm:w-auto py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-['Fredoka'] font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Hubungi WhatsApp</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedBiodataParent(null)}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

