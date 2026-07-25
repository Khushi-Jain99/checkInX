import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, CheckCircle2, AlertCircle, RefreshCw, X, Sparkles, Volume2, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { processVoiceAttendance } from '../api';

export default function VoiceAttendanceModal({ subject, onClose, onSuccess }) {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      setError('');
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      console.error('Mic error:', err);
      setError('Could not access microphone. Please upload an audio file instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioBlob(file);
      setAudioUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleProcess = async () => {
    if (!audioBlob) {
      setError('Please record or upload an audio file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await processVoiceAttendance(subject.subject_id, audioBlob);
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
      setError(err.message || 'Voice attendance processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', position: 'relative', background: '#ffffff' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mic color="#0284c7" size={20} strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>AI Voice Attendance</h3>
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

        {results ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0f9ff', border: '2px solid #0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#0284c7" />
            </div>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Voice Attendance Processed!</h4>
            
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '24px', background: '#f8fafc' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>Identified Speakers & Match Scores:</p>
              {results.identified_results && Object.keys(results.identified_results).length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(results.identified_results).map(([sid, score]) => (
                    <div key={sid} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <User size={16} color="#0284c7" /> Student ID: #{sid}
                      </span>
                      <span className="badge badge-cyan" style={{ padding: '4px 10px' }}>
                        {(score * 100).toFixed(1)}% Match
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No registered voice embeddings met similarity threshold (0.65).</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setResults(null); setAudioUrl(null); setAudioBlob(null); }} className="btn-secondary" style={{ height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                <RefreshCw size={16} /> Record Another
              </button>
              <button onClick={onClose} className="btn-primary" style={{ height: '46px', padding: '0 24px', borderRadius: '12px' }}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Audio Recorder Stage */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '36px 24px', textAlign: 'center', marginBottom: '24px' }}>
              {recording ? (
                <div>
                  <div className="pulse-dot" style={{ width: '20px', height: '20px', margin: '0 auto 16px', backgroundColor: '#f43f5e' }}></div>
                  <h4 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Listening / Recording Classroom Audio...</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '24px' }}>Speak student names or attendance numbers clearly</p>
                  
                  <button onClick={stopRecording} className="btn-secondary" style={{ borderColor: '#fecdd3', color: '#be123c', height: '46px' }}>
                    <Square size={16} fill="currentColor" /> Stop Recording
                  </button>
                </div>
              ) : audioUrl ? (
                <div>
                  <Volume2 size={40} color="#0284c7" style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Audio Clip Recorded / Loaded</p>
                  <audio src={audioUrl} controls style={{ width: '100%', maxWidth: '400px', marginBottom: '16px' }} />
                  <div>
                    <button onClick={() => { setAudioUrl(null); setAudioBlob(null); }} className="btn-secondary" style={{ height: '36px', padding: '0 16px', fontSize: '0.8rem', borderRadius: '10px' }}>
                      Re-record / Change File
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <Mic size={48} color="#0284c7" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>Record or Upload Classroom Audio</h4>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '24px' }}>
                    CheckInX voice encoder will split audio segments and match speaker embeddings.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button onClick={startRecording} className="btn-primary" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', height: '46px', padding: '0 22px', borderRadius: '12px' }}>
                      <Mic size={18} strokeWidth={2.2} /> Start Recording
                    </button>
                    <label className="btn-secondary" style={{ cursor: 'pointer', height: '46px', padding: '0 22px', borderRadius: '12px' }}>
                      <Upload size={18} strokeWidth={2} /> Upload WAV File
                      <input type="file" accept="audio/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={onClose} className="btn-secondary" disabled={loading} style={{ height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                Cancel
              </button>
              <button onClick={handleProcess} className="btn-emerald" disabled={loading || !audioBlob} style={{ height: '46px', padding: '0 24px', borderRadius: '12px' }}>
                {loading ? (
                  <>
                    <RefreshCw className="spin" size={18} /> Resemblyzer AI Processing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} strokeWidth={2.2} /> Process Voice Attendance
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
