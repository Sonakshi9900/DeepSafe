import React from 'react';

const Navbar = ({ systemHealth, onLogout }) => {
    const isHealthy = systemHealth?.overall_api_status === 'healthy';

    return (
        <header className="navbar-header" style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '38px',
                    height: '38px',
                    background: 'linear-gradient(135deg, #2563eb, #6366f1)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    color: '#ffffff',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)'
                }}>
                    DS
                </div>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#f8fafc' }}>
                            DeepSafe
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.3)'
                        }}>
                            v2.5
                        </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>
                        Media Authenticity & Forensics
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: isHealthy ? '#10b981' : '#f59e0b',
                        boxShadow: `0 0 8px ${isHealthy ? '#10b981' : '#f59e0b'}`
                    }} />
                    <span style={{ color: isHealthy ? '#10b981' : '#f59e0b', fontWeight: '600' }}>
                        {isHealthy ? 'System Ready' : 'Connecting'}
                    </span>
                </div>

                {onLogout && (
                    <button
                        onClick={onLogout}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </header>
    );
};

export default Navbar;
