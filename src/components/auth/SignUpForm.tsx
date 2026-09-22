import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Check, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DifficultyLevel, SubjectType } from '../../types';

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const AVAILABLE_LEVELS: { id: DifficultyLevel; label: string; desc: string }[] = [
  { id: 'Beginner', label: 'Beginner', desc: 'Strengthen fundamentals' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'Standard curriculum pace' },
  { id: 'Advanced', label: 'Advanced', desc: 'Accelerated problem solving' }
];

const AVAILABLE_SUBJECTS: { name: SubjectType; icon: string }[] = [
  { name: 'Mathematics', icon: '📐' },
  { name: 'Science', icon: '🔬' },
  { name: 'English', icon: '📖' },
  { name: 'Computer Science', icon: '💻' },
  { name: 'Social Science', icon: '🌍' }
];

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitchToLogin }) => {
  const { signUp, authError, clearError, isConfigured } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [grade, setGrade] = useState('10th');
  const [level, setLevel] = useState<DifficultyLevel>('Intermediate');
  const [preferredSubjects, setPreferredSubjects] = useState<SubjectType[]>([
    'Mathematics',
    'Science'
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationNotice, setConfirmationNotice] = useState<string | null>(null);

  // Client-side validation errors
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    subjects?: string;
  }>({});

  const toggleSubject = (subject: SubjectType) => {
    if (preferredSubjects.includes(subject)) {
      if (preferredSubjects.length > 1) {
        setPreferredSubjects(preferredSubjects.filter((s) => s !== subject));
      }
    } else {
      setPreferredSubjects([...preferredSubjects, subject]);
    }
    if (errors.subjects) {
      setErrors((prev) => ({ ...prev, subjects: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      subjects?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must contain at least 6 characters.';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (preferredSubjects.length === 0) {
      newErrors.subjects = 'Please select at least one preferred subject.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setConfirmationNotice(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await signUp({
        name,
        email,
        password,
        confirmPassword,
        grade,
        level,
        preferredSubjects
      });

      if (res.success && res.requiresConfirmation) {
        setConfirmationNotice(
          'Account created successfully! Please check your email to confirm your account before logging in.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '20px', textAlign: 'left' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#1E293B',
          letterSpacing: '-0.02em',
          marginBottom: '6px'
        }}>
          Create Your Account
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
          Join GuruMitra to begin personalized AI-guided learning.
        </p>
      </div>

      {/* Supabase Configuration Warning */}
      {!isConfigured && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          color: '#92400E',
          fontSize: '0.82rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <Info size={16} style={{ flexShrink: 0, marginTop: '2px', color: '#D97706' }} />
          <span>
            <strong>Supabase Setup Required:</strong> Add your project URL and public anon key to <code>.env</code> to connect real Supabase Auth.
          </span>
        </div>
      )}

      {/* Email Verification Required Notice */}
      {confirmationNotice && (
        <div style={{
          marginBottom: '16px',
          padding: '14px',
          borderRadius: '12px',
          background: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          color: '#065F46',
          fontSize: '0.88rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
            <CheckCircle2 size={18} color="#10B981" />
            <span>Verification Email Sent</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.84rem', color: '#047857' }}>
            {confirmationNotice}
          </p>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn btn-primary"
            style={{ marginTop: '6px', padding: '8px 14px', fontSize: '0.82rem', alignSelf: 'flex-start' }}
          >
            Go to Login
          </button>
        </div>
      )}

      {/* Global Auth Error Alert */}
      {authError && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          fontSize: '0.86rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={17} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{authError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }} noValidate>
        {/* Full Name */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
            Full Name
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: errors.name ? '#EF4444' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <User size={18} />
            </div>
            <input
              type="text"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                if (authError) clearError();
              }}
              style={{
                width: '100%',
                padding: '11px 16px 11px 42px',
                borderRadius: '12px',
                border: errors.name ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: errors.name ? '#FEF2F2' : '#FFFFFF'
              }}
            />
          </div>
          {errors.name && (
            <p style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '4px', fontWeight: 600 }}>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
            Email Address
          </label>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: errors.email ? '#EF4444' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <Mail size={18} />
            </div>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (authError) clearError();
              }}
              style={{
                width: '100%',
                padding: '11px 16px 11px 42px',
                borderRadius: '12px',
                border: errors.email ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                fontSize: '0.9rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: errors.email ? '#FEF2F2' : '#FFFFFF'
              }}
            />
          </div>
          {errors.email && (
            <p style={{ color: '#DC2626', fontSize: '0.76rem', marginTop: '4px', fontWeight: 600 }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password & Confirm Password */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 6 chars"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                style={{
                  width: '100%',
                  padding: '11px 36px 11px 14px',
                  borderRadius: '12px',
                  border: errors.password ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  backgroundColor: errors.password ? '#FEF2F2' : '#FFFFFF'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#DC2626', fontSize: '0.72rem', marginTop: '3px', fontWeight: 600 }}>
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '12px',
                border: errors.confirmPassword ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: errors.confirmPassword ? '#FEF2F2' : '#FFFFFF'
              }}
            />
            {errors.confirmPassword && (
              <p style={{ color: '#DC2626', fontSize: '0.72rem', marginTop: '3px', fontWeight: 600 }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Class & Learning Level */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
              Class / Grade
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 12px',
                borderRadius: '12px',
                border: '1.5px solid var(--border-medium)',
                fontSize: '0.88rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            >
              <option value="9th">Class 9th</option>
              <option value="10th">Class 10th</option>
              <option value="11th">Class 11th</option>
              <option value="12th">Class 12th</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '5px' }}>
              Learning Level
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {AVAILABLE_LEVELS.map((lvl) => {
                const isSelected = level === lvl.id;
                return (
                  <button
                    type="button"
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    style={{
                      flex: 1,
                      padding: '9px 6px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid #4F46E5' : '1px solid var(--border-medium)',
                      background: isSelected ? '#EEF2FF' : '#FFFFFF',
                      color: isSelected ? '#4F46E5' : '#475569',
                      fontSize: '0.78rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preferred Subjects */}
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', marginBottom: '6px' }}>
            Preferred Subjects (Select at least one)
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {AVAILABLE_SUBJECTS.map((sub) => {
              const isSelected = preferredSubjects.includes(sub.name);
              return (
                <button
                  type="button"
                  key={sub.name}
                  onClick={() => toggleSubject(sub.name)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    border: isSelected ? '1.5px solid #4F46E5' : '1px solid var(--border-medium)',
                    background: isSelected ? '#EEF2FF' : '#F8FAFC',
                    color: isSelected ? '#4F46E5' : '#475569',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{sub.icon}</span>
                  <span>{sub.name}</span>
                  {isSelected && <Check size={13} strokeWidth={3} />}
                </button>
              );
            })}
          </div>
          {errors.subjects && (
            <p style={{ color: '#DC2626', fontSize: '0.75rem', marginTop: '4px', fontWeight: 600 }}>
              {errors.subjects}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '0.96rem',
            borderRadius: '12px',
            marginTop: '8px',
            opacity: isSubmitting ? 0.85 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Creating your account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        paddingTop: '16px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#4F46E5',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '0.88rem',
              padding: 0
            }}
          >
            Log In
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
