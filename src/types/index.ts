export type AppView = 
  | 'splash'
  | 'auth'
  | 'student_home'
  | 'student_activities'
  | 'student_equipment'
  | 'student_activity'
  | 'student_celebration'
  | 'student_voice'
  | 'teacher_dashboard'
  | 'teacher_student_detail'
  | 'teacher_analytics'
  | 'parent_dashboard'
  | 'handbook'
  | 'hardware_tester'
  | 'settings';

export type UserRole = 'teacher' | 'parent';

export type ScaffoldingLevel = 'panduan_lengkap' | 'petunjuk_ringkas' | 'coba_mandiri';

export type VoiceCommand = 'lanjut' | 'ulangi' | 'bantuan' | 'selesai';

export interface UserSession {
  id: string;
  name: string;
  role: UserRole;
  email?: string;
  roomCode?: string;
  roomId?: number | string;
  studentId?: string;
  avatar?: string;
  school: string;
  nip?: string;
  phone?: string;
  parentRelation?: string;
  address?: string;
  className?: string;
  teacherName?: string;
  childName?: string;
  isNewAccount?: boolean;
  syncedWithTeacher?: boolean;
}

export interface SchoolSettings {
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  schoolName: string;
  autoSyncEnabled: boolean;
  showStudentModeButton: boolean;
}

export interface ActivityStep {
  id: number;
  stepNumber: number;
  instruction: string;
  voiceText: string;
  image: string;
  tip: string;
}

export interface ActivityEquipment {
  id: number;
  name: string;
  description: string;
  soundCue: string;
  soundDescription: string;
  iconType: string;
  image?: string;
}

export interface BinaDiriModule {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  image: string;
  duration: string;
  totalSteps: number;
  equipment: ActivityEquipment[];
  steps: ActivityStep[];
  badgeName: string;
  badgeDesc: string;
  badgeIcon: string;
}

export interface PeriodicGrade {
  period: string; // e.g. 'Pekan 1 Sep', 'Pekan 2 Sep', etc.
  score: number; // 0 - 100
  verbalPromptLevel: number; // 1-5 (5 = Fully independent)
  status: 'Meningkat' | 'Stabil' | 'Perlu Bimbingan';
}

export interface StudentProgress {
  id: string;
  name: string;
  nickname?: string; // Call name e.g. 'Budi', 'Siti', 'Rian'
  roomCode: string; // Used by parents to login (e.g. SLB-BUDI-01)
  avatar: string;
  class: string;
  condition: string;
  parentName: string;
  parentPhone?: string;
  school?: string;
  teacherName?: string;
  currentActivity: string;
  status: 'mandiri' | 'suara' | 'butuh_bantuan';
  progressPercentage: number;
  completedActivities: number;
  totalActivities: number;
  weeklyStars: number;
  maxWeeklyStars: number;
  assistanceTrend: 'menurun' | 'stabil' | 'meningkat';
  modulesProgress: {
    cuciTangan: number;
    menggosokGigi: number;
    makanMandiri: number;
    memakaiPakaian: number;
  };
  latestTeacherNote: {
    author: string;
    role: string;
    timestamp: string;
    text: string;
    synced: boolean;
  };
  latestAudioRecording: {
    command: string;
    duration: string;
    accuracy: number;
  };
  gradeHistory: PeriodicGrade[];
}

export interface HandbookEntry {
  id: string;
  studentId: string;
  roomCode?: string;
  studentName?: string;
  authorName: string;
  authorRole: 'Guru SLB' | 'Orang Tua' | 'Sistem BISA (Otomatis)';
  authorAvatar?: string;
  timestamp: string;
  content: string;
  imageUrl?: string;
  liked: boolean;
  likedBy?: string;
  readStatus: boolean;
  readBy?: string;
}

export interface AssistanceRequest {
  id: string;
  studentName: string;
  activityTitle: string;
  stepNumber: number;
  timestamp: string;
  status: 'pending' | 'resolved';
}

export interface VoiceTestMetric {
  command: VoiceCommand;
  detectedText: string;
  latencyMs: number;
  accuracy: number;
  success: boolean;
  timestamp: string;
}

export interface DailyNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'activity_completed' | 'help_requested' | 'teacher_note' | 'sync_success';
  read: boolean;
  studentName: string;
}

export interface OfflineSyncQueueItem {
  id: string;
  entity: 'activity' | 'student' | 'note' | 'handbook';
  data: any;
  timestamp: string;
  status: 'pending' | 'synced';
}
