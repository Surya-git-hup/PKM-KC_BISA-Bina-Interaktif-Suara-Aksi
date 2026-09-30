import React from 'react';
import { X, Printer, Download, Award, CheckCircle, FileText } from 'lucide-react';
import { StudentProgress } from '../../types';

interface ReportCardModalProps {
  student: StudentProgress;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({ student, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 my-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Rapor Container */}
        <div className="space-y-6 printable-report">
          {/* Header SLB */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-['Fredoka'] font-bold text-xl flex items-center justify-center">
                B
              </div>
              <h2 className="font-['Fredoka'] font-extrabold text-2xl text-slate-900">
                SLB BUDI KASIH - BENGKULU
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-semibold">
              Laporan Evaluasi Pembelajaran Bina Diri Interaktif Suara-Aksi (BISA)
            </p>
            <p className="text-xs text-slate-400">Tahun Ajaran 2024/2025 • Semester Ganjil</p>
          </div>

          {/* Student Info Table */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-slate-500">Nama Siswa:</p>
              <p className="font-bold text-slate-800 text-sm">{student.name}</p>
            </div>
            <div>
              <p className="text-slate-500">Kelas / Fase:</p>
              <p className="font-bold text-slate-800 text-sm">{student.class} (Fase A)</p>
            </div>
            <div>
              <p className="text-slate-500">Kebutuhan Khusus:</p>
              <p className="font-bold text-slate-800 text-sm">{student.condition}</p>
            </div>
            <div>
              <p className="text-slate-500">Wali Murid:</p>
              <p className="font-bold text-slate-800 text-sm">{student.parentName}</p>
            </div>
          </div>

          {/* Progress Modules Table */}
          <div>
            <h3 className="font-bold text-sm text-slate-800 mb-3">
              I. Capaian Keterampilan Bina Diri
            </h3>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Keterampilan</th>
                    <th className="py-2.5 px-3">Capaian</th>
                    <th className="py-2.5 px-3">Keterangan Kemandirian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">1</td>
                    <td className="py-2.5 px-3 font-semibold">Cuci Tangan 6 Langkah</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600">{(student.modulesProgress?.cuciTangan ?? 0)}%</td>
                    <td className="py-2.5 px-3">
                      {(student.modulesProgress?.cuciTangan ?? 0) === 0 ? 'Belum Memulai Modul' : 'Mandiri Penuh (Tanpa sentuh bantuan)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">2</td>
                    <td className="py-2.5 px-3 font-semibold">Menggosok Gigi Mandiri</td>
                    <td className="py-2.5 px-3 font-bold text-sky-600">{(student.modulesProgress?.menggosokGigi ?? 0)}%</td>
                    <td className="py-2.5 px-3">
                      {(student.modulesProgress?.menggosokGigi ?? 0) === 0 ? 'Belum Memulai Modul' : 'Respons Suara Lancar (BISA Voice Mic)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">3</td>
                    <td className="py-2.5 px-3 font-semibold">Makan & Minum Tertib</td>
                    <td className="py-2.5 px-3 font-bold text-amber-600">{(student.modulesProgress?.makanMandiri ?? 0)}%</td>
                    <td className="py-2.5 px-3">
                      {(student.modulesProgress?.makanMandiri ?? 0) === 0 ? 'Belum Memulai Modul' : 'Pembiasaan Sendok & Sikap Meja'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-semibold">4</td>
                    <td className="py-2.5 px-3 font-semibold">Memakai Pakaian / Kemeja</td>
                    <td className="py-2.5 px-3 font-bold text-indigo-600">{(student.modulesProgress?.memakaiPakaian ?? 0)}%</td>
                    <td className="py-2.5 px-3">
                      {(student.modulesProgress?.memakaiPakaian ?? 0) === 0 ? 'Belum Memulai Modul' : 'Latihan Kancing Bertahap (Scaffolding)'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Catatan Kualitatif Guru */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/70 text-xs">
            <h4 className="font-bold text-amber-900 mb-1">Catatan Kualitatif Guru Kelas:</h4>
            <p className="text-slate-700 italic leading-relaxed">
              "{student.latestTeacherNote.text} Ananda menunjukkan antusiasme tinggi saat berlatih menggunakan kendali suara BISA. Kerja sama pembiasaan orang tua di rumah sangat baik."
            </p>
          </div>

          {/* Tanda Tangan */}
          <div className="flex justify-between items-center pt-4 text-xs">
            <div className="text-center">
              <p className="text-slate-500 mb-10">Orang Tua / Wali Murid</p>
              <p className="font-bold text-slate-800 underline">{student.parentName || 'Orang Tua Murid'}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-500 mb-10">Guru Pembimbing Khusus</p>
              <p className="font-bold text-slate-800 underline">{student.teacherName || student.latestTeacherNote?.author || 'Guru SLB'}</p>
              <p className="text-[10px] text-slate-400">NIP. 19850412 201101 2 008</p>
            </div>
          </div>

        </div>

        {/* Modal Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 text-xs font-bold hover:bg-slate-100 rounded-xl"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Rapor</span>
          </button>
        </div>

      </div>
    </div>
  );
};
