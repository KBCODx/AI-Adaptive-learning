import { SubjectData, RecommendationItem, StudyPlanItem, LearningPathNode, ActivityItem } from '../types';

export const INITIAL_SUBJECTS: SubjectData[] = [
  {
    id: 'subj-math',
    name: 'Mathematics',
    progress: 82,
    level: 'Intermediate',
    accuracy: 78,
    completedTopics: 18,
    totalTopics: 24,
    strengths: ['Algebra', 'Trigonometry', 'Coordinate Geometry'],
    weaknesses: ['Geometry', 'Fractions'],
    icon: '📐',
    color: '#4F46E5',
    bgLight: '#EEF2FF',
    description: 'Quadratic equations, circles, trigonometry, triangles & algebra.'
  },
  {
    id: 'subj-sci',
    name: 'Science',
    progress: 62,
    level: 'Intermediate',
    accuracy: 74,
    completedTopics: 14,
    totalTopics: 22,
    strengths: ['Covalent Bonding', 'Life Processes', 'Metals & Non-metals'],
    weaknesses: ['Functional Groups', 'Chemical Reactions'],
    icon: '🔬',
    color: '#059669',
    bgLight: '#ECFDF5',
    description: 'Carbon and its compounds, genetics, electricity & human body.'
  },
  {
    id: 'subj-eng',
    name: 'English',
    progress: 91,
    level: 'Advanced',
    accuracy: 91,
    completedTopics: 21,
    totalTopics: 23,
    strengths: ['Reading Comprehension', 'Tenses', 'Creative Writing'],
    weaknesses: ['Active/Passive Voice', 'Reported Speech'],
    icon: '📖',
    color: '#D97706',
    bgLight: '#FEF3C7',
    description: 'Literature analysis, voice, direct/indirect speech & composition.'
  },
  {
    id: 'subj-cs',
    name: 'Computer Science',
    progress: 68,
    level: 'Intermediate',
    accuracy: 72,
    completedTopics: 12,
    totalTopics: 19,
    strengths: ['Python Loops', 'Conditionals', 'OOP Basics'],
    weaknesses: ['Binary Trees', 'Recursion'],
    icon: '💻',
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    description: 'Data structures, algorithm complexity, recursion & Python.'
  },
  {
    id: 'subj-sst',
    name: 'Social Science',
    progress: 79,
    level: 'Intermediate',
    accuracy: 79,
    completedTopics: 15,
    totalTopics: 20,
    strengths: ['Indian Constitution', 'Federalism', 'Democracy'],
    weaknesses: ['French Revolution Dates', 'Economic Sectors'],
    icon: '🌍',
    color: '#DC2626',
    bgLight: '#FEF2F2',
    description: 'World history, democratic politics, geography & economics.'
  }
];

export const INITIAL_RECOMMENDATIONS: RecommendationItem[] = [
  {
    id: 'rec-1',
    topic: 'Functional Groups Basics',
    subject: 'Science',
    difficulty: 'Intermediate',
    reason: 'Recommended because your recent quiz accuracy in functional groups was 45%.',
    duration: '15 min',
    priority: 'High Priority'
  },
  {
    id: 'rec-2',
    topic: 'Geometry: Triangles & Tangents',
    subject: 'Mathematics',
    difficulty: 'Intermediate',
    reason: 'Identified as a recurring weak area in your diagnostic assessments.',
    duration: '20 min',
    priority: 'High Priority'
  },
  {
    id: 'rec-3',
    topic: 'Chemical Reactions & Equations',
    subject: 'Science',
    difficulty: 'Intermediate',
    reason: 'Strengthen equation balancing before moving on to oxidation-reduction.',
    duration: '10 min',
    priority: 'Practice'
  },
  {
    id: 'rec-4',
    topic: 'Binary Search Tree Traversals',
    subject: 'Computer Science',
    difficulty: 'Intermediate',
    reason: 'Recommended following your recent lesson on non-linear data structures.',
    duration: '15 min',
    priority: 'Practice'
  },
  {
    id: 'rec-5',
    topic: 'Covalent Bonding Mastery',
    subject: 'Science',
    difficulty: 'Intermediate',
    reason: 'You scored 90% in covalent bonding! Quick review to lock in mastery.',
    duration: '5 min',
    priority: 'On Track'
  }
];

export const INITIAL_STUDY_PLAN: StudyPlanItem[] = [
  {
    id: 'plan-1',
    title: 'Functional Groups Deep Dive',
    duration: '15 min',
    type: 'High Priority',
    subject: 'Science',
    completed: false
  },
  {
    id: 'plan-2',
    title: 'Chemical Reactions Practice',
    duration: '10 min',
    type: 'Practice',
    subject: 'Science',
    completed: false
  },
  {
    id: 'plan-3',
    title: 'Revision Quiz (All Topics)',
    duration: '5 min',
    type: 'All Topics',
    subject: 'Science',
    completed: false
  },
  {
    id: 'plan-4',
    title: 'Quick Revision Notes & Formulas',
    duration: '10 min',
    type: 'Summary',
    subject: 'Science',
    completed: false
  }
];

export const INITIAL_LEARNING_PATH: LearningPathNode[] = [
  {
    id: 'path-1',
    stepNumber: 1,
    title: 'Basic Concepts & Formulas',
    subject: 'Mathematics',
    status: 'completed',
    level: 'Beginner',
    description: 'Foundational axioms, number systems, and basic algebraic arithmetic.'
  },
  {
    id: 'path-2',
    stepNumber: 2,
    title: 'Fractions & Rational Numbers',
    subject: 'Mathematics',
    status: 'completed',
    level: 'Beginner',
    description: 'Decimals, percentages, and operations on rational fractions.'
  },
  {
    id: 'path-3',
    stepNumber: 3,
    title: 'Algebra: Quadratic Equations',
    subject: 'Mathematics',
    status: 'current',
    level: 'Intermediate',
    description: 'Factorization, nature of roots, quadratic formulas, and graph parabolas.'
  },
  {
    id: 'path-4',
    stepNumber: 4,
    title: 'Geometry: Triangles & Circles',
    subject: 'Mathematics',
    status: 'revision',
    level: 'Intermediate',
    description: 'Targeted revision node: basic proportionality, tangents, and coordinate geometry.'
  },
  {
    id: 'path-5',
    stepNumber: 5,
    title: 'Advanced Mathematics & Calculus Intro',
    subject: 'Mathematics',
    status: 'locked',
    level: 'Advanced',
    description: 'Unlockable once overall mathematics mastery exceeds 85%.'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'quiz',
    title: 'Quiz completed',
    subtitle: 'Science — Carbon and Its Compounds • Score: 6/10',
    time: '2 hours ago',
    tag: 'Score: 6/10',
    badgeType: 'Practice'
  },
  {
    id: 'act-2',
    type: 'plan',
    title: 'Study plan updated',
    subtitle: 'GuruMitra adapted tomorrow’s study schedule based on your performance',
    time: '3 hours ago',
    tag: 'AI Adapted',
    badgeType: 'High Priority'
  },
  {
    id: 'act-3',
    type: 'lesson',
    title: 'Lesson Completed: Covalent Bonding',
    subtitle: 'Mastered electron dot structures and single/double bonds',
    time: 'Yesterday',
    tag: '100% Mastery',
    badgeType: 'On Track'
  }
];

export const DAILY_MOTIVATIONAL_QUOTES = [
  'Small steps every day lead to big results. 🌱',
  'Consistency is your superpower. Keep building momentum! ✨',
  'Mistakes are just data points for the AI to make you smarter. 💡',
  'Focus on progress, not perfection. You are leveling up every day! 🚀'
];
