import React from 'react';
import {
  CheckCircle2,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  ArrowDown,
  ArrowRight,
  Target,
  Award
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const LearningPathView: React.FC = () => {
  const { learningPath, student, setActiveTab, setActiveSubject, setTopicContext } = useStudent();

  const handleLaunchTopic = (node: any) => {
    setTopicContext(node.subject, node.title, node.title);
    setActiveTab('adaptive');
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '32px 24px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header */}
      <div>
        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
          Visual Mastery Graph
        </span>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
          Personalized Learning Path
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
          This path dynamically branches and inserts revision checkpoints based on your diagnostic assessment scores.
        </p>
      </div>

      {/* Dynamic Status Legend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 20px',
        borderRadius: '14px',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-subtle)',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#166534', fontWeight: 600 }}>
          <CheckCircle2 size={16} color="#10B981" />
          <span>Completed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>
          <Play size={16} color="#3B82F6" />
          <span>Current In Progress</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#991B1B', fontWeight: 600 }}>
          <RotateCcw size={16} color="#EF4444" />
          <span>Remedial Revision</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
          <Lock size={16} color="#94A3B8" />
          <span>Locked</span>
        </div>
      </div>

      {/* Vertical Stepper Nodes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', position: 'relative' }}>
        {learningPath.map((node, index) => {
          const isCompleted = node.status === 'completed';
          const isCurrent = node.status === 'current';
          const isRevision = node.status === 'revision';
          const isLocked = node.status === 'locked';

          const borderColor = isCompleted
            ? '#10B981'
            : isCurrent
            ? '#4F46E5'
            : isRevision
            ? '#EF4444'
            : '#CBD5E1';

          const bgColor = isCompleted
            ? '#F0FDF4'
            : isCurrent
            ? '#EEF2FF'
            : isRevision
            ? '#FEF2F2'
            : '#F8FAFC';

          return (
            <React.Fragment key={node.id}>
              <div
                className="card"
                style={{
                  padding: '24px',
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  position: 'relative',
                  opacity: isLocked ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  {/* Step Number Circle */}
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#10B981' : isCurrent ? '#4F46E5' : isRevision ? '#EF4444' : '#CBD5E1',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0
                  }}>
                    {isCompleted ? <CheckCircle2 size={22} /> : isLocked ? <Lock size={20} /> : isRevision ? <RotateCcw size={20} /> : node.stepNumber}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                        Step {node.stepNumber} • {node.subject}
                      </span>
                      <span className={`badge ${
                        isCompleted ? 'badge-on-track' : isCurrent ? 'badge-info' : isRevision ? 'badge-high-priority' : 'badge-practice'
                      }`} style={{ fontSize: '0.68rem' }}>
                        {node.status.toUpperCase()}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1E293B', marginBottom: '4px' }}>
                      {node.title}
                    </h3>

                    <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
                      {node.description}
                    </p>
                  </div>
                </div>

                {/* Node Action */}
                <div>
                  {!isLocked ? (
                    <button
                      onClick={() => handleLaunchTopic(node)}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 18px',
                        fontSize: '0.85rem',
                        background: isRevision
                          ? 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
                          : undefined
                      }}
                    >
                      <span>{isRevision ? 'Start Revision' : isCompleted ? 'Review' : 'Continue'}</span>
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '0.8rem', fontWeight: 600 }}>
                      <Lock size={14} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Connector Down Arrow between nodes */}
              {index < learningPath.length - 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '8px 0',
                  color: '#94A3B8'
                }}>
                  <ArrowDown size={22} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
