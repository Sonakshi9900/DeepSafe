import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import UploadDropzone from './components/UploadDropzone';
import AnalysisControls from './components/AnalysisControls';
import VerdictCard from './components/VerdictCard';
import ForensicMetricsTable from './components/ForensicMetricsTable';
import Footer from './components/Footer';
import './App.css';

const API_BASE_URL = window.location.hostname === 'localhost' && window.location.port === '3000'
  ? 'http://localhost:8000'
  : '/api';

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
            setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
        }
    };

    const handleRemoveFile = () => {
        handleClear();
    };

    const handleClear = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResults(null);
        setError(null);
    };

    const handleLoadSample = (path, name) => {
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
            .catch(() => setError(`Failed to load benchmark sample ${name}`));
    };

    const handleLoadDemoVideo = () => {
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
            .catch(() => setError('Failed to load demo video'));
    };

    const handleSubmit = async () => {
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
                throw new Error(errorData.detail || 'Forensic analysis failed');
            }

            const data = await response.json();
            setResults(data);

            // Smooth scroll to verdict on mobile
            if (window.innerWidth < 1024) {
                const verdictElement = document.querySelector('.verdict-card');
                if (verdictElement) {
                    verdictElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (err) {
            setError(err.message || 'An error occurred during media analysis.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar systemHealth={systemHealth} onLogout={onLogout} />

            <main className="container" style={{ flex: '1', maxWidth: '860px', margin: '0 auto', padding: '2rem 1rem' }}>
                {/* Hero Header */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        backgroundColor: 'rgba(99, 102, 241, 0.12)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        color: '#818cf8',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        marginBottom: '0.75rem'
                    }}>
                        <span>Enterprise Forensics Suite</span>
                    </div>

                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        color: '#f8fafc',
                        letterSpacing: '-0.025em',
                        marginBottom: '0.75rem',
                        lineHeight: '1.2'
                    }}>
                        AI Media Authenticity & Deepfake Detection
                    </h1>

                    <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.5' }}>
                        Inspect image and video files for synthetic generative markers, face-swap cutouts, and physical sensor noise consistency.
                    </p>
                </div>

                {/* Upload & Dropzone */}
                <UploadDropzone
                    selectedFile={selectedFile}
                    previewUrl={previewUrl}
                    mediaType={mediaType}
                    onFileChange={handleFileChange}
                    onRemoveFile={handleRemoveFile}
                    onLoadSample={handleLoadSample}
                    onLoadDemoVideo={handleLoadDemoVideo}
                />

                {/* Action Controls: Submit & Clear */}
                <AnalysisControls
                    selectedFile={selectedFile}
                    isAnalyzing={isAnalyzing}
                    onSubmit={handleSubmit}
                    onClear={handleClear}
                />

                {/* Error Banner */}
                {error && (
                    <div style={{
                        margin: '1.5rem 0',
                        padding: '1rem 1.25rem',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#ef4444',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <span>⚠️ {error}</span>
                    </div>
                )}

                {/* Verdict Section */}
                <VerdictCard results={results} />

                {/* Forensic Diagnostic Breakdown Table */}
                <ForensicMetricsTable results={results} />
            </main>

            <Footer />
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
