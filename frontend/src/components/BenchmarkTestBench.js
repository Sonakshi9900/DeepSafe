import React from 'react';

const BenchmarkTestBench = ({ onLoadSample, onLoadDemoVideo }) => {
    return (
        <div className="card benchmark-card" style={{
            marginTop: '2.5rem',
            padding: '1.5rem',
            borderRadius: '16px',
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '1rem'
            }}>
                <div>
                    <h3 style={{
                        fontSize: '0.95rem',
                        fontWeight: '700',
                        color: '#f8fafc',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>⚡ Quick 1-Click Benchmark Test Bench</span>
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0 0 0' }}>
                        Select any reference sample to immediately verify against the forensic engine
                    </p>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem'
            }}>
                <button
                    type="button"
                    onClick={() => onLoadSample('/demo_images/real_sample.jpg', 'real_sample.jpg')}
                    className="btn btn-secondary"
                    style={{
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        borderColor: 'rgba(16, 185, 129, 0.35)',
                        backgroundColor: 'rgba(16, 185, 129, 0.06)'
                    }}
                >
                    <span style={{ fontSize: '1.1rem' }}>📷</span>
                    <span style={{ color: '#10b981', fontWeight: '700' }}>Camera Portrait</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Verified Real</span>
                </button>

                <button
                    type="button"
                    onClick={() => onLoadSample('/demo_images/fake_sample_faceswap.jpg', 'fake_sample_faceswap.jpg')}
                    className="btn btn-secondary"
                    style={{
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        borderColor: 'rgba(239, 68, 68, 0.35)',
                        backgroundColor: 'rgba(239, 68, 68, 0.06)'
                    }}
                >
                    <span style={{ fontSize: '1.1rem' }}>🎭</span>
                    <span style={{ color: '#ef4444', fontWeight: '700' }}>FaceSwap Mask</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>AI Splicing</span>
                </button>

                <button
                    type="button"
                    onClick={() => onLoadSample('/demo_images/fake_sample_stylegan.jpg', 'fake_sample_stylegan.jpg')}
                    className="btn btn-secondary"
                    style={{
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        borderColor: 'rgba(239, 68, 68, 0.35)',
                        backgroundColor: 'rgba(239, 68, 68, 0.06)'
                    }}
                >
                    <span style={{ fontSize: '1.1rem' }}>🤖</span>
                    <span style={{ color: '#ef4444', fontWeight: '700' }}>StyleGAN Face</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Neural Latent</span>
                </button>

                <button
                    type="button"
                    onClick={() => onLoadSample('/demo_images/fake_sample_gan.jpg', 'fake_sample_gan.jpg')}
                    className="btn btn-secondary"
                    style={{
                        padding: '0.6rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.25rem',
                        borderColor: 'rgba(239, 68, 68, 0.35)',
                        backgroundColor: 'rgba(239, 68, 68, 0.06)'
                    }}
                >
                    <span style={{ fontSize: '1.1rem' }}>🎨</span>
                    <span style={{ color: '#ef4444', fontWeight: '700' }}>GAN Synthesis</span>
                    <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Low Sensor Grain</span>
                </button>

                {onLoadDemoVideo && (
                    <button
                        type="button"
                        onClick={onLoadDemoVideo}
                        className="btn btn-secondary"
                        style={{
                            padding: '0.6rem 0.75rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.25rem'
                        }}
                    >
                        <span style={{ fontSize: '1.1rem' }}>🎬</span>
                        <span style={{ color: '#f8fafc', fontWeight: '700' }}>Demo Video</span>
                        <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Video Forensic</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default BenchmarkTestBench;
