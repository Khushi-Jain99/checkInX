import streamlit as st
from src.database.db import create_attendance

def show_attendance_result(df, logs):
    st.markdown("<h4 style='color:#c7d2fe; margin-bottom:0.5rem;'>Review Attendance Summary</h4>", unsafe_allow_html=True)
    
    if not df.empty and 'Status' in df.columns:
        present_cnt = int(df['Status'].astype(str).str.contains('Present').sum())
        total_cnt = len(df)
        st.markdown(f"""
            <div style="display:flex; gap:12px; margin-bottom:15px;">
                <div style="background:rgba(52, 211, 153, 0.15); border:1px solid rgba(52, 211, 153, 0.3); padding:8px 16px; border-radius:12px; color:#34d399; font-size:0.95rem;">
                    ✅ Present: <b>{present_cnt}</b> / {total_cnt}
                </div>
                <div style="background:rgba(248, 113, 113, 0.15); border:1px solid rgba(248, 113, 113, 0.3); padding:8px 16px; border-radius:12px; color:#f87171; font-size:0.95rem;">
                    ❌ Absent: <b>{total_cnt - present_cnt}</b> / {total_cnt}
                </div>
            </div>
        """, unsafe_allow_html=True)

    st.dataframe(df, hide_index=True, use_container_width=True)

    st.space()
    col1, col2 = st.columns(2)

    with col1:
        if st.button('Discard', use_container_width=True, type='tertiary'):
            st.session_state.voice_attendance_results = None
            st.session_state.attendance_images = []
            st.rerun()

    with col2:
        if st.button('Confirm & Save', use_container_width=True, type='primary'):
            try:
                create_attendance(logs)
                st.toast("Attendance recorded successfully! 🎉")
                st.session_state.attendance_images = []
                st.session_state.voice_attendance_results = None
                st.rerun()
            except Exception as e:
                st.error('Sync failed!')


@st.dialog("Attendance Reports")
def attendance_result_dialog(df, logs):
    show_attendance_result(df, logs)
