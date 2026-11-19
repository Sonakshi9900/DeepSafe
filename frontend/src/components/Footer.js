import React from 'react';

const Footer = () => {
    return (
        <footer style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: '#64748b',
            fontSize: '0.85rem',
            marginTop: '3.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
                &copy; {new Date().getFullYear()} <strong style={{ color: '#94a3b8' }}>Sonakshi Kumari</strong>. All Rights Reserved. DeepSafe Platform.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.8rem' }}>
                <a
                    href="https://github.com/Sonakshi9900/DeepSafe"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#94a3b8', textDecoration: 'none' }}
                >
                    GitHub Repository
                </a>
                <span>&bull;</span>
                <a
                    href="https://huggingface.co/spaces/Sonakshi9900/Deepsafe"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#94a3b8', textDecoration: 'none' }}
                >
                    Hugging Face Space
                </a>
            </div>
        </footer>
    );
};

export default Footer;
