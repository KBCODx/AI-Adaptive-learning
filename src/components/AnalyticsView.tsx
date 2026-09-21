import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Flame,
  Award,
  Sparkles,
  ArrowUpRight,
  PieChart
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const AnalyticsView: React.FC = () => {
  const { student, subjects, activities } = useStudent();

  // Weekly study activity mock
  const weeklyDays = [
    { day: 'Mon', hours: 1.5, lessons: 3 },
    { day: 'Tue', hours: 2.0, lessons: 4 },
    { day: 'Wed', hours: 1.2, lessons: 2 },
    { day: 'Thu', hours: 2.5, lessons: 5 },
    { day: 'Fri', hours: 1.8, lessons: 4 },
    { day: 'Sat', hours: 3.0, lessons: 6 },
    { day: 'Sun', hours: 2.2, lessons: 4 },
  ];

  return (
    <div style={{
      maxWidth: '1180px',
      margin: '0 auto',
      padding: '32px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '28px'
    }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
          Diagnostic Overview
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
          Progress & Analytics
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
          Detailed performance metrics tracked across all 5 active subjects.
        </p>
      </div>

      {/* Row 1: High Level KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
            OVERALL ACCURACY
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', margin: '6px 0 2px' }}>
            {student.overallAccuracy}%
          </div>
          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 700 }}>
            ↑ 12% increase this week
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
            LEARNING STREAK
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#F97316', margin: '6px 0 2px' }}>
            {student.streak} Days 🔥
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
            Consistency on track
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
            COMPLETED LESSONS
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4F46E5', margin: '6px 0 2px' }}>
            {student.completedLessons}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
            Curriculum milestone
          </span>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
            CURRENT LEVEL
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', margin: '6px 0 2px' }}>
            {student.level}
          </div>
          <span style={{ fontSize: '0.72rem', color: '#7C3AED', fontWeight: 700 }}>
            Dynamically adjusted
          </span>
        </div>
      </div>

      {/* Row 2: Subject Performance Bars + Weekly Activity */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
        gap: '24px'
      }}>
        {/* Subject Accuracy List matching Section 16 */}
        <div className="card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
              Subject Performance
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
              Accuracy Benchmarks
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {subjects.map((sub) => (
              <div key={sub.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{sub.icon}</span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1E293B' }}>
                      {sub.name}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: sub.color }}>
                    {sub.accuracy}%
                  </span>
                </div>

                <div className="progress-bar-container" style={{ height: '8px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${sub.accuracy}%`,
                      background: `linear-gradient(90deg, ${sub.color} 0%, ${sub.color}cc 100%)`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Bar Chart */}
        <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
                Weekly Activity
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                Study Hours
              </span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              height: '160px',
              paddingTop: '20px',
              borderBottom: '1px solid #E2E8F0',
              marginBottom: '12px'
            }}>
              {weeklyDays.map((d, i) => {
                const heightPercent = (d.hours / 3.0) * 100;
                return (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '32px' }}>
                    <div
                      style={{
                        width: '18px',
                        height: `${heightPercent}%`,
                        background: 'linear-gradient(180deg, #4F46E5 0%, #818CF8 100%)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s ease'
                      }}
                      title={`${d.hours} hrs (${d.lessons} lessons)`}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: '12px 16px',
            borderRadius: '12px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #F1F5F9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Total This Week:</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1E293B' }}>14.2 Hours • 28 Lessons</span>
          </div>
        </div>
      </div>

      {/* Row 3: Strengths vs Weaknesses Breakdown */}
      <div className="card" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '20px' }}>
          Diagnostic Strengths & Improvement Areas
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px'
        }}>
          {/* Strong Areas */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #BBF7D0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <CheckCircle2 size={18} color="#15803D" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                Strong Areas (Mastery &gt; 80%)
              </h4>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Reading Comprehension (English)', 'Algebra (Math)', 'Covalent Bonding (Science)', 'Python Loops (CS)', 'Indian Constitution (SST)', 'Trigonometry (Math)'].map((st, i) => (
                <span key={i} className="badge badge-on-track" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                  ✓ {st}
                </span>
              ))}
            </div>
          </div>

          {/* Weak Areas needing revision */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #FECACA'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <TrendingUp size={18} color="#DC2626" />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#B91C1C', margin: 0 }}>
                Areas Needing Practice (Mastery &lt; 65%)
              </h4>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Geometry: Triangles (Math)', 'Functional Groups (Science)', 'Binary Tree Traversals (CS)', 'Active/Passive Voice (English)', 'Historical Timelines (SST)'].map((wk, i) => (
                <span key={i} className="badge badge-high-priority" style={{ fontSize: '0.75rem', padding: '6px 12px' }}>
                  ! {wk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
