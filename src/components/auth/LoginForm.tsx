import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSwitchToSignUp,
  onSwitchToForgotPassword
}) => {
  const { login, authError, clearError, demoCredentials } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local client validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must contain at least 8 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        email,
        password,
        rememberMe
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    setErrors({});
    clearError();
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      {/* Form Header */}
      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#1E293B',
          letterSpacing: '-0.02em',
          marginBottom: '6px'
        }}>
          Welcome Back
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
          Log in to continue your personalized AI learning journey.
        </p>
      </div>

      {/* Quick Judge Demo Helper Banner */}
      <div style={{
        marginBottom: '20px',
        padding: '12px 14px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
        border: '1.5px solid #FDE68A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.1rem' }}>🎓</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#92400E' }}>
              Hackathon Judge Demo Account
            </div>
            <div style={{ fontSize: '0.72rem', color: '#B45309', fontFamily: 'monospace' }}>
              {demoCredentials.email} • {demoCredentials.password}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          style={{
            border: 'none',
            background: '#F59E0B',
            color: '#FFFFFF',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(245, 158, 11, 0.35)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <Sparkles size={12} fill="#FFFFFF" />
          <span>Auto-Fill</span>
        </button>
      </div>

      {/* Global Auth Error Alert */}
      {authError && (
        <div style={{
          marginBottom: '18px',
          padding: '12px 14px',
          borderRadius: '12px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          color: '#DC2626',
          fontSize: '0.86rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'pulse-soft 0.2s ease'
        }}>
          <AlertCircle size={17} color="#DC2626" />
          <span>{authError}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
        {/* Email Field */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#1E293B',
            marginBottom: '6px'
          }}>
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
              placeholder="e.g. demo@student.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                if (authError) clearError();
              }}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: '12px',
                border: errors.email ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: errors.email ? '#FEF2F2' : '#FFFFFF',
                transition: 'border-color 0.15s ease'
              }}
            />
          </div>
          {errors.email && (
            <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px'
          }}>
            <label style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#1E293B'
            }}>
              Password
            </label>
            <button
              type="button"
              onClick={onSwitchToForgotPassword}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#4F46E5',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Forgot password?
            </button>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: errors.password ? '#EF4444' : '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none'
            }}>
              <Lock size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                if (authError) clearError();
              }}
              style={{
                width: '100%',
                padding: '12px 42px 12px 42px',
                borderRadius: '12px',
                border: errors.password ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                fontSize: '0.92rem',
                fontFamily: 'var(--font-family)',
                outline: 'none',
                backgroundColor: errors.password ? '#FEF2F2' : '#FFFFFF',
                transition: 'border-color 0.15s ease'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember Me Checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              width: '16px',
              height: '16px',
              accentColor: '#4F46E5',
              cursor: 'pointer'
            }}
          />
          <label
            htmlFor="rememberMe"
            style={{
              fontSize: '0.84rem',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            Remember me on this device
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '13px',
            fontSize: '0.96rem',
            borderRadius: '12px',
            marginTop: '4px',
            opacity: isSubmitting ? 0.85 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Signing you in...</span>
            </>
          ) : (
            <>
              <span>Login</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div style={{
        marginTop: '24px',
        textAlign: 'center',
        paddingTop: '18px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignUp}
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
            Sign Up
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
