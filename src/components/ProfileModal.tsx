import React, { useState, useEffect } from 'react';
import {
  User,
  Camera,
  CheckCircle2,
  Sparkles,
  Save,
  LogIn,
  KeyRound,
  Mail,
  ArrowRight,
  Shield,
  LogOut,
  Clock,
  Check
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';
import { useAuth } from '../context/AuthContext';
import { LearningStyle } from '../types';

export const ProfileModal: React.FC = () => {
  const { student, updateProfile, setActiveTab } = useStudent();
  const { user, logout } = useAuth();
  const [activeSubView, setActiveSubView] = useState<'profile' | 'account'>('profile');

  // Form states initialized with current student
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [style, setStyle] = useState<LearningStyle>(student.preferredStyle);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state if student changes
  useEffect(() => {
    setName(student.name);
    setGrade(student.grade);
    setStyle(student.preferredStyle);
  }, [student]);

  const initials = student.name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';

  const handleSave = () => {
    updateProfile(name, grade, style);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '32px 24px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Tab Switcher between Profile Setup and Login/Sign Up Mockup */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '12px'
      }}>
        <button
          onClick={() => setActiveSubView('profile')}
          className={`btn ${activeSubView === 'profile' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <User size={16} />
          <span>Student Profile Setup</span>
        </button>
        <button
          onClick={() => setActiveSubView('account')}
          className={`btn ${activeSubView === 'account' ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <Shield size={16} />
          <span>Account & Security</span>
        </button>
      </div>

      {activeSubView === 'profile' ? (
        /* PANEL 2: Student Profile Setup */
        <div className="card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
              Personalization Engine
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
              Complete Your Profile
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
              Help us personalize your learning experience and pedagogy.
            </p>
          </div>

          {/* Avatar with Camera badge */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
                color: '#FFFFFF',
                fontSize: '2rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)'
              }}>
                {initials}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '0px',
                right: '0px',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#4F46E5',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #FFFFFF',
                cursor: 'pointer'
              }}>
                <Camera size={14} />
              </div>
            </div>
          </div>

          {/* Input fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                Class / Grade
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <option value="9th">9th Standard</option>
                <option value="10th">10th Standard</option>
                <option value="11th">11th Standard</option>
                <option value="12th">12th Standard</option>
              </select>
            </div>
          </div>

          {/* Subjects Pills matching Panel 2 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
              Enrolled Subjects
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Mathematics', 'Science', 'English', 'Computer Science', 'Social Science'].map((sub) => (
                <span
                  key={sub}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '999px',
                    backgroundColor: '#EEF2FF',
                    color: '#4F46E5',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: '1px solid #C7D2FE'
                  }}
                >
                  <span>{sub}</span>
                  <span style={{ cursor: 'pointer', fontSize: '0.85rem' }}>✕</span>
                </span>
              ))}
              <button
                className="btn btn-outline"
                style={{ padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem' }}
              >
                + Add Subject
              </button>
            </div>
          </div>

          {/* Preferred Learning Style 4 Cards matching Screenshot Panel 2 */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '12px' }}>
              Preferred Learning Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { id: 'Simple', icon: '💡', title: 'Simple', desc: 'Easy & clear explanations' },
                { id: 'Analogy', icon: '🧩', title: 'Analogy', desc: 'Real-life examples & comparisons' },
                { id: 'Visual', icon: '👁️', title: 'Visual', desc: 'Diagrams & images' },
                { id: 'Exam-oriented', icon: '📝', title: 'Exam-oriented', desc: 'Important points & practice' },
              ].map((item) => {
                const isSelected = style === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setStyle(item.id as any)}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #4F46E5' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? '#EEF2FF' : '#FFFFFF',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.5rem', marginBottom: '6px', display: 'block' }}>
                      {item.icon}
                    </span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#4F46E5' : '#1E293B', marginBottom: '4px' }}>
                      {item.title}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: isSelected ? '#4338CA' : '#64748B', margin: 0 }}>
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
            {savedSuccess ? (
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                Profile changes saved!
              </span>
            ) : (
              <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>
                Preferences will instantly apply to AI Tutor and study lessons
              </span>
            )}

            <button
              onClick={handleSave}
              className="btn btn-primary"
              style={{ padding: '12px 28px' }}
            >
              <Save size={16} />
              <span>Save & Continue</span>
            </button>
          </div>
        </div>
      ) : (
        /* PANEL: Account & Security */
        <div className="card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
              Authentication & Session
            </span>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
              Account & Security
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
              Manage your active login session, account credentials, and system access.
            </p>
          </div>

          {/* Active Session Card */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#F8FAFC',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                color: '#FFFFFF',
                fontSize: '1.25rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(79, 70, 229, 0.25)'
              }}>
                {initials}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                    {student.name}
                  </h3>
                  {user?.isDemo && (
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      backgroundColor: '#FEF3C7',
                      color: '#B45309',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      border: '1px solid #FDE68A'
                    }}>
                      DEMO ACCOUNT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.86rem', color: '#64748B', marginTop: '2px' }}>
                  {user?.email || 'demo@student.com'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '999px',
                backgroundColor: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#15803D',
                fontSize: '0.78rem',
                fontWeight: 700
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span>Session Active</span>
              </div>
            </div>
          </div>

          {/* Account Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Learning Level</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
                {student.level}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Class / Grade</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
                Class {student.grade}
              </div>
            </div>

            <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)', backgroundColor: '#FFFFFF' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Storage Architecture</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
                LocalStorage Session
              </div>
            </div>
          </div>

          {/* Session Termination & Logout Box */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            backgroundColor: '#FEF2F2',
            border: '1.5px solid #FECACA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginTop: '8px'
          }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#991B1B' }}>
                Terminate Current Session
              </div>
              <p style={{ fontSize: '0.82rem', color: '#B91C1C', margin: '4px 0 0' }}>
                Logging out will clear your local authentication token and return you to the Login screen.
              </p>
            </div>

            <button
              type="button"
              onClick={logout}
              className="btn"
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                padding: '10px 22px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.88rem',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.3)'
              }}
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
