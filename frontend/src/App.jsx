import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { checkHealth } from './api';
import { UserCheck, Camera, Mic, Sparkles, Activity, Lock, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeRole, setActiveRole] = useState(null); // 'teacher' | 'student' | null
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [apiConnected, setApiConnected] = useState(false);

  useEffect(() => {
    checkHealth()
      .then(res => {
        if (res.status === 'ok') setApiConnected(true);
      })
      .catch(err => console.log('API health check error:', err));
  }, []);

  const handleLoginSuccess = (role, userObj) => {
    setActiveRole(role);
    setUser(userObj);
    if (role === 'teacher') {
      setCurrentTab('dashboard');
    } else {
      setCurrentTab('student_classes');
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
    setUser(null);
    setCurrentTab('home');
  };

  const handleNavigate = (tab) => {
    if (tab === 'home') {
      setActiveRole(null);
      setUser(null);
    } else {
      setCurrentTab(tab);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {/* Global Tech Dot Grid & Animated Ambient Orbs */}
      <div className="app-bg-grid"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>
      <div className="bg-orb bg-orb-4"></div>

      <Navbar
        activeRole={activeRole}
        user={user}
        onRoleSelect={(role) => { setActiveRole(role); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentTab={currentTab}
      />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {!user ? (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        ) : activeRole === 'teacher' ? (
          <TeacherDashboard teacher={user} activeTab={currentTab} />
        ) : (
          <StudentDashboard student={user} activeTab={currentTab} />
        )}
      </main>

      <footer style={{ 
        position: 'relative', 
        zIndex: 10, 
        borderTop: '1px solid rgba(226, 232, 240, 0.8)', 
        padding: '56px 24px 32px', 
        color: '#64748b', 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Top Grid Section */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '40px', marginBottom: '40px' }}>
            
            {/* Column 1: Brand & Slogan */}
            <div>
              <div 
                onClick={() => handleNavigate('home')}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '14px' }}
              >
                <img 
                  src="/logo.png" 
                  alt="CheckInX Logo" 
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    boxShadow: '0 6px 14px rgba(37, 99, 235, 0.25)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                  }} 
                />
                <span style={{ fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
                  CheckIn<span style={{ color: '#2563eb' }}>X</span>
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '16px' }}>
                Automating classroom check-ins in seconds using high-precision facial recognition & voice biometrics.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: '#ecfdf5', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
                <span className="pulse-dot"></span>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>AI Engine Operational</span>
              </div>
            </div>

            {/* Column 2: Key Features */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                AI Capabilities
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                  <Camera size={15} color="#2563eb" /> Multi-Face AI (dlib + SVM)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                  <Mic size={15} color="#0284c7" /> Voice Biometrics (Resemblyzer)
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                  <Sparkles size={15} color="#7c3aed" /> Instant Join Code Generation
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                  <Activity size={15} color="#10b981" /> Automated Supabase Logs
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Navigation */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Quick Navigation
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <li>
                  <button 
                    onClick={() => handleNavigate('home')} 
                    style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                  >
                    Home Page
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveRole('teacher')} 
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}
                  >
                    Teacher Dashboard Access
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveRole('student')} 
                    style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', padding: 0 }}
                  >
                    Student Portal & AI Setup
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: System Tech Stack */}
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                Tech Stack
              </h4>
              <p style={{ fontSize: '0.83rem', color: '#64748b', lineHeight: 1.6 }}>
                Frontend: <strong>React</strong> + <strong>Vite</strong><br />
                Backend: <strong>FastAPI</strong> + <strong>Uvicorn</strong><br />
                Database: <strong>Supabase PostgreSQL</strong><br />
                AI Models: <strong>dlib</strong>, <strong>Resemblyzer</strong>, <strong>scikit-learn</strong>
              </p>
            </div>

          </div>

          {/* Bottom Divider & Security Info */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', fontSize: '0.82rem', color: '#94a3b8' }}>
            <div>
              © 2026 CheckInX. All rights reserved. Sub-second automated attendance.
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Lock size={13} /> Biometric Embeddings Encrypted</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={13} /> Supabase Verified</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
