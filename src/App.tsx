/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AppView, 
  UserRole, 
  UserSession, 
  BinaDiriModule, 
  StudentProgress, 
  HandbookEntry, 
  ScaffoldingLevel,
  DailyNotification,
  SchoolSettings
} from './types';
import { BINA_DIRI_MODULES, INITIAL_STUDENTS, INITIAL_HANDBOOK_ENTRIES, INITIAL_NOTIFICATIONS } from './data/mockData';
import { soundEffects } from './utils/soundEffects';
import { cryptoStorage } from './utils/cryptoStorage';
import { syncService } from './utils/syncService';
import { StudentHeader } from './components/StudentHeader';
import { PortalHeader } from './components/PortalHeader';
import { Sidebar } from './components/Sidebar';
import { AuthPage } from './components/auth/AuthPage';
import { SplashScreen } from './components/student/SplashScreen';
import { StudentHome } from './components/student/StudentHome';
import { StudentDirectoryHome } from './components/student/StudentDirectoryHome';
import { StudentActivityPicker } from './components/student/StudentActivityPicker';
import { EquipmentCheck } from './components/student/EquipmentCheck';
import { StepActivityPlayer } from './components/student/StepActivityPlayer';
import { ActivityCelebration } from './components/student/ActivityCelebration';
import { HelpAssistanceModal } from './components/student/HelpAssistanceModal';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { StudentDetailProfile } from './components/teacher/StudentDetailProfile';
import { AddStudentModal } from './components/teacher/AddStudentModal';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { ParentDashboard } from './components/parent/ParentDashboard';
import { BukuPenghubung } from './components/handbook/BukuPenghubung';
import { VoiceMicTester } from './components/hardware/VoiceMicTester';
import { SettingsPage } from './components/settings/SettingsPage';
import { VoiceNavigationAssistant } from './components/accessibility/VoiceNavigationAssistant';
import { VoiceActivityScreen } from './components/student/VoiceActivityScreen';

export default function App() {
  // Session & Auth State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    return cryptoStorage.loadEncrypted<UserSession | null>('active_session', null);
  });

  // When opening the application, show the splash/welcome screen first as requested
  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('register');

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const savedSession = cryptoStorage.loadEncrypted<UserSession | null>('active_session', null);
    return savedSession ? savedSession.role : 'teacher';
  });

  // Data States: Empty on initial load when teacher enters for the first time
  const [students, setStudents] = useState<StudentProgress[]>(() => {
    const saved = cryptoStorage.loadEncrypted<StudentProgress[] | null>('bisa_students', null);
    return saved !== null ? saved : [];
  });

  const [handbookEntries, setHandbookEntries] = useState<HandbookEntry[]>(() => {
    const saved = cryptoStorage.loadEncrypted<HandbookEntry[] | null>('bisa_handbook', null);
    return saved !== null ? saved : [];
  });

  const [notifications, setNotifications] = useState<DailyNotification[]>(() => {
    const saved = cryptoStorage.loadEncrypted<DailyNotification[] | null>('bisa_notifications', null);
    return saved !== null ? saved : [];
  });

  // Selected entities
  const [selectedModule, setSelectedModule] = useState<BinaDiriModule>(BINA_DIRI_MODULES[0]);
  const [currentVoiceStepNumber, setCurrentVoiceStepNumber] = useState<number>(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(() => {
    const saved = cryptoStorage.loadEncrypted<StudentProgress[] | null>('bisa_students', null);
    return saved && saved.length > 0 ? saved[0] : null;
  });

  // App UI & Network States
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [completedActivitiesCount, setCompletedActivitiesCount] = useState(0);
  const [helpStepNumber, setHelpStepNumber] = useState<number | null>(null);
  const [pendingHelpCount, setPendingHelpCount] = useState(0);
  const [scaffoldingLevel, setScaffoldingLevel] = useState<ScaffoldingLevel>('panduan_lengkap');
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Offline & Cloud Sync Status
  const [isOnline, setIsOnline] = useState(syncService.isOnline());
  const [pendingSyncCount, setPendingSyncCount] = useState(syncService.getPendingCount());

  // Academic & System Settings (persisted)
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const saved = cryptoStorage.loadEncrypted<SchoolSettings | null>('bisa_school_settings', null);
    return saved || {
      academicYear: '2026/2027',
      semester: 'Ganjil',
      schoolName: 'SLB Negeri Budi Kasih',
      autoSyncEnabled: syncService.isAutoSyncEnabled(),
      showStudentModeButton: true
    };
  });

  // Listen to network & cloud sync updates
  useEffect(() => {
    const unsub = syncService.subscribe((online, pending, auto) => {
      setIsOnline(online);
      setPendingSyncCount(pending);
      setSchoolSettings(prev => ({ ...prev, autoSyncEnabled: auto }));
    });
    return unsub;
  }, []);

  // Save changes to encrypted storage automatically
  useEffect(() => {
    cryptoStorage.saveEncrypted('bisa_school_settings', schoolSettings);
  }, [schoolSettings]);

  useEffect(() => {
    cryptoStorage.saveEncrypted('bisa_students', students);
  }, [students]);

  useEffect(() => {
    cryptoStorage.saveEncrypted('bisa_handbook', handbookEntries);
  }, [handbookEntries]);

  useEffect(() => {
    cryptoStorage.saveEncrypted('bisa_notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      cryptoStorage.saveEncrypted('active_session', currentUser);
    } else {
      cryptoStorage.remove('active_session');
    }
  }, [currentUser]);

  // Handlers for Settings & Data Operations
  const handleToggleAutoSync = () => {
    const next = !syncService.isAutoSyncEnabled();
    syncService.setAutoSyncEnabled(next);
    setSchoolSettings(prev => ({ ...prev, autoSyncEnabled: next }));
    soundEffects.playPop();
  };

  const handleUpdateSchoolSettings = (updated: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => {
      const next = { ...prev, ...updated };
      cryptoStorage.saveEncrypted('bisa_school_settings', next);
      return next;
    });
    soundEffects.playPop();
  };

  const handleUpdateUserProfile = (updated: Partial<UserSession>) => {
    if (currentUser) {
      const next = { ...currentUser, ...updated };
      setCurrentUser(next);
      cryptoStorage.saveEncrypted('active_session', next);
      soundEffects.playPop();
    }
  };

  const handleUpdateStudentPhoto = (studentId: string, photoDataUrl: string) => {
    soundEffects.playPop();
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, avatar: photoDataUrl } : s))
    );
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(prev => prev ? { ...prev, avatar: photoDataUrl } : null);
    }
  };

  const handleDeleteStudent = (student: StudentProgress) => {
    soundEffects.playPop();
    setStudents(prev => prev.filter(s => s.id !== student.id));
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(null);
      if (currentView === 'teacher_student_detail') {
        setCurrentView('teacher_dashboard');
      }
    }

    // Clean handbook entries for deleted student
    setHandbookEntries(prev => prev.filter(h => h.studentId !== student.id));

    // Sever connection / unsync if current user is the parent of this deleted student
    if (currentUser?.role === 'parent' && (currentUser.studentId === student.id || currentUser.childName === student.name)) {
      const unsyncedSession: UserSession = {
        ...currentUser,
        studentId: undefined,
        childName: undefined,
        roomCode: undefined,
        teacherName: undefined,
        syncedWithTeacher: false
      };
      setCurrentUser(unsyncedSession);
      cryptoStorage.saveEncrypted('active_session', unsyncedSession);
    }

    const deleteNotif: DailyNotification = {
      id: `notif-del-${Date.now()}`,
      title: 'Data Siswa Dihapus & Sinkronisasi Diputus',
      message: `Data peserta didik ${student.name} (${student.class}) telah dihapus. Akun orang tua terkait tidak lagi tersingkron dengan akun guru.`,
      timestamp: 'Baru saja',
      type: 'sync_success',
      read: false,
      studentName: student.name
    };
    setNotifications(prev => [deleteNotif, ...prev]);

    try {
      fetch(`/api/students/${student.id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
  };

  const handleResetStudentPractice = (studentId: string) => {
    soundEffects.playPop();
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            completedActivities: 0,
            progressPercentage: 0,
            weeklyStars: 0,
            currentActivity: 'Belum Ada Aktivitas',
            status: 'butuh_bantuan',
            modulesProgress: {
              cuciTangan: 0,
              menggosokGigi: 0,
              makanMandiri: 0,
              memakaiPakaian: 0
            },
            gradeHistory: []
          };
        }
        return s;
      })
    );

    if (selectedStudent?.id === studentId) {
      setSelectedStudent(prev => prev ? {
        ...prev,
        completedActivities: 0,
        progressPercentage: 0,
        weeklyStars: 0,
        currentActivity: 'Belum Ada Aktivitas',
        status: 'butuh_bantuan',
        modulesProgress: {
          cuciTangan: 0,
          menggosokGigi: 0,
          makanMandiri: 0,
          memakaiPakaian: 0
        },
        gradeHistory: []
      } : null);
    }

    try {
      fetch(`/api/students/${studentId}/reset-progress`, { method: 'POST' }).catch(() => {});
    } catch {}
  };

  const handleResetAllPracticeProgress = () => {
    soundEffects.playPop();
    setStudents(prev =>
      prev.map(s => ({
        ...s,
        completedActivities: 0,
        progressPercentage: 0,
        weeklyStars: 0,
        currentActivity: 'Belum Ada Aktivitas',
        status: 'butuh_bantuan',
        modulesProgress: {
          cuciTangan: 0,
          menggosokGigi: 0,
          makanMandiri: 0,
          memakaiPakaian: 0
        },
        gradeHistory: []
      }))
    );
    setCompletedActivitiesCount(0);
    if (selectedStudent) {
      setSelectedStudent(prev => prev ? {
        ...prev,
        completedActivities: 0,
        progressPercentage: 0,
        weeklyStars: 0,
        currentActivity: 'Belum Ada Aktivitas',
        status: 'butuh_bantuan',
        modulesProgress: {
          cuciTangan: 0,
          menggosokGigi: 0,
          makanMandiri: 0,
          memakaiPakaian: 0
        },
        gradeHistory: []
      } : null);
    }
  };

  // Parent registration sync callback
  const handleRegisterParentSuccess = (newStudent: StudentProgress) => {
    setStudents(prev => {
      const exists = prev.some(s => s.id === newStudent.id);
      return exists ? prev.map(s => s.id === newStudent.id ? newStudent : s) : [newStudent, ...prev];
    });
    setSelectedStudent(newStudent);
  };

  // Real-time synchronization check for parent account
  useEffect(() => {
    if (currentUser?.role !== 'parent' || !currentUser?.studentId) return;

    let isMounted = true;
    const checkSyncStatus = async () => {
      try {
        const res = await fetch(`/api/students/${currentUser.studentId}/sync-status`);
        if (res.ok) {
          const json = await res.json();
          if (json.synced === false && isMounted) {
            // Student was deleted by teacher: unsync parent account immediately!
            setSelectedStudent(null);
            setStudents(prev => prev.filter(s => s.id !== currentUser.studentId));
            const unsynced: UserSession = {
              ...currentUser,
              studentId: undefined,
              childName: undefined,
              roomCode: undefined,
              teacherName: undefined,
              syncedWithTeacher: false
            };
            setCurrentUser(unsynced);
            cryptoStorage.saveEncrypted('active_session', unsynced);

            const alertNotif: DailyNotification = {
              id: `notif-unsync-${Date.now()}`,
              title: 'Akun Tidak Tersingkron',
              message: 'Data peserta didik telah dihapus oleh Guru Kelas. Akun Anda tidak lagi tersingkron dengan guru.',
              timestamp: 'Baru saja',
              type: 'help_requested',
              read: false,
              studentName: currentUser.childName || 'Peserta Didik'
            };
            setNotifications(prev => [alertNotif, ...prev]);
          }
        }
      } catch {}
    };

    checkSyncStatus();
    const interval = setInterval(checkSyncStatus, 4000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser?.role, currentUser?.studentId]);

  // Login handler matching account scoping & synchronization
  const handleLoginSuccess = async (session: UserSession) => {
    setCurrentUser(session);
    setCurrentRole(session.role);

    // If teacher registers a new account: completely empty all data!
    if (session.isNewAccount && session.role === 'teacher') {
      setStudents([]);
      setSelectedStudent(null);
      setHandbookEntries([]);
      setNotifications([]);
      cryptoStorage.saveEncrypted('bisa_students', []);
      cryptoStorage.saveEncrypted('bisa_handbook', []);
      cryptoStorage.saveEncrypted('bisa_notifications', []);
      cryptoStorage.saveEncrypted('active_session', session);
      setCurrentView('teacher_dashboard');
      return;
    }

    // Fetch account-scoped students from database
    try {
      const roomParam = session.roomCode ? `?roomCode=${encodeURIComponent(session.roomCode)}` : '';
      const res = await fetch(`/api/students${roomParam}`);
      if (res.ok) {
        const data = await res.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          let scoped = data.data;
          if (session.role === 'parent') {
            if (session.studentId) {
              const child = scoped.find((s: StudentProgress) => s.id === session.studentId);
              scoped = child ? [child] : [];
            } else {
              scoped = [];
            }
          }
          // Always set students (even if empty array for new teacher!)
          setStudents(scoped);
          setSelectedStudent(scoped.length > 0 ? scoped[0] : null);
          cryptoStorage.saveEncrypted('bisa_students', scoped);
        }
      }

      // Fetch handbook entries scoped to roomCode
      const hbParam = session.roomCode ? `?roomCode=${encodeURIComponent(session.roomCode)}` : '';
      const hbRes = await fetch(`/api/handbook${hbParam}`);
      if (hbRes.ok) {
        const hbData = await hbRes.json();
        if (hbData.status === 'success' && Array.isArray(hbData.data)) {
          setHandbookEntries(hbData.data);
          cryptoStorage.saveEncrypted('bisa_handbook', hbData.data);
        }
      }
    } catch {
      // Offline fallback
      if (session.role === 'parent' && session.studentId) {
        const match = students.find(s => s.id === session.studentId);
        if (match) setSelectedStudent(match);
      }
    }

    if (session.role === 'teacher') {
      setCurrentView('teacher_dashboard');
    } else if (session.role === 'parent') {
      setCurrentView('parent_dashboard');
    } else {
      setCurrentView('student_home');
    }
  };

  const handleLogout = () => {
    soundEffects.playPop();
    setCurrentUser(null);
    setCurrentView('auth');
  };

  const handleToggleSound = () => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    soundEffects.setSoundEnabled(next);
  };

  const handleToggleOfflineMode = () => {
    const nextSimulated = !syncService.isSimulationActive();
    syncService.setSimulatedOffline(nextSimulated);
    soundEffects.playPop();
  };

  const handleSelectModule = (mod: BinaDiriModule) => {
    setSelectedModule(mod);
    setCurrentVoiceStepNumber(1);
    setCurrentView('student_equipment');
  };

  const handleStartActivitySteps = () => {
    setCurrentView('student_activity');
  };

  // Notification deletion handlers
  const handleDeleteNotification = (notifId: string) => {
    soundEffects.playPop();
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const handleClearAllNotifications = () => {
    soundEffects.playPop();
    setNotifications([]);
  };

  // Real-time synchronization for Buku Penghubung
  useEffect(() => {
    const roomCode = currentUser?.roomCode || selectedStudent?.roomCode || '';
    if (!roomCode) return;

    let isMounted = true;
    const syncHandbook = async () => {
      try {
        const res = await fetch(`/api/handbook?roomCode=${encodeURIComponent(roomCode)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'success' && Array.isArray(json.data) && isMounted) {
            setHandbookEntries(json.data);
            cryptoStorage.saveEncrypted('bisa_handbook', json.data);
          }
        }
      } catch {}
    };

    const interval = setInterval(syncHandbook, 3000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [currentUser?.roomCode, selectedStudent?.roomCode]);

  // Fix any existing handbook entries and notifications to use student's name instead of parent's name
  useEffect(() => {
    if (currentUser?.role === 'parent' && currentUser?.name && (currentUser?.childName || selectedStudent?.name)) {
      const child = currentUser.childName || selectedStudent?.name || 'Ananda';
      const parent = currentUser.name;
      setHandbookEntries(prev =>
        prev.map(e => {
          let updated = { ...e };
          if (updated.content && updated.content.includes(`${parent} memanggil bantuan`)) {
            updated.content = updated.content.replace(`${parent} memanggil bantuan`, `${child} memanggil bantuan`);
            updated.studentName = child;
          }
          if (updated.content && updated.content.includes(`${parent} meminta bantuan`)) {
            updated.content = updated.content.replace(`${parent} meminta bantuan`, `${child} meminta bantuan`);
            updated.studentName = child;
          }
          return updated;
        })
      );
      setNotifications(prev =>
        prev.map(n => {
          let updated = { ...n };
          if (updated.message && updated.message.includes(`${parent} meminta bantuan`)) {
            updated.message = updated.message.replace(`${parent} meminta bantuan`, `${child} meminta bantuan`);
            updated.studentName = child;
          }
          return updated;
        })
      );
    }
  }, [currentUser?.name, currentUser?.childName, currentUser?.role, selectedStudent?.name]);

  // Activity Completion & Automated Progress Notification Dispatch
  const handleActivityComplete = () => {
    setCompletedActivitiesCount(prev => Math.min(10, prev + 1));

    const activeStudentName = selectedStudent?.name || currentUser?.childName || 'Ananda';
    const activeStudentId = selectedStudent?.id || currentUser?.studentId || 'siswa-1';
    const activeRoomCode = currentUser?.roomCode || selectedStudent?.roomCode || 'SLB-BUDI-01';

    // 1. Update Student record if a student exists
    if (selectedStudent) {
      setStudents(prev =>
        prev.map(s => {
          if (s.id === selectedStudent.id) {
            const nextScore = Math.min(100, s.progressPercentage + 5);
            return {
              ...s,
              completedActivities: s.completedActivities + 1,
              progressPercentage: nextScore,
              weeklyStars: Math.min(10, s.weeklyStars + 1),
              gradeHistory: [
                ...(s.gradeHistory || []),
                {
                  period: `Sesi ${s.completedActivities + 1}`,
                  score: nextScore,
                  verbalPromptLevel: 5,
                  status: 'Meningkat'
                }
              ]
            };
          }
          return s;
        })
      );
    }

    // 2. Automated Daily Progress Notification
    const autoNotification: DailyNotification = {
      id: `notif-${Date.now()}`,
      title: 'Progres Harian Otomatis',
      message: `${activeStudentName} telah menyelesaikan ${selectedModule.totalSteps} langkah ${selectedModule.title} dengan mandiri! (+3 Bintang)`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'activity_completed',
      read: false,
      studentName: activeStudentName
    };
    setNotifications(prev => [autoNotification, ...prev]);

    // 3. Automated Handbook timeline post
    const completionHandbookEntry: HandbookEntry = {
      id: `entry-${Date.now()}`,
      studentId: activeStudentId,
      studentName: activeStudentName,
      roomCode: activeRoomCode,
      authorName: 'Notifikasi Suara BISA',
      authorRole: 'Sistem BISA (Otomatis)',
      authorAvatar: '🤖',
      timestamp: 'Baru saja',
      content: `${activeStudentName} telah menuntaskan modul ${selectedModule.title} dengan kendali suara secara mandiri! ⭐ (+3 Bintang)`,
      liked: false,
      readStatus: true,
      readBy: 'Tersinkronisasi Realtime Cloud'
    };
    setHandbookEntries(prev => [completionHandbookEntry, ...prev]);

    // Save handbook entry to MySQL database API for cross-account synchronization
    fetch('/api/handbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completionHandbookEntry)
    }).catch(() => {});

    // Enqueue to cloud sync manager
    syncService.enqueue('activity', {
      studentId: activeStudentId,
      module: selectedModule.id,
      timestamp: new Date().toISOString()
    });

    // Save directly to MySQL database API
    try {
      fetch('/api/activities/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: activeStudentId,
          studentName: activeStudentName,
          moduleId: selectedModule.id,
          moduleName: selectedModule.title,
          stepsCompleted: selectedModule.totalSteps,
          totalSteps: selectedModule.totalSteps,
          accuracy: 94,
          latencyMs: 240,
          voiceCommand: 'selesai',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.warn('Activity log sync warning:', err));
    } catch (e) {
      // Handled gracefully in offline mode
    }

    setCurrentView('student_celebration');
  };

  // Help Call Handler
  const handleTriggerHelp = (stepNumber: number) => {
    setHelpStepNumber(stepNumber);
    setPendingHelpCount(prev => prev + 1);

    const activeStudentName = selectedStudent?.name || currentUser?.childName || 'Ananda';
    const activeStudentId = selectedStudent?.id || currentUser?.studentId || 'siswa-1';
    const activeRoomCode = currentUser?.roomCode || selectedStudent?.roomCode || 'SLB-BUDI-01';

    // Automated Help Notification
    const helpNotif: DailyNotification = {
      id: `help-notif-${Date.now()}`,
      title: 'Permintaan Bantuan Suara',
      message: `${activeStudentName} meminta bantuan pada modul ${selectedModule.title}, langkah ${stepNumber}. Guru kelas C1 telah diberi sinyal.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type: 'help_requested',
      read: false,
      studentName: activeStudentName
    };
    setNotifications(prev => [helpNotif, ...prev]);

    // Add note in handbook
    const helpEntry: HandbookEntry = {
      id: `help-${Date.now()}`,
      studentId: activeStudentId,
      studentName: activeStudentName,
      roomCode: activeRoomCode,
      authorName: `${activeStudentName} (Meminta Bantuan)`,
      authorRole: 'Sistem BISA (Otomatis)',
      authorAvatar: '🔔',
      timestamp: 'Baru saja',
      content: `${activeStudentName} memanggil bantuan suara pada langkah ${stepNumber}. Pendamping siap memberikan scaffolding adaptif.`,
      liked: false,
      readStatus: false
    };
    setHandbookEntries(prev => [helpEntry, ...prev.filter(e => e.id !== helpEntry.id)]);

    syncService.enqueue('note', { studentId: activeStudentId, type: 'help', stepNumber });

    // Save directly to MySQL database API so teacher & parent are synchronized
    fetch('/api/handbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(helpEntry)
    }).catch(() => {});
  };

  // Teacher adds new student
  const handleAddNewStudent = (newStudent: StudentProgress) => {
    setStudents(prev => [newStudent, ...prev]);
    setSelectedStudent(newStudent);

    // Automated Notification
    const newStudentNotif: DailyNotification = {
      id: `notif-student-${Date.now()}`,
      title: 'Peserta Didik Terdaftar',
      message: `${newStudent.name} (${newStudent.class}) berhasil ditambahkan. Kode ruang orang tua: ${newStudent.roomCode}`,
      timestamp: 'Baru saja',
      type: 'sync_success',
      read: false,
      studentName: newStudent.name
    };
    setNotifications(prev => [newStudentNotif, ...prev]);

    syncService.enqueue('student', newStudent);

    // Save directly to MySQL database API
    try {
      fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      }).catch(err => console.warn('Student MySQL sync warning:', err));
    } catch (e) {
      // Handled gracefully in offline mode
    }
  };

  const handleUpdateStudentNote = (studentId: string, noteText: string) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          return {
            ...s,
            latestTeacherNote: {
              ...s.latestTeacherNote,
              text: noteText,
              timestamp: 'Hari ini, Baru saja',
              synced: true
            }
          };
        }
        return s;
      })
    );

    const newEntry: HandbookEntry = {
      id: `note-${Date.now()}`,
      studentId,
      authorName: currentUser?.name || 'Ibu Ratna, S.Pd',
      authorRole: 'Guru SLB',
      authorAvatar: '👩‍🏫',
      timestamp: 'Baru saja',
      content: noteText,
      liked: false,
      readStatus: true,
      readBy: 'Tersinkron ke Buku Penghubung'
    };
    setHandbookEntries(prev => [newEntry, ...prev]);

    syncService.enqueue('note', { studentId, text: noteText });

    // Save to MySQL database API
    try {
      fetch('/api/handbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      }).catch(err => console.warn('Handbook MySQL sync warning:', err));
    } catch (e) {
      // Handled gracefully
    }
  };

  const handleAddHandbookEntry = async (entry: Partial<HandbookEntry>) => {
    const effectiveRoomCode = entry.roomCode || currentUser?.roomCode || selectedStudent?.roomCode || 'SLB-BUDI-01';
    const entryWithRoom: HandbookEntry = {
      ...entry,
      roomCode: effectiveRoomCode,
      studentId: entry.studentId || selectedStudent?.id || currentUser?.studentId || 'siswa-1',
      studentName: entry.studentName || selectedStudent?.name || currentUser?.childName || 'Ananda'
    } as HandbookEntry;

    setHandbookEntries(prev => [entryWithRoom, ...prev.filter(e => e.id !== entryWithRoom.id)]);
    syncService.enqueue('handbook', entryWithRoom);

    // Save to MySQL database API
    try {
      await fetch('/api/handbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryWithRoom)
      });
      // Re-fetch to ensure synchronization
      const res = await fetch(`/api/handbook?roomCode=${encodeURIComponent(effectiveRoomCode)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setHandbookEntries(json.data);
          cryptoStorage.saveEncrypted('bisa_handbook', json.data);
        }
      }
    } catch (e) {
      // Handled gracefully
    }
  };

  const handleDeleteHandbookEntry = (entryId: string) => {
    setHandbookEntries(prev => prev.filter(e => e.id !== entryId));
    soundEffects.playPop();
    try {
      fetch(`/api/handbook/${entryId}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
  };

  const handleRoleChange = (role: UserRole) => {
    // SECURITY: Never grant teacher account access to parents
    if (currentUser?.role === 'parent' && role === 'teacher') {
      setCurrentRole('parent');
      setCurrentView('parent_dashboard');
      return;
    }

    setCurrentRole(role);
    if (role === 'teacher') {
      setCurrentView('teacher_dashboard');
    } else if (role === 'parent') {
      setCurrentView('parent_dashboard');
    }
  };

  const handleNavigateView = (view: AppView) => {
    // SECURITY: Do not give parent access to teacher routes
    if (currentUser?.role === 'parent' && (view === 'teacher_dashboard' || view === 'teacher_student_detail' || view === 'teacher_analytics')) {
      setCurrentView('parent_dashboard');
      return;
    }
    setCurrentView(view);
  };

  // Handlers for Welcome / Splash Navigation matching user requirement:
  // - If user has logged in before -> direct to home / beranda
  // - If first time -> direct to registration
  const handleNavigateHomeFromSplash = () => {
    soundEffects.playPop();
    if (!currentUser) {
      setAuthInitialMode('register');
      setCurrentView('auth');
      return;
    }
    if (currentUser.role === 'teacher') {
      setCurrentView('teacher_dashboard');
    } else if (currentUser.role === 'parent') {
      setCurrentView('parent_dashboard');
    } else {
      setCurrentView('student_home');
    }
  };

  const handleNavigateRegisterFromSplash = () => {
    soundEffects.playPop();
    setAuthInitialMode('register');
    setCurrentView('auth');
  };

  const handleNavigateLoginFromSplash = () => {
    soundEffects.playPop();
    setAuthInitialMode('login');
    setCurrentView('auth');
  };

  // If in Auth View (First Time Entry / Login Selection)
  if (currentView === 'auth') {
    return (
      <AuthPage
        onLoginSuccess={handleLoginSuccess}
        onRegisterParentSuccess={handleRegisterParentSuccess}
        students={students}
        initialMode={authInitialMode}
        onBackToWelcome={() => setCurrentView('splash')}
      />
    );
  }

  // If in Splash Screen
  if (currentView === 'splash') {
    return (
      <SplashScreen
        currentUser={currentUser}
        onNavigateHome={handleNavigateHomeFromSplash}
        onNavigateRegister={handleNavigateRegisterFromSplash}
        onNavigateLogin={handleNavigateLoginFromSplash}
      />
    );
  }

  // Is Portal Layout (Teacher / Parent / Handbook / Analytics / Settings)
  const isPortalView =
    currentView === 'teacher_dashboard' ||
    currentView === 'teacher_student_detail' ||
    currentView === 'teacher_analytics' ||
    currentView === 'parent_dashboard' ||
    currentView === 'handbook' ||
    currentView === 'hardware_tester' ||
    currentView === 'settings';

  const studentNickname = selectedStudent?.nickname || selectedStudent?.name?.trim().split(/\s+/)[0] || 'Budi';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 relative">
      
      {/* Offline Alert Ribbon when disconnected */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-xs font-bold py-1 px-4 text-center flex items-center justify-center gap-2 shadow-xs z-50">
          <span>⚠️ Mode Offline Aktif: Data latihan tetap tersimpan secara aman di memori terenkripsi dan akan diunggah otomatis saat kembali online.</span>
          <button 
            onClick={handleToggleOfflineMode}
            className="underline font-extrabold cursor-pointer"
          >
            Aktifkan Mode Online
          </button>
        </div>
      )}

      {/* Conditionally Render Portal Layout with Sidebar vs Student Full Layout */}
      {isPortalView ? (
        <div className="flex min-h-screen">
          {/* Left Sidebar */}
          <Sidebar
            currentRole={currentRole}
            onRoleChange={handleRoleChange}
            currentView={currentView}
            onNavigate={handleNavigateView}
            currentUser={currentUser}
            onLogout={handleLogout}
            onOpenAddStudent={() => setIsAddStudentOpen(true)}
            isOpenOnMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            students={students}
            onViewAsParent={(s) => {
              setSelectedStudent(s);
              setCurrentRole('parent');
              setCurrentView('parent_dashboard');
            }}
            onOpenHandbookForStudent={(sId) => {
              const st = students.find(s => s.id === sId);
              if (st) setSelectedStudent(st);
              setCurrentView('handbook');
            }}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <PortalHeader
              onBackToStudent={() => {
                setCurrentView('student_home');
              }}
              notifications={notifications}
              onMarkNotificationsRead={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
              onClearNotifications={handleClearAllNotifications}
              onDeleteNotification={handleDeleteNotification}
              currentUser={currentUser}
              onLogout={handleLogout}
              isOnline={isOnline}
              pendingSyncCount={pendingSyncCount}
              academicYear={schoolSettings.academicYear}
              autoSyncEnabled={schoolSettings.autoSyncEnabled}
              onToggleAutoSync={handleToggleAutoSync}
              showStudentModeButton={schoolSettings.showStudentModeButton}
              students={students}
              onSelectStudent={(s) => {
                setSelectedStudent(s);
                if (currentUser?.role === 'parent') {
                  setCurrentView('parent_dashboard');
                } else {
                  setCurrentView('teacher_student_detail');
                }
              }}
              onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
            />

            <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
              {currentView === 'teacher_dashboard' && (
                <TeacherDashboard
                  students={students}
                  onSelectStudent={(s) => {
                    setSelectedStudent(s);
                    setCurrentView('teacher_student_detail');
                  }}
                  pendingHelpCount={pendingHelpCount}
                  onOpenAddStudent={() => setIsAddStudentOpen(true)}
                  onOpenAnalytics={() => setCurrentView('teacher_analytics')}
                  onDeleteStudent={handleDeleteStudent}
                  currentUser={currentUser}
                  onViewAsParent={(s) => {
                    setSelectedStudent(s);
                    setCurrentRole('parent');
                    setCurrentView('parent_dashboard');
                  }}
                  onOpenHandbookForStudent={(sId) => {
                    const st = students.find(s => s.id === sId);
                    if (st) setSelectedStudent(st);
                    setCurrentView('handbook');
                  }}
                />
              )}

              {currentView === 'teacher_student_detail' && (
                <StudentDetailProfile
                  student={selectedStudent}
                  onBack={() => setCurrentView('teacher_dashboard')}
                  onUpdateNote={handleUpdateStudentNote}
                  onDeleteStudent={handleDeleteStudent}
                  onResetPractice={handleResetStudentPractice}
                  onUpdateStudentPhoto={handleUpdateStudentPhoto}
                  currentUser={currentUser}
                  onViewAsParent={(s) => {
                    setSelectedStudent(s);
                    setCurrentRole('parent');
                    setCurrentView('parent_dashboard');
                  }}
                />
              )}

              {currentView === 'teacher_analytics' && (
                <AnalyticsDashboard
                  students={students}
                  onSelectStudent={(s) => {
                    setSelectedStudent(s);
                    setCurrentView('teacher_student_detail');
                  }}
                />
              )}

              {currentView === 'parent_dashboard' && (
                <ParentDashboard
                  student={selectedStudent}
                  currentUser={currentUser}
                  latestHandbookEntry={handbookEntries.find(e => e.authorRole === 'Guru SLB') || null}
                  onOpenVoicePractice={() => {
                    setCurrentView('student_activity');
                  }}
                  onOpenHandbook={() => setCurrentView('handbook')}
                />
              )}

              {currentView === 'handbook' && (
                <BukuPenghubung
                  entries={handbookEntries}
                  onAddEntry={handleAddHandbookEntry}
                  onDeleteEntry={handleDeleteHandbookEntry}
                  currentRole={currentRole}
                  currentUser={currentUser}
                  teacherName={currentUser?.role === 'teacher' ? currentUser.name : (selectedStudent?.teacherName || currentUser?.teacherName || 'Guru SLB')}
                  student={selectedStudent}
                  roomCode={currentUser?.roomCode || selectedStudent?.roomCode || 'SLB-BUDI-01'}
                />
              )}

              {currentView === 'hardware_tester' && <VoiceMicTester />}

              {currentView === 'settings' && (
                <SettingsPage
                  currentRole={currentRole}
                  currentUser={currentUser}
                  onUpdateUserProfile={handleUpdateUserProfile}
                  schoolSettings={schoolSettings}
                  onUpdateSchoolSettings={handleUpdateSchoolSettings}
                  isOnline={isOnline}
                  pendingSyncCount={pendingSyncCount}
                  onResetAllPracticeProgress={handleResetAllPracticeProgress}
                />
              )}
            </main>
          </div>
        </div>
      ) : (
        /* Student Friendly Mode (Matches IMG-20260926-WA0009, 11, 14, 16, 17) */
        <div className="flex-1 flex flex-col">
          <StudentHeader
            currentView={currentView}
            onNavigate={(view) => setCurrentView(view)}
            onSwitchRole={(role) => handleRoleChange(role)}
            isSoundOn={isSoundOn}
            onToggleSound={handleToggleSound}
            onOpenHelp={() => handleTriggerHelp(currentVoiceStepNumber)}
            currentUser={currentUser}
            selectedStudent={selectedStudent}
            onLogout={handleLogout}
          />

          <main className="flex-1 py-4">
            {currentView === 'student_home' && (
              <StudentDirectoryHome
                students={students}
                selectedStudent={selectedStudent}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onStartActivityWithStudent={(s) => {
                  setSelectedStudent(s);
                  setCurrentView('student_activities');
                }}
                onUpdateStudentPhoto={handleUpdateStudentPhoto}
                onOpenAddStudent={() => setIsAddStudentOpen(true)}
                currentRole={currentRole}
              />
            )}

            {currentView === 'student_activities' && (
              <StudentActivityPicker
                modules={BINA_DIRI_MODULES}
                students={students}
                selectedStudent={selectedStudent}
                onSelectStudent={(s) => setSelectedStudent(s)}
                onSelectModule={handleSelectModule}
                currentUser={currentUser}
                completedCount={completedActivitiesCount}
              />
            )}

            {currentView === 'student_equipment' && (
              <EquipmentCheck
                module={selectedModule}
                onBack={() => setCurrentView('student_activities')}
                onReadyToStart={handleStartActivitySteps}
              />
            )}

            {currentView === 'student_activity' && (
              <StepActivityPlayer
                module={selectedModule}
                onBack={() => setCurrentView('student_equipment')}
                onComplete={handleActivityComplete}
                onTriggerHelp={handleTriggerHelp}
                scaffoldingLevel={scaffoldingLevel}
              />
            )}

            {currentView === 'student_voice' && (
              <VoiceActivityScreen
                module={selectedModule}
                currentStepNumber={currentVoiceStepNumber}
                onNextStep={() => {
                  const totalSteps = selectedModule.totalSteps || selectedModule.steps?.length || 6;
                  if (currentVoiceStepNumber < totalSteps) {
                    setCurrentVoiceStepNumber(prev => prev + 1);
                  } else {
                    handleActivityComplete();
                  }
                }}
                onRepeatStep={() => {
                  // Replay audio handled inside VoiceActivityScreen
                }}
                onPrevStep={() => {
                  if (currentVoiceStepNumber > 1) {
                    setCurrentVoiceStepNumber(prev => prev - 1);
                  }
                }}
                onStepChange={(stepNum) => setCurrentVoiceStepNumber(stepNum)}
                onTriggerHelp={() => handleTriggerHelp(currentVoiceStepNumber)}
                onCompleteActivity={handleActivityComplete}
                onBack={() => setCurrentView('student_activities')}
                studentName={studentNickname}
                selectedStudent={selectedStudent}
                allModules={BINA_DIRI_MODULES}
                onSelectModule={(mod) => {
                  setSelectedModule(mod);
                  setCurrentVoiceStepNumber(1);
                }}
              />
            )}

            {currentView === 'student_celebration' && (
              <ActivityCelebration
                module={selectedModule}
                onHome={() => setCurrentView('student_home')}
                onRestart={() => setCurrentView('student_equipment')}
                starsEarned={3}
                totalCollectedStars={completedActivitiesCount}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Emergency Help Modal Dialog */}
      {helpStepNumber !== null && (
        <HelpAssistanceModal
          stepNumber={helpStepNumber}
          onClose={() => setHelpStepNumber(null)}
          onContinue={() => setHelpStepNumber(null)}
        />
      )}

      {/* Add Student Modal */}
      {isAddStudentOpen && (
        <AddStudentModal
          onClose={() => setIsAddStudentOpen(false)}
          onAddStudent={handleAddNewStudent}
          currentUser={currentUser}
        />
      )}

      {/* Global Voice Navigation Assistant & Offline Manager Dock */}
      <VoiceNavigationAssistant
        onNavigate={(view) => setCurrentView(view)}
        onRoleChange={handleRoleChange}
        isOnline={isOnline}
        onToggleOfflineMode={handleToggleOfflineMode}
        pendingSyncCount={pendingSyncCount}
      />

    </div>
  );
}
