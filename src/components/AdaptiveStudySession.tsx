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
  const {
    student,
    activeSubject,
    currentLearningContext,
    setTopicContext,
    setPreferredStyle,
    startQuizForCurrentTopic,
    setActiveTab
  } = useStudent();
  const [activeSubtab, setActiveSubtab] = useState<'Explanation' | 'Notes' | 'Examples'>('Explanation');
  const [sessionTab, setSessionTab] = useState<'Learn' | 'Practice' | 'AskAI'>('Learn');

  // Chapters available for the active subject
  const chapters = getChapters(student.grade, student.board, student.stream, activeSubject);

  // Retrieve current active chapter and topic objects from currentLearningContext
  const currentChapter =
    chapters.find((c) => c.id === currentLearningContext.chapterId || c.title.toLowerCase() === currentLearningContext.chapter?.toLowerCase()) ||
    chapters[0];
  const currentTopic =
    currentChapter?.topics.find((t) => t.id === currentLearningContext.topicId || t.title.toLowerCase() === currentLearningContext.topic?.toLowerCase()) ||
    currentChapter?.topics[0];

  const selectedChapterId = currentChapter?.id || '';
  const selectedTopicId = currentTopic?.id || '';

  // When chapter selection changes, update active topic in central context
  const handleChapterChange = (chId: string) => {
    const ch = chapters.find((c) => c.id === chId);
    if (ch && ch.topics.length > 0) {
      setTopicContext(activeSubject, ch.title, ch.topics[0].title, ch.id, ch.topics[0].id);
    }
  };

  // When topic selection changes, update central context
  const handleTopicChange = (topId: string) => {
    if (currentChapter) {
      const top = currentChapter.topics.find((t) => t.id === topId);
      if (top) {
        setTopicContext(activeSubject, currentChapter.title, top.title, currentChapter.id, top.id);
      }
    }
  };

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
                  if (tab.id === 'Practice') startQuizForCurrentTopic();
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
                    onClick={() => handleTopicChange(top.id)}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Style Badge / Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      backgroundColor:
                        student.preferredStyle === 'Simple' ? '#ECFDF5' :
                        student.preferredStyle === 'Analogy' ? '#FEF3C7' :
                        student.preferredStyle === 'Visual' ? '#EEF2FF' : '#F5F3FF',
                      color:
                        student.preferredStyle === 'Simple' ? '#059669' :
                        student.preferredStyle === 'Analogy' ? '#D97706' :
                        student.preferredStyle === 'Visual' ? '#4F46E5' : '#7C3AED'
                    }}>
                      {student.preferredStyle} Mode Active
                    </span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginTop: '6px' }}>
                      {activeContent.heading}
                    </h4>
                  </div>
                </div>

                {/* 1. SIMPLE MODE */}
                {student.preferredStyle === 'Simple' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '0.98rem', color: '#334155', lineHeight: '1.7', margin: 0 }}>
                      {activeContent.paragraph}
                    </p>

                    {activeContent.bulletPoints && activeContent.bulletPoints.length > 0 && (
                      <div style={{
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Core Key Takeaways
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeContent.bulletPoints.map((pt, idx) => (
                            <li key={idx} style={{ fontSize: '0.92rem', color: '#1E293B', lineHeight: '1.5' }}>
                              {pt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>💡</span>
                      <div>
                        <strong>Beginner Friendly Tip: </strong>
                        <span>{activeContent.tip}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ANALOGY MODE */}
                {student.preferredStyle === 'Analogy' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Story Card */}
                    <div style={{
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.4rem' }}>🧩</span>
                        <h5 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400E', margin: 0 }}>
                          {activeContent.analogyDetails?.analogyTitle || 'Everyday Real-World Metaphor'}
                        </h5>
                      </div>
                      <p style={{ fontSize: '0.96rem', color: '#78350F', lineHeight: '1.7', margin: 0 }}>
                        {activeContent.analogyDetails?.analogyStory || activeContent.paragraph}
                      </p>
                    </div>

                    {/* Concept Mapping Table */}
                    {activeContent.analogyDetails?.conceptMapping && activeContent.analogyDetails.conceptMapping.length > 0 && (
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                      }}>
                        <div style={{
                          backgroundColor: '#F8FAFC',
                          padding: '12px 18px',
                          borderBottom: '1px solid #E2E8F0',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          color: '#475569',
                          textTransform: 'uppercase'
                        }}>
                          Mapping: Everyday Scenario ⟷ Curriculum Rule
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          {activeContent.analogyDetails.conceptMapping.map((item, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto 1fr',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 18px',
                                borderBottom: idx !== activeContent.analogyDetails!.conceptMapping.length - 1 ? '1px solid #F1F5F9' : 'none',
                                backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC'
                              }}
                            >
                              <div style={{ fontSize: '0.88rem', color: '#B45309', fontWeight: 600 }}>
                                {item.realWorld}
                              </div>
                              <span style={{ color: '#94A3B8', fontWeight: 800 }}>⟷</span>
                              <div style={{ fontSize: '0.88rem', color: '#1E293B', fontWeight: 600 }}>
                                {item.concept}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: '#FEF3C7',
                      border: '1px solid #FCD34D',
                      color: '#92400E',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>💡</span>
                      <div>
                        <strong>Mental Model Insight: </strong>
                        <span>{activeContent.tip}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. VISUAL MODE */}
                {student.preferredStyle === 'Visual' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                      {activeContent.paragraph}
                    </p>

                    {/* Monospaced ASCII Visual Diagram */}
                    {activeContent.visualDiagram && (
                      <div style={{
                        backgroundColor: '#0F172A',
                        color: '#38BDF8',
                        borderRadius: '14px',
                        padding: '20px',
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: '0.84rem',
                        lineHeight: '1.5',
                        whiteSpace: 'pre',
                        overflowX: 'auto',
                        border: '1px solid #1E293B',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}>
                        {activeContent.visualDiagram}
                      </div>
                    )}

                    {/* Structured Comparison Table */}
                    {activeContent.comparisonTable && (
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '14px',
                        overflow: 'hidden'
                      }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#EEF2FF', borderBottom: '2px solid #C7D2FE' }}>
                              {activeContent.comparisonTable.headers.map((h, idx) => (
                                <th key={idx} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#3730A3' }}>
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {activeContent.comparisonTable.rows.map((row, rIdx) => (
                              <tr key={rIdx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} style={{ padding: '10px 14px', color: '#1E293B', fontWeight: cIdx === 0 ? 600 : 400 }}>
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Visual Steps Roadmap */}
                    {activeContent.visualSteps && activeContent.visualSteps.length > 0 && (
                      <div style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <h5 style={{ fontSize: '0.82rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '10px' }}>
                          Visual Step Sequence
                        </h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {activeContent.visualSteps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem', color: '#14532D' }}>
                              <span style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: '50%',
                                backgroundColor: '#22C55E',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                flexShrink: 0
                              }}>
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      color: '#3730A3',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>👁️</span>
                      <div>
                        <strong>Visual Memory Trigger: </strong>
                        <span>{activeContent.tip}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. EXAM-ORIENTED MODE */}
                {student.preferredStyle === 'Exam-oriented' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <p style={{ fontSize: '0.96rem', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                      {activeContent.paragraph}
                    </p>

                    {/* Board Definition Card */}
                    {activeContent.examBreakdown?.definition && (
                      <div style={{
                        backgroundColor: '#F5F3FF',
                        border: '1px solid #DDD6FE',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6D28D9', textTransform: 'uppercase' }}>
                          Official {student.board} Curriculum Definition
                        </span>
                        <p style={{ fontSize: '0.94rem', color: '#4C1D95', fontWeight: 600, margin: '6px 0 0', lineHeight: '1.5' }}>
                          "{activeContent.examBreakdown.definition}"
                        </p>
                      </div>
                    )}

                    {/* Formulas & High-Yield Key Points */}
                    {activeContent.examBreakdown?.formulas && activeContent.examBreakdown.formulas.length > 0 && (
                      <div style={{
                        backgroundColor: '#1E293B',
                        color: '#F8FAFC',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', textTransform: 'uppercase' }}>
                          Standard Board Equations & Formulas
                        </span>
                        <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#38BDF8', marginTop: '6px' }}>
                          {activeContent.examBreakdown.formulas.join('  •  ')}
                        </div>
                      </div>
                    )}

                    {/* Common Mistakes */}
                    {activeContent.examBreakdown?.commonMistakes && activeContent.examBreakdown.commonMistakes.length > 0 && (
                      <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <AlertTriangle size={18} color="#DC2626" />
                          <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B', textTransform: 'uppercase', margin: 0 }}>
                            Common Mistakes to Avoid in {student.board} Exams
                          </h5>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {activeContent.examBreakdown.commonMistakes.map((m, idx) => (
                            <li key={idx} style={{ fontSize: '0.88rem', color: '#7F1D1D', lineHeight: '1.4' }}>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Typical Exam Questions & Marking Criteria */}
                    {activeContent.examBreakdown?.practiceQuestions && activeContent.examBreakdown.practiceQuestions.length > 0 && (
                      <div style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        padding: '16px 20px'
                      }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
                          Typical Board Practice Question
                        </span>
                        {activeContent.examBreakdown.practiceQuestions.map((pq, idx) => (
                          <div key={idx} style={{ marginTop: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                              <p style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.92rem', margin: 0 }}>
                                Q: {pq.question}
                              </p>
                              <span style={{
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#EEF2FF',
                                color: '#4F46E5',
                                whiteSpace: 'nowrap'
                              }}>
                                {pq.marks}
                              </span>
                            </div>
                            <div style={{
                              marginTop: '8px',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              backgroundColor: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              fontSize: '0.86rem',
                              color: '#334155',
                              lineHeight: '1.5'
                            }}>
                              <strong style={{ color: '#059669' }}>Board Standard Solution: </strong>
                              {pq.solution}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{
                      padding: '16px',
                      borderRadius: '14px',
                      backgroundColor: '#FAF5FF',
                      border: '1px solid #E9D5FF',
                      color: '#6B21A8',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <span style={{ fontSize: '1.4rem' }}>📝</span>
                      <div>
                        <strong>{student.board} Marking Tip: </strong>
                        <span>{activeContent.tip}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              onClick={() => startQuizForCurrentTopic()}
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
