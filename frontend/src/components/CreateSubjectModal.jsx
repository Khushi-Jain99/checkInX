import React, { useState } from 'react';
import { BookOpen, X, PlusCircle, AlertCircle } from 'lucide-react';
import { createSubject } from '../api';

export default function CreateSubjectModal({ teacherId, onClose, onSuccess }) {
  const [subjectCode, setSubjectCode] = useState('');
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subjectCode || !name || !section) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createSubject(subjectCode.trim().toUpperCase(), name.trim(), section.trim().toUpperCase(), teacherId);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '32px', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen color="#2563eb" size={20} strokeWidth={2} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Create New Subject</h3>
          </div>
          <button onClick={onClose} className="btn-secondary" style={{ width: '36px', height: '36px', padding: 0, borderRadius: '50%', justifyContent: 'center' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', marginBottom: '20px', color: '#be123c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Subject Code (e.g. CS101, MATH202)
            </label>
            <input 
              type="text"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              placeholder="e.g. CS101"
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Course Title
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Machine Learning & AI"
              className="input-field"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
              Section / Branch
            </label>
            <input 
              type="text"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              placeholder="e.g. CSE-A"
              className="input-field"
              required
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="button" onClick={onClose} className="btn-secondary" disabled={loading} style={{ height: '46px', padding: '0 20px', borderRadius: '12px' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '46px', padding: '0 24px', borderRadius: '12px' }}>
              <PlusCircle size={18} strokeWidth={2.2} /> Create Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
