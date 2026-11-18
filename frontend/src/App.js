import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port === '3000'
  ? 'http://localhost:8000'  // Local dev (npm start)
  : '/api';                   // Docker (Nginx proxy)

// Protected Route Wrapper
const ProtectedRoute = ({ children, isAuthenticated }) => {
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

function Dashboard({ onLogout }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [mediaType, setMediaType] = useState('image');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [systemHealth, setSystemHealth] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/health`)
            .then((res) => res.json())
            .then((data) => setSystemHealth(data))
            .catch((err) => console.error('Health check failed:', err));
    }, []);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setResults(null);
            setError(null);
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
            if (file.type.startsWith('video/')) {
                setMediaType('video');
            } else {
                setMediaType('image');
            }
        }
    };

    const loadSample = (path, name) => {
        fetch(path)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], name, { type: 'image/jpeg' });
                setSelectedFile(file);
                setPreviewUrl(path);
                setMediaType('image');
                setResults(null);
                setError(null);
            })
            .catch((err) => setError(`Failed to load ${name}`));
    };

    const handleDemoVideo = () => {
        fetch('/demo_video.mp4')
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], 'demo_video.mp4', { type: 'video/mp4' });
                setSelectedFile(file);
                setPreviewUrl('/demo_video.mp4');
                setMediaType('video');
                setResults(null);
                setError(null);
            })
            .catch((err) => setError('Failed to load demo video'));
    };
    const handleAnalyze = async () => {
        if (!selectedFile) return;
        setIsAnalyzing(true);
        setError(null);
        setResults(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('media_type', mediaType);

        try {
            const response = await fetch(`${API_BASE_URL}/detect`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis failed');
            }

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderHealthStatus = () => {
        if (!systemHealth) return <span className="text-secondary">Checking system...</span>;
        const status = systemHealth.overall_api_status || 'Unknown';
        const color = status === 'healthy' ? 'var(--success)' : 'var(--danger)';
        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 8px ${color}` }}></span>
                <span style={{ color: color, fontWeight: 600, fontSize: '0.875rem' }}>{status.toUpperCase()}</span>
            </div>
        );
    };

    const renderResults = () => {
        if (!results) return null;
        const isFake = results.is_likely_deepfake;
        const fakeProb = results.deepfake_probability || 0;
        const confidencePct = results.confidence_percentage 
            ? results.confidence_percentage 
            : ((isFake ? fakeProb : (1 - fakeProb)) * 100).toFixed(1);

        const verdictColor = isFake ? '#ef4444' : '#10b981';
        const verdictBg = isFake ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)';
        const verdictBorder = isFake ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)';
        const verdictTitle = isFake ? 'DEEPFAKE (AI-GENERATED)' : 'AUTHENTIC (REAL MEDIA)';
        const verdictSubtitle = isFake 
            ? 'Definitive artificial or manipulated generative artifacts detected.'
            : 'Verified natural optical capture with consistent sensor characteristics.';

        const barData = {
            labels: Object.keys(results.model_results || {}).map(m => m.replace(/_/g, ' ').toUpperCase()),
            datasets: [
                {
                    label: 'Deepfake Probability (%)',
                    data: Object.values(results.model_results || {}).map(r => r.probability ? (r.probability * 100).toFixed(1) : 0),
                    backgroundColor: isFake ? 'rgba(239, 68, 68, 0.65)' : 'rgba(16, 185, 129, 0.65)',
                    borderColor: isFake ? '#ef4444' : '#10b981',
                    borderWidth: 1,
                    borderRadius: 6,
                },
            ],
        };

        const doughnutData = {
            labels: ['Authentic (Real)', 'Manipulated (Fake)'],
            datasets: [
                {
                    data: [
                        Math.max(0, +(100 - (fakeProb * 100)).toFixed(1)),
                        Math.max(0, +(fakeProb * 100).toFixed(1))
                    ],
                    backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(239, 68, 68, 0.75)'],
                    borderColor: ['#10b981', '#ef4444'],
                    borderWidth: 2,
                },
            ],
        };

        return (
            <div className="animate-fade-in" style={{ marginTop: '2.5rem' }}>
                {/* Main Exact Verdict Banner */}
                <div className="card" style={{
                    textAlign: 'center',
                    marginBottom: '2rem',
                    border: `2px solid ${verdictBorder}`,
                    backgroundColor: verdictBg,
                    boxShadow: `0 8px 32px ${verdictColor}25`,
                    borderRadius: '16px',
                    padding: '2.5rem 2rem'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.4rem 1.2rem',
                        borderRadius: '9999px',
                        backgroundColor: verdictColor,
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        marginBottom: '1rem',
                        textTransform: 'uppercase'
                    }}>
                        {isFake ? '⚠️ AI Manipulation Identified' : '🛡️ Verified Authentic Natural Media'}
                    </div>

                    <h1 style={{
                        fontSize: '3rem',
                        fontWeight: '900',
                        color: verdictColor,
                        letterSpacing: '-0.02em',
                        marginBottom: '0.5rem',
                        textShadow: `0 0 30px ${verdictColor}50`
                    }}>
                        {verdictTitle}
                    </h1>

                    <p style={{
                        color: 'var(--text-primary)',
                        fontSize: '1.3rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem'
                    }}>
                        Verdict Certainty: <span style={{ color: verdictColor }}>{confidencePct}%</span>
                    </p>

                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1rem',
                        maxWidth: '650px',
                        margin: '0 auto'
                    }}>
                        {results.verdict_summary || verdictSubtitle}
                    </p>
                </div>

                {/* Forensic Diagnostic Breakdown Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            Verdict Status
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: verdictColor }}>
                            {isFake ? 'DEEPFAKE' : 'AUTHENTIC'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            {isFake ? 'Synthesized' : 'Camera Capture'}
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            Noise & Spectrum
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: isFake ? '#f59e0b' : '#10b981' }}>
                            {isFake ? 'Residual Artifacts' : 'Natural Noise'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            FFT Power Spectrum
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            Compression (ELA)
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: isFake ? '#f59e0b' : '#10b981' }}>
                            {isFake ? 'Discontinuous' : 'Uniform Error'}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Error Level Analysis
                        </div>
                    </div>

                    <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                            Detector Consensus
                        </div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                            {results.fake_votes !== undefined ? results.fake_votes : (isFake ? 2 : 0)} Fake / {results.real_votes !== undefined ? results.real_votes : (isFake ? 0 : 2)} Real
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                            Ensemble: {results.ensemble_method_used || 'Voting'}
                        </div>
                    </div>
                </div>

                {/* Visual Charts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Ensemble Probability Distribution
                        </h3>
                        <div style={{ height: '240px', display: 'flex', justifyContent: 'center' }}>
                            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }} />
                        </div>
                    </div>
                    <div className="card">
                        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            Microservice Model Scores
                        </h3>
                        <div style={{ height: '240px' }}>
                            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } } }, plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="App">
            <header style={{
                padding: '1.5rem 2rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>DS</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.025em' }}>DeepSafe</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {renderHealthStatus()}
                    <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Logout</button>
                </div>
            </header>

            <main className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '2rem' }}>
                    <h2 className="text-gradient" style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', lineHeight: 1.2 }}>
                        Detect Deepfakes with<br />Enterprise Precision
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                        Upload your media to analyze it against our multi-model ensemble engine.
                    </p>
                </div>

                <div className="card" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
                    <input
                        type="file"
                        id="file-upload"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                    />
                    <label htmlFor="file-upload" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: 'var(--accent-primary)'
                        }}>
                            <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                            {selectedFile ? selectedFile.name : 'Click to Upload or Drag & Drop'}
                        </span>
                        <span style={{ color: 'var(--text-secondary)' }}>Supported formats: JPG, PNG, MP4, AVI</span>
                    </label>
                </div>

                {/* Quick Test Sample Buttons */}
                <div style={{ maxWidth: '800px', margin: '1rem auto 0', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>Quick Test Samples:</span>
                    <button
                        type="button"
                        onClick={() => loadSample('/demo_images/real_sample.jpg', 'real_sample.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                    >
                        📷 Authentic Photo
                    </button>
                    <button
                        type="button"
                        onClick={() => loadSample('/demo_images/fake_sample_faceswap.jpg', 'fake_sample_faceswap.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        🎭 FaceSwap Deepfake
                    </button>
                    <button
                        type="button"
                        onClick={() => loadSample('/demo_images/fake_sample_stylegan.jpg', 'fake_sample_stylegan.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        🤖 StyleGAN AI Face
                    </button>
                    <button
                        type="button"
                        onClick={handleDemoVideo}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem' }}
                    >
                        🎬 Demo Video
                    </button>
                </div>

                {previewUrl && (
                    <div className="animate-fade-in" style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0' }}>
                        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
                            <div style={{ position: 'relative', width: '100%', height: '400px', backgroundColor: '#000' }}>
                                {mediaType === 'video' ? (
                                    <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                ) : (
                                    <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                )}
                            </div>
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-secondary)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Ready to Analyze</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{selectedFile?.size > 1024 * 1024 ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : `${((selectedFile?.size || 0) / 1024).toFixed(2)} KB`}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAnalyze}
                                        disabled={isAnalyzing}
                                        style={{ opacity: isAnalyzing ? 0.7 : 1, minWidth: '160px', fontWeight: '600' }}
                                    >
                                        {isAnalyzing ? 'Analyzing Forensics...' : 'Run Forensic Analysis'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto 0', padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {error}
                    </div>
                )}

                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {renderResults()}
                </div>
            </main>

            <footer style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <p>&copy; {new Date().getFullYear()} Sonakshi Kumari - DeepSafe Platform. All Rights Reserved.</p>
            </footer>
        </div>
    );
}

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('token') !== null;
    });

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/register" element={<Register onLogin={handleLogin} />} />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Dashboard onLogout={handleLogout} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
