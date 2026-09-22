export type LearningStyle = 'Simple' | 'Analogy' | 'Visual' | 'Exam-oriented';

export type ClassLevel =
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export type BoardType = 'CBSE' | 'ICSE' | 'UP Board';

export type StreamType = 'Science' | 'Commerce' | 'Humanities / Arts' | 'Not applicable';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SubjectType =
  | 'Mathematics'
  | 'Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Computer Science'
  | 'Social Science'
  | 'Accountancy'
  | 'Business Studies'
  | 'Economics'
  | 'Hindi'
  | 'History'
  | 'Political Science'
  | 'Geography'
  | string;

export interface CurriculumTopic {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  keyPoints: string[];
  formulas?: string[];
  summary: string;
}

export interface CurriculumChapter {
  id: string;
  number: number;
  title: string;
  subject: string;
  classLevel: ClassLevel;
  board: BoardType;
  stream?: StreamType;
  description: string;
  topics: CurriculumTopic[];
}

export interface PedagogicalStyleContent {
  heading: string;
  paragraph: string;
  subtext: string;
  tip: string;
  bulletPoints?: string[];
  exampleBox?: string;
  analogyDetails?: {
    analogyTitle: string;
    analogyStory: string;
    conceptMapping: { realWorld: string; concept: string }[];
  };
  visualDiagram?: string;
  comparisonTable?: {
    headers: string[];
    rows: string[][];
  };
  visualSteps?: string[];
  examBreakdown?: {
    definition: string;
    keyPoints: string[];
    formulas: string[];
    importantFacts?: string[];
    commonMistakes: string[];
    examTips: string[];
    practiceQuestions: { question: string; marks: string; solution: string }[];
  };
}

export interface CurriculumLessonContent {
  subject: string;
  classLevel: ClassLevel;
  board: BoardType;
  stream: StreamType;
  chapterId: string;
  chapterTitle: string;
  topicId: string;
  topicTitle: string;
  difficulty: DifficultyLevel;
  progress: number;
  styles: Record<LearningStyle, PedagogicalStyleContent>;
}

export interface CurrentLearningContext {
  classLevel: ClassLevel;
  board: BoardType;
  stream: StreamType;
  subject: SubjectType;
  chapter: string;
  chapterId?: string;
  topic: string;
  topicId?: string;
  learningStyle: LearningStyle;
  difficulty: DifficultyLevel;
}

export interface StudentAcademicProfile {
  grade: ClassLevel;
  board: BoardType;
  stream: StreamType;
  preferredStyle: LearningStyle;
  level: DifficultyLevel;
}

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
  created_at?: string;
  streak: number;
  totalPoints?: number;
  rank?: number;
  overallProgress?: number;
  overallAccuracy?: number;
  completedLessons?: number;
  xp?: number;
  board?: BoardType;
  stream?: StreamType;
  classLevel?: ClassLevel;
  syllabusUploaded?: boolean;
  syllabusData?: Record<string, any>;
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
  topics?: string[];
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

export interface ParsedMaterial {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileSizeFormatted: string;
  extractedText: string;
  summaryPreview: string;
  wordCount: number;
  topics: {
    title: string;
    concepts: string;
  }[];
  uploadedAt: string;
}

export interface TutorMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  timestamp: string;
  subject?: SubjectType;
  styleUsed?: LearningStyle;
  attachedFile?: any;
  structuredResponse?: {
    responseType?: 'conceptual' | 'mathematical' | 'programming' | 'document' | 'general' | string;
    crossSubjectNotice?: any;
    directAnswer: string;
    simpleExplanation: string;
    example?: string;
    stepByStep?: string[];
    analogy?: string;
    keyConcept: string;
    formulaOrCode?: string;
    codeExplanation?: string;
    complexity?: {
      time: string;
      space: string;
    };
    visualDiagram?: string;
    relevantContentFound?: any;
    documentReference?: any;
    followUpQuestions?: string[];
    practiceQuestion?: {
      question: string;
      options?: string[];
      answer: string;
    };
  };
}

export interface UserProfile {
  id: string;
  full_name: string;
  learning_level: DifficultyLevel;
  preferred_subjects: SubjectType[];
  grade?: ClassLevel | string;
  board?: BoardType;
  stream?: StreamType;
  created_at?: string;
  updated_at?: string;
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
  created_at?: string;
  board?: BoardType;
  stream?: StreamType;
  classLevel?: ClassLevel;
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
  }>;
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
  grade?: ClassLevel | string;
  board?: BoardType;
  stream?: StreamType;
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