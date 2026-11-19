import React from 'react';

const UploadDropzone = ({
    selectedFile,
    previewUrl,
    mediaType,
    onFileChange,
    onRemoveFile,
    onLoadSample,
    onLoadDemoVideo
}) => {
    return (
        <div className="upload-container" style={{ marginBottom: '1.5rem' }}>
            {/* Dropzone Card */}
            <div className="card" style={{
                padding: '2rem 1.5rem',
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderColor: selectedFile ? '#3b82f6' : 'rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(30, 41, 59, 0.5)',
                borderRadius: '16px',
                textAlign: 'center',
                transition: 'border-color 0.2s ease'
            }}>
                <input
                    type="file"
                    id="media-file-input"
                    style={{ display: 'none' }}
                    onChange={onFileChange}
                    accept="image/*,video/*"
                />

                {!previewUrl ? (
                    <label
                        htmlFor="media-file-input"
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(59, 130, 246, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1rem',
                            color: '#60a5fa'
                        }}>
                            <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                        </div>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#f8fafc', marginBottom: '0.35rem' }}>
                            Upload image or video for verification
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                            Drag and drop file here, or click to browse (JPG, PNG, WEBP, MP4)
                        </span>
                    </label>
                ) : (
                    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#0f172a' }}>
                        {mediaType === 'video' ? (
                            <video
                                src={previewUrl}
                                controls
                                style={{ width: '100%', maxHeight: '360px', objectFit: 'contain' }}
                            />
                        ) : (
                            <img
                                src={previewUrl}
                                alt="Selected Media"
                                style={{ width: '100%', maxHeight: '360px', objectFit: 'contain' }}
                            />
                        )}
                        <button
                            type="button"
                            onClick={onRemoveFile}
                            title="Remove file"
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(239, 68, 68, 0.9)',
                                color: '#ffffff',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                            }}
                        >
                            &times;
                        </button>
                    </div>
                )}
            </div>

            {/* Benchmark Preset Samples */}
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '500', display: 'block', marginBottom: '0.5rem' }}>
                    Quick Benchmark Test Samples:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                        type="button"
                        onClick={() => onLoadSample('/demo_images/real_sample.jpg', 'real_sample.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                    >
                        📷 Camera Portrait (Real)
                    </button>
                    <button
                        type="button"
                        onClick={() => onLoadSample('/demo_images/fake_sample_faceswap.jpg', 'fake_sample_faceswap.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        🎭 FaceSwap Splicing (Fake)
                    </button>
                    <button
                        type="button"
                        onClick={() => onLoadSample('/demo_images/fake_sample_stylegan.jpg', 'fake_sample_stylegan.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        🤖 StyleGAN Face (Fake)
                    </button>
                    <button
                        type="button"
                        onClick={() => onLoadSample('/demo_images/fake_sample_gan.jpg', 'fake_sample_gan.jpg')}
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                    >
                        🎨 GAN Synthesis (Fake)
                    </button>
                    {onLoadDemoVideo && (
                        <button
                            type="button"
                            onClick={onLoadDemoVideo}
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                            🎬 Demo Video
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadDropzone;
