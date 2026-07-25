import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { checkHealth } from './api';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeRole={activeRole}
        user={user}
        onRoleSelect={(role) => { setActiveRole(role); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentTab={currentTab}
      />

      <main style={{ flex: 1 }}>
        {!user ? (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        ) : activeRole === 'teacher' ? (
          <TeacherDashboard teacher={user} activeTab={currentTab} />
        ) : (
          <StudentDashboard student={user} activeTab={currentTab} />
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-dim)', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <div>
            <strong>CheckInX</strong> - AI Powered Faster Attendance System
          </div>
          <div>
            Built with React, FastAPI, dlib, Resemblyzer & Supabase
          </div>
        </div>
      </footer>
    </div>
  );
}
