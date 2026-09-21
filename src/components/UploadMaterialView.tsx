import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Image,
  Video,
  FileCode,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Bot,
  Layers,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { useStudent } from '../context/StudentContext';

export const UploadMaterialView: React.FC = () => {
  const { setActiveTab, setActiveSubject } = useStudent();
  const [selectedFormat, setSelectedFormat] = useState<'PDF' | 'Notes' | 'Image' | 'YouTube'>('PDF');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(0);

  const topicsFound = [
    {
      title: 'Covalent Bonding in Carbon',
      concepts: 'Tetravalency, Catenaion property, Single, double, and triple bonds.'
    },
    {
      title: 'Properties of Carbon Allotropes',
      concepts: 'Diamond (rigid tetrahedral 3D), Graphite (hexagonal layers), Fullerenes.'
    },
    {
      title: 'Homologous Series',
      concepts: 'Successive difference of -CH2- and 14 u, gradation in physical boiling points.'
    },
    {
      title: 'Functional Groups & IUPAC',
      concepts: 'Alcohol (-OH), Carboxylic Acid (-COOH), Aldehyde (-CHO), Ketone (>C=O).'
    },
    {
      title: 'Chemical Reactions: Combustion & Esterification',
      concepts: 'Oxidation using alkaline KMnO4, addition reactions with Ni catalyst, soap formation.'
    }
  ];

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const step1 = setTimeout(() => setAnalysisProgress(45), 600);
    const step2 = setTimeout(() => setAnalysisProgress(70), 1200);
    const step3 = setTimeout(() => setAnalysisProgress(85), 1800);
    const step4 = setTimeout(() => {
      setAnalysisProgress(100);
      setIsAnalyzing(false);
      setIsAnalyzed(true);
    }, 2400);
  };

  const handleReset = () => {
    setIsAnalyzing(false);
    setIsAnalyzed(false);
    setAnalysisProgress(0);
  };

  return (
    <div style={{
      maxWidth: '1080px',
      margin: '0 auto',
      padding: '32px 32px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header matching Screenshot Panel 4 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4F46E5', textTransform: 'uppercase' }}>
            AI Curriculum Ingestion
          </span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1E293B', marginTop: '2px' }}>
            Upload Learning Material
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.92rem', margin: 0 }}>
            Add your textbook chapter, class notes, or lecture video and let GuruMitra build your adaptive plan.
          </p>
        </div>

        {isAnalyzed && (
          <button onClick={handleReset} className="btn btn-outline" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            <RotateCcw size={14} />
            <span>Upload Another</span>
          </button>
        )}
      </div>

      {!isAnalyzed && !isAnalyzing ? (
        /* PANEL 4: Upload Area */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Drag & Drop Card */}
          <div
            className="card"
            style={{
              padding: '60px 32px',
              border: '2px dashed #C7D2FE',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              gap: '16px',
              cursor: 'pointer'
            }}
            onClick={handleStartAnalysis}
          >
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4F46E5'
            }}>
              <UploadCloud size={36} />
            </div>

            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', marginBottom: '6px' }}>
                Drag & drop your file here
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
                or <span style={{ color: '#4F46E5', fontWeight: 700, textDecoration: 'underline' }}>Browse Files</span> on your computer
              </p>
              <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
                Supports PDF, TXT, Handwritten notes (OCR), and YouTube links
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartAnalysis();
              }}
              className="btn btn-primary"
              style={{ padding: '12px 28px', marginTop: '8px' }}
            >
              <span>Scan & Extract with GuruMitra AI</span>
              <Sparkles size={16} />
            </button>
          </div>

          {/* Format Selector Pills matching screenshot */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'PDF', icon: FileText, label: 'PDF Chapter', color: '#EF4444', bg: '#FEE2E2' },
              { id: 'Notes', icon: FileCode, label: 'Text / Notes', color: '#3B82F6', bg: '#DBEAFE' },
              { id: 'Image', icon: Image, label: 'Handwritten Image', color: '#10B981', bg: '#D1FAE5' },
              { id: 'YouTube', icon: Video, label: 'YouTube Link', color: '#DC2626', bg: '#FEE2E2' },
            ].map((fmt) => {
              const Icon = fmt.icon;
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  onClick={() => setSelectedFormat(fmt.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    backgroundColor: isSelected ? fmt.bg : '#FFFFFF',
                    border: isSelected ? `2px solid ${fmt.color}` : '1px solid var(--border-subtle)',
                    color: isSelected ? fmt.color : '#64748B',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <Icon size={16} color={fmt.color} />
                  <span>{fmt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* PANEL 5: AI Analysis / Topic Extraction State */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Top Analysis Progress Card */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  {isAnalyzing ? 'AI is analyzing your material...' : 'Analysis Complete! Concepts Extracted'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
                  We're extracting key topics, concepts and creating a personalized learning path for you.
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Concept Extraction Progress</span>
                <span style={{ color: '#4F46E5' }}>{analysisProgress}%</span>
              </div>
              <div className="progress-bar-container" style={{ height: '8px' }}>
                <div className="progress-bar-fill" style={{ width: `${analysisProgress}%` }} />
              </div>
            </div>
          </div>

          {/* Split Layout: Checklist + Topics Found (Matching Panel 5 screenshot!) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
            gap: '24px'
          }}>
            {/* Extracting Steps Checklist */}
            <div className="card" style={{ padding: '24px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', marginBottom: '16px' }}>
                Extracting...
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Identifying topics', done: analysisProgress >= 25 },
                  { label: 'Finding key concepts', done: analysisProgress >= 50 },
                  { label: 'Generating summary', done: analysisProgress >= 75 },
                  { label: 'Creating practice questions', done: analysisProgress >= 100 },
                ].map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: step.done ? '#10B981' : '#F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF'
                    }}>
                      {step.done ? <CheckCircle2 size={16} /> : <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#94A3B8' }} />}
                    </div>
                    <span style={{
                      fontSize: '0.88rem',
                      fontWeight: step.done ? 700 : 500,
                      color: step.done ? '#1E293B' : '#94A3B8'
                    }}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topics Found Accordion matching Screenshot Panel 5 */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>
                  Topics Found ({topicsFound.length})
                </h4>
                <span className="badge badge-on-track" style={{ fontSize: '0.65rem' }}>
                  High Quality Scan
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topicsFound.map((topic, i) => {
                  const isExpanded = expandedTopic === i;
                  return (
                    <div
                      key={i}
                      style={{
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        backgroundColor: isExpanded ? '#F8FAFC' : '#FFFFFF'
                      }}
                    >
                      <button
                        onClick={() => setExpandedTopic(isExpanded ? null : i)}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                          {topic.title}
                        </span>
                        <ChevronDown
                          size={16}
                          color="#64748B"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                        />
                      </button>

                      {isExpanded && (
                        <div style={{ padding: '0 16px 14px', fontSize: '0.8rem', color: '#64748B', lineHeight: '1.4' }}>
                          <strong>Sub-concepts: </strong>{topic.concepts}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Mascot Banner (Matching Screenshot Panel 5!) */}
          <div className="card" style={{
            padding: '20px 24px',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
            border: '1.5px solid #C7D2FE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '2rem' }}>🤖</span>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#4F46E5' }}>
                  Your material has been analyzed!
                </div>
                <p style={{ fontSize: '0.82rem', color: '#4338CA', margin: 0 }}>
                  Ready for a personalized adaptive learning experience.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveSubject('Science');
                setActiveTab('adaptive');
              }}
              className="btn btn-primary"
              style={{ padding: '10px 22px' }}
            >
              <span>Start Adaptive Study</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
