export type LearningStyle = 'Simple' | 'Analogy' | 'Visual' | 'Exam-oriented';

export type SubjectType =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Computer Science'
  | 'Social Science'
  | 'Accountancy'
  | 'Business Studies'
  | 'Economics';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type BoardType = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'IGCSE';

export type StreamType = 'Science' | 'Commerce' | 'Humanities';

export type ClassLevel =
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  grade: string;
  level: DifficultyLevel;
  preferredSubjects: SubjectType[];
  preferredStyle: LearningStyle;
  isDemo?: boolean;
  emailVerified?: boolean;
  createdAt: string;
  streak: number;
  totalPoints: number;
  rank: number;
  board?: BoardType;
  stream?: StreamType;
  classLevel?: ClassLevel;
}

export interface SubjectData {
  id: string;
  name: SubjectType;
  progress: number;
  level: DifficultyLevel;
  accuracy: number;
  completedTopics: number;
  totalTopics: number;
  strengths: string[];
  weaknesses: string[];
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  topics: string[];
}

export interface RecommendationItem {
  id: string;
  topic: string;
  subject: SubjectType;
  difficulty: DifficultyLevel;
  reason: string;
  duration: string;
  priority: 'High Priority' | 'Practice' | 'On Track';
  completed?: boolean;
}

export interface StudyPlanItem {
  id: string;
  title: string;
  duration: string;
  type: 'High Priority' | 'Practice' | 'All Topics' | 'Summary';
  subject?: SubjectType;
  completed: boolean;
}

export interface LearningPathNode {
  id: string;
  title: string;
  subject: SubjectType;
  status: 'completed' | 'current' | 'locked' | 'revision';
  level: DifficultyLevel;
  description: string;
  stepNumber: number;
}

export interface ActivityItem {
  id: string;
  type: 'quiz' | 'plan' | 'lesson' | 'adaptation';
  title: string;
  subtitle: string;
  time: string;
  tag?: string;
  badgeType?: 'High Priority' | 'Practice' | 'On Track';
}

export interface QuizQuestion {
  id: string;
  subject: SubjectType;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  chapter?: string;
  board?: BoardType;
  classLevel?: ClassLevel;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  accuracy: number;
  subject: SubjectType;
  topic: string;
  difficulty: DifficultyLevel;
  strongTopics: string[];
  weakTopics: string[];
  adaptationMessage: string;
  newDifficulty: DifficultyLevel;
  recommendedTopic: string;
  userAnswers: { questionIndex: number; selectedIndex: number; isCorrect: boolean }[];
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  subject?: SubjectType;
  styleUsed?: LearningStyle;
  structuredResponse?: {
    directAnswer: string;
    simpleExplanation: string;
    stepByStep?: string[];
    analogy?: string;
    keyConcept: string;
    formulaOrCode?: string;
    visualDiagram?: string;
    practiceQuestion?: {
      question: string;
      options?: string[];
      answer: string;
    };
  };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  grade: string;
  level: DifficultyLevel;
  preferredSubjects: SubjectType[];
  preferredStyle: LearningStyle;
  isDemo?: boolean;
  emailVerified?: boolean;
  createdAt: string;
  syllabusData?: Record<string, {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    storagePath: string;
    publicUrl: string;
    extractedText: string;
    topics: string[]; // Detected topics from PDF
    examFocusedTopics?: Record<string, string[]>; // Chapter -> exam-focused topics (4-5 per chapter)
    analysisComplete: boolean;
  }>
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  grade: string;
  level: DifficultyLevel;
  preferredSubjects: SubjectType[];
}

export interface SyllabusFile {
  subjectName: SubjectType;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}