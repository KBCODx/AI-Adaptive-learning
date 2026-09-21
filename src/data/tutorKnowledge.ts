import { SubjectType, LearningStyle, TutorMessage } from '../types';

interface PresetResponse {
  keywords: string[];
  subject: SubjectType;
  responses: Record<LearningStyle, NonNullable<TutorMessage['structuredResponse']>>;
}

export const PRESET_RESPONSES: PresetResponse[] = [
  // MATHEMATICS: Quadratic Equations
  {
    keywords: ['quadratic', 'equation', 'roots', 'parabola', 'ax2'],
    subject: 'Mathematics',
    responses: {
      Simple: {
        directAnswer: 'A quadratic equation is any mathematical equation of the form ax² + bx + c = 0, where "x" is an unknown variable and "a" cannot be 0.',
        simpleExplanation: 'The highest power of the variable is 2 (squared). When graphed, it always creates a symmetrical curved U-shape called a parabola.',
        stepByStep: [
          'Step 1: Write the equation in standard form: ax² + bx + c = 0',
          'Step 2: Identify the coefficients: a, b, and c',
          'Step 3: Solve by factoring, completing the square, or using the Quadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
          'Step 4: Check for two roots, one root, or complex roots using discriminant D = b² - 4ac'
        ],
        analogy: 'Imagine throwing a basketball into a hoop. The curved path the ball travels through the air up and down traces an exact quadratic curve (parabola)!',
        keyConcept: 'Degree of the equation is 2, meaning it can have at most two solutions (roots).',
        formulaOrCode: 'Standard Form: ax² + bx + c = 0\nQuadratic Formula: x = (-b ± √(b² - 4ac)) / (2a)',
        visualDiagram: '    y\n    │       ╭─╮  (Vertex: maximum height)\n    │      ╭╯ ╰╮\n    │     ╭╯   ╰╮\n    │────x₁─────x₂───► x  (x₁ and x₂ are the roots)\n    │',
        practiceQuestion: {
          question: 'Solve for x: x² - 5x + 6 = 0',
          options: ['x = 2 or x = 3', 'x = -2 or x = -3', 'x = 1 or x = 6', 'x = 5 or x = 6'],
          answer: 'x = 2 or x = 3. (Because (x - 2)(x - 3) = 0)'
        }
      },
      Analogy: {
        directAnswer: 'A quadratic equation is like a roller coaster trajectory: it climbs to a peak, turns around, and plunges back down.',
        simpleExplanation: 'Whenever something accelerates or falls under gravity, its height depends on time squared (t²). That is why ballistics and roller coasters rely on quadratic equations.',
        stepByStep: [
          '1. The Launch (t=0): Starting point on the ground.',
          '2. The Ascent: Speed slows as gravity pulls it down.',
          '3. The Vertex: Peak point where it momentarily stops rising.',
          '4. The Descent & Splashdown: Lands at the roots (solutions).'
        ],
        analogy: 'Think of an arch bridge over a river. The water level represents y=0. The two points where the bridge anchors into the river banks are the roots (solutions).',
        keyConcept: 'Symmetry is king: the left side of the curve mirrors the right side around the axis of symmetry x = -b / (2a).',
        formulaOrCode: 'Vertex coordinates: (-b / 2a , c - b² / 4a)',
        practiceQuestion: {
          question: 'If a ball is thrown with height h = -5t² + 20t, at what time does it hit the ground?',
          answer: 'At t = 4 seconds. (-5t(t - 4) = 0, so t = 0 or t = 4)'
        }
      },
      Visual: {
        directAnswer: 'Graphically, a quadratic equation represents a parabola oriented vertically.',
        simpleExplanation: 'If coefficient "a" is positive (a > 0), the parabola opens upward like a smile (minimum point). If "a" is negative (a < 0), it opens downward like a frown (maximum point).',
        stepByStep: [
          'Find y-intercept: Set x = 0 → (0, c)',
          'Find Axis of Symmetry: x = -b / (2a)',
          'Find Vertex: Plug axis of symmetry back into equation',
          'Find x-intercepts: Solve ax² + bx + c = 0'
        ],
        keyConcept: 'Discriminant D = b² - 4ac determines how the curve touches the x-axis: D > 0 (2 crossings), D = 0 (touches once), D < 0 (floats, no real crossings).',
        formulaOrCode: 'D = b² - 4ac\n• D > 0: Two distinct real roots\n• D = 0: One repeated real root\n• D < 0: No real roots',
        visualDiagram: '       D > 0              D = 0              D < 0\n    \\        /          \\        /             \\     /\n─────\\──────/─────  ─────\\──────/─────   ───────\\───/──────\n      \\____/              \\____/ (touch)         ─── (float)',
        practiceQuestion: {
          question: 'What is the discriminant of 2x² + 4x + 2 = 0?',
          answer: 'D = 4² - 4(2)(2) = 16 - 16 = 0 (One real repeated root)'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Quadratic Equation: ax² + bx + c = 0 (a ≠ 0). Standard 10th Board scoring topic with 3-4 guaranteed marks.',
        simpleExplanation: 'Key exam focus: Factorization method, Nature of roots using Discriminant (D = b² - 4ac), and Word problems based on speed/distance or area.',
        stepByStep: [
          'Mark Rule 1: Always rewrite given equation into standard ax² + bx + c = 0 before identifying a, b, c.',
          'Mark Rule 2: If finding nature of roots, calculate D first. Write condition explicitly.',
          'Mark Rule 3: For word problems, define let "x" be the unknown quantity with appropriate units.',
          'Mark Rule 4: Reject negative roots if variable represents speed, time, or dimensions.'
        ],
        keyConcept: 'Sum of roots: α + β = -b/a. Product of roots: α · β = c/a.',
        formulaOrCode: '1. x = (-b ± √(b² - 4ac)) / (2a)\n2. α + β = -b/a\n3. αβ = c/a\n4. D = b² - 4ac',
        practiceQuestion: {
          question: 'If one root of quadratic equation 2x² + kx - 6 = 0 is 2, find the value of k.',
          answer: 'k = -1. Substitute x = 2: 2(2)² + k(2) - 6 = 0 => 8 + 2k - 6 = 0 => 2k = -2 => k = -1.'
        }
      }
    }
  },

  // SCIENCE: Photosynthesis
  {
    keywords: ['photosynthesis', 'plant', 'chlorophyll', 'light', 'carbon dioxide', 'glucose', 'oxygen'],
    subject: 'Science',
    responses: {
      Simple: {
        directAnswer: 'Photosynthesis is the chemical process by which green plants and other organisms use sunlight, water, and carbon dioxide to produce glucose (food) and oxygen.',
        simpleExplanation: 'Chlorophyll inside plant cells catches sunlight like solar panels. The plant drinks water through roots and takes in CO₂ from air through tiny pores called stomata.',
        stepByStep: [
          'Step 1: Sunlight is absorbed by chlorophyll in chloroplasts.',
          'Step 2: Water (H₂O) is split into Hydrogen and Oxygen using solar energy (Light Reaction).',
          'Step 3: Oxygen is released into the air as a byproduct.',
          'Step 4: Carbon Dioxide (CO₂) is converted into Glucose (food) for the plant (Dark Reaction).'
        ],
        analogy: 'Think of a plant like a solar-powered kitchen! Sunlight is the stove power, CO₂ and water are raw ingredients, glucose is the baked bread, and oxygen is the fresh aroma released.',
        keyConcept: 'Conversion of solar energy into chemical energy stored in glucose bonds.',
        formulaOrCode: '6CO₂ + 6H₂O + Sunlight ──► C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)',
        visualDiagram: '        ☀️ Sunlight\n             │\n   CO₂ ──► [ 🌱 Green Leaf: Chloroplasts ] ──► O₂ (Air)\n             │\n   H₂O ──► [ Split H₂O ──► Glucose C₆H₁₂O₆ ] ──► Stored Starch',
        practiceQuestion: {
          question: 'Which gas is released into the atmosphere as a byproduct of photosynthesis?',
          options: ['Oxygen (O₂)', 'Carbon Dioxide (CO₂)', 'Nitrogen (N₂)', 'Methane (CH₄)'],
          answer: 'Oxygen (O₂), which comes directly from the splitting of water molecules!'
        }
      },
      Analogy: {
        directAnswer: 'Photosynthesis is Earth’s ultimate solar bakery that keeps all living creatures fed and breathing.',
        simpleExplanation: 'Without plants catching photons from 93 million miles away, animal life on land would have neither food calories nor breathable oxygen.',
        stepByStep: [
          '1. Solar Harvester: Chlorophyll acts as biological solar cells.',
          '2. Water Splitting: Breaking H-O-H bonds releases free oxygen.',
          '3. Carbon Fixing: Invisible air carbon is stitched into solid sugar.'
        ],
        analogy: 'Imagine charging a battery pack (ATP & NADPH) during the sunny day, then using that battery at night to run a 3D food printer that prints sugar crystals.',
        keyConcept: 'Autotrophs (self-feeders) form the primary base of every terrestrial food chain.',
        formulaOrCode: 'Light Reactions (Thylakoids) + Calvin Cycle (Stroma) = Life on Earth',
        practiceQuestion: {
          question: 'Where do light-dependent reactions take place inside chloroplasts?',
          answer: 'In the thylakoid membranes where chlorophyll pigments are embedded.'
        }
      },
      Visual: {
        directAnswer: 'Occurs inside specialized organelles called Chloroplasts located primarily in leaf mesophyll cells.',
        simpleExplanation: 'Two distinct phases: Light-dependent reactions in Thylakoids produce ATP and NADPH. The Calvin Cycle in the Stroma uses them to synthesize Glucose.',
        stepByStep: [
          'Photolysis: 2H₂O ──► 4H⁺ + 4e⁻ + O₂ ↑',
          'Electron Transport Chain creates proton gradient across thylakoid membrane.',
          'ATP Synthase generates ATP; NADP⁺ reduces to NADPH.',
          'Calvin Cycle fixes 3 CO₂ molecules using Rubisco enzyme.'
        ],
        keyConcept: 'The oxygen released during photosynthesis comes entirely from water (H₂O), not from carbon dioxide (CO₂). Verified by Ruben & Kamen radioactive isotope tracer experiments.',
        formulaOrCode: 'Light Energy ──► Chemical Energy (ATP + NADPH) ──► Carbohydrates (Starch)',
        visualDiagram: '┌────────────────── Chloroplast ──────────────────┐\n│  Thylakoids:          Stroma:                   │\n│  Sunlight + H₂O ──► [ Light Reactions ]         │\n│                         │ (ATP, NADPH)          │\n│                         ▼                       │\n│  CO₂ ─────────────► [ Calvin Cycle ] ──► Sugar  │\n│                         │ (ADP, NADP⁺)          │\n│  O₂ (Released) ◄────────┘                       │\n└─────────────────────────────────────────────────┘',
        practiceQuestion: {
          question: 'Which enzyme is responsible for initial carbon fixation in C3 plants?',
          answer: 'RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase).'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Photosynthesis definition, equation, and balanced representation are high-frequency Class 10 Board exam questions (3-5 marks).',
        simpleExplanation: 'Common Board questions: 1) Write balanced chemical equation. 2) List events occurring during photosynthesis. 3) Explain starch test on variegated leaves.',
        stepByStep: [
          'Point 1: Absorption of light energy by chlorophyll.',
          'Point 2: Conversion of light energy to chemical energy and splitting of water molecules into hydrogen and oxygen.',
          'Point 3: Reduction of carbon dioxide to carbohydrates.',
          'Note: These steps need not take place one immediately after the other (e.g., desert plants take up CO₂ at night).'
        ],
        keyConcept: 'Desert plant adaptation (CAM pathway): Stomata open at night to absorb CO₂ and prepare an intermediate acid, acted upon by energy during the day.',
        formulaOrCode: 'Equation for Board Exam:\n6CO₂ + 12H₂O ──(Sunlight / Chlorophyll)──► C₆H₁₂O₆ + 6O₂ + 6H₂O',
        practiceQuestion: {
          question: 'Why do desert plants take in carbon dioxide at night?',
          answer: 'To prevent water loss (transpiration) during the intense heat of the daytime.'
        }
      }
    }
  },

  // SCIENCE: Functional Groups (Directly from User Screenshot!)
  {
    keywords: ['functional', 'groups', 'alcohol', 'carbon', 'carboxylic', 'aldehyde', 'ketone'],
    subject: 'Science',
    responses: {
      Simple: {
        directAnswer: 'Functional groups are specific groups of atoms within organic molecules that determine the chemical properties and reactivity of those compounds, regardless of carbon chain length.',
        simpleExplanation: 'In an organic compound, the carbon backbone provides structure, but the functional group gives it its chemical "personality" (e.g., whether it acts as an alcohol, acid, or fuel).',
        stepByStep: [
          'Step 1: Alcohol (-OH) gives alcohol properties (e.g., Ethanol C₂H₅OH).',
          'Step 2: Carboxylic Acid (-COOH) imparts acidic properties (e.g., Ethanoic acid CH₃COOH).',
          'Step 3: Aldehyde (-CHO) has a carbonyl group with at least one hydrogen.',
          'Step 4: Ketone (>C=O) has a carbonyl group bonded between two carbon atoms.'
        ],
        analogy: 'Think of functional groups as "special badges" or uniforms in a team! No matter who wears the firefighter badge, they gain firefighter capabilities!',
        keyConcept: 'Homologous series members share identical functional groups, so their chemical properties remain virtually identical while physical properties vary with mass.',
        formulaOrCode: 'Common Groups:\n• Alcohol: -OH\n• Aldehyde: -CHO\n• Ketone: -CO-\n• Carboxylic Acid: -COOH\n• Halogen: -Cl, -Br',
        visualDiagram: '   Hydrocarbon Chain          Functional Group            Molecule\n     [ CH₃─CH₂─ ]      +           [ ─OH ]         =   CH₃CH₂OH (Ethanol)\n       (Backbone)               (Chemical Engine)         (Active Alcohol)',
        practiceQuestion: {
          question: 'Which of the following is the functional group in alcohols?',
          options: ['A. -COOH', 'B. -OH', 'C. -NH2', 'D. -CH3'],
          answer: 'B. -OH (Hydroxyl group)'
        }
      },
      Analogy: {
        directAnswer: 'A functional group is like an interchangeable attachment on a power tool.',
        simpleExplanation: 'The motor and handle remain the same (the carbon chain), but swapping the drill bit for a sander completely changes what the tool can do.',
        stepByStep: [
          '1. Attach -OH: Molecule behaves like rubbing alcohol or beverage alcohol.',
          '2. Attach -COOH: Molecule behaves like sour vinegar (acetic acid).',
          '3. Attach -CHO: Molecule gains pungent smells like vanilla or formaldehyde.'
        ],
        analogy: 'Think of Twitter handles: the username is the carbon chain, but adding a "Verified Blue Badge" (-OH) gives it special privileges!',
        keyConcept: 'Reactivity happens almost exclusively at the functional group site because of electronegativity differences.',
        formulaOrCode: 'R-OH (Alcohol), R-CHO (Aldehyde), R-CO-R (Ketone), R-COOH (Carboxylic Acid)',
        practiceQuestion: {
          question: 'Vinegar gets its sour taste and smell from which functional group?',
          answer: 'Carboxylic acid group (-COOH) in Acetic acid (Ethanoic acid).'
        }
      },
      Visual: {
        directAnswer: 'Structural formula breakdown of Class 10 organic functional groups.',
        simpleExplanation: 'Oxygen and nitrogen atoms introduce polar bonds into nonpolar hydrocarbon backbones, creating localized reactive sites.',
        stepByStep: [
          'Hydroxyl (-OH): Single bond O bonded to H.',
          'Carbonyl (C=O): Double bond between Carbon and Oxygen.',
          'Carboxyl (-COOH): Combination of Carbonyl (C=O) and Hydroxyl (-OH) on same carbon.'
        ],
        keyConcept: 'Geometry: Carbonyl carbon is sp² hybridized (planar 120°), whereas alcohol oxygen is sp³ hybridized with two lone pairs (bent ~104.5°).',
        formulaOrCode: '  Alcohol:       Aldehyde:        Ketone:         Carboxylic Acid:\n    H                H               O                   O\n    │                │               ║                   ║\n ─C─O─H           ─C─C═O          ─C─C─C─             ─C─C─O─H\n    │                │               │                   │',
        practiceQuestion: {
          question: 'How many bonds does the carbon atom in a carbonyl group (>C=O) form with oxygen?',
          answer: 'Two covalent bonds (one sigma σ and one pi π bond, forming a double bond).'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Functional Groups: Direct Board Exam topic with IUPAC naming and test reactions (4 marks).',
        simpleExplanation: 'Must memorize suffix and prefixes: -ol for Alcohol, -al for Aldehyde, -one for Ketone, -oic acid for Carboxylic Acid.',
        stepByStep: [
          '1. Identify the longest carbon chain containing the functional group.',
          '2. Number the chain from the end closest to the functional group (gives lowest locant).',
          '3. Replace the terminal "-e" of alkane with the characteristic suffix.',
          '4. Test for Carboxylic Acid: Add sodium bicarbonate (NaHCO₃) → brisk effervescence of CO₂ gas.'
        ],
        keyConcept: 'Litmus Test: Carboxylic acids turn blue litmus red. Alcohols are neutral to litmus test.',
        formulaOrCode: '2CH₃COOH + 2Na ──► 2CH₃COONa + H₂ ↑\nCH₃COOH + NaHCO₃ ──► CH₃COONa + H₂O + CO₂ ↑',
        practiceQuestion: {
          question: 'What is the IUPAC name of CH₃-CH₂-CHO?',
          answer: 'Propanal (3 carbons = propane, aldehyde suffix = -al).'
        }
      }
    }
  },

  // COMPUTER SCIENCE: Binary Tree
  {
    keywords: ['binary', 'tree', 'node', 'leaf', 'root', 'traversal', 'bst'],
    subject: 'Computer Science',
    responses: {
      Simple: {
        directAnswer: 'A binary tree is a non-linear, hierarchical data structure where each node has at most two children, typically referred to as the "left child" and the "right child".',
        simpleExplanation: 'It begins with a single starting node called the "Root". Nodes with no children are called "Leaves". It allows computers to store sorted data and search through it dramatically faster than flat lists.',
        stepByStep: [
          'Step 1: The topmost node is called the Root.',
          'Step 2: Each node stores data and up to two pointers/references (Left and Right).',
          'Step 3: A Binary Search Tree (BST) adds a special rule: all left descendants are smaller than the node, and all right descendants are larger!',
          'Step 4: This allows finding any item in O(log n) time instead of O(n).'
        ],
        analogy: 'Think of an upside-down family tree: grandparents at the top (root), branching down into parents and children (leaves). Each person has at most 2 direct successors.',
        keyConcept: 'Hierarchical branching: Doubling the tree depth doubles the total data capacity, yet searching only requires checking one node per level!',
        formulaOrCode: 'class TreeNode {\n  int val;\n  TreeNode left;\n  TreeNode right;\n  TreeNode(int val) { this.val = val; }\n}',
        visualDiagram: '               [ 10 ]  ◄── Root\n              /      \\\n          [ 5 ]      [ 15 ]\n          /   \\        /   \\\n       [ 2 ]  [ 7 ]  [ 12 ] [ 20 ] ◄── Leaf Nodes',
        practiceQuestion: {
          question: 'What is the maximum number of nodes at level "i" of a binary tree (root is level 0)?',
          options: ['2^i', '2^(i+1)', '2i', 'i^2'],
          answer: '2^i. (At level 0: 2⁰=1 node; level 1: 2¹=2 nodes; level 2: 2²=4 nodes)'
        }
      },
      Analogy: {
        directAnswer: 'A binary tree is like playing the "20 Questions" guessing game.',
        simpleExplanation: 'Instead of guessing every number from 1 to 100 one by one (linear search), you ask "Is it greater than 50?" You immediately eliminate half the possibilities in one step!',
        stepByStep: [
          '1. Root Question: Is number > 50? (Go Right if yes, Left if no)',
          '2. Child Question: Is number > 75? (Halves remaining possibilities again)',
          '3. Within 7 questions, you can pinpoint any number out of 100 accurately!'
        ],
        analogy: 'Imagine an organized corporate hierarchy: CEO (Root) has 2 VPs, each VP oversees 2 Directors, and so on.',
        keyConcept: 'Logarithmic growth: A balanced binary tree with only 30 levels can store over 1 BILLION elements (2³⁰ ≈ 1.07 billion)!',
        formulaOrCode: 'Time Complexity for Balanced BST: Search = O(log n), Insert = O(log n)',
        practiceQuestion: {
          question: 'In which traversal of a Binary Search Tree are elements visited in ascending sorted order?',
          answer: 'In-order Traversal (Left ──► Root ──► Right).'
        }
      },
      Visual: {
        directAnswer: 'Memory layout and pointer architecture of Binary Trees.',
        simpleExplanation: 'Each node in memory holds 3 blocks: [ Left Pointer | Stored Data | Right Pointer ]. Null/None represents absence of a child.',
        stepByStep: [
          'Pre-order traversal: Visit Node → Left subtree → Right subtree (N-L-R)',
          'In-order traversal: Visit Left subtree → Node → Right subtree (L-N-R)',
          'Post-order traversal: Visit Left subtree → Right subtree → Node (L-R-N)',
          'Level-order (BFS): Queue-based breadth traversal level by level'
        ],
        keyConcept: 'Degenerate Tree (Skewed Tree): If elements are inserted already sorted without rebalancing, the tree degrades into a linked list with O(n) performance. AVL and Red-Black trees self-balance to prevent this.',
        formulaOrCode: '// In-order traversal recursive:\nvoid inOrder(Node root) {\n  if (root == null) return;\n  inOrder(root.left);\n  System.out.print(root.val + " ");\n  inOrder(root.right);\n}',
        visualDiagram: '       Normal Balanced:              Skewed (Linked List like):\n            (4)                                (1)\n           /   \\                                 \\\n         (2)   (6)                               (2)\n        /  \\   /  \\                                \\\n       (1) (3)(5) (7)                              (3) (O(n) search!)',
        practiceQuestion: {
          question: 'What is the height of a balanced binary tree with N nodes?',
          answer: 'O(log₂ N).'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Binary Tree is a fundamental computer science exam topic with heavy weightage in Data Structures & Algorithms.',
        simpleExplanation: 'Examiners commonly test: Maximum nodes formulas, Traversal sequence reconstruction, and BST insertion/deletion edge cases.',
        stepByStep: [
          'Rule 1: Maximum nodes in binary tree of height h: 2^(h+1) - 1',
          'Rule 2: Minimum nodes in binary tree of height h: h + 1',
          'Rule 3: Given Pre-order and In-order, you can uniquely construct the original binary tree!',
          'Rule 4: In a full binary tree with L leaves, number of internal nodes is L - 1.'
        ],
        keyConcept: 'Relation between leaves and degree-2 nodes: In any binary tree, number of leaf nodes n₀ = n₂ + 1 (where n₂ is number of nodes with 2 children).',
        formulaOrCode: 'Total Nodes N = 2^(h+1) - 1\nHeight h = ⌊log₂(N)⌋\nLeaves = Internal Nodes + 1',
        practiceQuestion: {
          question: 'A complete binary tree has 15 nodes. What is its height (root at height 0)?',
          answer: 'Height is 3. (Level 0: 1, Level 1: 2, Level 2: 4, Level 3: 8 => 1+2+4+8 = 15).'
        }
      }
    }
  },

  // ENGLISH: Active and Passive Voice
  {
    keywords: ['active', 'passive', 'voice', 'subject', 'object', 'verb', 'grammar'],
    subject: 'English',
    responses: {
      Simple: {
        directAnswer: 'In Active Voice, the subject of the sentence DOES the action. In Passive Voice, the subject RECEIVES the action.',
        simpleExplanation: 'Active voice is direct, vigorous, and clear. Passive voice shifts emphasis to the action or the object being acted upon.',
        stepByStep: [
          'Step 1: Identify the Subject (doer), Verb (action), and Object (receiver) in the active sentence.',
          'Step 2: Move the Object to the front so it becomes the new subject.',
          'Step 3: Add an appropriate form of the auxiliary verb "to be" (is, am, are, was, were, been, being).',
          'Step 4: Change the main verb into its Past Participle (V3 form).',
          'Step 5: Place the original subject at the end, usually preceded by "by".'
        ],
        analogy: 'Imagine a soccer game! Active: "The striker kicked the ball." (Focus is on the player). Passive: "The ball was kicked by the striker." (Focus is on the ball).',
        keyConcept: 'Only transitive verbs (verbs taking an object) can be converted into passive voice.',
        formulaOrCode: 'Active:  Subject + Verb + Object\nPassive: Object + Be-verb + V3 (Past Participle) + by + Subject',
        visualDiagram: '  ACTIVE:   [ Khushi ]  ──( wrote )──►  [ the code ]\n              Subject                    Object\n                │                          │\n                ▼                          ▼\n  PASSIVE:  [ The code ] ──( was written by )──► [ Khushi ]\n              New Subject                       Agent',
        practiceQuestion: {
          question: 'Change into passive voice: "Leonardo da Vinci painted the Mona Lisa."',
          options: [
            'The Mona Lisa was painted by Leonardo da Vinci.',
            'The Mona Lisa had painted Leonardo da Vinci.',
            'The Mona Lisa is being painted by Leonardo da Vinci.',
            'Leonardo da Vinci was painted by the Mona Lisa.'
          ],
          answer: 'The Mona Lisa was painted by Leonardo da Vinci.'
        }
      },
      Analogy: {
        directAnswer: 'Active voice puts the spotlight on the hero; passive voice puts the spotlight on the mystery.',
        simpleExplanation: 'When news anchors say "A rare diamond was stolen last night," they use passive voice because the thief is unknown or the diamond is the real headliner.',
        stepByStep: [
          '1. Hero Focus: "Chef Gordon cooked a magnificent feast." (Active)',
          '2. Dish Focus: "A magnificent feast was cooked by Chef Gordon." (Passive)',
          '3. Agent Dropped: "Mistakes were made." (Passive without "by whom" - classic diplomatic rhetoric).'
        ],
        analogy: 'Think of camera angles in a film: Active is a close-up on the hero pulling the lever; Passive is a shot of the drawbridge descending.',
        keyConcept: 'Use active voice 90% of the time for punchy writing; reserve passive voice for scientific reports or when the doer is obvious or irrelevant.',
        formulaOrCode: 'Scientific writing rule: "The solution was heated to 100°C" (Passive is preferred over "We heated the solution").',
        practiceQuestion: {
          question: 'Why is passive voice preferred in laboratory science manuals?',
          answer: 'Because the scientific experiment and result matter, not the specific individual conducting the steps.'
        }
      },
      Visual: {
        directAnswer: 'Tense transformation chart for Active to Passive voice conversions.',
        simpleExplanation: 'The main verb ALWAYS transforms into its 3rd form (V3 / past participle). The auxiliary verb shifts to reflect the tense.',
        stepByStep: [
          'Simple Present: writes ──► is/are written',
          'Simple Past: wrote ──► was/were written',
          'Present Continuous: is writing ──► is/are being written',
          'Present Perfect: has written ──► has been written',
          'Future Simple: will write ──► will be written'
        ],
        keyConcept: 'Future continuous and perfect continuous tenses generally do not have standard passive forms in modern English grammar.',
        formulaOrCode: 'Tense Rules:\n• writes ──► is/are written\n• wrote ──► was/were written\n• will write ──► will be written\n• is writing ──► is being written\n• has written ──► has been written',
        practiceQuestion: {
          question: 'Convert to passive: "The chef is preparing the dessert."',
          answer: 'The dessert is being prepared by the chef.'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Voice conversion is a mandatory 2-3 mark grammar question in secondary board exams.',
        simpleExplanation: 'Rules examiners check: Pronoun changes (I ──► me, he ──► him, they ──► them) and proper preposition usage (sometimes "at", "to", or "with" instead of "by").',
        stepByStep: [
          'Rule 1: Imperative sentences: "Shut the door" ──► "Let the door be shut" or "You are ordered to shut the door."',
          'Rule 2: Verbs followed by prepositions: "He laughed at the beggar" ──► "The beggar was laughed at by him."',
          'Rule 3: Special verbs: "I know him" ──► "He is known to me" (NOT "known by me").',
          'Rule 4: Interrogative: "Who wrote this book?" ──► "By whom was this book written?"'
        ],
        keyConcept: 'Common pitfall: Do NOT change the tense of the sentence! Active past tense must remain passive past tense.',
        formulaOrCode: 'Imperative form:\n"Do it" ──► "Let it be done"\n"Please help me" ──► "You are requested to help me"',
        practiceQuestion: {
          question: 'Change into passive: "Who broke this beautiful vase?"',
          answer: 'By whom was this beautiful vase broken?'
        }
      }
    }
  },

  // SOCIAL SCIENCE: French Revolution
  {
    keywords: ['french', 'revolution', 'bastille', 'louis', 'estates', 'liberty', 'monarchy'],
    subject: 'Social Science',
    responses: {
      Simple: {
        directAnswer: 'The French Revolution (1789–1799) was a period of fundamental political and societal change in France that overthrew the absolute monarchy, stripped the nobility and clergy of feudal privileges, and established democratic ideals.',
        simpleExplanation: 'Ordinary people in France were starving, heavily taxed, and treated unfairly by King Louis XVI and rich nobles. On July 14, 1789, citizens stormed the Bastille prison fortress, sparking a revolution for Liberty, Equality, and Fraternity.',
        stepByStep: [
          'Step 1: Financial Crisis: France went bankrupt supporting the American War of Independence and royal luxuries.',
          'Step 2: Three Estates: Society was divided; only the 3rd Estate (peasants, workers, merchants) paid all taxes.',
          'Step 3: Storming of Bastille: July 14, 1789 marked the fall of despotic royal power.',
          'Step 4: Declaration of Rights: Proclaimed "Men are born and remain free and equal in rights".',
          'Step 5: Rise of Napoleon Bonaparte in 1799 after the Reign of Terror.'
        ],
        analogy: 'Imagine a restaurant where 3 people eat a massive feast, but the 2 richest people at the table order the poorest guest to pay the entire bill with interest. Eventually, the guest rebels!',
        keyConcept: 'The modern democratic values of Liberty, Equality, and Fraternity (Liberté, égalité, fraternité) were born from this revolution.',
        formulaOrCode: 'Core Motto: Liberté, Égalité, Fraternité (Liberty, Equality, Fraternity)',
        visualDiagram: '   [ 1st Estate: Clergy ]   ── 1% Population, Owned 10% Land, Zero Taxes\n   [ 2nd Estate: Nobility ] ── 2% Population, Owned 25% Land, Zero Taxes\n   [ 3rd Estate: Peasants ] ── 97% Population, Paid 100% of Taxes ──► REVOLUTION! 💥',
        practiceQuestion: {
          question: 'Which historic event on July 14, 1789 is celebrated as French National Day?',
          options: ['Storming of the Bastille', 'Execution of Louis XVI', 'Tennis Court Oath', 'Battle of Waterloo'],
          answer: 'Storming of the Bastille, symbol of royal tyranny overthrown by citizens.'
        }
      },
      Analogy: {
        directAnswer: 'The French Revolution was the earthquake that shattered absolute kings across Europe.',
        simpleExplanation: 'Before 1789, people believed kings ruled by "Divine Right" appointed by God. The French Revolution proved that real sovereignty belongs to the citizens.',
        stepByStep: [
          '1. The Pressure Cooker: Bad harvests, skyrocketing bread prices, tax exemption for the wealthy.',
          '2. The Spark: King summons the Estates-General; 3rd Estate breaks away to form the National Assembly.',
          '3. The Radical Peak: Robespierre and the Guillotine during the Reign of Terror.',
          '4. The Order: Napoleon emerges to modernize French law and administrative systems.'
        ],
        analogy: 'Think of a frozen dam bursting under pressure: the old feudal dam broke and flooded Europe with republican constitutions and human rights.',
        keyConcept: 'The concept of the modern Nation-State and universal human rights spread globally because of this uprising.',
        formulaOrCode: 'Key dates: 1789 (Bastille) ──► 1792 (Republic declared) ──► 1793 (Reign of Terror) ──► 1799 (Napoleon)',
        practiceQuestion: {
          question: 'What song, written during the revolution, later became the national anthem of France?',
          answer: 'La Marseillaise, composed by Claude Joseph Rouget de Lisle.'
        }
      },
      Visual: {
        directAnswer: 'Structural timeline and political transition of the French Revolution.',
        simpleExplanation: 'France shifted from Absolute Monarchy ──► Constitutional Monarchy ──► Republic (Reign of Terror) ──► Directory ──► Napoleonic Empire.',
        stepByStep: [
          'May 1789: Meeting of Estates-General at Versailles',
          'June 1789: Tennis Court Oath creates National Assembly',
          'July 1789: Storming of Bastille Fortress',
          'August 1789: Abolition of Feudalism & Declaration of Rights',
          '1793–1794: Reign of Terror under Maximilien Robespierre'
        ],
        keyConcept: 'Political spectrum origin: In the National Assembly, royalist supporters sat on the Right of the presiding officer, while reformers and revolutionaries sat on the Left. This is the origin of the terms "Left-wing" and "Right-wing" politics!',
        formulaOrCode: 'Left Wing (Jacobins / Radicals) vs Right Wing (Girondins / Royalists)',
        practiceQuestion: {
          question: 'Where did the National Assembly delegates take their famous oath to write a constitution?',
          answer: 'On an indoor tennis court at Versailles (The Tennis Court Oath).'
        }
      },
      'Exam-oriented': {
        directAnswer: 'Class 9/10 Social Science core topic with guaranteed 5-mark long answer questions.',
        simpleExplanation: 'Top exam themes: 1) Circumstances leading to the French Revolution. 2) Role of philosophers (Locke, Rousseau, Montesquieu). 3) Legacy of the revolution to the world.',
        stepByStep: [
          'Cause 1: Political: Autocratic rule of Louis XVI and Marie Antoinette.',
          'Cause 2: Social: Division into three estates and feudal burden (Tithe to Church, Taille to State).',
          'Cause 3: Economic: Empty treasury from war debt and severe subsistence crisis.',
          'Cause 4: Intellectual: Montesquieu proposed separation of powers; Rousseau proposed social contract.',
          'Impact: Abolition of censorship, declaration of human rights, end of feudal privileges.'
        ],
        keyConcept: 'Tithe vs Taille: Tithe was a tax levied by the Church (1/10th of agricultural produce); Taille was a direct tax paid to the State.',
        formulaOrCode: 'Philosophers & Books:\n• Montesquieu: The Spirit of the Laws (Separation of Powers)\n• Rousseau: The Social Contract (Democratic government)\n• John Locke: Two Treatises of Government (Refuted divine right of kings)',
        practiceQuestion: {
          question: 'Who wrote the influential political pamphlet "What is the Third Estate?"',
          answer: 'Abbé Sieyès.'
        }
      }
    }
  }
];

// Fallback intelligent parser for any generic or custom student questions
export function generateIntelligentTutorResponse(
  question: string,
  subject: SubjectType,
  style: LearningStyle
): NonNullable<TutorMessage['structuredResponse']> {
  const lowerQ = question.toLowerCase();

  // Check matching preset
  const matched = PRESET_RESPONSES.find(
    (preset) =>
      preset.subject === subject &&
      preset.keywords.some((kw) => lowerQ.includes(kw))
  );

  if (matched) {
    return matched.responses[style];
  }

  // Cross-subject match check
  const crossMatch = PRESET_RESPONSES.find((preset) =>
    preset.keywords.some((kw) => lowerQ.includes(kw))
  );
  if (crossMatch) {
    return crossMatch.responses[style];
  }

  // Intelligent dynamic context-aware answer
  const subjectTopics: Record<SubjectType, string> = {
    Mathematics: 'mathematical logic, formal proofs, step-by-step algebraic manipulation, and precise geometric definitions',
    Science: 'empirical observation, scientific laws, molecular interactions, and biological mechanisms',
    'Computer Science': 'algorithmic efficiency, data abstractions, computational complexity, and clean coding architectures',
    English: 'grammatical precision, rhetorical devices, structural syntax, and literary expression',
    'Social Science': 'historical cause-and-effect, constitutional governance, geographical phenomena, and socio-economic systems'
  };

  const styleTone: Record<LearningStyle, string> = {
    Simple: 'Here is a crystal-clear, straightforward breakdown designed to make the core idea instantly intuitive.',
    Analogy: 'To make this concept unforgettable, let’s frame it with a relatable real-world analogy.',
    Visual: 'Let’s visualize the structure, relationships, and component flow of this topic.',
    'Exam-oriented': 'Here is the high-yield, exam-focused summary highlighting marking criteria, key terms, and common pitfalls.'
  };

  return {
    directAnswer: `In ${subject}, "${question.trim()}" centers on fundamental principles of ${subjectTopics[subject]}.`,
    simpleExplanation: `${styleTone[style]} When analyzing this question, the primary mechanism connects foundational theory directly to observable applications in your curriculum.`,
    stepByStep: [
      `Phase 1: Identify the underlying core definition in ${subject}.`,
      `Phase 2: Break down the primary variables, entities, or rules involved.`,
      `Phase 3: Apply the standard method or analytical framework to solve or interpret.`,
      `Phase 4: Synthesize the final outcome and verify consistency.`
    ],
    analogy:
      style === 'Analogy'
        ? `Think of this like an interconnected puzzle: each piece represents a specific condition. When properly aligned, the overall system functions seamlessly.`
        : undefined,
    keyConcept: `Core Rule in ${subject}: Master the underlying mechanism rather than memorizing isolated surface details.`,
    formulaOrCode:
      subject === 'Mathematics'
        ? 'General Analytical Framework: Output = f(Core_Variables) ± Boundary_Conditions'
        : subject === 'Computer Science'
        ? '// Pseudo-logical pattern\nfunction solveConcept(input) {\n  validate(input);\n  return transform(input);\n}'
        : undefined,
    visualDiagram:
      style === 'Visual'
        ? `[ Input / Premise ] ──► [ ${subject} Mechanism ] ──► [ Verified Conclusion ]\n           ▲                       │\n           └────── [ Feedback ] ───┘`
        : undefined,
    practiceQuestion: {
      question: `Check your understanding: Which fundamental rule in ${subject} applies most directly to this question?`,
      answer: `The foundational law of ${subject} that links cause, structure, and outcome systematically.`
    }
  };
}
