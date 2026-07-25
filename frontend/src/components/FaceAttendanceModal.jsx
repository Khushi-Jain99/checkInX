import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, RefreshCw, X, Sparkles, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { processFaceAttendance } from '../api';

export default function FaceAttendanceModal({ subject, onClose, onSuccess }) {
  const [mode, setMode] = useState('camera'); // 'camera' | 'upload'
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageBlob, setImageBlob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Start webcam stream
  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [mode]);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('Could not access camera. Please check permissions or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      setImageBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.95);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageBlob(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleProcess = async () => {
    if (!imageBlob) {
      setError('Please capture or upload a class photo first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await processFaceAttendance(subject.subject_id, imageBlob);
      setResults(res);

      if (res.present_student_ids && res.present_student_ids.length > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Face recognition failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '32px', position: 'relative', background: '#ffffff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera color="#2563eb" size={20} strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>AI Face Attendance</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              Subject: <strong style={{ color: '#0f172a' }}>{subject.name} ({subject.subject_code})</strong>
            </p>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', marginBottom: '20px', color: '#be123c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Results Screen */}
        {results ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#10b981" />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Attendance Logged Successfully!</h4>
            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
              Detected <strong>{results.detected_faces_count}</strong> face(s) in classroom photo.
            </p>

            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '24px', background: '#f8fafc' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>Presents Marked (Student IDs):</p>
              {results.present_student_ids && results.present_student_ids.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {results.present_student_ids.map(id => (
                    <span key={id} className="badge badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                      <User size={14} /> Student ID: #{id}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No registered student faces matched similarity threshold.</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setResults(null); setPreviewUrl(null); setImageBlob(null); startCamera(); }} className="btn-secondary" style={{ height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                <RefreshCw size={16} /> Scan Another
              </button>
              <button onClick={onClose} className="btn-primary" style={{ height: '46px', padding: '0 24px', borderRadius: '12px' }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Tab Selector */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', background: '#f1f5f9', padding: '4px', borderRadius: '14px' }}>
              <button
                onClick={() => { setMode('camera'); setPreviewUrl(null); setImageBlob(null); }}
                className="btn-secondary"
                style={{
                  flex: 1,
                  height: '42px',
                  padding: 0,
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  background: mode === 'camera' ? '#ffffff' : 'transparent',
                  borderColor: mode === 'camera' ? '#e2e8f0' : 'transparent',
                  color: mode === 'camera' ? '#2563eb' : '#64748b',
                  boxShadow: mode === 'camera' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <Camera size={16} strokeWidth={2} /> Live Webcam
              </button>
              <button
                onClick={() => { setMode('upload'); setPreviewUrl(null); setImageBlob(null); stopCamera(); }}
                className="btn-secondary"
                style={{
                  flex: 1,
                  height: '42px',
                  padding: 0,
                  fontSize: '0.88rem',
                  borderRadius: '10px',
                  background: mode === 'upload' ? '#ffffff' : 'transparent',
                  borderColor: mode === 'upload' ? '#e2e8f0' : 'transparent',
                  color: mode === 'upload' ? '#2563eb' : '#64748b',
                  boxShadow: mode === 'upload' ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <Upload size={16} strokeWidth={2} /> Upload Image
              </button>
            </div>

            {/* Viewfinder / Preview */}
            <div style={{ position: 'relative', width: '100%', height: '320px', borderRadius: '16px', overflow: 'hidden', background: '#0f172a', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              {previewUrl ? (
                <img src={previewUrl} alt="Classroom snapshot" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : mode === 'camera' ? (
                <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <label style={{ cursor: 'pointer', textAlign: 'center', padding: '32px' }}>
                  <Upload size={44} color="#2563eb" style={{ marginBottom: '12px' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>Click to select class photo</p>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Supports JPG, PNG (Contains multiple student faces)</p>
                  <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              )}

              {/* Camera Controls Overlay */}
              {mode === 'camera' && !previewUrl && (
                <button
                  onClick={captureSnapshot}
                  className="btn-primary"
                  style={{ position: 'absolute', bottom: '20px', borderRadius: '30px', padding: '0 24px', height: '46px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                >
                  <Camera size={18} strokeWidth={2.2} /> Take Classroom Photo
                </button>
              )}
            </div>

            {previewUrl && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}>✓ Image Ready for AI Analysis</span>
                <button onClick={() => { setPreviewUrl(null); setImageBlob(null); if (mode==='camera') startCamera(); }} className="btn-secondary" style={{ height: '34px', padding: '0 14px', fontSize: '0.78rem', borderRadius: '8px' }}>
                  Retake Photo
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary" disabled={loading} style={{ height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                Cancel
              </button>
              <button onClick={handleProcess} className="btn-emerald" disabled={loading || !imageBlob} style={{ height: '46px', padding: '0 24px', borderRadius: '12px' }}>
                {loading ? (
                  <>
                    <RefreshCw className="spin" size={18} /> Running dlib AI...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} strokeWidth={2.2} /> Run Face Recognition
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
