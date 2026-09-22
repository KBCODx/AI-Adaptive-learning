import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LearningStyle,
  SubjectType,
  DifficultyLevel,
  ClassLevel,
  BoardType,
  StreamType,
  StudentProfile,
  SubjectData,
  RecommendationItem,
  StudyPlanItem,
  LearningPathNode,
  ActivityItem,
  QuizResult,
  ParsedMaterial,
  CurrentLearningContext
} from '../types';
import {
  INITIAL_STUDY_PLAN,
  INITIAL_ACTIVITIES
} from '../data/mockCurriculum';
import {
  getAvailableSubjects,
  getRecommendations,
  getLearningPath,
  getChapters,
  normalizeGrade
} from '../services/curriculumService';
import { useAuth } from './AuthContext';
import { processUploadedFile } from '../services/fileProcessingService';

const STORAGE_KEY = 'gurumitra_academic_profile';

interface StudentContextType {
  student: StudentProfile;
  subjects: SubjectData[];
  recommendations: RecommendationItem[];
  studyPlan: StudyPlanItem[];
  learningPath: LearningPathNode[];
  activities: ActivityItem[];
  activeTab: string;
  activeSubject: SubjectType;
  lastQuizResult: QuizResult | null;
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  judgeDemoStep: number;
  uploadedMaterial: ParsedMaterial | null;
  uploadState: 'idle' | 'uploading' | 'analyzing' | 'ready' | 'error';
  uploadError: string | null;
  currentLearningContext: CurrentLearningContext;
  setCurrentLearningContext: React.Dispatch<React.SetStateAction<CurrentLearningContext>>;
  setTopicContext: (
    subject: SubjectType,
    chapter: string,
    topic: string,
    chapterId?: string,
    topicId?: string,
    difficulty?: DifficultyLevel
  ) => void;
  startQuizForCurrentTopic: (override?: Partial<CurrentLearningContext>) => void;
  setActiveTab: (tab: string) => void;
  setActiveSubject: (subject: SubjectType) => void;
  setPreferredStyle: (style: LearningStyle) => void;
  setAcademicProfile: (
    grade: ClassLevel,
    board: BoardType,
    stream: StreamType,
    style?: LearningStyle,
    level?: DifficultyLevel
  ) => void;
  updateProfile: (
    name: string,
    grade: ClassLevel | string,
    style: LearningStyle,
    board?: BoardType,
    stream?: StreamType
  ) => void;
  toggleStudyPlanItem: (id: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  setJudgeDemoStep: (step: number) => void;
  resetToDefault: () => void;
  clearNotification: () => void;
  processAndSetFile: (file: File) => Promise<ParsedMaterial>;
  removeUploadedMaterial: () => void;
  clearUploadError: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Helper to load persistent academic profile
function loadInitialAcademicProfile(): {
  grade: ClassLevel;
  board: BoardType;
  stream: StreamType;
  preferredStyle: LearningStyle;
  level: DifficultyLevel;
} {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        grade: normalizeGrade(parsed.grade),
        board: (parsed.board as BoardType) || 'CBSE',
        stream: (parsed.stream as StreamType) || 'Not applicable',
        preferredStyle: (parsed.preferredStyle as LearningStyle) || 'Simple',
        level: (parsed.level as DifficultyLevel) || 'Beginner'
      };
    }
  } catch (e) {
    // Ignore localStorage read errors
  }
  return {
    grade: 'Class 9',
    board: 'CBSE',
    stream: 'Not applicable',
    preferredStyle: 'Simple',
    level: 'Beginner'
  };
}

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const initialAcademic = loadInitialAcademicProfile();

  const [student, setStudent] = useState<StudentProfile>({
    name: user?.name || 'Khushi Dixit',
    grade: initialAcademic.grade,
    board: initialAcademic.board,
    stream: initialAcademic.stream,
    level: user?.level || initialAcademic.level,
    streak: 4,
    overallProgress: 76,
    overallAccuracy: 82,
    completedLessons: 24,
    xp: 1420,
    preferredStyle: user?.preferredStyle || initialAcademic.preferredStyle
  });

  // Dynamically initialize subjects based on academic profile
  const [subjects, setSubjects] = useState<SubjectData[]>(() =>
    getAvailableSubjects(student.grade, student.board, student.stream)
  );

  const [activeSubject, setActiveSubjectState] = useState<SubjectType>(() => {
    const initialSubs = getAvailableSubjects(student.grade, student.board, student.stream);
    return initialSubs[0]?.name || 'Mathematics';
  });

  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(() =>
    getRecommendations(student.grade, student.board, student.stream, activeSubject)
  );
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(INITIAL_STUDY_PLAN);
  const [learningPath, setLearningPath] = useState<LearningPathNode[]>(() =>
    getLearningPath(student.grade, student.board, student.stream, activeSubject)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0);
  const [uploadedMaterial, setUploadedMaterial] = useState<ParsedMaterial | null>(null);
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'analyzing' | 'ready' | 'error'>('idle');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Centralized single source of truth for active lesson & quiz context
  const [currentLearningContext, setCurrentLearningContext] = useState<CurrentLearningContext>(() => {
    const normGrade = initialAcademic.grade;
    const initBoard = initialAcademic.board;
    const initStream = initialAcademic.stream;
    const initSubject = 'Mathematics';
    const chs = getChapters(normGrade, initBoard, initStream, initSubject);
    const ch = chs[0] || {
      id: 'cbse-9-math-ch1',
      title: 'Number Systems',
      topics: [{ id: 'cbse-9-math-t1', title: 'Irrational Numbers and Decimal Expansions' }]
    };
    const top = ch.topics[0] || {
      id: 'cbse-9-math-t1',
      title: 'Irrational Numbers and Decimal Expansions'
    };
    return {
      classLevel: normGrade,
      board: initBoard,
      stream: initStream,
      subject: initSubject,
      chapter: ch.title,
      chapterId: ch.id,
      topic: top.title,
      topicId: top.id,
      learningStyle: initialAcademic.preferredStyle,
      difficulty: initialAcademic.level
    };
  });

  // Synchronize student profile whenever auth user changes
  useEffect(() => {
    if (user) {
      const userGrade = normalizeGrade(user.grade);
      setStudent((prev) => ({
        ...prev,
        name: user.name,
        grade: userGrade,
        level: user.level || prev.level,
        preferredStyle: user.preferredStyle || prev.preferredStyle
      }));
      setCurrentLearningContext((prev) => ({
        ...prev,
        classLevel: userGrade,
        learningStyle: user.preferredStyle || prev.learningStyle,
        difficulty: user.level || prev.difficulty
      }));
    }
  }, [user]);

  // Set active subject and automatically sync subject-specific recommendations, learning path, and context
  const setActiveSubject = (subject: SubjectType) => {
    setActiveSubjectState(subject);
    const updatedRecs = getRecommendations(student.grade, student.board, student.stream, subject);
    setRecommendations(updatedRecs);
    const updatedPath = getLearningPath(student.grade, student.board, student.stream, subject);
    setLearningPath(updatedPath);

    // Keep active learning context in sync with the new subject's first chapter & topic
    const chs = getChapters(student.grade, student.board, student.stream, subject);
    const firstCh = chs[0];
    const firstTop = firstCh?.topics[0];
    if (firstCh && firstTop) {
      setCurrentLearningContext((prev) => ({
        ...prev,
        subject,
        chapter: firstCh.title,
        chapterId: firstCh.id,
        topic: firstTop.title,
        topicId: firstTop.id
      }));
    } else {
      setCurrentLearningContext((prev) => ({
        ...prev,
        subject
      }));
    }
  };

  // Explicit helper to switch topic context cleanly from anywhere in the app
  const setTopicContext = (
    subject: SubjectType,
    chapter: string,
    topic: string,
    chapterId?: string,
    topicId?: string,
    difficulty?: DifficultyLevel
  ) => {
    setActiveSubjectState(subject);
    setCurrentLearningContext((prev) => ({
      ...prev,
      subject,
      chapter,
      topic,
      chapterId: chapterId || prev.chapterId,
      topicId: topicId || prev.topicId,
      difficulty: difficulty || prev.difficulty
    }));
  };

  // Helper to transition to quiz view seamlessly for the active topic
  const startQuizForCurrentTopic = (override?: Partial<CurrentLearningContext>) => {
    if (override) {
      setCurrentLearningContext((prev) => ({ ...prev, ...override }));
      if (override.subject) {
        setActiveSubjectState(override.subject);
      }
    }
    setActiveTab('quiz');
  };

  // Comprehensive Academic Profile Switcher
  const setAcademicProfile = (
    grade: ClassLevel,
    board: BoardType,
    stream: StreamType,
    style?: LearningStyle,
    level?: DifficultyLevel
  ) => {
    const normGrade = normalizeGrade(grade);
    const isSenior = normGrade === 'Class 11' || normGrade === 'Class 12';
    const effectiveStream: StreamType = isSenior
      ? (stream === 'Not applicable' ? 'Science' : stream)
      : 'Not applicable';

    const newSubjects = getAvailableSubjects(normGrade, board, effectiveStream);
    setSubjects(newSubjects);

    // If current subject is not in new subject list, switch to first available
    let nextSubject = activeSubject;
    const exists = newSubjects.some((s) => s.name.toLowerCase() === activeSubject.toLowerCase());
    if (!exists && newSubjects.length > 0) {
      nextSubject = newSubjects[0].name;
      setActiveSubjectState(nextSubject);
    }

    const newPreferredStyle = style || student.preferredStyle;
    const newLevel = level || student.level;

    setStudent((prev) => ({
      ...prev,
      grade: normGrade,
      board,
      stream: effectiveStream,
      preferredStyle: newPreferredStyle,
      level: newLevel
    }));

    // Update recommendations and path for the new curriculum
    setRecommendations(getRecommendations(normGrade, board, effectiveStream, nextSubject));
    setLearningPath(getLearningPath(normGrade, board, effectiveStream, nextSubject));

    // Update learning context for the new curriculum
    const newChs = getChapters(normGrade, board, effectiveStream, nextSubject);
    const firstCh = newChs[0];
    const firstTop = firstCh?.topics[0];
    setCurrentLearningContext({
      classLevel: normGrade,
      board,
      stream: effectiveStream,
      subject: nextSubject,
      chapter: firstCh ? firstCh.title : 'Chapter 1',
      chapterId: firstCh?.id,
      topic: firstTop ? firstTop.title : 'Topic 1',
      topicId: firstTop?.id,
      learningStyle: newPreferredStyle,
      difficulty: newLevel
    });

    // Persist to localStorage
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          grade: normGrade,
          board,
          stream: effectiveStream,
          preferredStyle: newPreferredStyle,
          level: newLevel
        })
      );
    } catch (e) {
      // Ignore localStorage write errors
    }

    setNotification({
      message: `Curriculum calibrated to ${normGrade} • ${board}${effectiveStream !== 'Not applicable' ? ' • ' + effectiveStream : ''}. Subject list updated!`,
      type: 'success'
    });
  };

  const clearNotification = () => setNotification(null);

  const setPreferredStyle = (style: LearningStyle) => {
    setStudent((prev) => {
      const updated = { ...prev, preferredStyle: style };
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            grade: updated.grade,
            board: updated.board,
            stream: updated.stream,
            preferredStyle: style,
            level: updated.level
          })
        );
      } catch (e) {}
      return updated;
    });

    // Keep active learning context in sync with the style change
    setCurrentLearningContext((prev) => ({
      ...prev,
      learningStyle: style
    }));

    setNotification({
      message: `Preferred learning style updated to "${style}". AI content adapted!`,
      type: 'info'
    });
  };

  const updateProfile = (
    name: string,
    grade: ClassLevel | string,
    style: LearningStyle,
    board?: BoardType,
    stream?: StreamType
  ) => {
    const normGrade = normalizeGrade(grade);
    const targetBoard = board || student.board;
    const targetStream = stream || student.stream;

    setAcademicProfile(normGrade, targetBoard, targetStream, style);
    setStudent((prev) => ({ ...prev, name }));
  };

  const toggleStudyPlanItem = (id: string) => {
    setStudyPlan((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // CORE USP: DYNAMIC ADAPTATION ENGINE
  const recordQuizResult = (result: QuizResult) => {
    setLastQuizResult(result);

    const { accuracy, score, totalQuestions, subject, topic } = result;

    let newLevel: DifficultyLevel = student.level;
    let adaptationMsg = '';
    let notificationType: 'success' | 'info' | 'warning' = 'info';

    if (accuracy > 80) {
      newLevel = 'Advanced';
      adaptationMsg = 'Great performance! Difficulty increased to Advanced. Unlocked advanced challenges!';
      notificationType = 'success';
    } else if (accuracy >= 60) {
      newLevel = 'Intermediate';
      adaptationMsg = "You're progressing steadily. Continue at Intermediate level.";
      notificationType = 'info';
    } else {
      newLevel = 'Beginner';
      adaptationMsg = "Let's strengthen the basics before moving ahead. Difficulty adjusted to Beginner (Revision).";
      notificationType = 'warning';
    }

    // 1. Update Student Profile
    const xpGained = accuracy >= 80 ? 150 : accuracy >= 60 ? 80 : 40;
    setStudent((prev) => {
      const newAcc = Math.round((prev.overallAccuracy * 4 + accuracy) / 5);
      const newProg = Math.min(100, prev.overallProgress + 2);
      return {
        ...prev,
        level: newLevel,
        overallAccuracy: newAcc,
        overallProgress: newProg,
        xp: prev.xp + xpGained,
        completedLessons: prev.completedLessons + 1
      };
    });

    // 2. Update Subject Matrix
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.name === subject) {
          const updatedStrengths = [...sub.strengths];
          const updatedWeaknesses = [...sub.weaknesses];

          if (accuracy >= 80) {
            if (!updatedStrengths.includes(topic)) updatedStrengths.push(topic);
            const idx = updatedWeaknesses.indexOf(topic);
            if (idx > -1) updatedWeaknesses.splice(idx, 1);
          } else if (accuracy < 60) {
            if (!updatedWeaknesses.includes(topic)) updatedWeaknesses.push(topic);
            const idx = updatedStrengths.indexOf(topic);
            if (idx > -1) updatedStrengths.splice(idx, 1);
          }

          return {
            ...sub,
            accuracy: Math.round((sub.accuracy + accuracy) / 2),
            level: newLevel,
            completedTopics: Math.min(sub.totalTopics, sub.completedTopics + 1),
            strengths: updatedStrengths,
            weaknesses: updatedWeaknesses
          };
        }
        return sub;
      })
    );

    // 3. Update Recommendations Queue Dynamically
    if (accuracy < 60) {
      const remedialRec: RecommendationItem = {
        id: `rec-${Date.now()}`,
        topic: `${topic} Basics`,
        subject: subject,
        difficulty: 'Beginner',
        reason: `Recommended because your recent accuracy in ${topic} was ${accuracy}%.`,
        duration: '15 min',
        priority: 'High Priority'
      };
      setRecommendations((prev) => [remedialRec, ...prev.slice(0, 4)]);

      // Add high priority study plan item
      const newPlanItem: StudyPlanItem = {
        id: `plan-${Date.now()}`,
        title: `Revise ${topic} Basics`,
        duration: '15 min',
        type: 'High Priority',
        subject: subject,
        completed: false
      };
      setStudyPlan((prev) => [newPlanItem, ...prev.slice(0, 3)]);

      // Update Learning Path to insert remedial revision
      setLearningPath((prev) =>
        prev.map((node) => {
          if (node.title.toLowerCase().includes(topic.toLowerCase()) || node.id === 'path-4') {
            return {
              ...node,
              status: 'revision',
              description: `AI flagged this node for remedial reinforcement (${accuracy}% accuracy).`
            };
          }
          return node;
        })
      );
    } else if (accuracy >= 80) {
      const advancedRec: RecommendationItem = {
        id: `rec-${Date.now()}`,
        topic: `Advanced ${topic} & Applications`,
        subject: subject,
        difficulty: 'Advanced',
        reason: `High mastery demonstrated (${accuracy}%). Advancing to deep-dive applications!`,
        duration: '20 min',
        priority: 'On Track'
      };
      setRecommendations((prev) => [advancedRec, ...prev.slice(0, 4)]);

      // Unlock next node in Learning Path
      setLearningPath((prev) =>
        prev.map((node, index) => {
          if (node.status === 'locked' && index <= 4) {
            return { ...node, status: 'current', description: 'Unlocked based on high performance!' };
          }
          return node;
        })
      );
    }

    // 4. Add Activity Log
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'quiz',
      title: `Quiz completed: ${topic}`,
      subtitle: `${subject} • Score: ${score}/${totalQuestions} (${accuracy}%)`,
      time: 'Just now',
      tag: `Accuracy: ${accuracy}%`,
      badgeType: accuracy >= 80 ? 'On Track' : accuracy >= 60 ? 'Practice' : 'High Priority'
    };

    const adaptationActivity: ActivityItem = {
      id: `act-adapt-${Date.now()}`,
      type: 'adaptation',
      title: 'AI Engine Adapted Curriculum',
      subtitle: adaptationMsg,
      time: 'Just now',
      tag: newLevel,
      badgeType: accuracy >= 80 ? 'On Track' : accuracy >= 60 ? 'Practice' : 'High Priority'
    };

    setActivities((prev) => [newActivity, adaptationActivity, ...prev.slice(0, 4)]);

    // 5. Trigger System Notification
    setNotification({
      message: `Quiz Submitted: ${score}/${totalQuestions} (${accuracy}%). ${adaptationMsg}`,
      type: notificationType
    });
  };

  const clearUploadError = () => setUploadError(null);

  const removeUploadedMaterial = () => {
    setUploadedMaterial(null);
    setUploadState('idle');
    setUploadError(null);
    setNotification({
      message: 'Uploaded material removed from AI Tutor session.',
      type: 'info'
    });
  };

  const processAndSetFile = async (file: File): Promise<ParsedMaterial> => {
    setUploadState('uploading');
    setUploadError(null);

    try {
      // Step 1: Uploading state
      await new Promise((resolve) => setTimeout(resolve, 400));
      setUploadState('analyzing');

      // Step 2: Genuine text parsing & topic extraction
      const parsed = await processUploadedFile(file);

      // Brief animation pause for genuine analytical feedback
      await new Promise((resolve) => setTimeout(resolve, 600));

      setUploadedMaterial(parsed);
      setUploadState('ready');

      setNotification({
        message: `Successfully analyzed "${file.name}" (${parsed.wordCount} words, ${parsed.topics.length} topics found). Connected to AI Tutor!`,
        type: 'success'
      });

      return parsed;
    } catch (err: any) {
      setUploadState('error');
      const msg = err?.message || 'Couldn\'t read this file. Please try another supported file.';
      setUploadError(msg);
      setNotification({
        message: msg,
        type: 'warning'
      });
      throw err;
    }
  };

  const resetToDefault = () => {
    setStudent({
      name: user?.name || 'Khushi Dixit',
      grade: 'Class 9',
      board: 'CBSE',
      stream: 'Not applicable',
      level: 'Beginner',
      streak: 4,
      overallProgress: 76,
      overallAccuracy: 82,
      completedLessons: 24,
      xp: 1420,
      preferredStyle: 'Simple'
    });
    const defSubs = getAvailableSubjects('Class 9', 'CBSE', 'Not applicable');
    setSubjects(defSubs);
    setActiveSubjectState(defSubs[0]?.name || 'Mathematics');
    setRecommendations(getRecommendations('Class 9', 'CBSE', 'Not applicable', defSubs[0]?.name || 'Mathematics'));
    setStudyPlan(INITIAL_STUDY_PLAN);
    setLearningPath(getLearningPath('Class 9', 'CBSE', 'Not applicable', defSubs[0]?.name || 'Mathematics'));
    setActivities(INITIAL_ACTIVITIES);
    setLastQuizResult(null);
    setJudgeDemoStep(0);
    setUploadedMaterial(null);
    setUploadState('idle');
    setUploadError(null);
    setCurrentLearningContext({
      classLevel: 'Class 9',
      board: 'CBSE',
      stream: 'Not applicable',
      subject: 'Mathematics',
      chapter: 'Number Systems',
      chapterId: 'cbse-9-math-ch1',
      topic: 'Irrational Numbers and Decimal Expansions',
      topicId: 'cbse-9-math-t1',
      learningStyle: 'Simple',
      difficulty: 'Beginner'
    });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setNotification({
      message: 'Demo state reset to initial baseline successfully!',
      type: 'info'
    });
  };

  return (
    <StudentContext.Provider
      value={{
        student,
        subjects,
        recommendations,
        studyPlan,
        learningPath,
        activities,
        activeTab,
        activeSubject,
        lastQuizResult,
        notification,
        judgeDemoStep,
        uploadedMaterial,
        uploadState,
        uploadError,
        currentLearningContext,
        setCurrentLearningContext,
        setTopicContext,
        startQuizForCurrentTopic,
        setActiveTab,
        setActiveSubject,
        setPreferredStyle,
        setAcademicProfile,
        updateProfile,
        toggleStudyPlanItem,
        recordQuizResult,
        setJudgeDemoStep,
        resetToDefault,
        clearNotification,
        processAndSetFile,
        removeUploadedMaterial,
        clearUploadError
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};
