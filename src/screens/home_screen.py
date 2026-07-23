import streamlit as st
from src.components.header import header_home
from src.ui.base_layout import style_base_layout, style_background_home

def home_screen():
    header_home()
    style_background_home()
    style_base_layout()

    col1, col2 = st.columns(2, gap="large")

    with col1:
        st.markdown("""
            <div style="text-align:center;">
                <span style="background:rgba(99, 102, 241, 0.2); color:#a5b4fc; font-size:0.8rem; font-weight:700; padding:4px 12px; border-radius:12px; letter-spacing:0.05em; text-transform:uppercase;">Student Access</span>
                <h2 style="text-align:center; margin-top:0.6rem; margin-bottom:0.3rem; color:#ffffff;">Student</h2>
                <p style="text-align:center; color:#94a3b8; margin-bottom:1rem; font-size:0.92rem;">Check-in using Face Recognition or Voice sample</p>
                <div style="display:flex; justify-content:center; align-items:center; min-height:160px; margin-bottom:1.2rem;">
                    <img src="https://i.ibb.co/844D9Lrt/mascot-student.png" style="max-width:130px; max-height:150px; width:auto; height:auto; object-fit:contain;" />
                </div>
            </div>
        """, unsafe_allow_html=True)
        
        if st.button('Student Portal  ↗', type='primary', use_container_width=True):
            st.session_state['login_type'] = 'student'
            st.rerun()

    with col2:
        st.markdown("""
            <div style="text-align:center;">
                <span style="background:rgba(236, 72, 153, 0.2); color:#f472b6; font-size:0.8rem; font-weight:700; padding:4px 12px; border-radius:12px; letter-spacing:0.05em; text-transform:uppercase;">Teacher Access</span>
                <h2 style="text-align:center; margin-top:0.6rem; margin-bottom:0.3rem; color:#ffffff;">Teacher</h2>
                <p style="text-align:center; color:#94a3b8; margin-bottom:1rem; font-size:0.92rem;">Manage subjects & run instant AI attendance analysis</p>
                <div style="display:flex; justify-content:center; align-items:center; min-height:160px; margin-bottom:1.2rem;">
                    <img src="https://i.ibb.co/CsmQQV6X/mascot-prof.png" style="max-width:145px; max-height:150px; width:auto; height:auto; object-fit:contain;" />
                </div>
            </div>
        """, unsafe_allow_html=True)

        if st.button('Teacher Portal  ↗', type='secondary', use_container_width=True):
            st.session_state['login_type'] = 'teacher'
            st.rerun()