import os
import sys
import io
import cv2
import numpy as np
from typing import List, Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from datetime import datetime

# Ensure sys.path includes backend root
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

# Import database and pipeline operations
try:
    from src.database.db import (
        check_teacher_exists,
        create_teacher,
        teacher_login,
        get_all_students,
        create_student,
        create_subject,
        get_teacher_subjects,
        enroll_student_to_subject,
        unenroll_student_to_subject,
        get_student_subjects,
        get_student_attendance,
        create_attendance,
        get_attendance_for_teacher
    )
    from src.pipelines.face_pipeline import (
        get_face_embeddings,
        train_classifier,
        predict_attendance
    )
    from src.pipelines.voice_pipeline import (
        get_voice_embedding,
        process_bulk_audio
    )
except ImportError:
    from backend.src.database.db import (
        check_teacher_exists,
        create_teacher,
        teacher_login,
        get_all_students,
        create_student,
        create_subject,
        get_teacher_subjects,
        enroll_student_to_subject,
        unenroll_student_to_subject,
        get_student_subjects,
        get_student_attendance,
        create_attendance,
        get_attendance_for_teacher
    )
    from backend.src.pipelines.face_pipeline import (
        get_face_embeddings,
        train_classifier,
        predict_attendance
    )
    from backend.src.pipelines.voice_pipeline import (
        get_voice_embedding,
        process_bulk_audio
    )


app = FastAPI(
    title="CheckInX API",
    description="AI Powered Faster Attendance System",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite defaults to 5173, 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class TeacherRegisterRequest(BaseModel):
    username: str
    password: str
    name: str

class TeacherLoginRequest(BaseModel):
    username: str
    password: str

class SubjectCreateRequest(BaseModel):
    subject_code: str
    name: str
    section: str
    teacher_id: str

class EnrollRequest(BaseModel):
    student_id: int
    subject_id: int

class StudentCreateRequest(BaseModel):
    name: str

# --- API Endpoints ---

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "CheckInX API is running successfully"}

# 1. AUTHENTICATION
@app.post("/api/auth/teacher/register")
def register_teacher(req: TeacherRegisterRequest):
    if check_teacher_exists(req.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    result = create_teacher(req.username, req.password, req.name)
    return {"success": True, "data": result}

@app.post("/api/auth/teacher/login")
def login_teacher(req: TeacherLoginRequest):
    teacher = teacher_login(req.username, req.password)
    if not teacher:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"success": True, "teacher": teacher}

# 2. TEACHER SUBJECTS
@app.get("/api/teacher/subjects")
def list_teacher_subjects(teacher_id: str):
    subjects = get_teacher_subjects(teacher_id)
    return {"success": True, "subjects": subjects}

@app.post("/api/teacher/subjects")
def add_subject(req: SubjectCreateRequest):
    result = create_subject(req.subject_code, req.name, req.section, req.teacher_id)
    return {"success": True, "data": result}

# 3. STUDENTS MANAGEMENT
@app.get("/api/students")
def list_all_students():
    students = get_all_students()
    return {"success": True, "students": students}

@app.post("/api/student/create")
def register_student_basic(req: StudentCreateRequest):
    res = create_student(req.name)
    return {"success": True, "student": res}

@app.post("/api/student/register-full")
async def register_student_with_media(
    name: str = Form(...),
    face_file: Optional[UploadFile] = File(None),
    voice_file: Optional[UploadFile] = File(None)
):
    face_emb = None
    voice_emb = None

    if face_file:
        contents = await face_file.read()
        nparr = np.frombuffer(contents, np.uint8)
        img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img_np is not None:
            img_rgb = cv2.cvtColor(img_np, cv2.COLOR_BGR2RGB)
            embeddings = get_face_embeddings(img_rgb)
            if embeddings:
                face_emb = embeddings[0].tolist()

    if voice_file:
        audio_bytes = await voice_file.read()
        voice_emb = get_voice_embedding(audio_bytes)

    res = create_student(name, face_embedding=face_emb, voice_embedding=voice_emb)
    # Retrain face classifier with new embedding
    train_classifier()
    return {"success": True, "student": res}

# 4. ENROLLMENT & STUDENT DASHBOARD
@app.get("/api/student/subjects")
def student_subjects(student_id: int):
    subjects = get_student_subjects(student_id)
    return {"success": True, "subjects": subjects}

@app.get("/api/student/attendance")
def student_attendance(student_id: int):
    logs = get_student_attendance(student_id)
    return {"success": True, "attendance": logs}

@app.post("/api/student/enroll")
def enroll_student(req: EnrollRequest):
    res = enroll_student_to_subject(req.student_id, req.subject_id)
    return {"success": True, "data": res}

@app.post("/api/student/unenroll")
def unenroll_student(req: EnrollRequest):
    res = unenroll_student_to_subject(req.student_id, req.subject_id)
    return {"success": True, "data": res}

# 5. AI ATTENDANCE PIPELINES
@app.post("/api/teacher/attendance/face")
async def process_face_attendance(
    subject_id: int = Form(...),
    file: UploadFile = File(...)
):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file format")
    
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    detected_dict, all_students, detected_faces_count = predict_attendance(img_rgb)

    now_iso = datetime.now().isoformat()
    logs_to_insert = []

    for sid in detected_dict.keys():
        logs_to_insert.append({
            "student_id": sid,
            "subject_id": subject_id,
            "status": "Present",
            "timestamp": now_iso
        })

    if logs_to_insert:
        create_attendance(logs_to_insert)

    return {
        "success": True,
        "detected_faces_count": detected_faces_count,
        "present_student_ids": list(detected_dict.keys()),
        "total_enrolled_candidates": len(all_students)
    }

@app.post("/api/teacher/attendance/voice")
async def process_voice_attendance(
    subject_id: int = Form(...),
    file: UploadFile = File(...)
):
    audio_bytes = await file.read()
    all_students_db = get_all_students()
    
    candidates_dict = {}
    for s in all_students_db:
        if s.get('voice_embedding'):
            candidates_dict[s['student_id']] = s['voice_embedding']

    results = process_bulk_audio(audio_bytes, candidates_dict)

    now_iso = datetime.now().isoformat()
    logs_to_insert = []

    for sid in results.keys():
        logs_to_insert.append({
            "student_id": sid,
            "subject_id": subject_id,
            "status": "Present",
            "timestamp": now_iso
        })

    if logs_to_insert:
        create_attendance(logs_to_insert)

    return {
        "success": True,
        "identified_results": results,
        "present_student_ids": list(results.keys())
    }

@app.get("/api/teacher/attendance")
def teacher_attendance_records(teacher_id: str):
    records = get_attendance_for_teacher(teacher_id)
    return {"success": True, "attendance": records}


# Serve static React frontend files
possible_static_dirs = [
    os.path.join(os.path.dirname(__file__), "static"),
    os.path.join(os.path.dirname(__file__), "..", "static"),
    os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"),
]

frontend_static_dir = next((d for d in possible_static_dirs if os.path.exists(d) and os.path.isdir(d)), None)

if frontend_static_dir:
    assets_dir = os.path.join(frontend_static_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_react_app(full_path: str):
        file_path = os.path.join(frontend_static_dir, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_static_dir, "index.html"))

