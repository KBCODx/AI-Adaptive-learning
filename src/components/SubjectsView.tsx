import React from 'react';
import { ArrowRight, BookOpen, CheckCircle, Target, Award, Sparkles } from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { SubjectType } from '../types';

export const SubjectsView: React.FC = () => {
  const { subjects, setActiveSubject, setActiveTab } = useStudent();

  const handleContinue = (subjectName: SubjectType) => {
    setActiveSubject(subjectName);
    setActiveTab('adaptive');
  };

  const handleTakeQuiz = (subjectName: SubjectType) => {
    setActiveSubject(subjectName);
    setActiveTab('quiz');
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '32px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
            Academic Subjects
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem' }}>
            Multi-subject curriculum continuously synchronized with your personal AI diagnostic matrix.
          </p>
        </div>
        <span className="badge badge-info">
          5 Subjects Active
        </span>
      </div>

      {/* Grid of Subject Cards matching Section 9 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '24px'
      }}>
        {subjects.map((sub) => (
          <div
            key={sub.id}
            className="card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Color Accent */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              backgroundColor: sub.color
            }} />

            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{sub.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>
                      {sub.name}
                    </h3>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: sub.color,
                      backgroundColor: sub.bgLight,
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      Level: {sub.level}
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B' }}>
                    {sub.progress}%
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Mastery</span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: '#64748B', lineHeight: '1.4', marginBottom: '16px' }}>
                {sub.description}
              </p>

              {/* Progress Bar */}
              <div style={{ marginBottom: '16px' }}>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${sub.progress}%`, background: sub.color }}
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#F8FAFC',
                marginBottom: '16px',
                border: '1px solid #F1F5F9'
              }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Accuracy</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                    {sub.accuracy}%
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Completed Topics</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
                    {sub.completedTopics} / {sub.totalTopics}
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses Pills */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                  AI DIAGNOSTIC HIGHLIGHTS:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {sub.strengths.slice(0, 2).map((st, i) => (
                    <span key={i} className="badge badge-on-track" style={{ fontSize: '0.68rem' }}>
                      ✓ {st}
                    </span>
                  ))}
                  {sub.weaknesses.slice(0, 1).map((wk, i) => (
                    <span key={i} className="badge badge-high-priority" style={{ fontSize: '0.68rem' }}>
                      ! {wk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => handleContinue(sub.name)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                <span>Continue</span>
                <ArrowRight size={15} />
              </button>
              <button
                onClick={() => handleTakeQuiz(sub.name)}
                className="btn btn-outline"
                style={{ padding: '10px 14px', fontSize: '0.85rem' }}
                title="Take diagnostic quiz"
              >
                Quiz
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
