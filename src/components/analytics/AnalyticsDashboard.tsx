import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Award, 
  Calendar, 
  Download, 
  Filter, 
  ArrowUpRight, 
  Mic, 
  Activity,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { StudentProgress } from '../../types';

interface AnalyticsDashboardProps {
  students: StudentProgress[];
  onSelectStudent: (student: StudentProgress) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  students,
  onSelectStudent
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'pekan' | 'bulan' | 'semester'>('bulan');
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');

  const filteredStudents = selectedStudentFilter === 'all' 
    ? students 
    : students.filter(s => s.id === selectedStudentFilter);

  // Calculate aggregates safely
  const avgIndependence = students.length > 0
    ? Math.round(students.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) / students.length)
    : 0;

  const avgArticulation = students.length > 0
    ? Math.round(students.reduce((acc, curr) => acc + (curr.latestAudioRecording?.accuracy || 0), 0) / students.length)
    : 0;

  const handleExportCSV = () => {
    const headers = 'Nama Siswa,Kelas,Kondisi,Nilai Kemandirian,Akurasi Suara,Status\n';
    const rows = students.map(s => 
      `"${s.name}","${s.class}","${s.condition}",${s.progressPercentage}%,${s.latestAudioRecording.accuracy}%,"${s.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `rekap_nilai_bisa_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-50/80 via-white to-sky-50/80 rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-0.5 rounded-full">
              Dasbor Nilai Berkala
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
              FIM Evaluasi Inklusi
            </span>
          </div>
          <h1 className="font-['Fredoka'] font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Analitik Kemandirian & Rekap Nilai Siswa
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Pemantauan berkala tingkat adaptif, pengurangan bantuan (scaffolding fading), dan respon suara murid SLB.
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setSelectedPeriod('pekan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPeriod === 'pekan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pekan Ini
          </button>
          <button
            onClick={() => setSelectedPeriod('bulan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPeriod === 'bulan'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bulan Ini
          </button>
          <button
            onClick={() => setSelectedPeriod('semester')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedPeriod === 'semester'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semester 1
          </button>
        </div>
      </div>

      {/* 4 Summary Aggregate Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Indeks Kemandirian Rata-rata
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-['Fredoka'] font-extrabold text-3xl text-emerald-600 tabular-nums">
              {avgIndependence}%
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Berdasarkan 4 modul bina diri adaptif
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Pengurangan Bantuan Guru
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-['Fredoka'] font-extrabold text-3xl text-sky-600 tabular-nums">
              -65%
            </span>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
              Prompt Fading
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Beralih dari bantuan fisik ke respon suara mandiri
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Akurasi Artikulasi Suara
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-['Fredoka'] font-extrabold text-3xl text-amber-600 tabular-nums">
              {avgArticulation}%
            </span>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
              Jelas
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Perintah "Lanjut", "Ulangi", "Bantuan", "Selesai"
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Sinergi Rumah & Sekolah
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className="font-['Fredoka'] font-extrabold text-3xl text-indigo-600 tabular-nums">
              94%
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Aktif
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Keterisian rutin Buku Penghubung digital
          </p>
        </div>

      </div>

      {/* Visual Chart 1: Tren Nilai Berkala Siswa (Comparison Bar Charts) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-['Fredoka'] font-bold text-xl text-slate-900">
              Grafik Perkembangan Nilai Berkala
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Kenaikan nilai per pekannya membuktikan efektivitas pembelajaran suara interaktif.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Pilih Siswa:</span>
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="all">Semua Siswa Terpantau</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="space-y-4 pt-2">
          {filteredStudents.map(student => (
            <div key={student.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{student.avatar}</span>
                  <div>
                    <h3 className="font-['Fredoka'] font-bold text-sm text-slate-900">
                      {student.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">{student.condition}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-['Fredoka'] font-extrabold text-lg text-slate-900 tabular-nums">
                    {student.progressPercentage}%
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full ml-2">
                    {student.assistanceTrend === 'menurun' ? 'Kemandirian Naik' : 'Perlu Didampingi'}
                  </span>
                </div>
              </div>

              {/* Weekly bar progression */}
              {!student.gradeHistory || student.gradeHistory.length === 0 ? (
                <div className="h-20 flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-100/50 rounded-xl mt-2 border border-dashed border-slate-200">
                  <span>Belum ada riwayat nilai berkala (siswa baru didaftarkan)</span>
                </div>
              ) : (
                <div className="grid grid-cols-6 gap-2 items-end h-28 pt-2">
                  {student.gradeHistory.map((grade, idx) => (
                    <div key={idx} className="flex flex-col items-center h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-slate-600 mb-1">
                        {grade.score}
                      </span>
                      <div className="w-full bg-slate-200 rounded-t-lg overflow-hidden h-full flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            grade.score >= 80 
                              ? 'bg-gradient-to-t from-emerald-500 to-teal-400' 
                              : grade.score >= 60 
                              ? 'bg-gradient-to-t from-sky-500 to-blue-400' 
                              : 'bg-gradient-to-t from-amber-500 to-yellow-400'
                          }`}
                          style={{ height: `${grade.score}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold mt-1 truncate max-w-full">
                        {grade.period}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tabel Evaluasi & Rekap Nilai Berkala Siswa */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-['Fredoka'] font-bold text-lg text-slate-900">
              Rekapitulasi Nilai & Evaluasi Murid (Format Rapor SLB)
            </h2>
            <p className="text-xs text-slate-500">
              Data dapat diunduh untuk arsip akreditasi dan laporan bulanan dinas pendidikan.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh Rekap CSV</span>
          </button>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Murid</th>
                <th className="py-3 px-4">Kelas & Kebutuhan</th>
                <th className="py-3 px-4">Modul Berjalan</th>
                <th className="py-3 px-4">Nilai Kemandirian</th>
                <th className="py-3 px-4">Akurasi Suara</th>
                <th className="py-3 px-4">Rekomendasi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{s.avatar}</span>
                      <span className="font-bold text-slate-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-slate-800 font-semibold">{s.class}</p>
                    <p className="text-[11px] text-slate-500">{s.condition}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {s.currentActivity}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-sm text-slate-900 mr-2">
                      {s.progressPercentage}%
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.progressPercentage > 0
                        ? 'text-emerald-700 bg-emerald-50'
                        : 'text-slate-500 bg-slate-100'
                    }`}>
                      {s.progressPercentage > 0 ? 'Tuntas' : 'Belum Mulai'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-sky-700">
                    {s.latestAudioRecording?.accuracy ?? 0}%
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {s.latestTeacherNote?.text || '-'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectStudent(s)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Buka Profil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
