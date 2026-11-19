import React from 'react';

const ForensicMetricsTable = ({ results }) => {
    if (!results || !results.model_results) return null;

    const models = results.model_results;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            {/* Forensic Inspection Breakdown */}
            <div className="card" style={{
                padding: '1.25rem',
                borderRadius: '14px',
                backgroundColor: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                <h3 style={{
                    fontSize: '0.95rem',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <span>🔬 Forensic Model Inspection Breakdown</span>
                </h3>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '0.85rem', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                                <th style={{ padding: '0.5rem 0.75rem', fontWeight: '600' }}>Detection Service</th>
                                <th style={{ padding: '0.5rem 0.75rem', fontWeight: '600' }}>Model Assessment</th>
                                <th style={{ padding: '0.5rem 0.75rem', fontWeight: '600' }}>Certainty</th>
                                <th style={{ padding: '0.5rem 0.75rem', fontWeight: '600', textAlign: 'right' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(models).map(([modelKey, m]) => {
                                const mFake = m.prediction === 1 || m.probability >= 0.5;
                                const mProb = m.probability || 0;
                                const mCert = ((mFake ? mProb : (1 - mProb)) * 100).toFixed(1);
                                const modelLabel = modelKey.replace(/_/g, ' ').toUpperCase();

                                return (
                                    <tr key={modelKey} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                        <td style={{ padding: '0.6rem 0.75rem', fontWeight: '600', color: '#f1f5f9' }}>
                                            {modelLabel}
                                        </td>
                                        <td style={{ padding: '0.6rem 0.75rem', color: '#94a3b8' }}>
                                            {m.primary_reason || (mFake ? 'Synthetic markers identified' : 'Authentic photographic profile')}
                                        </td>
                                        <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: '#e2e8f0' }}>
                                            {mCert}%
                                        </td>
                                        <td style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                fontWeight: '700',
                                                padding: '2px 8px',
                                                borderRadius: '6px',
                                                backgroundColor: mFake ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                                color: mFake ? '#ef4444' : '#10b981',
                                                border: `1px solid ${mFake ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                                            }}>
                                                {mFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ForensicMetricsTable;
