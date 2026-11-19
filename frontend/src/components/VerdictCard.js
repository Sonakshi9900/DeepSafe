import React from 'react';

const VerdictCard = ({ results }) => {
    if (!results) return null;

    const isFake = results.is_likely_deepfake;
    const fakeProb = results.deepfake_probability || 0;
    const realProb = Math.max(0, 1 - fakeProb);
    const confidencePct = results.confidence_percentage 
        ? results.confidence_percentage 
        : ((isFake ? fakeProb : realProb) * 100).toFixed(1);

    const verdictColor = isFake ? '#ef4444' : '#10b981';
    const verdictBg = isFake ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)';
    const verdictBorder = isFake ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)';
    const verdictTitle = isFake ? 'DEEPFAKE (AI-GENERATED)' : 'AUTHENTIC (REAL MEDIA)';

    const primaryReason = results.verdict_summary || (
        isFake
            ? 'Synthetic texture artifacts & neural latent profile identified.'
            : 'Physical optical sensor shot noise & natural photometric consistency verified.'
    );

    return (
        <div className="card verdict-card" style={{
            marginTop: '2rem',
            padding: '2rem 1.5rem',
            borderRadius: '16px',
            border: `2px solid ${verdictBorder}`,
            backgroundColor: verdictBg,
            textAlign: 'center',
            boxShadow: `0 8px 30px ${verdictColor}15`
        }}>
            {/* Status Pill */}
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 1rem',
                borderRadius: '9999px',
                backgroundColor: verdictColor,
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '0.75rem',
                letterSpacing: '0.05em',
                marginBottom: '1rem',
                textTransform: 'uppercase'
            }}>
                {isFake ? '⚠️ AI Manipulation Identified' : '🛡️ Verified Authentic Media'}
            </div>

            {/* Verdict Headline */}
            <h2 style={{
                fontSize: '2.2rem',
                fontWeight: '900',
                color: verdictColor,
                letterSpacing: '-0.02em',
                margin: '0.25rem 0 0.5rem 0'
            }}>
                {verdictTitle}
            </h2>

            {/* Certainty */}
            <p style={{
                fontSize: '1.15rem',
                fontWeight: '700',
                color: '#f8fafc',
                margin: '0 0 0.5rem 0'
            }}>
                Verdict Certainty: <span style={{ color: verdictColor }}>{confidencePct}%</span>
            </p>

            {/* Reason */}
            <p style={{
                fontSize: '0.9rem',
                color: '#cbd5e1',
                maxWidth: '600px',
                margin: '0 auto 1.5rem auto',
                lineHeight: '1.5'
            }}>
                {primaryReason}
            </p>

            {/* Probability Bars */}
            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                textAlign: 'left'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                    <span>Confidence Distribution</span>
                    <span>Ensemble Weight</span>
                </div>

                {/* Real Bar */}
                <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#10b981' }}>Authentic (Real Media)</span>
                        <span style={{ color: '#10b981', fontFamily: 'monospace' }}>{(realProb * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${(realProb * 100).toFixed(1)}%`,
                            height: '100%',
                            backgroundColor: '#10b981',
                            borderRadius: '9999px',
                            transition: 'width 0.6s ease'
                        }} />
                    </div>
                </div>

                {/* Fake Bar */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        <span style={{ color: '#ef4444' }}>Deepfake (AI / Spliced)</span>
                        <span style={{ color: '#ef4444', fontFamily: 'monospace' }}>{(fakeProb * 100).toFixed(1)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#334155', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${(fakeProb * 100).toFixed(1)}%`,
                            height: '100%',
                            backgroundColor: '#ef4444',
                            borderRadius: '9999px',
                            transition: 'width 0.6s ease'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerdictCard;
