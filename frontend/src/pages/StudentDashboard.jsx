import React, { useState, useEffect } from 'react';
import { BookOpen, PlusCircle, CheckCircle, Clock, Camera, Mic, UserCheck, Sparkles, AlertCircle, RefreshCw, Layers, Award, Check, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { getStudentSubjects, getStudentAttendance, enrollStudent, getAllStudents, registerStudentFull } from '../api';

export default function StudentDashboard({ student, activeTab, onSelectStudentProfile }) {
  const [selectedStudentId, setSelectedStudentId] = useState(student?.student_id || 1);
  const [studentsList, setStudentsList] = useState([]);
  const [enrolledSubjects, setEnrolledSubjects] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join code form state
  const [joinCode, setJoinCode] = useState('');
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinMsg, setJoinMsg] = useState({ type: '', text: '' });

  // AI Profile Enrollment State
  const [profileName, setProfileName] = useState('');
  const [faceFile, setFaceFile] = useState(null);
  const [facePreview, setFacePreview] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');

  useEffect(() => {
    loadStudentsList();
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      loadStudentData(selectedStudentId);
    }
  }, [selectedStudentId]);

  const loadStudentsList = async () => {
    try {
      const res = await getAllStudents();
      if (res.success && res.students.length > 0) {
        setStudentsList(res.students);
        if (!student?.student_id) {
          setSelectedStudentId(res.students[0].student_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadStudentData = async (sid) => {
    setLoading(true);
    try {
      const [subsRes, attRes] = await Promise.all([
        getStudentSubjects(sid),
        getStudentAttendance(sid)
      ]);

      if (subsRes.success) setEnrolledSubjects(subsRes.subjects || []);
      if (attRes.success) setAttendanceLogs(attRes.attendance || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinSubject = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    setJoinLoading(true);
    setJoinMsg({ type: '', text: '' });

    try {
      const res = await enrollStudent(selectedStudentId, parseInt(joinCode) || 1);
      setJoinMsg({ type: 'success', text: `Successfully enrolled in class!` });
      setJoinCode('');
      loadStudentData(selectedStudentId);
    } catch (err) {
      setJoinMsg({ type: 'error', text: 'Enrollment failed. Please check Join Code.' });
    } finally {
      setJoinLoading(false);
    }
  };

  const handleFaceChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFaceFile(file);
      setFacePreview(URL.createObjectURL(file));
    }
  };

  const handleRegisterProfile = async (e) => {
    e.preventDefault();
    if (!profileName) return;
    setProfileLoading(true);
    setProfileSuccess('');

    try {
      const res = await registerStudentFull(profileName, faceFile, voiceFile);
      if (res.success) {
        setProfileSuccess(`Student profile "${profileName}" created and AI model trained!`);
        setProfileName('');
        setFaceFile(null);
        setFacePreview(null);
        setVoiceFile(null);
        loadStudentsList();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileLoading(false);
    }
  };

  const currentStudentObj = studentsList.find(s => s.student_id === parseInt(selectedStudentId));

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>
      
      {/* Student Profile Switcher Header */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '36px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', background: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck color="#0284c7" size={24} strokeWidth={2} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              Student Portal {currentStudentObj ? `- ${currentStudentObj.name}` : ''}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Viewing attendance history, enrolled courses & AI profile</p>
          </div>
        </div>

        {studentsList.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 700 }}>Select Student Profile:</label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="input-field"
              style={{ width: 'auto', minWidth: '220px', height: '42px', padding: '0 14px', borderRadius: '12px', fontWeight: 600 }}
            >
              {studentsList.map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} (ID: #{s.student_id})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {activeTab === 'student_profile' ? (
        /* AI Profile Training Page */
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '680px', margin: '0 auto', background: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Sparkles color="#2563eb" size={26} strokeWidth={2} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Register Student AI Profile</h2>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '28px', lineHeight: 1.6 }}>
            Upload facial photo and voice samples so CheckInX AI can automatically recognize you during classroom attendance scans!
          </p>

          {profileSuccess && (
            <div style={{ padding: '14px 18px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', marginBottom: '24px', color: '#047857', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600 }}>
              <CheckCircle size={20} strokeWidth={2.2} />
              <span>{profileSuccess}</span>
            </div>
          )}

          <form onSubmit={handleRegisterProfile} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                Full Student Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                className="input-field"
                required
              />
            </div>

            {/* Face Image Upload Card */}
            <div className="glass-panel" style={{ padding: '20px', background: '#f8fafc' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                Face Photo Sample (dlib 128-d Vector Training)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <label className="btn-secondary" style={{ cursor: 'pointer', height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                  <Camera size={18} strokeWidth={2} /> Upload Face Photo
                  <input type="file" accept="image/*" onChange={handleFaceChange} style={{ display: 'none' }} />
                </label>
                {facePreview && (
                  <img src={facePreview} alt="Face preview" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }} />
                )}
              </div>
            </div>

            {/* Voice Sample Upload Card */}
            <div className="glass-panel" style={{ padding: '20px', background: '#f8fafc' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '12px' }}>
                Voice Audio Sample (Resemblyzer Voice Embedding)
              </label>
              <label className="btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', height: '46px', padding: '0 20px', borderRadius: '12px' }}>
                <Mic size={18} strokeWidth={2} /> Upload Voice Sample Audio
                <input type="file" accept="audio/*" onChange={(e) => setVoiceFile(e.target.files[0])} style={{ display: 'none' }} />
              </label>
              {voiceFile && <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginLeft: '14px' }}>✓ {voiceFile.name}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={profileLoading} style={{ marginTop: '8px' }}>
              {profileLoading ? (
                <>
                  <RefreshCw className="spin" size={18} /> Training AI Model...
                </>
              ) : (
                <>
                  <Sparkles size={18} strokeWidth={2.2} /> Save & Train Student AI Profile
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Enrolled Classes & Attendance Timeline */
        <div>
          
          {/* Join Class Banner */}
          <div className="glass-panel" style={{ padding: '28px 32px', marginBottom: '36px', background: '#ffffff' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                  Join New Course / Class
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
                  Enter the Join Code provided by your teacher to auto-enroll in a subject.
                </p>
              </div>

              <form onSubmit={handleJoinSubject} style={{ display: 'flex', gap: '10px', minWidth: '320px' }}>
                <input
                  type="text"
                  placeholder="Enter Join Code (e.g. CS101)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="input-field"
                  style={{ flex: 1, height: '48px', borderRadius: '12px' }}
                />
                <button type="submit" className="btn-primary" disabled={joinLoading} style={{ height: '48px', padding: '0 24px', borderRadius: '12px' }}>
                  <PlusCircle size={18} strokeWidth={2.2} /> Join
                </button>
              </form>
            </div>

            {joinMsg.text && (
              <p style={{ marginTop: '14px', fontSize: '0.88rem', fontWeight: 700, color: joinMsg.type === 'success' ? '#047857' : '#be123c' }}>
                {joinMsg.text}
              </p>
            )}
          </div>

          {/* Stats Summary Widgets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={24} color="#2563eb" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enrolled Courses</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{enrolledSubjects.length}</h3>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: '#ecfdf5', border: '1px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={24} color="#10b981" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Verified Presents</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857' }}>{attendanceLogs.length}</h3>
              </div>
            </div>

          </div>

          {/* Enrolled Courses Grid */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Your Enrolled Courses</h3>
          
          {loading ? (
            <p style={{ color: '#64748b', fontWeight: 500 }}>Loading subjects...</p>
          ) : enrolledSubjects.length === 0 ? (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: '#64748b', background: '#ffffff', marginBottom: '40px' }}>
              <BookOpen size={40} color="#2563eb" style={{ marginBottom: '12px', opacity: 0.5 }} />
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Not Enrolled in Any Classes</h4>
              <p style={{ fontSize: '0.9rem' }}>Enter a Join Code provided by your teacher above to auto-enroll!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginBottom: '44px' }}>
              {enrolledSubjects.map((item, idx) => {
                const sub = item.subjects || {};
                return (
                  <div key={idx} className="glass-panel" style={{ padding: '24px', background: '#ffffff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="badge badge-cyan" style={{ padding: '5px 12px', fontSize: '0.72rem' }}>
                        {sub.subject_code || 'COURSE'}
                      </span>
                      <span className="badge badge-emerald">Enrolled</span>
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      {sub.name || 'Enrolled Course'}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                      Section: <strong style={{ color: '#0f172a' }}>{sub.section || 'General'}</strong>
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Attendance History Timeline */}
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>My Attendance History</h3>
          
          <div className="glass-panel" style={{ padding: '28px', background: '#ffffff' }}>
            {attendanceLogs.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>No attendance records logged yet for this student profile.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {attendanceLogs.map((log, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a7f3d0' }}>
                        <Check size={20} color="#047857" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h5 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                          {log.subjects?.name || 'Class Session Check-In'}
                        </h5>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>
                      <CheckCircle size={14} strokeWidth={2.2} /> {log.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
