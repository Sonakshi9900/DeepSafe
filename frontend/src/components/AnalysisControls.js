import React from 'react';

const AnalysisControls = ({
    selectedFile,
    isAnalyzing,
    onSubmit,
    onClear
}) => {
    return (
        <div style={{
            display: 'flex',
            gap: '0.75rem',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1.5rem 0'
        }}>
            <button
                type="button"
                onClick={onSubmit}
                disabled={!selectedFile || isAnalyzing}
                className="btn btn-primary"
                style={{
                    flex: '2',
                    maxWidth: '240px',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    borderRadius: '10px',
                    opacity: (!selectedFile || isAnalyzing) ? 0.5 : 1,
                    cursor: (!selectedFile || isAnalyzing) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                }}
            >
                {isAnalyzing ? (
                    <>
                        <span className="spinner" style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid rgba(255,255,255,0.3)',
                            borderTopColor: '#ffffff',
                            borderRadius: '50%',
                            display: 'inline-block',
                            animation: 'spin 0.8s linear infinite'
                        }} />
                        <span>Analyzing...</span>
                    </>
                ) : (
                    <>
                        <span>Submit</span>
                    </>
                )}
            </button>

            <button
                type="button"
                onClick={onClear}
                disabled={!selectedFile && !isAnalyzing}
                className="btn btn-secondary"
                style={{
                    flex: '1',
                    maxWidth: '120px',
                    padding: '0.75rem 1.25rem',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    borderRadius: '10px',
                    borderColor: 'rgba(255, 255, 255, 0.15)',
                    opacity: (!selectedFile) ? 0.4 : 1,
                    cursor: (!selectedFile) ? 'not-allowed' : 'pointer'
                }}
            >
                Clear
            </button>
        </div>
    );
};

export default AnalysisControls;
