import streamlit as st


def header_home():
    logo_url = "https://i.ibb.co/YTYGn5qV/logo.png"

    st.markdown(f"""
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; margin-bottom:2.5rem; margin-top:1.5rem">
            <div style="position:relative; display:inline-block;">
                <div style="position:absolute; inset:-10px; background:radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%); filter:blur(15px); border-radius:50%;"></div>
                <img src='{logo_url}' style='height:110px; position:relative; z-index:2; filter:drop-shadow(0 10px 20px rgba(0,0,0,0.5));' />
            </div>
            <h1 style='text-align:center; font-family:"Syne", sans-serif; font-weight:800; font-size:3.8rem; margin-top:0.8rem; margin-bottom:0.2rem; background:linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #818cf8 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;'>CheckInX</h1>
            <div style="display:inline-flex; align-items:center; gap:8px; background:rgba(99, 102, 241, 0.15); border:1px solid rgba(129, 140, 248, 0.3); padding:4px 14px; border-radius:20px; margin-top:4px;">
                <span style="height:7px; width:7px; background-color:#34d399; border-radius:50%; display:inline-block; box-shadow:0 0 8px #34d399;"></span>
                <span style="font-size:0.85rem; font-weight:600; color:#c7d2fe; letter-spacing:0.05em; text-transform:uppercase;">AI-Powered Smart Attendance</span>
            </div>
        </div>   
    """, unsafe_allow_html=True)


def header_dashboard():
    logo_url = "https://i.ibb.co/YTYGn5qV/logo.png"

    st.markdown(f"""
        <div style="display:flex; align-items:center; justify-content:flex-start; gap:16px; margin-bottom:1rem;">
            <div style="position:relative;">
                <img src='{logo_url}' style='height:75px; filter:drop-shadow(0 8px 16px rgba(0,0,0,0.4));' />
            </div>
            <div>
                <h2 style='text-align:left; font-family:"Syne", sans-serif; font-weight:800; font-size:2.2rem; margin:0; background:linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent;'>CheckInX</h2>
                <span style="font-size:0.78rem; font-weight:600; color:#818cf8; letter-spacing:0.06em; text-transform:uppercase;">Smart Portal</span>
            </div>
        </div>   
    """, unsafe_allow_html=True)