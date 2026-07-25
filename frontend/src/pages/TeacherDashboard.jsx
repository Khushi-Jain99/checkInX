import React, { useState, useEffect } from 'react';
import { Plus, Camera, Mic, Users, BookOpen, Clock, QrCode, Search, CheckCircle, Award, Sparkles, Filter, Activity, TrendingUp, ChevronRight, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { getTeacherSubjects, getTeacherAttendance } from '../api';
import FaceAttendanceModal from '../components/FaceAttendanceModal';
import VoiceAttendanceModal from '../components/VoiceAttendanceModal';
import CreateSubjectModal from '../components/CreateSubjectModal';

export default function TeacherDashboard({ teacher, activeTab }) {
  const [subjects, setSubjects] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [selectedSubjectForFace, setSelectedSubjectForFace] = useState(null);
  const [selectedSubjectForVoice, setSelectedSubjectForVoice] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  const teacherId = teacher?.teacher_id || teacher?.username;

  useEffect(() => {
    fetchDashboardData();
  }, [teacherId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [subsRes, logsRes] = await Promise.all([
        getTeacherSubjects(teacherId),
        getTeacherAttendance(teacherId)
      ]);

      if (subsRes.success) setSubjects(subsRes.subjects || []);
      if (logsRes.success) setAttendanceLogs(logsRes.attendance || []);
    } catch (err) {
      console.error('Error fetching teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyJoinCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredSubjects = subjects.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.subject_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.section && s.section.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalClassesCount = subjects.reduce((acc, s) => acc + (s.total_classes || 0), 0);
  const totalEnrolledCount = subjects.reduce((acc, s) => acc + (s.total_students || 0), 0);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px 80px' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '40px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-indigo">Faculty Portal</span>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>Welcome back,</span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
            {teacher.name || teacher.username}'s Dashboard
          </h1>
        </div>

        <button onClick={() => setShowCreateModal(true)} className="btn-primary" style={{ padding: '0 24px', height: '48px' }}>
          <Plus size={18} strokeWidth={2.2} /> Create New Class
        </button>
      </div>

      {/* Analytics Widgets Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '44px' }}>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bfdbfe' }}>
            <BookOpen size={26} color="#2563eb" strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Active Courses</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{subjects.length}</h3>
              <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                <TrendingUp size={14} /> Active
              </span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #bae6fd' }}>
            <Users size={26} color="#0284c7" strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Enrolled Students</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{totalEnrolledCount}</h3>
              <span style={{ fontSize: '0.78rem', color: '#0284c7', fontWeight: 700 }}>Total</span>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', background: '#ffffff', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #a7f3d0' }}>
            <Clock size={26} color="#10b981" strokeWidth={2} />
          </div>
          <div>
            <p style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AI Check-In Sessions</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{totalClassesCount}</h3>
              <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>Recorded</span>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'attendance_logs' ? (
        /* Attendance Records Table View */
        <div className="glass-panel" style={{ padding: '32px', background: '#ffffff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>AI Attendance Logs & History</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Real-time database records logged via Face & Voice recognition</p>
            </div>
            <span className="badge badge-emerald" style={{ padding: '6px 14px' }}>{attendanceLogs.length} Records Logged</span>
          </div>

          {attendanceLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#64748b' }}>
              <Clock size={44} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>No Attendance Logs Recorded</h4>
              <p style={{ fontSize: '0.9rem' }}>Launch AI Face or Voice attendance in one of your courses to record logs!</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontWeight: 700 }}>
                    <th style={{ padding: '14px 16px' }}>Student ID</th>
                    <th style={{ padding: '14px 16px' }}>Subject / Course</th>
                    <th style={{ padding: '14px 16px' }}>Status</th>
                    <th style={{ padding: '14px 16px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLogs.map((log, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontWeight: 800, fontSize: '0.75rem' }}>
                          #{log.student_id}
                        </div>
                        Student ID: #{log.student_id}
                      </td>
                      <td style={{ padding: '16px', color: '#334155', fontWeight: 600 }}>
                        {log.subjects?.name || `Subject #${log.subject_id}`}
                        {log.subjects?.subject_code && <span className="badge badge-indigo" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>{log.subjects.subject_code}</span>}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span className="badge badge-emerald">
                          <CheckCircle size={13} strokeWidth={2.2} /> {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', color: '#64748b', fontSize: '0.85rem' }}>
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Main Courses Grid View */
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Your Courses</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage classes, share Join Codes, and trigger AI recognition</p>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '300px' }}>
              <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search subject code or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '44px', height: '46px', borderRadius: '14px' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Sparkles size={36} color="#2563eb" className="spin" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#64748b', fontWeight: 500 }}>Loading classes...</p>
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: '64px 24px', background: '#ffffff' }}>
              <BookOpen size={48} color="#2563eb" style={{ marginBottom: '16px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>No Classes Found</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '24px' }}>
                {searchQuery ? 'No subjects matched your search query.' : 'You haven\'t created any classes yet.'}
              </p>
              <button onClick={() => setShowCreateModal(true)} className="btn-primary" style={{ padding: '0 24px', height: '48px' }}>
                <Plus size={18} strokeWidth={2.2} /> Create Your First Class
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '28px' }}>
              {filteredSubjects.map((sub) => (
                <div key={sub.subject_id} className="glass-panel" style={{ padding: '28px', background: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                  {/* Subject Header Info */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span className="badge badge-indigo" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                        {sub.subject_code}
                      </span>
                      <button
                        onClick={() => copyJoinCode(sub.subject_code)}
                        className="btn-secondary"
                        style={{ height: '34px', padding: '0 12px', fontSize: '0.78rem', borderRadius: '10px' }}
                        title="Copy Join Code"
                      >
                        <QrCode size={14} /> {copiedCode === sub.subject_code ? 'Copied!' : `Code: ${sub.subject_code}`}
                      </button>
                    </div>

                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                      {sub.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', fontWeight: 500 }}>
                      Section: <strong style={{ color: '#0f172a' }}>{sub.section || 'General'}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '16px', padding: '14px', background: '#f8fafc', borderRadius: '14px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Students</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{sub.total_students || 0}</span>
                      </div>
                      <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '16px', flex: 1 }}>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Sessions</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{sub.total_classes || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Launch AI Check-In:
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => setSelectedSubjectForFace(sub)}
                        className="btn-primary"
                        style={{ flex: 1, height: '44px', padding: 0, fontSize: '0.88rem', borderRadius: '12px' }}
                      >
                        <Camera size={16} strokeWidth={2.2} /> Face AI
                      </button>
                      <button
                        onClick={() => setSelectedSubjectForVoice(sub)}
                        className="btn-secondary"
                        style={{ flex: 1, height: '44px', padding: 0, fontSize: '0.88rem', borderRadius: '12px', borderColor: '#bae6fd', color: '#0284c7' }}
                      >
                        <Mic size={16} strokeWidth={2.2} /> Voice AI
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateSubjectModal
          teacherId={teacherId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {selectedSubjectForFace && (
        <FaceAttendanceModal
          subject={selectedSubjectForFace}
          onClose={() => setSelectedSubjectForFace(null)}
          onSuccess={fetchDashboardData}
        />
      )}

      {selectedSubjectForVoice && (
        <VoiceAttendanceModal
          subject={selectedSubjectForVoice}
          onClose={() => setSelectedSubjectForVoice(null)}
          onSuccess={fetchDashboardData}
        />
      )}

    </div>
  );
}
