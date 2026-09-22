import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  FileText,
  HelpCircle,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { LearningStyle } from '../types';
import {
  getChapters,
  getLesson,
  validateSubjectContext
} from '../services/curriculumService';

export const AdaptiveStudySession: React.FC = () => {
  const { student, activeSubject, setPreferredStyle, setActiveTab } = useStudent();
  const [activeSubtab, setActiveSubtab] = useState<'Explanation' | 'Notes' | 'Examples'>('Explanation');
  const [sessionTab, setSessionTab] = useState<'Learn' | 'Practice' | 'AskAI'>('Learn');

  // Chapters available for the active subject
  const chapters = getChapters(student.grade, student.board, student.stream, activeSubject);
  const [selectedChapterId, setSelectedChapterId] = useState<string>(chapters[0]?.id || '');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(chapters[0]?.topics[0]?.id || '');

  // Reset chapter and topic selection when activeSubject or grade changes
  useEffect(() => {
    const updatedChapters = getChapters(student.grade, student.board, student.stream, activeSubject);
    if (updatedChapters.length > 0) {
      setSelectedChapterId(updatedChapters[0].id);
      setSelectedTopicId(updatedChapters[0].topics[0]?.id || '');
    }
  }, [activeSubject, student.grade, student.board, student.stream]);

  // When chapter selection changes, update active topic
  const handleChapterChange = (chId: string) => {
    setSelectedChapterId(chId);
    const ch = chapters.find((c) => c.id === chId);
    if (ch && ch.topics.length > 0) {
      setSelectedTopicId(ch.topics[0].id);
    }
  };

  // Retrieve current active chapter and topic objects
  const currentChapter = chapters.find((c) => c.id === selectedChapterId) || chapters[0];
  const currentTopic =
    currentChapter?.topics.find((t) => t.id === selectedTopicId) || currentChapter?.topics[0];

  // Dynamic lesson content based on active subject, chapter, topic, and style
  const lessonData = getLesson(
    student.grade,
    student.board,
    student.stream,
    activeSubject,
    selectedChapterId,
    selectedTopicId
  );

  // Subject-Context Validation Guard
  const isSubjectValid = validateSubjectContext(lessonData.subject, activeSubject);

  const learningStyles: { style: LearningStyle; icon: string; title: string; subtitle: string }[] = [
    { style: 'Simple', icon: '💡', title: 'Simple', subtitle: 'Easy & clear explanations' },
    { style: 'Analogy', icon: '🧩', title: 'Analogy', subtitle: 'Real-life examples & metaphors' },
    { style: 'Visual', icon: '👁️', title: 'Visual', subtitle: 'Structural diagrams & charts' },
    { style: 'Exam-oriented', icon: '📝', title: 'Exam-oriented', subtitle: 'High-yield points & practice' },
  ];

  const activeContent = lessonData.styles[student.preferredStyle] || lessonData.styles.Simple;

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '32px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Session Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
              {activeSubject} Adaptive Study
            </span>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#059669',
              backgroundColor: '#ECFDF5',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              {student.grade} • {student.board} {student.stream !== 'Not applicable' ? `• ${student.stream}` : ''}
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
            {lessonData.topicTitle}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
            {currentChapter ? currentChapter.title : `${activeSubject} Curriculum`} • Pedagogical depth calibrated to {student.grade}.
          </p>
        </div>

        {/* Session Tabs (Learn, Practice, Ask AI) */}
        <div style={{
          display: 'flex',
          gap: '6px',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          {[
            { id: 'Learn', icon: BookOpen, label: 'Learn' },
            { id: 'Practice', icon: CheckCircle2, label: 'Practice' },
            { id: 'AskAI', icon: Bot, label: 'Ask AI' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = sessionTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSessionTab(tab.id as any);
                  if (tab.id === 'Practice') setActiveTab('quiz');
                  if (tab.id === 'AskAI') setActiveTab('tutor');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isTabActive ? '#4F46E5' : 'transparent',
                  color: isTabActive ? '#FFFFFF' : '#64748B',
                  fontWeight: isTabActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chapter & Topic Selector Bar */}
      {chapters.length > 0 && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px 20px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bookmark size={17} color="#4F46E5" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B' }}>
              Select Chapter:
            </span>
            <select
              value={selectedChapterId}
              onChange={(e) => handleChapterChange(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.85rem',
                color: '#1E293B',
                fontWeight: 600,
                backgroundColor: '#F8FAFC',
                outline: 'none'
              }}
            >
              {chapters.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  Chapter {ch.number}: {ch.title}
                </option>
              ))}
            </select>
          </div>

          {currentChapter && currentChapter.topics.length > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>Topic:</span>
              {currentChapter.topics.map((top) => {
                const isTopActive = top.id === selectedTopicId;
                return (
                  <button
                    key={top.id}
                    onClick={() => setSelectedTopicId(top.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      border: isTopActive ? '1px solid #4F46E5' : '1px solid #E2E8F0',
                      backgroundColor: isTopActive ? '#EEF2FF' : '#FFFFFF',
                      color: isTopActive ? '#4F46E5' : '#475569',
                      fontWeight: isTopActive ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {top.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Subject-Context Validation Alert if mismatch ever occurs */}
      {!isSubjectValid && (
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          color: '#B91C1C',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <AlertTriangle size={20} />
          <div>
            <strong>Subject Mismatch Warning:</strong> Current subject is "{activeSubject}", but lesson context indicated "{lessonData.subject}". Content has been safeguarded.
          </div>
        </div>
      )}

      {/* Main Study Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
        gap: '24px'
      }}>
        {/* Left Column: Lesson Content + Subtabs */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B' }}>
                  Today's Lesson
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B' }}>
                  {lessonData.chapterTitle}
                </h3>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4F46E5' }}>
                {lessonData.progress}%
              </span>
            </div>

            <div className="progress-bar-container" style={{ height: '6px' }}>
              <div className="progress-bar-fill" style={{ width: `${lessonData.progress}%` }} />
            </div>
          </div>

          {/* Subtabs: [Explanation] [Notes] [Examples] */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid #F1F5F9',
            paddingBottom: '12px'
          }}>
            {(['Explanation', 'Notes', 'Examples'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubtab(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeSubtab === tab ? '#EEF2FF' : 'transparent',
                  color: activeSubtab === tab ? '#4F46E5' : '#64748B',
                  fontWeight: activeSubtab === tab ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subtab Content rendered dynamically according to student.preferredStyle & active topic */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '220px' }}>
            {activeSubtab === 'Explanation' && (
              <>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                  {activeContent.heading}
                </h4>
                <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6' }}>
                  {activeContent.paragraph}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>
                  {activeContent.subtext}
                </p>

                {/* Illustrated Tip Box */}
                <div style={{
                  padding: '16px',
                  borderRadius: '14px',
                  backgroundColor: '#FEF9C3',
                  border: '1px solid #FEF08A',
                  color: '#854D0E',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  marginTop: '10px'
                }}>
                  <span style={{ fontSize: '1.3rem' }}>💡</span>
                  <div>
                    <strong>{student.preferredStyle} Tip: </strong>
                    <span>{activeContent.tip}</span>
                  </div>
                </div>
              </>
            )}

            {activeSubtab === 'Notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                  Quick Revision Notes • {lessonData.topicTitle}
                </h4>
                {currentTopic?.keyPoints && currentTopic.keyPoints.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.8' }}>
                    {currentTopic.keyPoints.map((point, idx) => (
                      <li key={idx}>
                        <strong>Key Concept {idx + 1}:</strong> {point}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                    Fundamental concepts for {lessonData.topicTitle} in {student.grade} {activeSubject}.
                  </p>
                )}

                {currentTopic?.formulas && currentTopic.formulas.length > 0 && (
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0'
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
                      Standard Formulas / Equations
                    </span>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#1E293B', marginTop: '4px' }}>
                      {currentTopic.formulas.join('  |  ')}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSubtab === 'Examples' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                  Worked Example • {lessonData.topicTitle}
                </h4>
                <div style={{
                  backgroundColor: '#0F172A',
                  color: '#F8FAFC',
                  padding: '16px',
                  borderRadius: '12px',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  lineHeight: '1.6'
                }}>
                  // {activeSubject} ({student.grade} - {student.board})<br />
                  // Topic: {lessonData.topicTitle}<br /><br />
                  {currentTopic?.formulas && currentTopic.formulas.length > 0 ? (
                    <>
                      // Governing Rule:<br />
                      {currentTopic.formulas[0]}<br /><br />
                      // Application:<br />
                      Input parameters are mapped from board syllabus specifications.<br />
                      Step 1: State the formula clearly.<br />
                      Step 2: Substitute values with proper SI/standard units.<br />
                      Step 3: Solve analytically and verify boundary limits.
                    </>
                  ) : (
                    <>
                      // Core Concept Application:<br />
                      1. Identify the given premise in the problem.<br />
                      2. Apply the fundamental rule of {lessonData.topicTitle}.<br />
                      3. Formulate the conclusion based on {student.board} criteria.
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Next Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid #F1F5F9',
            paddingTop: '16px',
            marginTop: 'auto'
          }}>
            <button
              onClick={() => setActiveTab('quiz')}
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              <span>Next (Take Quiz)</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>

        {/* Right Column: Learning Style Switcher Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Personalize Pedagogical Style
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Clicking any style transforms the {activeSubject} explanation instantly.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {learningStyles.map((item) => {
                const isSelected = student.preferredStyle === item.style;
                return (
                  <div
                    key={item.style}
                    onClick={() => setPreferredStyle(item.style)}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #4F46E5' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(79, 70, 229, 0.12)' : 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                      <span style={{
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: isSelected ? '#4F46E5' : '#1E293B'
                      }}>
                        {item.title}
                      </span>
                      {isSelected && (
                        <CheckCircle2 size={16} color="#4F46E5" style={{ marginLeft: 'auto' }} />
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: isSelected ? '#4338CA' : '#64748B',
                      margin: 0,
                      lineHeight: '1.3'
                    }}>
                      {item.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Adaptive AI Engine Status Card */}
          <div className="card" style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
            border: '1px solid #E9D5FF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={16} color="#7C3AED" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7C3AED' }}>
                AI Engine Active
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#6B21A8', margin: 0, lineHeight: '1.4' }}>
              Pacing calibrated to <strong>{student.level}</strong> difficulty for <strong>{student.grade} ({student.board})</strong>. If quiz score drops below 60%, the engine automatically routes to remedial prerequisites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
