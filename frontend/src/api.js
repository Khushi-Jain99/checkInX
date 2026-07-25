const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : '';

export async function checkHealth() {
  const res = await fetch(`${API_BASE_URL}/api/health`);
  return res.json();
}

// Teacher Authentication
export async function registerTeacher(username, password, name) {
  const res = await fetch(`${API_BASE_URL}/api/auth/teacher/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Registration failed');
  }
  return res.json();
}

export async function loginTeacher(username, password) {
  const res = await fetch(`${API_BASE_URL}/api/auth/teacher/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Login failed');
  }
  return res.json();
}

// Teacher Subjects
export async function getTeacherSubjects(teacherId) {
  const res = await fetch(`${API_BASE_URL}/api/teacher/subjects?teacher_id=${encodeURIComponent(teacherId)}`);
  return res.json();
}

export async function createSubject(subjectCode, name, section, teacherId) {
  const res = await fetch(`${API_BASE_URL}/api/teacher/subjects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subject_code: subjectCode, name, section, teacher_id: teacherId })
  });
  return res.json();
}

// Attendance Processing
export async function processFaceAttendance(subjectId, imageFileBlob) {
  const formData = new FormData();
  formData.append('subject_id', subjectId);
  formData.append('file', imageFileBlob, 'class_snapshot.jpg');

  const res = await fetch(`${API_BASE_URL}/api/teacher/attendance/face`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Face attendance processing failed');
  }
  return res.json();
}

export async function processVoiceAttendance(subjectId, audioFileBlob) {
  const formData = new FormData();
  formData.append('subject_id', subjectId);
  formData.append('file', audioFileBlob, 'voice_recording.wav');

  const res = await fetch(`${API_BASE_URL}/api/teacher/attendance/voice`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Voice attendance processing failed');
  }
  return res.json();
}

export async function getTeacherAttendance(teacherId) {
  const res = await fetch(`${API_BASE_URL}/api/teacher/attendance?teacher_id=${encodeURIComponent(teacherId)}`);
  return res.json();
}

// Student API
export async function getAllStudents() {
  const res = await fetch(`${API_BASE_URL}/api/students`);
  return res.json();
}

export async function registerStudentBasic(name) {
  const res = await fetch(`${API_BASE_URL}/api/student/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function registerStudentFull(name, faceBlob, voiceBlob) {
  const formData = new FormData();
  formData.append('name', name);
  if (faceBlob) formData.append('face_file', faceBlob, 'face.jpg');
  if (voiceBlob) formData.append('voice_file', voiceBlob, 'voice.wav');

  const res = await fetch(`${API_BASE_URL}/api/student/register-full`, {
    method: 'POST',
    body: formData
  });
  return res.json();
}

export async function getStudentSubjects(studentId) {
  const res = await fetch(`${API_BASE_URL}/api/student/subjects?student_id=${studentId}`);
  return res.json();
}

export async function getStudentAttendance(studentId) {
  const res = await fetch(`${API_BASE_URL}/api/student/attendance?student_id=${studentId}`);
  return res.json();
}

export async function enrollStudent(studentId, subjectId) {
  const res = await fetch(`${API_BASE_URL}/api/student/enroll`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ student_id: studentId, subject_id: subjectId })
  });
  return res.json();
}
