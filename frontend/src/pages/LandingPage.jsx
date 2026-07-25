import React, { useState } from 'react';
import { Camera, Mic, ShieldCheck, Sparkles, UserCheck, ArrowRight, BookOpen, Layers, CheckCircle2, Lock, User, Zap, Activity, Clock, Cpu, Check, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { loginTeacher, registerTeacher } from '../api';

export default function LandingPage({ onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('teacher'); // 'teacher' | 'student'
  
  // Form fields
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'teacher') {
        if (authMode === 'register') {
          if (!name || !username || !password) {
            throw new Error('Please fill in all registration fields');
          }
          await registerTeacher(username, password, name);
          const loginRes = await loginTeacher(username, password);
          onLoginSuccess('teacher', loginRes.teacher);
        } else {
          if (!username || !password) {
            throw new Error('Please enter username and password');
          }
          const loginRes = await loginTeacher(username, password);
          onLoginSuccess('teacher', loginRes.teacher);
        }
      } else {
        // Quick Student Portal Access
        onLoginSuccess('student', { student_id: 1, name: 'Student Access', username: 'student' });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      
      {/* Background Ambient Orbs */}
      <div className="bg-ambient-orb-1"></div>
      <div className="bg-ambient-orb-2"></div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 120px', position: 'relative', zIndex: 10 }}>
        
        {/* HERO SECTION */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '64px', alignItems: 'center', marginBottom: '140px' }}
        >
          
          {/* LEFT COLUMN: HERO HEADLINE & STATS */}
          <div>
            
            {/* AI Pill Badge */}
            <motion.div variants={itemVariants} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 18px', background: 'rgba(37, 99, 235, 0.08)', borderRadius: '30px', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <Sparkles size={16} color="#2563eb" strokeWidth={2.2} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  AI-POWERED ATTENDANCE SYSTEM
                </span>
              </div>
            </motion.div>

            {/* 64-72px Hero Title */}
            <motion.h1 
              variants={itemVariants} 
              style={{ 
                fontSize: 'clamp(3.5rem, 6vw, 4.5rem)', 
                fontWeight: 800, 
                lineHeight: 1.05, 
                letterSpacing: '-0.04em', 
                color: '#0f172a',
                marginBottom: '24px'
              }}
            >
              Faster Attendance <br />
              <span className="text-gradient-primary">Powered by AI</span>
            </motion.h1>

            {/* 20px Subheading */}
            <motion.p 
              variants={itemVariants} 
              style={{ 
                fontSize: '1.25rem', 
                fontWeight: 500, 
                lineHeight: 1.6, 
                color: '#475569', 
                marginBottom: '40px',
                maxWidth: '560px'
              }}
            >
              Automate classroom check-ins in seconds using high-precision <strong>Facial Recognition</strong> (dlib + SVM) and <strong>Voice Biometrics</strong> (Resemblyzer).
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '56px' }}>
              <button onClick={() => setRole('teacher')} className="btn-primary" style={{ padding: '0 32px' }}>
                Launch Dashboard <ArrowRight size={18} strokeWidth={2.2} />
              </button>
              <button onClick={() => setRole('student')} className="btn-secondary" style={{ padding: '0 32px' }}>
                Student Portal
              </button>
            </motion.div>

            {/* Statistics Cards Grid */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb', marginBottom: '2px' }}>99.8%</h3>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Face AI Accuracy</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', marginBottom: '2px' }}>&lt; 1s</h3>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Speed per Photo</p>
              </div>

              <div className="glass-panel" style={{ padding: '20px 16px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.7)' }}>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginBottom: '2px' }}>100%</h3>
                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Automated Logs</p>
              </div>
            </motion.div>

          </div>

          {/* RIGHT COLUMN: FLOATING GLASS LOGIN CARD */}
          <motion.div variants={itemVariants}>
            <div 
              className="glass-panel glass-card-glow"
              style={{
                padding: '40px',
                borderRadius: '28px',
                background: 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.08), 0 4px 20px rgba(37, 99, 235, 0.04)'
              }}
            >
              {/* Role Toggle Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: '#f1f5f9', padding: '6px', borderRadius: '18px' }}>
                <button
                  onClick={() => setRole('teacher')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    height: '46px',
                    padding: 0,
                    fontSize: '0.9rem',
                    borderRadius: '14px',
                    background: role === 'teacher' ? '#ffffff' : 'transparent',
                    borderColor: role === 'teacher' ? '#e2e8f0' : 'transparent',
                    color: role === 'teacher' ? '#2563eb' : '#64748b',
                    boxShadow: role === 'teacher' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <ShieldCheck size={18} strokeWidth={2} /> Teacher Access
                </button>
                <button
                  onClick={() => setRole('student')}
                  className="btn-secondary"
                  style={{
                    flex: 1,
                    height: '46px',
                    padding: 0,
                    fontSize: '0.9rem',
                    borderRadius: '14px',
                    background: role === 'student' ? '#ffffff' : 'transparent',
                    borderColor: role === 'student' ? '#e2e8f0' : 'transparent',
                    color: role === 'student' ? '#0284c7' : '#64748b',
                    boxShadow: role === 'student' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  <UserCheck size={18} strokeWidth={2} /> Student Portal
                </button>
              </div>

              {role === 'teacher' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                      {authMode === 'login' ? 'Teacher Sign In' : 'Create Teacher Account'}
                    </h3>
                    <button
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      {authMode === 'login' ? 'Register Account' : 'Sign In'}
                    </button>
                  </div>

                  {error && (
                    <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '14px', marginBottom: '20px', color: '#be123c', fontSize: '0.85rem' }}>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {authMode === 'register' && (
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                          Full Name
                        </label>
                        <div className="input-wrapper">
                          <User className="input-icon" size={18} strokeWidth={2} />
                          <input
                            type="text"
                            placeholder="e.g. Prof. Sarah Connor"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Username / ID
                      </label>
                      <div className="input-wrapper">
                        <User className="input-icon" size={18} strokeWidth={2} />
                        <input
                          type="text"
                          placeholder="Enter teacher username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                        Password
                      </label>
                      <div className="input-wrapper">
                        <Lock className="input-icon" size={18} strokeWidth={2} />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="input-field"
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '6px' }}>
                      {loading ? 'Authenticating...' : authMode === 'login' ? 'Sign In to Dashboard' : 'Create Account'} <ArrowRight size={18} strokeWidth={2.2} />
                    </button>
                  </form>

                  {/* Demo Credentials hint */}
                  <div style={{ marginTop: '24px', padding: '14px 18px', background: 'rgba(248, 250, 252, 0.9)', borderRadius: '16px', fontSize: '0.8rem', color: '#64748b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap size={16} color="#d97706" strokeWidth={2.2} />
                    <span><strong>Demo Quick Login:</strong> Username: <code>prof_demo</code> | Password: <code>demo123</code></span>
                  </div>
                </div>
              ) : (
                /* Student Portal Login */
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <UserCheck size={36} color="#0284c7" strokeWidth={2} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Student Quick Access</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '32px', lineHeight: 1.6 }}>
                    Access student portal to check attendance records, enter class Join Codes, and train your AI voice/face profile.
                  </p>

                  <button onClick={handleSubmit} className="btn-primary" style={{ width: '100%', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
                    Enter Student Portal <ArrowRight size={18} strokeWidth={2.2} />
                  </button>
                </div>
              )}

            </div>
          </motion.div>

        </motion.div>

        {/* FEATURES SECTION (3 BEAUTIFUL CARDS) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '80px' }}
        >
          
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(124, 58, 237, 0.08)', borderRadius: '30px', border: '1px solid rgba(124, 58, 237, 0.2)', marginBottom: '16px' }}>
              <Cpu size={16} color="#7c3aed" strokeWidth={2.2} />
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                AI ENGINE ARCHITECTURE
              </span>
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '12px' }}>
              Powered by Advanced Machine Learning
            </h2>
            <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              Engineered for sub-second recognition, multi-student detection, and zero-latency database sync.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
            
            {/* Card 1: Face Recognition */}
            <motion.div 
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-panel" 
              style={{ padding: '40px', borderRadius: '24px', background: '#ffffff' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #bfdbfe' }}>
                <Camera size={28} color="#2563eb" strokeWidth={2} />
              </div>
              <span className="badge badge-indigo" style={{ marginBottom: '12px' }}>Vision AI</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Face Recognition
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                Computes 128-dimensional facial landmark embeddings using frontal face detectors and trains a balanced linear SVM model to classify multiple students simultaneously in classroom snapshots.
              </p>
            </motion.div>

            {/* Card 2: Voice Biometrics */}
            <motion.div 
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-panel" 
              style={{ padding: '40px', borderRadius: '24px', background: '#ffffff' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #bae6fd' }}>
                <Mic size={28} color="#0284c7" strokeWidth={2} />
              </div>
              <span className="badge badge-cyan" style={{ marginBottom: '12px' }}>Voice AI</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Voice Biometrics
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                Splits classroom audio streams into silence-bounded utterances using WebRTC VAD and matches speaker voice embeddings against stored student voice profiles via cosine similarity.
              </p>
            </motion.div>

            {/* Card 3: Real-Time Attendance */}
            <motion.div 
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="glass-panel" 
              style={{ padding: '40px', borderRadius: '24px', background: '#ffffff' }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', border: '1px solid #a7f3d0' }}>
                <Activity size={28} color="#10b981" strokeWidth={2} />
              </div>
              <span className="badge badge-emerald" style={{ marginBottom: '12px' }}>Real-Time Sync</span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                Real-time Attendance
              </h3>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                Real-time Supabase database integration, bcrypt password security, automatic attendance log timestamps, and instant join code generation for students.
              </p>
            </motion.div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}
