import {
  ClassLevel,
  BoardType,
  StreamType,
  CurriculumChapter,
  SubjectData,
  LearningStyle
} from '../types';

export interface SubjectMetadata {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
}

// Subject catalog with visual styling
export const SUBJECT_METADATA: Record<string, SubjectMetadata> = {
  Mathematics: {
    id: 'subj-math',
    name: 'Mathematics',
    icon: '📐',
    color: '#4F46E5',
    bgLight: '#EEF2FF',
    description: 'Numbers, algebra, geometry, calculus, statistics and analytical logic.'
  },
  Science: {
    id: 'subj-sci',
    name: 'Science',
    icon: '🔬',
    color: '#059669',
    bgLight: '#ECFDF5',
    description: 'Natural phenomena, matter, energy, chemical transformations and living organisms.'
  },
  English: {
    id: 'subj-eng',
    name: 'English',
    icon: '📖',
    color: '#D97706',
    bgLight: '#FEF3C7',
    description: 'Grammar, reading comprehension, literature analysis and communication.'
  },
  'Social Science': {
    id: 'subj-sst',
    name: 'Social Science',
    icon: '🌍',
    color: '#DC2626',
    bgLight: '#FEF2F2',
    description: 'History, democratic politics, geography, resources and economics.'
  },
  Hindi: {
    id: 'subj-hindi',
    name: 'Hindi',
    icon: '🕉️',
    color: '#EA580C',
    bgLight: '#FFF7ED',
    description: 'Vyakaran, sahitya, kavya and bhasha bodh.'
  },
  'Computer Science': {
    id: 'subj-cs',
    name: 'Computer Science',
    icon: '💻',
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    description: 'Python programming, data structures, database queries and algorithmic problem solving.'
  },
  Physics: {
    id: 'subj-phy',
    name: 'Physics',
    icon: '⚡',
    color: '#2563EB',
    bgLight: '#EFF6FF',
    description: 'Kinematics, mechanics, thermodynamics, electrostatics and modern physics.'
  },
  Chemistry: {
    id: 'subj-chem',
    name: 'Chemistry',
    icon: '🧪',
    color: '#0D9488',
    bgLight: '#F0FDFA',
    description: 'Atomic structure, chemical bonding, organic functional groups and thermodynamics.'
  },
  Biology: {
    id: 'subj-bio',
    name: 'Biology',
    icon: '🌿',
    color: '#16A34A',
    bgLight: '#F0FDF4',
    description: 'Cell biology, human and plant physiology, genetics, biotechnology and ecology.'
  },
  Accountancy: {
    id: 'subj-acc',
    name: 'Accountancy',
    icon: '📊',
    color: '#0284C7',
    bgLight: '#F0F9FF',
    description: 'Double entry ledger, financial accounting, partnership deeds and balance sheets.'
  },
  'Business Studies': {
    id: 'subj-bst',
    name: 'Business Studies',
    icon: '💼',
    color: '#9333EA',
    bgLight: '#FAF5FF',
    description: 'Principles of management, business finance, marketing mix and organizing.'
  },
  Economics: {
    id: 'subj-eco',
    name: 'Economics',
    icon: '📈',
    color: '#CA8A04',
    bgLight: '#FEFCE8',
    description: 'Microeconomics, national income accounting, banking, money and development.'
  },
  History: {
    id: 'subj-hist',
    name: 'History',
    icon: '🏛️',
    color: '#B45309',
    bgLight: '#FFFBEB',
    description: 'Ancient civilization, colonial encounters, world history and nationalist movements.'
  },
  'Political Science': {
    id: 'subj-pol',
    name: 'Political Science',
    icon: '⚖️',
    color: '#475569',
    bgLight: '#F8FAFC',
    description: 'Constitution at work, political theories, international relations and diplomacy.'
  },
  Geography: {
    id: 'subj-geo',
    name: 'Geography',
    icon: '🗺️',
    color: '#047857',
    bgLight: '#ECFDF5',
    description: 'Geomorphology, climate patterns, human settlements and economic resources.'
  },
  // UP Board / Hindi nomenclature mappings
  'Ganit (Mathematics)': {
    id: 'subj-ganit',
    name: 'Ganit (Mathematics)',
    icon: '📐',
    color: '#4F46E5',
    bgLight: '#EEF2FF',
    description: 'Beejganit, Rekhaganit, Nirdeshank Jyamiti aur Trikonmiti.'
  },
  'Vigyan (Science)': {
    id: 'subj-vigyan',
    name: 'Vigyan (Science)',
    icon: '🔬',
    color: '#059669',
    bgLight: '#ECFDF5',
    description: 'Bhaotik, Rasayan aur Jeev Vigyan ke mahatvapurna siddhant.'
  },
  'Samajik Vigyan (Social Science)': {
    id: 'subj-samajik',
    name: 'Samajik Vigyan (Social Science)',
    icon: '🌍',
    color: '#DC2626',
    bgLight: '#FEF2F2',
    description: 'Itihas, Nagarik Shastra, Bhugol aur Arthashastra.'
  }
};

/**
 * Standard Subject Allocations by Class, Board, and Stream
 */
export const CURRICULUM_STRUCTURE: Record<
  ClassLevel,
  Record<BoardType, Record<StreamType, string[]>>
> = {
  'Class 6': {
    CBSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    ICSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    'UP Board': {
      'Not applicable': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Science: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Commerce: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      'Humanities / Arts': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English']
    }
  },
  'Class 7': {
    CBSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    ICSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    'UP Board': {
      'Not applicable': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Science: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Commerce: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      'Humanities / Arts': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English']
    }
  },
  'Class 8': {
    CBSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    ICSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    'UP Board': {
      'Not applicable': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Science: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Commerce: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      'Humanities / Arts': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English']
    }
  },
  'Class 9': {
    CBSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    ICSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    'UP Board': {
      'Not applicable': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Science: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Commerce: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      'Humanities / Arts': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English']
    }
  },
  'Class 10': {
    CBSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    ICSE: {
      'Not applicable': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi', 'Computer Science'],
      Science: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      Commerce: ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi'],
      'Humanities / Arts': ['Mathematics', 'Science', 'English', 'Social Science', 'Hindi']
    },
    'UP Board': {
      'Not applicable': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Science: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      Commerce: ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English'],
      'Humanities / Arts': ['Ganit (Mathematics)', 'Vigyan (Science)', 'Samajik Vigyan (Social Science)', 'Hindi', 'English']
    }
  },
  'Class 11': {
    CBSE: {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Economics', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'English']
    },
    ICSE: {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Economics', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'English']
    },
    'UP Board': {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Hindi', 'English'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Hindi', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Hindi', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'Hindi']
    }
  },
  'Class 12': {
    CBSE: {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Economics', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'English']
    },
    ICSE: {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Economics', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'English']
    },
    'UP Board': {
      Science: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Hindi', 'English'],
      Commerce: ['Accountancy', 'Business Studies', 'Economics', 'Hindi', 'English'],
      'Humanities / Arts': ['History', 'Political Science', 'Geography', 'Hindi', 'English'],
      'Not applicable': ['Physics', 'Chemistry', 'Mathematics', 'Hindi']
    }
  }
};

/**
 * Chapter database for authentic curriculum mapping
 */
export const CURRICULUM_CHAPTERS: CurriculumChapter[] = [
  // ==========================================
  // CLASS 9 CBSE MATHEMATICS
  // ==========================================
  {
    id: 'cbse-9-math-ch1',
    number: 1,
    title: 'Number Systems',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Irrational numbers, real numbers and decimal expansions, laws of exponents for real numbers.',
    topics: [
      {
        id: 'cbse-9-math-t1',
        title: 'Irrational Numbers and Decimal Expansions',
        difficulty: 'Beginner',
        keyPoints: [
          'Irrational numbers cannot be written in the form p/q (q != 0).',
          'Decimal expansion of irrational numbers is non-terminating and non-recurring.',
          'Square roots of non-perfect squares like √2, √3, √5 are irrational.'
        ],
        formulas: ['p/q representation', 'a^(m) * a^(n) = a^(m+n)'],
        summary: 'Understand the distinction between terminating, non-terminating repeating, and non-repeating decimals on the number line.'
      },
      {
        id: 'cbse-9-math-t2',
        title: 'Rationalisation of Denominators',
        difficulty: 'Intermediate',
        keyPoints: [
          'Multiply numerator and denominator by conjugate surd.',
          '(a + √b)(a - √b) = a² - b.'
        ],
        formulas: ['1 / (√a + √b) = (√a - √b) / (a - b)'],
        summary: 'Simplifying surds by clearing radicals from the denominator.'
      }
    ]
  },
  {
    id: 'cbse-9-math-ch2',
    number: 2,
    title: 'Polynomials',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Polynomials in one variable, zeroes of a polynomial, Remainder Theorem, Factor Theorem and algebraic identities.',
    topics: [
      {
        id: 'cbse-9-math-t3',
        title: 'Zeroes of a Polynomial & Remainder Theorem',
        difficulty: 'Beginner',
        keyPoints: [
          'A zero of a polynomial p(x) is a number c such that p(c) = 0.',
          'A non-zero constant polynomial has no zero.',
          'Every real number is a zero of the zero polynomial.'
        ],
        formulas: ['p(x) = g(x) * q(x) + r(x) where deg(r) < deg(g)'],
        summary: 'Finding zeroes of linear, quadratic polynomials and algebraic roots.'
      },
      {
        id: 'cbse-9-math-t4',
        title: 'Factorisation of Polynomials & Identities',
        difficulty: 'Intermediate',
        keyPoints: [
          'Splitting the middle term method for quadratic trinomials.',
          'Factor Theorem: x - a is a factor of p(x) if p(a) = 0.',
          'Cubic polynomial factorisation using synthetic trial and division.'
        ],
        formulas: [
          '(x + y + z)² = x² + y² + z² + 2xy + 2yz + 2zx',
          'x³ + y³ + z³ - 3xyz = (x + y + z)(x² + y² + z² - xy - yz - zx)'
        ],
        summary: 'Master factoring quadratic and cubic expressions through algebraic identities.'
      }
    ]
  },
  {
    id: 'cbse-9-math-ch3',
    number: 3,
    title: 'Coordinate Geometry',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Cartesian plane, coordinates of a point, plotting points in the plane.',
    topics: [
      {
        id: 'cbse-9-math-t5',
        title: 'The Cartesian Coordinate System',
        difficulty: 'Beginner',
        keyPoints: [
          'X-axis is the horizontal abscissa; Y-axis is the vertical ordinate.',
          'Origin (0,0) is where both axes intersect at right angles.',
          'Four quadrants: I (+,+), II (-,+), III (-,-), IV (+,-).'
        ],
        formulas: ['Point notation: P(x, y)'],
        summary: 'Visualizing coordinates and sign conventions across the four quadrants.'
      }
    ]
  },
  {
    id: 'cbse-9-math-ch4',
    number: 4,
    title: 'Linear Equations in Two Variables',
    subject: 'Mathematics',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Linear equations, solution of a linear equation, graph of a linear equation in two variables.',
    topics: [
      {
        id: 'cbse-9-math-t6',
        title: 'Solutions and Graphs of Linear Equations',
        difficulty: 'Intermediate',
        keyPoints: [
          'Standard form: ax + by + c = 0 (a, b not simultaneously zero).',
          'A linear equation in two variables has infinitely many solutions.',
          'The graph of every linear equation in two variables is a straight line.'
        ],
        formulas: ['ax + by + c = 0', 'Slope-intercept: y = mx + c'],
        summary: 'Finding coordinate pairs and plotting straight lines on Cartesian grids.'
      }
    ]
  },

  // ==========================================
  // CLASS 9 CBSE SCIENCE
  // ==========================================
  {
    id: 'cbse-9-sci-ch1',
    number: 1,
    title: 'Matter in Our Surroundings',
    subject: 'Science',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Physical nature of matter, characteristics of particles, states of matter and latent heat.',
    topics: [
      {
        id: 'cbse-9-sci-t1',
        title: 'States of Matter and Kinetic Particle Theory',
        difficulty: 'Beginner',
        keyPoints: [
          'Matter is made up of particles that have spaces and attract each other.',
          'Solid, Liquid, Gas: differ in shape, volume, compressibility and kinetic energy.',
          'Diffusion increases with temperature as kinetic velocity rises.'
        ],
        summary: 'Explaining particle arrangement, intermolecular forces and spacing.'
      },
      {
        id: 'cbse-9-sci-t2',
        title: 'Evaporation and Latent Heat',
        difficulty: 'Intermediate',
        keyPoints: [
          'Latent heat of fusion: heat to convert 1kg solid to liquid at atmospheric pressure.',
          'Latent heat of vaporization: heat to convert 1kg liquid to gas at boiling point.',
          'Evaporation is a surface phenomenon causing cooling.'
        ],
        summary: 'Thermal transitions occurring at constant temperature during state change.'
      }
    ]
  },
  {
    id: 'cbse-9-sci-ch2',
    number: 2,
    title: 'Atoms and Molecules',
    subject: 'Science',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Laws of chemical combination, Dalton atomic theory, atomic mass, molecular mass, mole concept.',
    topics: [
      {
        id: 'cbse-9-sci-t3',
        title: 'Law of Conservation of Mass & Definite Proportions',
        difficulty: 'Beginner',
        keyPoints: [
          'Mass can neither be created nor destroyed in a chemical reaction (Lavoisier).',
          'In a chemical substance elements are always present in definite proportions by mass (Proust).'
        ],
        summary: 'Quantitative foundations of chemical reactions.'
      },
      {
        id: 'cbse-9-sci-t4',
        title: 'Chemical Formulae and Molecular Mass',
        difficulty: 'Intermediate',
        keyPoints: [
          'Criss-cross method using valencies of combining ions.',
          'Polyatomic ions enclosed in brackets when multiplier > 1 (e.g., Ca(OH)₂).'
        ],
        summary: 'Writing systematic chemical formulae and calculating molecular weights.'
      }
    ]
  },
  {
    id: 'cbse-9-sci-ch3',
    number: 3,
    title: 'Motion and Laws of Motion',
    subject: 'Science',
    classLevel: 'Class 9',
    board: 'CBSE',
    description: 'Distance, displacement, velocity, acceleration, Newton laws of motion and momentum.',
    topics: [
      {
        id: 'cbse-9-sci-t5',
        title: 'Equations of Uniformly Accelerated Motion',
        difficulty: 'Intermediate',
        keyPoints: [
          'First equation: v = u + at relates velocity and time.',
          'Second equation: s = ut + 0.5at² relates displacement and time.',
          'Third equation: v² - u² = 2as relates velocity and distance.'
        ],
        formulas: ['v = u + at', 's = ut + (1/2)at²', 'v² - u² = 2as'],
        summary: 'Kinematic derivations using velocity-time graphs and numerical problem solving.'
      },
      {
        id: 'cbse-9-sci-t6',
        title: "Newton's Three Laws of Motion & Momentum",
        difficulty: 'Intermediate',
        keyPoints: [
          '1st Law: Law of Inertia (tendency to resist change in state of motion).',
          '2nd Law: Rate of change of momentum is proportional to applied force: F = ma.',
          '3rd Law: To every action there is an equal and opposite reaction.'
        ],
        formulas: ['p = mv', 'F = Δp / Δt = m(v - u) / t = ma'],
        summary: 'Understanding inertia, momentum conservation, and impulse.'
      }
    ]
  },

  // ==========================================
  // CLASS 11 CBSE SCIENCE: PHYSICS
  // ==========================================
  {
    id: 'cbse-11-phy-ch1',
    number: 1,
    title: 'Units and Measurements',
    subject: 'Physics',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'SI units, dimensional analysis and applications, error analysis and significant figures.',
    topics: [
      {
        id: 'cbse-11-phy-t1',
        title: 'Dimensional Analysis and Homogeneity Principle',
        difficulty: 'Beginner',
        keyPoints: [
          'Dimensions of physical quantities expressed in powers of [M], [L], [T], [A].',
          'Principle of Homogeneity: only terms having identical dimensions can be added or subtracted.',
          'Applications: checking correctness of equations, deducing relations between physical quantities.'
        ],
        formulas: ['[Force] = [M L T⁻²]', '[Energy] = [M L² T⁻²]', '[Pressure] = [M L⁻¹ T⁻²]'],
        summary: 'Validating physical formulae and converting units across CGS and SI.'
      }
    ]
  },
  {
    id: 'cbse-11-phy-ch2',
    number: 2,
    title: 'Kinematics: Motion in a Straight Line & Plane',
    subject: 'Physics',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'Instantaneous velocity and acceleration, calculus formulations, projectile motion and vectors.',
    topics: [
      {
        id: 'cbse-11-phy-t2',
        title: 'Projectile Motion on Horizontal Plane',
        difficulty: 'Intermediate',
        keyPoints: [
          'Horizontal motion is uniform (ax = 0); vertical motion is uniformly accelerated (ay = -g).',
          'Trajectory is parabolic: y = x tanθ - (gx²) / (2u² cos²θ).',
          'Time of flight: T = (2u sinθ) / g. Maximum Height: H = (u² sin²θ) / 2g.',
          'Horizontal Range: R = (u² sin2θ) / g (maximum at θ = 45°).'
        ],
        formulas: [
          'T = (2u sinθ) / g',
          'H_max = (u² sin²θ) / (2g)',
          'R = (u² sin2θ) / g'
        ],
        summary: 'Two-dimensional motion under constant gravitational acceleration.'
      }
    ]
  },
  {
    id: 'cbse-11-phy-ch3',
    number: 3,
    title: 'Laws of Motion and Work-Energy',
    subject: 'Physics',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'Newton laws, friction, banking of roads, work-energy theorem and conservative forces.',
    topics: [
      {
        id: 'cbse-11-phy-t3',
        title: 'Work-Energy Theorem & Conservation of Energy',
        difficulty: 'Advanced',
        keyPoints: [
          'Work done by all forces equals the change in kinetic energy: W_net = ΔK = Kf - Ki.',
          'Work done by conservative force depends only on initial and final points.',
          'Potential energy is defined only for conservative forces: F = -dU/dx.'
        ],
        formulas: ['W = ∫ F · dx', 'W_net = (1/2)m v² - (1/2)m u²', 'E = K + U = constant'],
        summary: 'Analytical problem solving for mechanical energy conservation.'
      }
    ]
  },

  // ==========================================
  // CLASS 11 CBSE SCIENCE: CHEMISTRY
  // ==========================================
  {
    id: 'cbse-11-chem-ch1',
    number: 1,
    title: 'Some Basic Concepts of Chemistry',
    subject: 'Chemistry',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'Mole concept, stoichiometry, limiting reagent, molarity, molality and mole fraction.',
    topics: [
      {
        id: 'cbse-11-chem-t1',
        title: 'Stoichiometry & Limiting Reagent',
        difficulty: 'Intermediate',
        keyPoints: [
          'Mole = 6.022 × 10²³ particles (Avogadro number).',
          'Limiting reagent is the reactant completely consumed first in a balanced reaction.',
          'Amount of product formed is strictly governed by the limiting reagent.'
        ],
        formulas: ['Moles = Mass / Molar Mass', 'Molarity (M) = Moles of solute / Liters of solution'],
        summary: 'Stoichiometric calculations in chemical synthesis.'
      }
    ]
  },
  {
    id: 'cbse-11-chem-ch2',
    number: 2,
    title: 'Structure of Atom & Periodic Classification',
    subject: 'Chemistry',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'Bohr model, de Broglie relation, Heisenberg uncertainty principle, quantum numbers and orbitals.',
    topics: [
      {
        id: 'cbse-11-chem-t2',
        title: 'Quantum Numbers & Electronic Configuration',
        difficulty: 'Advanced',
        keyPoints: [
          'Principal quantum number (n): size and energy level of orbital.',
          'Azimuthal quantum number (l): orbital shape (s=0, p=1, d=2, f=3).',
          'Magnetic quantum number (m_l): spatial orientation of orbital.',
          'Spin quantum number (m_s): electron spin state (+1/2 or -1/2).',
          'Aufbau principle, Pauli exclusion principle, Hund rule of maximum multiplicity.'
        ],
        formulas: ['λ = h / (mv)', 'Δx · Δp ≥ h / (4π)'],
        summary: 'Subshell electron population and periodic trends.'
      }
    ]
  },
  {
    id: 'cbse-11-chem-ch3',
    number: 3,
    title: 'Organic Chemistry: Basic Principles & Functional Groups',
    subject: 'Chemistry',
    classLevel: 'Class 11',
    board: 'CBSE',
    stream: 'Science',
    description: 'IUPAC nomenclature, inductive and resonance effects, carbocation stability and functional groups.',
    topics: [
      {
        id: 'cbse-11-chem-t3',
        title: 'Functional Groups and IUPAC Nomenclature',
        difficulty: 'Intermediate',
        keyPoints: [
          'Functional group determines characteristic chemical reactivity of the organic molecule.',
          'Priority order for IUPAC: -COOH > -SO3H > -COOR > -COCl > -CONH2 > -CN > -CHO > >C=O > -OH > -NH2 > C=C > C≡C.',
          'Isomerism: Structural (chain, position, functional) and Stereoisomerism.'
        ],
        formulas: ['R-OH (Alcohol)', 'R-CHO (Aldehyde)', 'R-CO-R (Ketone)', 'R-COOH (Carboxylic Acid)'],
        summary: 'Systematic nomenclature of monofunctional and polyfunctional organic compounds.'
      }
    ]
  },

  // ==========================================
  // CLASS 12 CBSE COMMERCE: ACCOUNTANCY
  // ==========================================
  {
    id: 'cbse-12-acc-ch1',
    number: 1,
    title: 'Accounting for Partnership Firms — Fundamentals',
    subject: 'Accountancy',
    classLevel: 'Class 12',
    board: 'CBSE',
    stream: 'Commerce',
    description: 'Partnership deed, profit and loss appropriation account, partners capital accounts, interest on drawings.',
    topics: [
      {
        id: 'cbse-12-acc-t1',
        title: 'Profit and Loss Appropriation & Interest on Capital',
        difficulty: 'Intermediate',
        keyPoints: [
          'P&L Appropriation account is an extension of Profit & Loss account.',
          'In absence of Partnership Deed: Equal profit sharing, no interest on capital or drawings, 6% p.a. on partner loans.',
          'Fixed vs Fluctuating Capital Accounts.'
        ],
        formulas: ['Interest on Capital = Capital × Rate/100 × Period', 'Interest on Drawings = Total × Rate/100 × Average Period/12'],
        summary: 'Appropriation of net profits among partners according to deed provisions.'
      }
    ]
  },
  {
    id: 'cbse-12-acc-ch2',
    number: 2,
    title: 'Accounting for Share Capital',
    subject: 'Accountancy',
    classLevel: 'Class 12',
    board: 'CBSE',
    stream: 'Commerce',
    description: 'Issue of shares at par, premium, calls in arrears, calls in advance, forfeiture and reissue of shares.',
    topics: [
      {
        id: 'cbse-12-acc-t2',
        title: 'Forfeiture and Reissue of Shares',
        difficulty: 'Advanced',
        keyPoints: [
          'Share capital account debited with called-up amount on forfeited shares.',
          'Share Forfeiture Account credited with amount already received towards face value.',
          'Profit on reissue transferred to Capital Reserve Account.'
        ],
        summary: 'Pro-rata allotment accounting and capital reserve calculations.'
      }
    ]
  },

  // ==========================================
  // CLASS 12 CBSE COMMERCE: BUSINESS STUDIES
  // ==========================================
  {
    id: 'cbse-12-bst-ch1',
    number: 1,
    title: 'Principles of Management',
    subject: 'Business Studies',
    classLevel: 'Class 12',
    board: 'CBSE',
    stream: 'Commerce',
    description: 'Fayol 14 principles of general management, Taylor scientific management techniques.',
    topics: [
      {
        id: 'cbse-12-bst-t1',
        title: "Henri Fayol's 14 Principles of Management",
        difficulty: 'Beginner',
        keyPoints: [
          'Division of Work: Specialization increases efficiency.',
          'Unity of Command: One subordinate should receive orders from one superior only.',
          'Unity of Direction: One head and one plan for a group of activities having the same objective.',
          'Scalar Chain: Formal line of authority from highest to lowest rank (Gang Plank for emergency).'
        ],
        summary: 'Fundamental guidelines for organizational decision-making and managerial behavior.'
      }
    ]
  },

  // ==========================================
  // CLASS 12 CBSE COMMERCE: ECONOMICS
  // ==========================================
  {
    id: 'cbse-12-eco-ch1',
    number: 1,
    title: 'National Income Accounting',
    subject: 'Economics',
    classLevel: 'Class 12',
    board: 'CBSE',
    stream: 'Commerce',
    description: 'Circular flow of income, GDP, GNP, NNP at market price and factor cost, Value Added, Income and Expenditure methods.',
    topics: [
      {
        id: 'cbse-12-eco-t1',
        title: 'Measurement of National Income (Three Methods)',
        difficulty: 'Advanced',
        keyPoints: [
          'Value Added Method: Gross Value Added (GVA) = Value of Output - Intermediate Consumption.',
          'Income Method: Compensation of Employees + Operating Surplus (Rent + Interest + Profit) + Mixed Income.',
          'Expenditure Method: Private Final Consumption + Govt Final Consumption + Gross Capital Formation + Net Exports (X - M).',
          'NNP_fc is National Income.'
        ],
        formulas: [
          'GVA_mp = Value of Output - Intermediate Consumption',
          'NNP_fc = GDP_mp - Depreciation + NFIA - NIT'
        ],
        summary: 'National macroeconomic measurement and GDP deflator adjustments.'
      }
    ]
  },

  // ==========================================
  // CLASS 8 UP BOARD: GANIT (MATHEMATICS)
  // ==========================================
  {
    id: 'up-8-math-ch1',
    number: 1,
    title: 'Parimey Sankhyayein (Rational Numbers)',
    subject: 'Ganit (Mathematics)',
    classLevel: 'Class 8',
    board: 'UP Board',
    description: 'Parimey sankhyao par sakriyayein, yog, antar, guna aur bhag ke niyam.',
    topics: [
      {
        id: 'up-8-math-t1',
        title: 'Parimey Sankhyao ke Gun-Dharm',
        difficulty: 'Beginner',
        keyPoints: [
          'Parimey sankhya p/q ke roop me hoti hai jahan q ≠ 0.',
          'Samvarak (Closure), Kram-vinimey (Commutative) aur Sahachari (Associative) niyam.',
          'Yogya tat-samak (Additive Identity) 0 hai aur Gunatmak tat-samak 1 hai.'
        ],
        formulas: ['p/q + r/s = (ps + qr) / qs'],
        summary: 'Basic operations and axioms governing rational fractions in Hindi.'
      }
    ]
  },
  {
    id: 'up-8-math-ch2',
    number: 2,
    title: 'Varg aur Vargmool (Squares and Square Roots)',
    subject: 'Ganit (Mathematics)',
    classLevel: 'Class 8',
    board: 'UP Board',
    description: 'Purna varg sankhyayein, gunankhand vidhi aur bhag vidhi se vargmool gyat karna.',
    topics: [
      {
        id: 'up-8-math-t2',
        title: 'Bhag Vidhi se Vargmool (Square Root by Division Method)',
        difficulty: 'Intermediate',
        keyPoints: [
          'Sankhya ke jode (pairs) daye se baye banaye jaate hain.',
          'Badi sankhyao ka vargmool aasani se bhag vidhi dwara gyat hota hai.',
          'Dashamalav sankhyao ka vargmool nikalne ke niyam.'
        ],
        summary: 'Calculating roots of large integers and decimals using long division.'
      }
    ]
  },

  // ==========================================
  // CLASS 8 UP BOARD: VIGYAN (SCIENCE)
  // ==========================================
  {
    id: 'up-8-sci-ch1',
    number: 1,
    title: 'Dainik Jeevan me Vigyan evam Prodyogiki',
    subject: 'Vigyan (Science)',
    classLevel: 'Class 8',
    board: 'UP Board',
    description: 'Sanchar, shiksha, chikitsa aur antariksh kshetra me vigyan ki naveen upalabdhiyaan.',
    topics: [
      {
        id: 'up-8-sci-t1',
        title: 'Naveen Prodyogiki evam Vigyan ke Labh',
        difficulty: 'Beginner',
        keyPoints: [
          'Internet, e-governance aur mobile dwara sanchar me kranti.',
          'Chikitsa me CT scan, MRI aur X-ray dwara rog ki sahi jaanch.',
          'Krishi me unnat beej, tractor aur harvester dwara harit kranti.'
        ],
        summary: 'Application of modern science and technologies in rural and urban development.'
      }
    ]
  }
];

/**
 * Pedagogical Content Generator
 * Generates class-level calibrated content for the 4 learning styles
 */
export function generateCurriculumLesson(
  grade: ClassLevel,
  board: BoardType,
  stream: StreamType,
  subject: string,
  chapterId?: string,
  topicId?: string
) {
  // Find chapter
  let chapter = CURRICULUM_CHAPTERS.find(
    (c) =>
      c.classLevel === grade &&
      c.board === board &&
      (c.subject.toLowerCase() === subject.toLowerCase() ||
        c.subject.toLowerCase().includes(subject.toLowerCase())) &&
      (chapterId ? c.id === chapterId : true)
  );

  // Fallback to any chapter for that subject and grade
  if (!chapter) {
    chapter = CURRICULUM_CHAPTERS.find(
      (c) =>
        c.classLevel === grade &&
        (c.subject.toLowerCase() === subject.toLowerCase() ||
          c.subject.toLowerCase().includes(subject.toLowerCase()))
    );
  }

  // Fallback to any chapter matching subject
  if (!chapter) {
    chapter = CURRICULUM_CHAPTERS.find(
      (c) =>
        c.subject.toLowerCase() === subject.toLowerCase() ||
        c.subject.toLowerCase().includes(subject.toLowerCase())
    );
  }

  // Absolute fallback if subject has no curated entry yet (create realistic shell)
  if (!chapter) {
    chapter = {
      id: `ch-custom-${subject.toLowerCase().replace(/\s+/g, '-')}`,
      number: 1,
      title: `${subject} Core Fundamentals`,
      subject,
      classLevel: grade,
      board,
      stream,
      description: `Structured curriculum topics for ${subject} according to ${board} ${grade} syllabus.`,
      topics: [
        {
          id: `t-custom-1`,
          title: `Introduction to ${subject} Concepts`,
          difficulty: 'Beginner',
          keyPoints: [
            `Core principles of ${subject} as prescribed by ${board}.`,
            `Foundational definitions and standard board terminology.`,
            `Application of concepts to real-world problem sets.`
          ],
          summary: `Primary conceptual building block for ${subject} in ${grade}.`
        }
      ]
    };
  }

  const topic =
    (topicId ? chapter.topics.find((t) => t.id === topicId) : chapter.topics[0]) ||
    chapter.topics[0];

  const isJunior = grade === 'Class 6' || grade === 'Class 7' || grade === 'Class 8';
  const isMiddle = grade === 'Class 9' || grade === 'Class 10';
  const isSenior = grade === 'Class 11' || grade === 'Class 12';

  // Construct calibrated 4 styles
  return {
    subject: chapter.subject,
    classLevel: grade,
    board,
    stream: stream || 'Not applicable',
    chapterId: chapter.id,
    chapterTitle: `Chapter ${chapter.number} • ${chapter.title}`,
    topicId: topic.id,
    topicTitle: topic.title,
    difficulty: topic.difficulty,
    progress: 45,
    styles: {
      Simple: {
        heading: isJunior
          ? `Let's Understand: ${topic.title}`
          : isMiddle
          ? `Concept Breakdown: ${topic.title}`
          : `Theoretical Foundation: ${topic.title}`,
        paragraph: isJunior
          ? `${topic.summary} Think of this as a daily life rule! For example, whenever we count or observe nature, we use these fundamental steps.`
          : isMiddle
          ? `${topic.summary} In ${grade} ${chapter.subject}, this topic forms the backbone for board questions and practical application.`
          : `${topic.summary} In ${grade} ${chapter.subject}, rigorous conceptual clarity is critical for deriving analytical equations and solving board and entrance-level problems.`,
        subtext: `Key takeaway: ${topic.keyPoints[0] || 'Understand the core definition thoroughly before attempting exercises.'}`,
        tip: isJunior
          ? "Friendly Tip: Draw a quick sketch in your notebook to remember the idea easily!"
          : isMiddle
          ? "Exam Tip: Memorize the exact definition and units; board examiners look for key terms!"
          : "Analytical Tip: Always verify dimensional consistency and edge conditions in derivations."
      },
      Analogy: {
        heading: isJunior
          ? `Real-Life Story: The ${topic.title} Connection`
          : `Intuitive Metaphor: Understanding ${topic.title}`,
        paragraph: isJunior
          ? `Imagine sharing a box of chocolates with your best friends or building with toy blocks. That exact same logic applies here!`
          : isMiddle
          ? `Think of this concept like a well-regulated railway system: tracks are the rules, trains are the values, and signals ensure balance.`
          : `Consider a thermodynamic engine or a corporate balance sheet: every debit has an equal credit, and entropy or force dictates equilibrium.`,
        subtext: `When you visualize this metaphor, remembering the formula becomes effortless!`,
        tip: "Mental Model: Anchor the abstract definition to a physical object you interact with daily."
      },
      Visual: {
        heading: `Structured Framework: ${topic.title}`,
        paragraph: `Here is the architectural view of how ${topic.title} connects to the overall ${chapter.subject} syllabus.`,
        subtext: topic.formulas && topic.formulas.length > 0
          ? `Primary Governing Formulas: ${topic.formulas.join('  |  ')}`
          : `Core Pillars: ${topic.keyPoints.slice(0, 2).join(' • ')}`,
        tip: "Visual Cue: Use flowcharts and mind-maps to interconnect related sub-topics."
      },
      'Exam-oriented': {
        heading: `${board} Examination Blueprint: ${topic.title}`,
        paragraph: isSenior
          ? `High-yield topic for ${board} board exams. Typically appears in Section C (3 marks) or Section D (5 marks derivation + numerical).`
          : isMiddle
          ? `Important board topic. Frequently tested in 2-mark conceptual questions and 3-mark analytical problems.`
          : `Key school exam topic. Learn definitions, spellings, and short 1-mark objective questions thoroughly.`,
        subtext: `Guaranteed Mark Booster: Ensure you state all assumptions and draw neatly labelled diagrams.`,
        tip: `${board} Examiner Criteria: Full marks require the standard formula, step-by-step substitution, and boxed final answer with correct units.`
      }
    }
  };
}
