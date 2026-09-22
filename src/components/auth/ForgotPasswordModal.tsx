import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordProps> = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setStatusMessage(null);
    setErrorMessage(null);

    if (!email.trim()) {
      setEmailError('Please enter your email.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(email.trim());
      if (res.success) {
        setStatusMessage(res.message);
      } else {
        setErrorMessage(res.error || res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '440px', margin: '0 auto' }}>
      {/* Back Button */}
      <button
        type="button"
        onClick={onBackToLogin}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'transparent',
          border: 'none',
          color: '#64748B',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: '20px',
          padding: 0
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: '#1E293B',
          letterSpacing: '-0.02em',
          marginBottom: '6px'
        }}>
          Reset your password
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
          Enter the email address associated with your account, and we'll send you instructions to reset your password.
        </p>
      </div>

      {/* Error alert */}
      {errorMessage && (
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
          gap: '8px'
        }}>
          <AlertCircle size={17} color="#DC2626" style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Confirmation Message */}
      {statusMessage ? (
        <div style={{
          padding: '20px',
          borderRadius: '14px',
          background: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          color: '#065F46',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={22} color="#10B981" />
            <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>Instructions Sent</span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#047857', margin: 0, lineHeight: 1.5 }}>
            {statusMessage}
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className="btn btn-primary"
            style={{ marginTop: '8px', padding: '10px 16px', fontSize: '0.88rem' }}
          >
            Return to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} noValidate>
          {/* Email input */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '6px'
            }}>
              Registered Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: emailError ? '#EF4444' : '#94A3B8',
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
                  if (emailError) setEmailError(null);
                  if (errorMessage) setErrorMessage(null);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  borderRadius: '12px',
                  border: emailError ? '1.5px solid #EF4444' : '1.5px solid var(--border-medium)',
                  fontSize: '0.92rem',
                  fontFamily: 'var(--font-family)',
                  outline: 'none',
                  backgroundColor: emailError ? '#FEF2F2' : '#FFFFFF'
                }}
              />
            </div>
            {emailError && (
              <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: '4px', fontWeight: 600 }}>
                {emailError}
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
              opacity: isSubmitting ? 0.85 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
            )}
          </button>
        </form>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
