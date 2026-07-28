import React from 'react';
import { Camera, Mic, Sparkles, UserCheck, ShieldCheck, LogOut, BookOpen, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar({ activeRole, user, onRoleSelect, onLogout, onNavigate, currentTab }) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ position: 'sticky', top: '16px', zIndex: 100, padding: '0 24px' }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)'
        }}
      >
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <img 
            src="/logo.png" 
            alt="CheckInX Logo" 
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              objectFit: 'cover',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.25)',
              border: '1px solid rgba(226, 232, 240, 0.8)'
            }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
                CheckIn<span style={{ color: '#2563eb' }}>X</span>
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Faster Attendance</p>
          </div>
        </div>

        {/* Center Nav Items if Logged In */}
        {user && (
          <nav style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '5px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            {activeRole === 'teacher' && (
              <>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="btn-secondary"
                  style={{
                    height: '42px',
                    padding: '0 18px',
                    fontSize: '0.88rem',
                    borderRadius: '12px',
                    background: currentTab === 'dashboard' ? '#ffffff' : 'transparent',
                    borderColor: currentTab === 'dashboard' ? '#e2e8f0' : 'transparent',
                    color: currentTab === 'dashboard' ? '#2563eb' : '#64748b',
                    boxShadow: currentTab === 'dashboard' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  <Layers size={16} strokeWidth={2} /> Classes & AI Attendance
                </button>
                <button
                  onClick={() => onNavigate('attendance_logs')}
                  className="btn-secondary"
                  style={{
                    height: '42px',
                    padding: '0 18px',
                    fontSize: '0.88rem',
                    borderRadius: '12px',
                    background: currentTab === 'attendance_logs' ? '#ffffff' : 'transparent',
                    borderColor: currentTab === 'attendance_logs' ? '#e2e8f0' : 'transparent',
                    color: currentTab === 'attendance_logs' ? '#2563eb' : '#64748b',
                    boxShadow: currentTab === 'attendance_logs' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  <BookOpen size={16} strokeWidth={2} /> Attendance Reports
                </button>
              </>
            )}

            {activeRole === 'student' && (
              <>
                <button
                  onClick={() => onNavigate('student_classes')}
                  className="btn-secondary"
                  style={{
                    height: '42px',
                    padding: '0 18px',
                    fontSize: '0.88rem',
                    borderRadius: '12px',
                    background: currentTab === 'student_classes' ? '#ffffff' : 'transparent',
                    borderColor: currentTab === 'student_classes' ? '#e2e8f0' : 'transparent',
                    color: currentTab === 'student_classes' ? '#2563eb' : '#64748b',
                    boxShadow: currentTab === 'student_classes' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  <BookOpen size={16} strokeWidth={2} /> Enrolled Classes
                </button>
                <button
                  onClick={() => onNavigate('student_profile')}
                  className="btn-secondary"
                  style={{
                    height: '42px',
                    padding: '0 18px',
                    fontSize: '0.88rem',
                    borderRadius: '12px',
                    background: currentTab === 'student_profile' ? '#ffffff' : 'transparent',
                    borderColor: currentTab === 'student_profile' ? '#e2e8f0' : 'transparent',
                    color: currentTab === 'student_profile' ? '#2563eb' : '#64748b',
                    boxShadow: currentTab === 'student_profile' ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                  }}
                >
                  <Sparkles size={16} strokeWidth={2} /> AI Profile Setup
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user.name || user.username}
                </p>
                <span className={`badge ${activeRole === 'teacher' ? 'badge-indigo' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                  {activeRole}
                </span>
              </div>
              <button
                onClick={onLogout}
                className="btn-secondary"
                style={{ height: '42px', width: '42px', padding: 0, borderRadius: '14px' }}
                title="Logout"
              >
                <LogOut size={18} strokeWidth={2} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => onRoleSelect('teacher')}
                className="btn-primary"
                style={{ height: '46px', padding: '0 20px', fontSize: '0.88rem', borderRadius: '14px' }}
              >
                <ShieldCheck size={18} strokeWidth={2} /> Teacher Access
              </button>
              <button
                onClick={() => onRoleSelect('student')}
                className="btn-secondary"
                style={{ height: '46px', padding: '0 20px', fontSize: '0.88rem', borderRadius: '14px' }}
              >
                Student Portal
              </button>
            </div>
          )}

        </div>

      </div>
    </motion.header>
  );
}
