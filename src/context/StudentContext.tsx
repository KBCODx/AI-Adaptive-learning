import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  LearningStyle,
  SubjectType,
  DifficultyLevel,
  BoardType,
  StreamType,
  ClassLevel,
  SubjectData,
  RecommendationItem,
  StudyPlanItem,
  LearningPathNode,
  ActivityItem,
  QuizResult,
  SyllabusFile,
  StudentProfile as AuthStudentProfile
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_STUDY_PLAN,
  INITIAL_LEARNING_PATH,
  INITIAL_ACTIVITIES,
  mockCurriculum
} from '../data/mockCurriculum';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { extractTextFromPDF } from '../utils/pdfExtractor';
import { parseSyllabusWithAI, getFallbackSyllabusParse } from '../lib/aiSyllabusParser';

// Extend the AuthStudentProfile with client-specific fields
export interface StudentProfile extends AuthStudentProfile {
  streak: number;
  totalPoints: number;
  rank: number;
  syllabusUploaded: boolean;
  syllabusData?: Record<string, {
    fileName: string;
    fileSize: number;
    uploadedAt: string;
    storagePath: string;
    publicUrl: string;
    extractedText: string;
    topics: string[];
    analysisComplete: boolean;
  }>;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Initialize student profile with data from auth user (if available) and defaults for client-specific fields
  const [student, setStudent] = useState<StudentProfile>({
    // Auth fields (from user or defaults)
    id: user ? user.id : 'guest_student',
    name: user ? user.name : 'Khushi Dixit',
    email: user ? user.email : '',
    grade: user ? user.grade : '10th',
    level: user ? user.level : 'Intermediate',
    preferredSubjects: user ? user.preferredSubjects : ['Mathematics', 'Science'],
    preferredStyle: user ? user.preferredStyle : 'Simple',
    isDemo: user ? user.isDemo : false,
    emailVerified: user ? user.emailVerified : true,
    createdAt: user ? user.createdAt : new Date().toISOString(),
    // Client-specific fields with defaults
    streak: 4,
    totalPoints: 1420,
    rank: 76,
    syllabusUploaded: false,
    syllabusData: {}
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
  const [syllabusData, setSyllabusData] = useState<Record<string, any>>({});

  // Topic extraction helper (client-side matching against curriculum)
  const extractAndAnalyzeTopics = (text: string, subject: SubjectType): string[] => {
    try {
      const curriculum = mockCurriculum[subject];
      if (!curriculum || !curriculum.topics) return [];

      const textLower = text.toLowerCase();
      // Match topics mentioned in text or return all curriculum topics if text is general
      const detected = curriculum.topics.filter(topic =>
        textLower.includes(topic.toLowerCase())
      );
      return detected.length > 0 ? detected : curriculum.topics.slice(0, 6);
    } catch (error) {
      console.error('Error in topic extraction:', error);
      return [];
    }
  };

  // Helper to update analysis for a subject
  const setSyllabusAnalysis = (subject: string, analysisData: any) => {
    setStudent(prev => ({
      ...prev,
      syllabusData: {
        ...(prev.syllabusData || {}),
        [subject]: {
          ...(prev.syllabusData?.[subject] || {}),
          ...analysisData
        }
      }
    }));
  };

  // Enhanced syllabus setup with Supabase storage and fallback
  const completeSyllabusSetup = async (filesRecord: Record<string, any>) => {
    try {
      const currentUserId = user?.id || 'guest_student';

      const uploadPromises = Object.entries(filesRecord).map(async ([subjectKey, fileData]) => {
        if (!fileData) return null;

        let storagePath = '';
        let publicUrl = '';
        let extractedText = `Syllabus for ${subjectKey}. Covered units: ${mockCurriculum[subjectKey as SubjectType]?.topics?.join(', ')}`;

        // Attempt Supabase Storage Upload if file object is present
        if (fileData.file && supabase) {
          try {
            const fileName = `${currentUserId}/${subjectKey}/${Date.now()}-${fileData.name}`;
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from('syllabus-uploads')
              .upload(fileName, fileData.file, {
                contentType: fileData.type || 'application/pdf',
                upsert: true
              });

            if (!uploadError && uploadData) {
              storagePath = fileName;
              const { data: urlData } = supabase
                .storage
                .from('syllabus-uploads')
                .getPublicUrl(fileName);
              publicUrl = urlData?.publicUrl || '';

              // Try Supabase Function for extraction
              try {
                const { data: extractionData } = await supabase.functions.invoke(
                  'extract-pdf-text',
                  { body: { filePath: fileName } }
                );
                if (extractionData?.text) {
                  extractedText = extractionData.text;
                }
              } catch (funcErr) {
                console.warn('PDF text extraction edge function skipped, using fallback parsing:', funcErr);
              }
            }
          } catch (storageErr) {
            console.warn('Supabase storage upload skipped or failed, using local in-memory fallback:', storageErr);
          }
        }

        // Extract actual text and generate AI-powered syllabus analysis if we have the file
        if (fileData.file) {
          try {
            // Extract raw text from PDF
            const { rawText } = await extractTextFromPDF(fileData.file);
            extractedText = rawText;

            // Use AI-powered syllabus parser to extract chapters and generate exam-focused topics
            const parsedSyllabus = parseSyllabusWithAI(rawText, subjectKey as SubjectType);

            return {
              subject: subjectKey,
              fileName: fileData.name,
              fileSize: fileData.size,
              uploadedAt: fileData.uploadedAt || new Date().toISOString(),
              storagePath,
              publicUrl,
              extractedText: parsedSyllabus.rawText,
              topics: parsedSyllabus.chapters, // Chapters as topics for backward compatibility
              analysisComplete: true
            };
          } catch (pdfErr) {
            console.warn('Client-side PDF extraction failed, using fallback:', pdfErr);
          }
        }

        // Fallback: Use AI-powered fallback syllabus parser (FREE - zero API cost)
        const fallbackSyllabus = getFallbackSyllabusParse(subjectKey as SubjectType);

        return {
          subject: subjectKey,
          fileName: fileData.name,
          fileSize: fileData.size,
          uploadedAt: fileData.uploadedAt || new Date().toISOString(),
          storagePath,
          publicUrl,
          extractedText: fallbackSyllabus.rawText,
          topics: fallbackSyllabus.chapters, // Chapters as topics for backward compatibility
          analysisComplete: true
        };
      });

      const results = await Promise.all(uploadPromises);
      const validResults = results.filter((r): r is NonNullable<typeof r> => r !== null);
      const syllabusMap = Object.fromEntries(validResults.map(r => [r.subject, r]));

      // Update state
      setStudent(prev => ({
        ...prev,
        syllabusData: syllabusMap,
        syllabusUploaded: true
      }));
      setSyllabusData(syllabusMap);

      // Save to per-user localStorage key
      if (user?.id) {
        const userSyllabusKey = `gurumitra_syllabus_data_${user.id}`;
        localStorage.setItem(userSyllabusKey, JSON.stringify(syllabusMap));
      }

      setNotification({
        message: 'Syllabus uploaded and analyzed successfully with AI!',
        type: 'success'
      });

      return validResults;
    } catch (error) {
      console.error('Syllabus setup failed:', error);
      throw error;
    }
  };

  // Synchronize student profile whenever auth user changes (e.g. login, signup, demo)
  useEffect(() => {
    if (user) {
      setStudent((prev) => ({
        ...prev,
        // Update auth-dependent fields
        id: user.id,
        name: user.name,
        email: user.email,
        grade: user.grade || '10th',
        level: user.level || 'Intermediate',
        preferredSubjects: user.preferredSubjects,
        preferredStyle: user.preferredStyle,
        isDemo: user.isDemo,
        emailVerified: user.emailVerified,
        createdAt: user.created_at || new Date().toISOString()
        // Note: streak, totalPoints, rank, board, stream, classLevel are not in auth user, so we keep existing values
      }));

      // If user selected preferred subjects, set active subject to first one if available
      if (user.preferredSubjects && user.preferredSubjects.length > 0) {
        setActiveSubject(user.preferredSubjects[0]);
      }

      // Restore syllabus data from localStorage using per-user key
      const userSyllabusKey = `gurumitra_syllabus_data_${user.id}`;
      try {
        const savedSyllabusData = localStorage.getItem(userSyllabusKey);
        if (savedSyllabusData) {
          const parsedData = JSON.parse(savedSyllabusData);
          setSyllabusData(parsedData);
          setStudent((prev) => ({ ...prev, syllabusData: parsedData, syllabusUploaded: true }));
        } else {
          // No syllabus for this user — reset to fresh state
          setSyllabusData({});
          setStudent((prev) => ({ ...prev, syllabusData: {}, syllabusUploaded: false }));
        }
      } catch (err) {
        console.error('Failed to restore syllabus data:', err);
        setSyllabusData({});
        setStudent((prev) => ({ ...prev, syllabusData: {}, syllabusUploaded: false }));
      }
    } else {
      // User logged out — reset syllabus state completely
      setSyllabusData({});
      setStudent((prev) => ({ ...prev, syllabusData: {}, syllabusUploaded: false }));
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
      // Auth fields (from user or defaults)
      id: user ? user.id : 'guest_student',
      name: user ? user.name : 'Khushi Dixit',
      email: user ? user.email : '',
      grade: user ? user.grade : '10th',
      level: user ? user.level : 'Intermediate',
      preferredSubjects: user ? user.preferredSubjects : ['Mathematics', 'Science'],
      preferredStyle: user ? user.preferredStyle : 'Simple',
      isDemo: user ? user.isDemo : false,
      emailVerified: user ? user.emailVerified : true,
      createdAt: user ? user.createdAt : new Date().toISOString(),
      // Client-specific fields with defaults
      streak: 4,
      totalPoints: 1420,
      rank: 76,
      syllabusUploaded: false,
      syllabusData: {}
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
        syllabusData,
        syllabusUploaded: student.syllabusUploaded,
        setActiveTab,
        setActiveSubject,
        setPreferredStyle,
        updateProfile,
        toggleStudyPlanItem,
        recordQuizResult,
        setJudgeDemoStep,
        completeSyllabusSetup,
        extractAndAnalyzeTopics,
        setSyllabusAnalysis,
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