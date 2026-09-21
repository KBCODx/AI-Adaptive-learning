import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { LearningStyle } from '../types';

export const AdaptiveStudySession: React.FC = () => {
  const { student, activeSubject, setPreferredStyle, setActiveTab } = useStudent();
  const [activeSubtab, setActiveSubtab] = useState<'Explanation' | 'Notes' | 'Examples'>('Explanation');
  const [sessionTab, setSessionTab] = useState<'Learn' | 'Practice' | 'AskAI'>('Learn');

  const learningStyles: { style: LearningStyle; icon: string; title: string; subtitle: string }[] = [
    { style: 'Simple', icon: '💡', title: 'Simple', subtitle: 'Easy & clear explanations' },
    { style: 'Analogy', icon: '🧩', title: 'Analogy', subtitle: 'Real-life examples & metaphors' },
    { style: 'Visual', icon: '👁️', title: 'Visual', subtitle: 'Structural diagrams & charts' },
    { style: 'Exam-oriented', icon: '📝', title: 'Exam-oriented', subtitle: 'High-yield points & practice' },
  ];

  // Dynamic lesson content based on style
  const lessonData = {
    title: activeSubject === 'Science' ? 'Carbon and Its Compounds' : `${activeSubject} Mastery`,
    chapter: 'Chapter 3 • Functional Groups',
    progress: 40,
    content: {
      Simple: {
        heading: 'What are Functional Groups?',
        paragraph: 'Functional groups are specific groups of atoms in organic compounds that determine the chemical properties and reactivity of the compounds.',
        subtext: 'Even if the hydrocarbon chain is very long or very short, the functional group dictates how the molecule behaves when interacting with other chemicals.',
        tip: "Think of functional groups as 'special teams' in a molecule! They give it unique properties."
      },
      Analogy: {
        heading: 'The Power Tool Metaphor',
        paragraph: 'Imagine an interchangeable power drill. The battery and motor handle are always the same (the carbon chain), but attaching a drill bit versus a sanding wheel completely changes what the tool can do.',
        subtext: 'Similarly, attaching an -OH group turns a benign hydrocarbon into an alcohol, while adding -COOH makes it an acidic vinegar!',
        tip: "Metaphor: The carbon chain is the vehicle, but the functional group is the driver deciding the direction!"
      },
      Visual: {
        heading: 'Molecular Architecture & Reactive Sites',
        paragraph: 'Oxygen and Nitrogen atoms contain electronegative lone pairs that create localized dipoles within nonpolar carbon bonds.',
        subtext: 'Alcohols (-OH) have bent sp³ geometry; Aldehydes (-CHO) and Ketones (>C=O) have planar sp² carbonyl bonds with 120° bond angles.',
        tip: "Visual Cue: Polar red oxygen centers attract attacking reagents while the grey carbon chain remains inert."
      },
      'Exam-oriented': {
        heading: 'Board Exam High-Yield Suffixes & Reactions',
        paragraph: 'Guaranteed 4-mark questions in Section C: 1) Identify functional group. 2) Give IUPAC nomenclature. 3) Test for carboxylic acid using Sodium Hydrogen Carbonate.',
        subtext: 'IUPAC Suffix Rules: Alcohol = -ol | Aldehyde = -al | Ketone = -one | Carboxylic Acid = -oic acid.',
        tip: "Board Exam Tip: When ethanoic acid reacts with NaHCO₃, brisk effervescence of CO₂ gas confirms carboxylic acid presence."
      }
    }
  };

  const activeContent = lessonData.content[student.preferredStyle] || lessonData.content.Simple;

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '32px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Session Top Header matching Screenshot Panel 6 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
            {activeSubject} Adaptive Study
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
            {lessonData.title}
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
            Let's learn at your pace! GuruMitra dynamically adjusts pedagogical depth.
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
                  {lessonData.chapter}
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

          {/* Subtab Content rendered dynamically according to student.preferredStyle */}
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

                {/* Illustrated Tip Box matching Screenshot Panel 6! */}
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
                    <strong>Tip: </strong>
                    <span>{activeContent.tip}</span>
                  </div>
                </div>
              </>
            )}

            {activeSubtab === 'Notes' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                  Quick Revision Notes
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: '#334155', lineHeight: '1.7' }}>
                  <li><strong>Alcohol:</strong> Contains -OH group. Suffix is -ol (e.g. Methanol, Ethanol).</li>
                  <li><strong>Carboxylic Acid:</strong> Contains -COOH group. Suffix is -oic acid (e.g. Ethanoic acid).</li>
                  <li><strong>Aldehydes:</strong> Contains terminal -CHO group. Suffix is -al (e.g. Ethanal).</li>
                  <li><strong>Ketones:</strong> Contains internal &gt;C=O group. Suffix is -one (e.g. Propanone).</li>
                </ul>
              </div>
            )}

            {activeSubtab === 'Examples' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1E293B' }}>
                  Common Chemical Examples
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
                  // Alcohols:<br />
                  CH₃-OH ──► Methanol<br />
                  CH₃-CH₂-OH ──► Ethanol (Drinkable/Alcohol)<br /><br />
                  // Carboxylic Acids:<br />
                  CH₃-COOH ──► Ethanoic acid (Vinegar 5-8% solution)
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action: Next Button matching screenshot */}
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

        {/* Right Column: Learning Style Switcher Cards (Panel 6) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                Personalize Pedagogical Style
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0 }}>
                Clicking any style transforms the explanation instantly.
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
              Pacing is calibrated to <strong>{student.level}</strong>. If quiz score drops below 60%, the engine automatically routes to remedial prerequisites.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
