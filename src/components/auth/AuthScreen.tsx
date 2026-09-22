import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { GraduationCap, Sparkles, BrainCircuit, Target, BookOpen, Bot, Award, CheckCircle2 } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot-password'>('login');

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-page)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Blobs */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(255,255,255,0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Main Split-Screen Container */}
      <div style={{
        display: 'flex',
        flex: 1,
        width: '100%',
        minHeight: '100vh',
        zIndex: 1
      }}>
        {/* Left Panel: Brand Showcase & Pedagogical USP */}
        <div style={{
          flex: '1 1 45%',
          background: 'linear-gradient(145deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          color: '#FFFFFF',
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Decorative Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.4,
            pointerEvents: 'none'
          }} />

          {/* Top: Logo & Title */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #EEF2FF 0%, #C7D2FE 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4F46E5',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
              }}>
                <GraduationCap size={28} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF'
                  }}>
                    GuruMitra
                  </span>
                  <Sparkles size={18} color="#FBBF24" fill="#FBBF24" />
                </div>
                <p style={{
                  fontSize: '0.78rem',
                  color: '#C7D2FE',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: 0
                }}>
                  AI Adaptive Learning System
                </p>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '999px',
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#E0E7FF',
              marginTop: '12px'
            }}>
              <span>Personalized learning powered by AI</span>
            </div>
          </div>

          {/* Center: Inspiring Value Proposition */}
          <div style={{ position: 'relative', zIndex: 2, margin: '40px 0' }}>
            <h1 style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              lineHeight: 1.2,
              marginBottom: '16px',
              color: '#FFFFFF'
            }}>
              Learn at your pace.<br />
              <span style={{
                background: 'linear-gradient(135deg, #FDE047 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Grow with your progress.
              </span>
            </h1>

            <p style={{
              fontSize: '1.02rem',
              color: '#C7D2FE',
              lineHeight: 1.6,
              maxWidth: '460px',
              marginBottom: '32px'
            }}>
              Our intelligent engine adapts every question, diagnostic quiz, and tutor explanation to your unique learning style and knowledge retention.
            </p>

            {/* 3 AI Feature Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '440px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(99, 102, 241, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FDE047'
                }}>
                  <BrainCircuit size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Dynamic Difficulty Adaptation
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                    Automatically adjusts based on live quiz accuracy
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(236, 72, 153, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#F472B6'
                }}>
                  <Bot size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Multi-Subject AI Tutor 24/7
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                    Step-by-step guidance in Science, Math, CS & English
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(6px)'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#34D399'
                }}>
                  <Target size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                    Personalized Learning Path
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>
                    Custom progression dynamically tuned to your mastery
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Product Footer (No team text) */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            paddingTop: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.78rem',
            color: '#CBD5E1'
          }}>
            <span>AI Adaptive Learning Platform</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FDE047' }}>
              <Sparkles size={13} />
              <span>Adaptive AI Engine v2.0</span>
            </span>
          </div>
        </div>

        {/* Right Panel: Authentication Card Container */}
        <div style={{
          flex: '1 1 55%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          overflowY: 'auto'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '44px 40px',
            borderRadius: '24px',
            boxShadow: '0 20px 45px -10px rgba(79, 70, 229, 0.12)',
            border: '1px solid var(--border-subtle)'
          }}>
            {authView === 'login' && (
              <LoginForm
                onSwitchToSignUp={() => setAuthView('signup')}
                onSwitchToForgotPassword={() => setAuthView('forgot-password')}
              />
            )}

            {authView === 'signup' && (
              <SignUpForm
                onSwitchToLogin={() => setAuthView('login')}
              />
            )}

            {authView === 'forgot-password' && (
              <ForgotPasswordModal
                onBackToLogin={() => setAuthView('login')}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
