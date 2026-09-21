import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LearningStyle,
  SubjectType,
  DifficultyLevel,
  SubjectData,
  RecommendationItem,
  StudyPlanItem,
  LearningPathNode,
  ActivityItem,
  QuizResult
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_STUDY_PLAN,
  INITIAL_LEARNING_PATH,
  INITIAL_ACTIVITIES
} from '../data/mockCurriculum';
import { useAuth } from './AuthContext';

export interface StudentProfile {
  name: string;
  grade: string;
  level: DifficultyLevel;
  streak: number;
  overallProgress: number;
  overallAccuracy: number;
  completedLessons: number;
  xp: number;
  preferredStyle: LearningStyle;
}

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
  setActiveTab: (tab: string) => void;
  setActiveSubject: (subject: SubjectType) => void;
  setPreferredStyle: (style: LearningStyle) => void;
  updateProfile: (name: string, grade: string, style: LearningStyle) => void;
  toggleStudyPlanItem: (id: string) => void;
  recordQuizResult: (result: QuizResult) => void;
  setJudgeDemoStep: (step: number) => void;
  resetToDefault: () => void;
  clearNotification: () => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [student, setStudent] = useState<StudentProfile>({
    name: user ? user.name : 'Khushi Dixit',
    grade: user ? user.grade : '10th',
    level: user ? user.level : 'Intermediate',
    streak: 4,
    overallProgress: 76,
    overallAccuracy: 82,
    completedLessons: 24,
    xp: 1420,
    preferredStyle: user ? user.preferredStyle : 'Simple'
  });

  const [subjects, setSubjects] = useState<SubjectData[]>(INITIAL_SUBJECTS);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>(INITIAL_RECOMMENDATIONS);
  const [studyPlan, setStudyPlan] = useState<StudyPlanItem[]>(INITIAL_STUDY_PLAN);
  const [learningPath, setLearningPath] = useState<LearningPathNode[]>(INITIAL_LEARNING_PATH);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeSubject, setActiveSubject] = useState<SubjectType>('Science');
  const [lastQuizResult, setLastQuizResult] = useState<QuizResult | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);
  const [judgeDemoStep, setJudgeDemoStep] = useState<number>(0);

  // Synchronize student profile whenever auth user changes (e.g. login, signup, demo)
  useEffect(() => {
    if (user) {
      setStudent((prev) => ({
        ...prev,
        name: user.name,
        grade: user.grade || '10th',
        level: user.level || 'Intermediate',
        preferredStyle: user.preferredStyle || 'Simple'
      }));

      // If user selected preferred subjects, set active subject to first one if available
      if (user.preferredSubjects && user.preferredSubjects.length > 0) {
        setActiveSubject(user.preferredSubjects[0]);
      }
    }
  }, [user]);

  const clearNotification = () => setNotification(null);

  const setPreferredStyle = (style: LearningStyle) => {
    setStudent((prev) => ({ ...prev, preferredStyle: style }));
    setNotification({
      message: `Preferred learning style updated to "${style}". AI content adapted!`,
      type: 'info'
    });
  };

  const updateProfile = (name: string, grade: string, style: LearningStyle) => {
    setStudent((prev) => ({ ...prev, name, grade, preferredStyle: style }));
    setNotification({
      message: 'Student profile updated successfully!',
      type: 'success'
    });
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

  const resetToDefault = () => {
    setStudent({
      name: user ? user.name : 'Khushi Dixit',
      grade: user ? user.grade : '10th',
      level: user ? user.level : 'Intermediate',
      streak: 4,
      overallProgress: 76,
      overallAccuracy: 82,
      completedLessons: 24,
      xp: 1420,
      preferredStyle: user ? user.preferredStyle : 'Simple'
    });
    setSubjects(INITIAL_SUBJECTS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setStudyPlan(INITIAL_STUDY_PLAN);
    setLearningPath(INITIAL_LEARNING_PATH);
    setActivities(INITIAL_ACTIVITIES);
    setLastQuizResult(null);
    setJudgeDemoStep(0);
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
        setActiveTab,
        setActiveSubject,
        setPreferredStyle,
        updateProfile,
        toggleStudyPlanItem,
        recordQuizResult,
        setJudgeDemoStep,
        resetToDefault,
        clearNotification
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
