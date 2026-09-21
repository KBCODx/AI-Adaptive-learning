import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Copy,
  Check,
  Volume2,
  HelpCircle,
  Code2,
  BookOpen,
  Eye,
  RefreshCw,
  Lightbulb,
  ChevronDown
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { SubjectType, LearningStyle, TutorMessage } from '../types';
import { generateIntelligentTutorResponse } from '../data/tutorKnowledge';

export const AITutor: React.FC = () => {
  const { student, activeSubject, setActiveSubject, setPreferredStyle } = useStudent();
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'tutor',
      text: "Sure! Functional groups are specific groups of atoms in organic compounds that determine how the compound behaves in chemical reactions. Think of them as 'identity tags' — just like a group of people has a common identity (e.g., students, teachers), functional groups give specific properties to organic compounds.",
      timestamp: 'Just now',
      subject: 'Science',
      styleUsed: 'Simple',
      structuredResponse: {
        directAnswer: 'Functional groups are specific atoms or bonds within molecules that are responsible for the characteristic chemical reactions of those molecules.',
        simpleExplanation: 'No matter how long the carbon chain is, the functional group dictates whether it behaves as an alcohol, an acid, or an aldehyde.',
        stepByStep: [
          'Step 1: Alcohol (-OH) gives alcohol properties (e.g. Ethanol)',
          'Step 2: Carboxylic Acid (-COOH) gives acidic properties (e.g. Acetic acid in vinegar)',
          'Step 3: Aldehyde (-CHO) and Ketone (>C=O) contain reactive carbonyl groups'
        ],
        analogy: "Think of functional groups as 'special tools' in a Swiss Army knife! Swapping the tool completely changes what the knife can do.",
        keyConcept: 'All members of a homologous series share identical functional groups.',
        formulaOrCode: 'Alcohol: -OH | Carboxylic Acid: -COOH | Aldehyde: -CHO | Ketone: -CO-',
        visualDiagram: '   [ Carbon Backbone ] ──► [ -OH ] = Alcohol (e.g., C₂H₅OH)\n   [ Carbon Backbone ] ──► [ -COOH ] = Organic Acid (e.g., CH₃COOH)',
        practiceQuestion: {
          question: 'Which functional group is found in alcohols?',
          options: ['-COOH', '-OH', '-CHO', '-NH2'],
          answer: '-OH (Hydroxyl group)'
        }
      }
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPracticeAnswer, setShowPracticeAnswer] = useState<Record<string, boolean>>({});
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const subjectsList: { name: SubjectType; icon: string; color: string }[] = [
    { name: 'Mathematics', icon: '📐', color: '#4F46E5' },
    { name: 'Science', icon: '🔬', color: '#059669' },
    { name: 'Computer Science', icon: '💻', color: '#7C3AED' },
    { name: 'English', icon: '📖', color: '#D97706' },
    { name: 'Social Science', icon: '🌍', color: '#DC2626' }
  ];

  const suggestedQuestions: Record<SubjectType, string[]> = {
    Mathematics: [
      'Explain quadratic equations in simple words',
      'What is the Pythagorean theorem?',
      'How does the discriminant work in quadratic roots?',
      'Give me an example problem'
    ],
    Science: [
      'Why does photosynthesis occur?',
      'Explain functional groups in simple words',
      'What is covalent bonding?',
      'Give me a practice question on chemical reactions'
    ],
    'Computer Science': [
      'What is a binary tree?',
      'Explain recursion using a real-world analogy',
      'What is the time complexity of binary search?',
      'Give me a Python code example'
    ],
    English: [
      'Explain active and passive voice',
      'What is the difference between a simile and a metaphor?',
      'Convert: "Khushi has completed the project"',
      'Explain subject-verb agreement rules'
    ],
    'Social Science': [
      'Explain the causes of the French Revolution',
      'What are the key features of federalism?',
      'Why is democracy considered the best form of government?',
      'Explain the separation of powers'
    ]
  };

  const stylePills: LearningStyle[] = ['Simple', 'Analogy', 'Visual', 'Exam-oriented'];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: TutorMessage = {
      id: `user-${Date.now()}`,
      sender: 'student',
      text: query,
      timestamp: 'Just now',
      subject: activeSubject
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate realistic AI generation with intelligent context
    setTimeout(() => {
      const responseStructure = generateIntelligentTutorResponse(
        query,
        activeSubject,
        student.preferredStyle
      );

      const botMessage: TutorMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: responseStructure.directAnswer,
        timestamp: 'Just now',
        subject: activeSubject,
        styleUsed: student.preferredStyle,
        structuredResponse: responseStructure
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '24px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: 'calc(100vh - 74px)'
    }}>
      {/* Top Controls: Header, Subject Selector & Learning Style Modifier */}
      <div className="card" style={{ padding: '18px 24px', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Bot size={18} />
              </div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                AI Tutor
              </h2>
              <span className="badge badge-info">
                Multi-Subject Context Aware
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '4px 0 0 40px' }}>
              Ask anything, anytime. Switches domain and pedagogical style dynamically.
            </p>
          </div>

          {/* Subject Pills / Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
              Subject:
            </span>
            {subjectsList.map((sub) => {
              const isSelected = activeSubject === sub.name;
              return (
                <button
                  key={sub.name}
                  onClick={() => setActiveSubject(sub.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: isSelected ? `2px solid ${sub.color}` : '1px solid var(--border-subtle)',
                    background: isSelected ? `${sub.color}15` : '#FFFFFF',
                    color: isSelected ? sub.color : '#64748B',
                    fontWeight: isSelected ? 800 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Style Selector Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', letterSpacing: '0.03em' }}>
              ADAPTIVE EXPLANATION STYLE:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {stylePills.map((style) => (
                <button
                  key={style}
                  onClick={() => setPreferredStyle(style)}
                  className={`style-pill ${student.preferredStyle === style ? 'active' : ''}`}
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {style === 'Simple' && '💡'}
                  {style === 'Analogy' && '🧩'}
                  {style === 'Visual' && '👁️'}
                  {style === 'Exam-oriented' && '📝'}
                  <span>{style}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearChat}
            className="btn btn-ghost"
            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#94A3B8' }}
            title="Clear Chat History"
          >
            <Trash2 size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main Chat Conversation Container */}
      <div className="card" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        padding: '0'
      }}>
        {/* Messages Stream */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {messages.length === 0 ? (
            <div style={{
              margin: 'auto',
              textAlign: 'center',
              maxWidth: '400px',
              color: '#94A3B8'
            }}>
              <Bot size={48} color="#C7D2FE" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: '#1E293B', marginBottom: '6px' }}>How can I help you today?</h4>
              <p style={{ fontSize: '0.85rem' }}>
                Select a subject, pick a question below, or type your query to receive an intelligent, structured breakdown.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isUser = msg.sender === 'student';
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    gap: '6px'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.72rem',
                    color: '#94A3B8'
                  }}>
                    {isUser ? (
                      <>
                        <span>{student.name}</span>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          backgroundColor: '#EC4899',
                          color: '#FFFFFF',
                          fontSize: '0.65rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}>
                          KD
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Bot size={12} />
                        </div>
                        <span style={{ fontWeight: 700, color: '#4F46E5' }}>
                          GuruMitra AI ({msg.subject || activeSubject} • {msg.styleUsed || student.preferredStyle})
                        </span>
                      </>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div style={{
                    maxWidth: isUser ? '75%' : '90%',
                    padding: isUser ? '12px 18px' : '20px',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    backgroundColor: isUser ? '#4F46E5' : '#FFFFFF',
                    color: isUser ? '#FFFFFF' : '#1E293B',
                    boxShadow: isUser
                      ? '0 4px 14px rgba(79, 70, 229, 0.25)'
                      : '0 4px 20px rgba(0, 0, 0, 0.05)',
                    border: isUser ? 'none' : '1px solid #E2E8F0',
                    fontSize: '0.92rem',
                    lineHeight: '1.5'
                  }}>
                    {isUser ? (
                      <div>{msg.text}</div>
                    ) : (
                      /* Rich Structured Response */
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Direct Answer */}
                        <div style={{
                          padding: '12px 16px',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          borderLeft: '4px solid #4F46E5',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          color: '#1E293B'
                        }}>
                          💡 {msg.structuredResponse?.directAnswer || msg.text}
                        </div>

                        {/* Simple Explanation */}
                        {msg.structuredResponse?.simpleExplanation && (
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Core Explanation
                            </div>
                            <p style={{ margin: 0, color: '#334155' }}>
                              {msg.structuredResponse.simpleExplanation}
                            </p>
                          </div>
                        )}

                        {/* Step-by-Step Breakdown */}
                        {msg.structuredResponse?.stepByStep && (
                          <div>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Step-by-Step Breakdown
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {msg.structuredResponse.stepByStep.map((step, idx) => (
                                <div key={idx} style={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  gap: '8px',
                                  fontSize: '0.88rem',
                                  color: '#334155'
                                }}>
                                  <span style={{ color: '#4F46E5', fontWeight: 700 }}>•</span>
                                  <span>{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Real World Analogy */}
                        {msg.structuredResponse?.analogy && (
                          <div style={{
                            padding: '12px 16px',
                            backgroundColor: '#FEF3C7',
                            borderRadius: '12px',
                            border: '1px solid #FDE68A',
                            color: '#92400E',
                            fontSize: '0.88rem'
                          }}>
                            <strong>🧩 Real-World Analogy: </strong>
                            {msg.structuredResponse.analogy}
                          </div>
                        )}

                        {/* Formula or Code block */}
                        {msg.structuredResponse?.formulaOrCode && (
                          <div style={{
                            backgroundColor: '#0F172A',
                            color: '#F8FAFC',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontFamily: 'monospace',
                            fontSize: '0.82rem',
                            whiteSpace: 'pre-wrap',
                            overflowX: 'auto'
                          }}>
                            {msg.structuredResponse.formulaOrCode}
                          </div>
                        )}

                        {/* Visual Diagram */}
                        {msg.structuredResponse?.visualDiagram && (
                          <div style={{
                            backgroundColor: '#F1F5F9',
                            color: '#1E293B',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            whiteSpace: 'pre-wrap',
                            overflowX: 'auto',
                            border: '1px solid #CBD5E1'
                          }}>
                            {msg.structuredResponse.visualDiagram}
                          </div>
                        )}

                        {/* Key Concept Box */}
                        {msg.structuredResponse?.keyConcept && (
                          <div style={{
                            fontSize: '0.82rem',
                            color: '#059669',
                            backgroundColor: '#ECFDF5',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontWeight: 600,
                            border: '1px solid #A7F3D0'
                          }}>
                            🎯 <strong>Key Concept:</strong> {msg.structuredResponse.keyConcept}
                          </div>
                        )}

                        {/* Practice Question */}
                        {msg.structuredResponse?.practiceQuestion && (
                          <div style={{
                            border: '1px solid #E0E7FF',
                            borderRadius: '12px',
                            padding: '14px 16px',
                            backgroundColor: '#F8FAFF'
                          }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', marginBottom: '6px' }}>
                              Interactive Practice Question
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                              {msg.structuredResponse.practiceQuestion.question}
                            </div>

                            {msg.structuredResponse.practiceQuestion.options && (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginBottom: '10px' }}>
                                {msg.structuredResponse.practiceQuestion.options.map((opt, i) => (
                                  <div key={i} style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E2E8F0',
                                    fontSize: '0.8rem',
                                    color: '#475569'
                                  }}>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setShowPracticeAnswer((prev) => ({ ...prev, [msg.id]: !prev[msg.id] }));
                              }}
                              className="btn btn-outline"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '8px' }}
                            >
                              <Eye size={12} />
                              <span>{showPracticeAnswer[msg.id] ? 'Hide Answer' : 'Reveal Solution'}</span>
                            </button>

                            {showPracticeAnswer[msg.id] && (
                              <div style={{
                                marginTop: '8px',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                backgroundColor: '#DCFCE7',
                                color: '#166534',
                                fontSize: '0.82rem',
                                fontWeight: 600
                              }}>
                                ✓ {msg.structuredResponse.practiceQuestion.answer}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action buttons (Copy, Read) */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          <button
                            onClick={() => handleCopy(msg.id, msg.structuredResponse?.directAnswer || msg.text)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#94A3B8',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            {copiedId === msg.id ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* Live Typing Animation */}
          {isTyping && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={13} />
              </div>
              <div style={{
                padding: '10px 16px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4F46E5', animation: 'pulse-soft 1s infinite' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4F46E5', animation: 'pulse-soft 1s infinite 0.2s' }} />
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4F46E5', animation: 'pulse-soft 1s infinite 0.4s' }} />
                <span style={{ fontSize: '0.75rem', color: '#64748B', marginLeft: '6px' }}>
                  GuruMitra is synthesizing with {student.preferredStyle} pedagogical style...
                </span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div style={{
          padding: '8px 20px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94A3B8' }}>
            SUGGESTED ({activeSubject}):
          </span>
          {suggestedQuestions[activeSubject]?.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '999px',
                padding: '4px 12px',
                fontSize: '0.75rem',
                color: '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#4F46E5';
                e.currentTarget.style.color = '#4F46E5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#475569';
              }}
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Field & Send Button */}
        <div style={{
          padding: '16px 20px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask any ${activeSubject} question (e.g. "Explain in simple words", "Give an example")...`}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '12px',
              border: '1.5px solid var(--border-subtle)',
              fontSize: '0.92rem',
              fontFamily: 'var(--font-family)',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />

          <button
            onClick={() => handleSendMessage()}
            className="btn btn-primary"
            style={{ padding: '12px 20px', borderRadius: '12px' }}
            disabled={!inputQuery.trim()}
          >
            <Send size={17} />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
