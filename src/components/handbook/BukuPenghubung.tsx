import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Check, 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Filter, 
  Sparkles, 
  Edit3, 
  User, 
  Camera,
  CheckCheck,
  Trash2,
  X,
  Upload,
  ZoomIn,
  AlertTriangle,
  Info
} from 'lucide-react';
import { HandbookEntry, UserRole, UserSession, StudentProgress } from '../../types';
import { soundEffects } from '../../utils/soundEffects';

interface BukuPenghubungProps {
  entries: HandbookEntry[];
  onAddEntry: (entry: Partial<HandbookEntry>) => void;
  onDeleteEntry?: (id: string) => void;
  currentRole: UserRole;
  currentUser?: UserSession | null;
  teacherName?: string;
  student?: StudentProgress | null;
  roomCode?: string;
}

export const BukuPenghubung: React.FC<BukuPenghubungProps> = ({
  entries,
  onAddEntry,
  onDeleteEntry,
  currentRole,
  currentUser,
  teacherName,
  student,
  roomCode
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'filtered' | 'help'>('all');
  const [inputText, setInputText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageCaption, setAttachedImageCaption] = useState<string>('Dokumentasi Mandiri');
  const [showPhotoPicker, setShowPhotoPicker] = useState<boolean>(false);
  const [localEntries, setLocalEntries] = useState<HandbookEntry[]>(entries);
  
  // Delete confirmation modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fullscreen photo lightbox
  const [lightboxImage, setLightboxImage] = useState<{ url: string; title: string; author: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const effectiveCode = (roomCode || currentUser?.roomCode || student?.roomCode || 'SLB-BUDI-01').trim().toUpperCase();

  // Sync entries from props
  React.useEffect(() => {
    setLocalEntries(entries);
  }, [entries]);

  // Periodic Real-Time Sync with Server for Buku Penghubung
  React.useEffect(() => {
    let isMounted = true;
    const fetchLatestEntries = async () => {
      try {
        const res = await fetch(`/api/handbook?roomCode=${encodeURIComponent(effectiveCode)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data) && isMounted) {
            setLocalEntries(json.data);
          }
        }
      } catch (err) {
        // graceful offline fallback
      }
    };

    fetchLatestEntries();
    const interval = setInterval(fetchLatestEntries, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [effectiveCode]);

  // Determine actual teacher name matching teacher's account
  const effectiveTeacherName = 
    (currentUser && currentUser.role === 'teacher' ? currentUser.name : null) || 
    teacherName || 
    'Guru SLB';

  const effectiveParentName = 
    (currentUser && currentUser.role === 'parent' ? currentUser.name : null) || 
    'Orang Tua Murid';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLike = (id: string) => {
    soundEffects.playPop();
    setLocalEntries(prev =>
      prev.map(entry => {
        if (entry.id === id) {
          const nextLiked = !entry.liked;
          const likerName = currentRole === 'teacher' ? effectiveTeacherName : effectiveParentName;
          return {
            ...entry,
            liked: nextLiked,
            likedBy: nextLiked ? `Disukai ${likerName}` : undefined
          };
        }
        return entry;
      })
    );
    try {
      const likerName = currentRole === 'teacher' ? effectiveTeacherName : effectiveParentName;
      fetch(`/api/handbook/${id}/like`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likerName })
      }).catch(() => {});
    } catch {}
  };

  const handleSend = () => {
    if (!inputText.trim() && !attachedImage) return;

    soundEffects.playCommandRecognized();
    const isTeacher = currentRole === 'teacher';
    const authorName = isTeacher ? effectiveTeacherName : effectiveParentName;
    const authorRole = isTeacher ? 'Guru SLB' : 'Orang Tua';
    const authorAvatar = isTeacher ? (currentUser?.avatar || '👩‍🏫') : (currentUser?.avatar || '👩');
    const readReceipt = isTeacher ? 'Terkirim ke Orang Tua' : `Terkirim ke ${effectiveTeacherName}`;
    const targetStudentId = student?.id || currentUser?.studentId || 'siswa-1';
    const targetStudentName = student?.name || currentUser?.childName || 'Ananda';

    const newEntry: HandbookEntry = {
      id: `entry-${Date.now()}`,
      studentId: targetStudentId,
      studentName: targetStudentName,
      roomCode: effectiveCode,
      authorName,
      authorRole,
      authorAvatar,
      timestamp: 'Baru saja',
      content: inputText.trim() || (attachedImage ? 'Melampirkan foto dokumentasi aktivitas.' : ''),
      imageUrl: attachedImage || undefined,
      liked: false,
      readStatus: true,
      readBy: readReceipt
    };

    setLocalEntries(prev => [newEntry, ...prev.filter(e => e.id !== newEntry.id)]);
    onAddEntry(newEntry);
    setInputText('');
    setAttachedImage(null);
    setShowPhotoPicker(false);
    showToast('Catatan berhasil dikirim ke Buku Penghubung.');
  };

  const formatContent = (content: string, itemStudentName?: string) => {
    if (!content) return '';
    let text = content;
    const childName = itemStudentName || student?.name || currentUser?.childName || 'Ananda';

    // Universal replacement: replace any parent calling/requesting help with student name
    text = text.replace(/(?:Ibu|Bapak|Wali)\s+[A-Za-z\s()]+(?:memanggil|meminta)\s+bantuan/gi, `${childName} meminta bantuan`);
    if (currentUser?.name) {
      text = text.replace(new RegExp(`\\b${currentUser.name}\\b\\s*(?:memanggil|meminta)\\s*bantuan`, 'gi'), `${childName} meminta bantuan`);
    }
    return text;
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    soundEffects.playPop();
    const idToDelete = deleteTargetId;
    setLocalEntries(prev => prev.filter(e => e.id !== idToDelete));
    if (onDeleteEntry) {
      onDeleteEntry(idToDelete);
    }
    setDeleteTargetId(null);
    try {
      await fetch(`/api/handbook/${idToDelete}`, { method: 'DELETE' });
    } catch {}
    showToast('Pesan / Notifikasi berhasil dihapus dari Buku Penghubung.');
  };

  // Bulk clear help notifications so they don't pile up
  const handleClearAllHelpNotifications = async () => {
    soundEffects.playPop();
    const idsToRemove = localEntries
      .filter(e => e.authorRole === 'Sistem BISA (Otomatis)' || e.authorName === 'Notifikasi BISA Voice Mic' || (e.content && e.content.toLowerCase().includes('bantuan')))
      .map(e => e.id);

    if (idsToRemove.length === 0) return;

    setLocalEntries(prev => prev.filter(e => !idsToRemove.includes(e.id)));
    if (onDeleteEntry) {
      idsToRemove.forEach(id => onDeleteEntry(id));
    }
    try {
      await fetch(`/api/handbook/clear-notifications?roomCode=${encodeURIComponent(effectiveCode)}`, {
        method: 'DELETE'
      });
    } catch {}
    showToast(`${idsToRemove.length} notifikasi bantuan berhasil dibersihkan agar tidak menumpuk.`);
  };

  const handleVoiceDictation = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      soundEffects.playListenPing();
      setTimeout(() => {
        const sampleText = currentRole === 'teacher'
          ? 'Ananda hari ini sangat aktif dan mandiri mempraktikkan bina diri di kelas inklusi.'
          : 'Ananda berhasil mengulang kegiatan bina diri di rumah dengan senang hati.';
        setInputText(prev => (prev ? `${prev} ` : '') + sampleText);
        setIsRecordingVoice(false);
      }, 2000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  // Real file upload from camera or device gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEffects.playPop();
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAttachedImage(result);
        setAttachedImageCaption(file.name.replace(/\.[^/.]+$/, "") || 'Dokumentasi Mandiri');
        setShowPhotoPicker(false);
        showToast('Foto dokumentasi berhasil dipilih dari perangkat.');
      }
    };
    reader.readAsDataURL(file);
    // Reset file input so same file can be re-selected if needed
    e.target.value = '';
  };

  // Preset sample documentation photos
  const sampleDocumentationPhotos = [
    {
      id: 'cuci-tangan',
      title: 'Cuci Tangan Mandiri',
      url: `${import.meta.env.BASE_URL}images/cuci_tangan_bisa_1790423529881.jpg`
    },
    {
      id: 'gosok-gigi',
      title: 'Menggosok Gigi',
      url: `${import.meta.env.BASE_URL}images/gosok_gigi_bisa_1790423550373.jpg`
    },
    {
      id: 'memakai-pakaian',
      title: 'Memakai Pakaian',
      url: `${import.meta.env.BASE_URL}images/memakai_pakaian_bisa_1790423578527.jpg`
    },
    {
      id: 'makan-mandiri',
      title: 'Makan Mandiri',
      url: `${import.meta.env.BASE_URL}images/makan_mandiri_bisa_1790423565600.jpg`
    },
    {
      id: 'budi-real',
      title: 'Praktik Nyata di Wastafel',
      url: `${import.meta.env.BASE_URL}images/budi_cuci_tangan_real_1790423591381.jpg`
    }
  ];

  // Filter help / system notifications
  const helpEntries = localEntries.filter(
    item => item.authorRole === 'Sistem BISA (Otomatis)' || 
            item.authorName === 'Notifikasi BISA Voice Mic' || 
            (item.content && item.content.toLowerCase().includes('bantuan'))
  );

  // Filtering entries based on filterMode
  const displayedEntries = localEntries.filter(item => {
    if (filterMode === 'all') return true;
    if (filterMode === 'help') {
      return item.authorRole === 'Sistem BISA (Otomatis)' || 
             item.authorName === 'Notifikasi BISA Voice Mic' || 
             (item.content && item.content.toLowerCase().includes('bantuan'));
    }
    if (currentRole === 'teacher') {
      return item.authorRole === 'Orang Tua' || item.authorRole === 'Guru SLB';
    }
    return item.authorRole === 'Guru SLB' || item.authorRole === 'Orang Tua';
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-16 relative">
      
      {/* Hidden file input for real camera & gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold animate-fadeIn border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner matching app styling */}
      <div className="bg-gradient-to-r from-amber-50/90 via-white to-sky-50/90 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Buku Penghubung
            </h1>
            <span className="bg-amber-100 text-amber-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
              Kolaboratif
            </span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500">
            Catatan Harian Guru SLB (<span className="text-sky-700 font-bold">{effectiveTeacherName}</span>) & Orang Tua Siswa
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              const inputElem = document.getElementById('handbook-input');
              inputElem?.focus();
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-2xl font-['Fredoka'] font-bold text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>Tulis Catatan</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Role indicator */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setFilterMode('all')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>Semua Catatan ({localEntries.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('filtered')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              filterMode === 'filtered'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>↔ Guru SLB & Orang Tua</span>
          </button>

          {helpEntries.length > 0 && (
            <button
              onClick={() => setFilterMode('help')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                filterMode === 'help'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <span>🆘 Bantuan Murid ({helpEntries.length})</span>
            </button>
          )}

          {/* Fitur Hapus Notifikasi agar tidak menumpuk */}
          {helpEntries.length > 0 && (
            <button
              type="button"
              onClick={handleClearAllHelpNotifications}
              title="Hapus semua notifikasi bantuan agar tidak menumpuk"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Bersihkan Notifikasi Menumpuk ({helpEntries.length})</span>
            </button>
          )}
        </div>

        <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
          <span>Akun Aktif:</span>
          <span className="text-slate-800 font-extrabold">
            {currentRole === 'teacher' ? effectiveTeacherName : effectiveParentName}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
            {currentRole === 'teacher' ? 'Guru SLB' : 'Orang Tua'}
          </span>
        </div>
      </div>

      {/* Feed Timeline Items */}
      <div className="space-y-5">
        {displayedEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="font-['Fredoka'] font-bold text-xl text-slate-800 mb-1">
              Belum Ada Catatan Buku Penghubung
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
              Catatan masih kosong. Tulis catatan atau lampirkan foto dokumentasi harian di bawah ini untuk memulai pemantauan kolaboratif antara Guru SLB dan Orang Tua.
            </p>
          </div>
        ) : (
          displayedEntries.map((item) => {
            // Determine displayed author and student name
            const isSystem = item.authorRole === 'Sistem BISA (Otomatis)' || item.authorName === 'Notifikasi BISA Voice Mic';
            const isHelpNotification = isSystem || (item.content && item.content.toLowerCase().includes('bantuan'));
            const isItemTeacher = item.authorRole === 'Guru SLB' && !isSystem;

            // Sesuaikan nama yang dilingkari dengan nama murid yang meminta bantuan
            const studentDisplayName = item.studentName || student?.name || currentUser?.childName || 'Budi Pratama';

            const displayAuthorName = isHelpNotification
              ? `${studentDisplayName} (Meminta Bantuan)`
              : isItemTeacher
              ? effectiveTeacherName
              : item.authorName;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border shadow-sm space-y-4 hover:shadow-md transition-shadow relative group ${
                  isHelpNotification ? 'border-rose-200 bg-rose-50/15' : 'border-slate-100'
                }`}
              >
                {/* Post Header with Delete Action */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 ${
                        isHelpNotification
                          ? 'bg-rose-100 text-rose-900 border border-rose-200'
                          : isSystem
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : isItemTeacher
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      <span>{isHelpNotification ? '🆘' : isSystem ? '🔔' : (item.authorAvatar || (isItemTeacher ? '👩‍🏫' : '👩'))}</span>
                      <span>{isHelpNotification ? 'Minta Bantuan Murid' : isSystem ? 'BISA Voice Mic' : item.authorRole}</span>
                    </span>
                    <h3 className="font-['Fredoka'] font-bold text-base text-slate-900">
                      {displayAuthorName}
                    </h3>

                    {item.studentName && !isHelpNotification && (
                      <span className="hidden sm:inline-block text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        Murid: {item.studentName}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold text-slate-400">
                      🕒 {item.timestamp}
                    </span>

                    {/* Fitur Hapus Notifikasi agar tidak menumpuk */}
                    {isHelpNotification ? (
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        title="Hapus notifikasi bantuan ini agar tidak menumpuk"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Notifikasi</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
                        title="Hapus pesan ini jika ada kesalahan pengiriman"
                        className="p-1.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer group-hover:opacity-100 opacity-80"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content text */}
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  "{formatContent(item.content, item.studentName)}"
                </p>

                {/* Attached Photo Documentation with Zoom Lightbox */}
                {item.imageUrl && (
                  <div 
                    onClick={() => setLightboxImage({
                      url: item.imageUrl!,
                      title: 'Foto Dokumentasi Aktivitas',
                      author: displayAuthorName
                    })}
                    className="rounded-2xl overflow-hidden border border-slate-100 relative max-h-96 bg-slate-100 shadow-inner group/photo cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt="Dokumentasi Bina Diri"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover/photo:scale-[1.01] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover/photo:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover/photo:opacity-100 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-opacity shadow-lg">
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Lihat Ukuran Penuh</span>
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-amber-300" />
                      <span>Foto Dokumentasi</span>
                    </div>
                  </div>
                )}

                {/* Footer Actions (Like, Reply, Read status) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                        item.liked
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                      <span>{item.liked ? item.likedBy || 'Disukai' : 'Apresiasi'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setInputText(`@${displayAuthorName} `);
                        document.getElementById('handbook-input')?.focus();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>Balas</span>
                    </button>
                  </div>

                  {item.readBy && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700">
                      <CheckCheck className="w-4 h-4 text-emerald-500" />
                      <span>
                        {item.readBy.includes('Bu Rahmawati') 
                          ? item.readBy.replace('Bu Rahmawati', effectiveTeacherName) 
                          : item.readBy}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Photo Picker Dialog / Tray */}
      {showPhotoPicker && (
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-300 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-amber-500" />
              <h3 className="font-['Fredoka'] font-bold text-base text-slate-900">
                Pilih Foto Dokumentasi
              </h3>
            </div>
            <button
              onClick={() => setShowPhotoPicker(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Real File Upload from Device or Camera */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/60 hover:bg-sky-50 text-left transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm text-sky-900">Upload dari Kamera / Galeri</div>
                <div className="text-xs text-sky-700">Pilih foto langsung dari smartphone atau komputer</div>
              </div>
            </button>

            {/* Quick Capture Presets */}
            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-500 px-1">Atau pilih contoh foto aktivitas:</div>
              <div className="grid grid-cols-2 gap-1.5">
                {sampleDocumentationPhotos.slice(0, 4).map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      soundEffects.playPop();
                      setAttachedImage(sample.url);
                      setAttachedImageCaption(sample.title);
                      setShowPhotoPicker(false);
                      showToast(`Foto ${sample.title} dipilih.`);
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-left transition-all cursor-pointer text-xs font-bold text-slate-700 truncate"
                  >
                    <img src={sample.url} alt={sample.title} className="w-7 h-7 rounded-lg object-cover" />
                    <span className="truncate">{sample.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fixed / Sticky Bottom Input Bar */}
      <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-xl flex flex-col gap-2">
        {/* Photo attachment preview if attached */}
        {attachedImage && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-2.5 rounded-2xl">
            <img 
              src={attachedImage} 
              alt="Preview" 
              className="w-12 h-12 rounded-xl object-cover border border-amber-200 shadow-xs" 
            />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-amber-900 truncate">
                📷 Foto Dokumentasi Terlampir: {attachedImageCaption}
              </div>
              <div className="text-[11px] text-amber-700">
                Siap dikirim bersama catatan ke buku penghubung
              </div>
            </div>
            <button 
              onClick={() => {
                soundEffects.playPop();
                setAttachedImage(null);
              }}
              className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-100 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Hapus Foto</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            id="handbook-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`Tulis catatan harian ${currentRole === 'teacher' ? 'evaluasi siswa' : 'latihan rumah'}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 rounded-2xl border-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800 placeholder-slate-400 font-medium"
          />

          {/* Photo documentation feature toggle */}
          <button
            onClick={() => setShowPhotoPicker(prev => !prev)}
            title="Lampirkan foto dokumentasi (Kamera / Galeri)"
            className={`p-2.5 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
              attachedImage || showPhotoPicker 
                ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold">Foto</span>
          </button>

          {/* Voice dictation button */}
          <button
            onClick={handleVoiceDictation}
            title="Dikte dengan suara"
            className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
              isRecordingVoice
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
          <button
            onClick={handleSend}
            className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-['Fredoka'] font-bold text-xs sm:text-sm rounded-2xl shadow-sm shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer transition-transform active:scale-95"
          >
            <span>Kirim</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-slate-100 animate-scaleUp">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-['Fredoka'] font-bold text-xl text-slate-900">
                {localEntries.find(e => e.id === deleteTargetId)?.authorRole === 'Sistem BISA (Otomatis)' ||
                 localEntries.find(e => e.id === deleteTargetId)?.authorName === 'Notifikasi BISA Voice Mic' ||
                 (localEntries.find(e => e.id === deleteTargetId)?.content?.toLowerCase().includes('bantuan'))
                  ? 'Hapus Notifikasi Bantuan?'
                  : 'Hapus Pesan Ini?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                {localEntries.find(e => e.id === deleteTargetId)?.authorRole === 'Sistem BISA (Otomatis)' ||
                 localEntries.find(e => e.id === deleteTargetId)?.authorName === 'Notifikasi BISA Voice Mic' ||
                 (localEntries.find(e => e.id === deleteTargetId)?.content?.toLowerCase().includes('bantuan'))
                  ? 'Notifikasi bantuan ini akan dihapus agar daftar catatan tetap rapi dan tidak menumpuk.'
                  : 'Pesan akan dihapus secara permanen dari buku penghubung jika terdapat kesalahan pengiriman.'}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-600/20 cursor-pointer transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Photo Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl border border-white/20 animate-scaleUp"
          >
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-bold text-sm">{lightboxImage.title}</h4>
                  <p className="text-[11px] text-slate-400">Oleh: {lightboxImage.author}</p>
                </div>
              </div>
              <button
                onClick={() => setLightboxImage(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-[70vh] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={lightboxImage.url}
                alt="Dokumentasi Fullsize"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="p-3 bg-slate-50 text-right">
              <button
                onClick={() => setLightboxImage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Tutup Foto
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
