import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Award,
  BookOpen,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { SubjectType, QuizQuestion, QuizResult, DifficultyLevel } from '../types';
import { getQuizQuestions, getChapters } from '../services/curriculumService';

export const QuizView: React.FC = () => {
  const {
    student,
    activeSubject,
    setActiveSubject,
    recordQuizResult,
    lastQuizResult,
    setActiveTab
  } = useStudent();

  const questionsToUse = getQuizQuestions(
    student.grade,
    student.board,
    student.stream,
    activeSubject,
    student.level
  );

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ questionIndex: number; selectedIndex: number; isCorrect: boolean }[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizStartTime] = useState(Date.now());

  // Reset quiz states on subject or academic profile change
  React.useEffect(() => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setIsCompleted(false);
  }, [activeSubject, student.grade, student.board, student.stream]);

  const currentQ = questionsToUse[currentQIndex] || questionsToUse[0] || {
    id: `fallback-q-${activeSubject.toLowerCase()}`,
    subject: activeSubject,
    topic: `${activeSubject} Diagnostic`,
    difficulty: student.level,
    question: `What is the core principle of ${student.grade} ${activeSubject}?`,
    options: ['Standard analytical definition', 'Arbitrary assumption', 'Unrelated guess', 'None of these'],
    correctIndex: 0,
    explanation: `Foundational syllabus definition for ${student.grade} ${activeSubject}.`
  };

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing after selection
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQ.correctIndex;
    const updatedAnswers = [
      ...userAnswers,
      { questionIndex: currentQIndex, selectedIndex: selectedOption, isCorrect }
    ];
    setUserAnswers(updatedAnswers);
    setSelectedOption(null);

    if (currentQIndex + 1 < questionsToUse.length) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      // Quiz complete: calculate score
      finishQuiz(updatedAnswers);
    }
  };

  const finishQuiz = (answers: typeof userAnswers) => {
    const correctCount = answers.filter((a) => a.isCorrect).length;
    const total = answers.length;
    const accuracy = Math.round((correctCount / total) * 100);

    let newDiff: DifficultyLevel = 'Intermediate';
    let adaptMsg = '';

    if (accuracy > 80) {
      newDiff = 'Advanced';
      adaptMsg = 'Great performance! Difficulty increased to Advanced.';
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (accuracy >= 60) {
      newDiff = 'Intermediate';
      adaptMsg = "You're progressing steadily. Continue at Intermediate level.";
    } else {
      newDiff = 'Beginner';
      adaptMsg = "Let's strengthen the basics before moving ahead.";
    }

    const result: QuizResult = {
      score: correctCount,
      totalQuestions: total,
      accuracy,
      subject: activeSubject,
      topic: currentQ.topic,
      difficulty: currentQ.difficulty,
      strongTopics: accuracy >= 60 ? [currentQ.topic] : [],
      weakTopics: accuracy < 60 ? [currentQ.topic] : [],
      adaptationMessage: adaptMsg,
      newDifficulty: newDiff,
      recommendedTopic: accuracy < 60 ? `${currentQ.topic} Basics` : `Advanced ${currentQ.topic}`,
      userAnswers: answers
    };

    recordQuizResult(result);
    setIsCompleted(true);
  };

  // Quick 58% simulation for Section 19 Hackathon Demo Flow!
  const handleSimulateDemo58 = () => {
    const simulatedAnswers = [
      { questionIndex: 0, selectedIndex: 0, isCorrect: true },
      { questionIndex: 1, selectedIndex: 1, isCorrect: true },
      { questionIndex: 2, selectedIndex: 2, isCorrect: false },
      { questionIndex: 3, selectedIndex: 3, isCorrect: true },
      { questionIndex: 4, selectedIndex: 0, isCorrect: false },
      { questionIndex: 5, selectedIndex: 1, isCorrect: true },
      { questionIndex: 6, selectedIndex: 2, isCorrect: false },
      { questionIndex: 7, selectedIndex: 3, isCorrect: true },
      { questionIndex: 8, selectedIndex: 0, isCorrect: false },
      { questionIndex: 9, selectedIndex: 1, isCorrect: false },
    ];

    const result: QuizResult = {
      score: 6,
      totalQuestions: 10,
      accuracy: 58,
      subject: activeSubject,
      topic: `${activeSubject} Diagnostic`,
      difficulty: 'Intermediate',
      strongTopics: [`${activeSubject} Foundations`],
      weakTopics: [`${activeSubject} Problem Sets`],
      adaptationMessage: "Let's strengthen the basics before moving ahead.",
      newDifficulty: 'Beginner',
      recommendedTopic: `${activeSubject} Fundamentals`,
      userAnswers: simulatedAnswers
    };

    recordQuizResult(result);
    setIsCompleted(true);
  };

  const handleRestart = () => {
    setCurrentQIndex(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setIsCompleted(false);
  };

  // RENDER POST-QUIZ RESULTS SCREEN (Panel 7 of screenshot)
  if (isCompleted && lastQuizResult) {
    const { score, totalQuestions, accuracy, subject, topic, adaptationMessage, newDifficulty, recommendedTopic } = lastQuizResult;
    const isSuccess = accuracy >= 80;
    const isWarning = accuracy < 60;

    return (
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '32px 24px 64px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Top Result Banner */}
        <div className="card" style={{
          padding: '32px',
          textAlign: 'center',
          background: isSuccess
            ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
            : isWarning
            ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
            : 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
          border: isSuccess ? '1.5px solid #A7F3D0' : isWarning ? '1.5px solid #FED7AA' : '1.5px solid #C7D2FE'
        }}>
          <span style={{ fontSize: '2.5rem', marginBottom: '8px', display: 'block' }}>
            {isSuccess ? '🏆' : isWarning ? '💡' : '📈'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
            Diagnostic Assessment Complete
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#475569', margin: 0 }}>
            Subject: <strong>{subject}</strong> • Topic: <strong>{topic}</strong>
          </p>
        </div>

        {/* Results Card with Circular Gauge matching Panel 7 in Screenshot! */}
        <div className="card" style={{ padding: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
            gap: '32px',
            alignItems: 'center'
          }}>
            {/* Circular Gauge matching "6/10 Score" from Screenshot! */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              borderRadius: '20px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '12px' }}>
                Your Performance
              </span>

              {/* Circular Graphic */}
              <div style={{
                position: 'relative',
                width: '140px',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="12"
                  />
                  <circle
                    cx="70"
                    cy="70"
                    r="58"
                    fill="none"
                    stroke={accuracy >= 80 ? '#10B981' : accuracy >= 60 ? '#4F46E5' : '#EF4444'}
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - accuracy / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 70 70)"
                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', lineHeight: '1.1' }}>
                    {score}/{totalQuestions}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>
                    Score ({accuracy}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Topic-Wise Breakdown matching Screenshot Panel 7 */}
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B', marginBottom: '14px' }}>
                Topic-wise Performance
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isWarning ? '#EF4444' : '#10B981' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                      {topic}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                      {accuracy}%
                    </span>
                    <span className={`badge ${isWarning ? 'badge-high-priority' : 'badge-on-track'}`}>
                      {isWarning ? 'High Priority' : 'On Track'}
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                      {getChapters(student.grade, student.board, student.stream, subject)[0]?.topics[0]?.title || `${subject} Foundations`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                      85%
                    </span>
                    <span className="badge badge-on-track">
                      On Track
                    </span>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                      {getChapters(student.grade, student.board, student.stream, subject)[0]?.topics[1]?.title || `${subject} Application`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>
                      65%
                    </span>
                    <span className="badge badge-practice">
                      Practice
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC ADAPTATION REACTION CARD (USP PROOF!) */}
          <div style={{
            marginTop: '28px',
            padding: '20px 24px',
            borderRadius: '16px',
            backgroundColor: isWarning ? '#FEF2F2' : isSuccess ? '#F0FDF4' : '#EEF2FF',
            border: isWarning ? '1.5px solid #FECACA' : isSuccess ? '1.5px solid #BBF7D0' : '1.5px solid #C7D2FE',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={20} color={isWarning ? '#DC2626' : isSuccess ? '#15803D' : '#4F46E5'} />
              <h4 style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: isWarning ? '#991B1B' : isSuccess ? '#166534' : '#1E1B4B',
                margin: 0
              }}>
                Adaptive Engine Recalibration
              </h4>
            </div>

            <p style={{
              fontSize: '0.92rem',
              color: isWarning ? '#7F1D1D' : isSuccess ? '#14532D' : '#312E81',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {adaptationMessage} Difficulty automatically tuned to <strong>{newDifficulty}</strong>.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(0,0,0,0.08)'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#334155' }}>
                Next AI Recommendation: <strong>{recommendedTopic}</strong>
              </span>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setActiveTab('recommendations')}
                  className="btn btn-primary"
                  style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                >
                  <span>Start Recommended Practice</span>
                  <ArrowRight size={15} />
                </button>
                <button
                  onClick={handleRestart}
                  className="btn btn-outline"
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <RotateCcw size={14} />
                  <span>Retake</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER ACTIVE QUESTION FLOW (Panel 7: Question 3 of 10)
  return (
    <div style={{
      maxWidth: '920px',
      margin: '0 auto',
      padding: '32px 24px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Top Header & Demo Fast Simulation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
            Diagnostic Quiz • {activeSubject}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
            Quiz: {currentQ.topic}
          </h1>
        </div>

        {/* Quick judge demo shortcut button */}
        <button
          onClick={handleSimulateDemo58}
          className="btn"
          style={{
            backgroundColor: '#FFF7ED',
            color: '#C2410C',
            border: '1px solid #FFEDD5',
            padding: '8px 14px',
            fontSize: '0.78rem',
            borderRadius: '999px',
            fontWeight: 700
          }}
          title="Fast-forward: Simulates 58% Geometry score to demonstrate adaptive difficulty lowering"
        >
          ⚡ Fast-Forward: Simulate 58% Score (Demo Step 5)
        </button>
      </div>

      {/* Progress Counter matching Screenshot Panel 7: "Question 3 of 10" */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5' }}>
            Question {currentQIndex + 1} of {questionsToUse.length}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
            Difficulty: {currentQ.difficulty}
          </span>
        </div>

        <div className="progress-bar-container" style={{ height: '6px' }}>
          <div
            className="progress-bar-fill"
            style={{ width: `${((currentQIndex + 1) / questionsToUse.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="card" style={{ padding: '32px' }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E293B',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}>
          {currentQ.question}
        </h3>

        {/* Options List matching Screenshot: A, B, C, D with green checkmark when selected */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
          {currentQ.options.map((opt, index) => {
            const isSelected = selectedOption === index;
            const letter = ['A', 'B', 'C', 'D'][index];

            return (
              <button
                key={index}
                onClick={() => handleSelectOption(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: isSelected ? '2px solid #10B981' : '1.5px solid var(--border-subtle)',
                  backgroundColor: isSelected ? '#DCFCE7' : '#FFFFFF',
                  color: isSelected ? '#15803D' : '#1E293B',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#10B981' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {letter}
                  </span>
                  <span>{opt}</span>
                </div>

                {isSelected && (
                  <CheckCircle2 size={20} color="#10B981" />
                )}
              </button>
            );
          })}
        </div>

        {/* Next Question Action Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '20px'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            {selectedOption === null ? 'Select an answer to proceed' : 'Answer recorded'}
          </span>

          <button
            onClick={handleNextQuestion}
            className="btn btn-primary"
            style={{ padding: '12px 28px', borderRadius: '12px' }}
            disabled={selectedOption === null}
          >
            <span>{currentQIndex + 1 === questionsToUse.length ? 'Submit Quiz' : 'Next Question'}</span>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
