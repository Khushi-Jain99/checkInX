import streamlit as st


def style_background_home():
    st.markdown("""
        <style>
            .stApp {
                background: radial-gradient(circle at 15% 15%, rgba(99, 102, 241, 0.3) 0%, transparent 45%),
                            radial-gradient(circle at 85% 85%, rgba(236, 72, 153, 0.25) 0%, transparent 45%),
                            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 60%),
                            #0b0f19 !important;
                background-attachment: fixed !important;
            }

            /* Style ONLY top-level horizontal columns */
            [data-testid="stHorizontalBlock"] > div[data-testid="stColumn"] {
                background: rgba(18, 24, 38, 0.8) !important;
                backdrop-filter: blur(20px) !important;
                -webkit-backdrop-filter: blur(20px) !important;
                border: 1px solid rgba(255, 255, 255, 0.12) !important;
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
                padding: 2.5rem 2rem !important;
                border-radius: 2.2rem !important;
                transition: all 0.3s ease !important;
            }

            [data-testid="stHorizontalBlock"] > div[data-testid="stColumn"]:hover {
                border-color: rgba(129, 140, 248, 0.4) !important;
                box-shadow: 0 25px 60px rgba(99, 102, 241, 0.2) !important;
            }
        </style>
    """, unsafe_allow_html=True)


def style_background_dashboard():
    st.markdown("""
        <style>
            .stApp {
                background: radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                            #0d1117 !important;
                background-attachment: fixed !important;
                color: #f1f5f9 !important;
            }

            [data-testid="stHorizontalBlock"] > div[data-testid="stColumn"] {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
                padding: 0.5rem !important;
            }
        </style>
    """, unsafe_allow_html=True)


def style_base_layout():
    st.markdown("""
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap');

            /* Hide default Streamlit top bar and footer */
            #MainMenu, footer, header, [data-testid="stHeader"] {
                visibility: hidden !important;
                height: 0px !important;
            }

            .block-container {
                padding-top: 1.5rem !important;
                padding-bottom: 3rem !important;
                max-width: 1050px !important;
            }

            html, body {
                font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif !important;
                color: #f1f5f9 !important;
            }

            /* Headers */
            h1 {
                font-family: 'Syne', sans-serif !important;
                font-weight: 800 !important;
                letter-spacing: -0.03em !important;
                color: #ffffff !important;
            }

            h2, h3 {
                font-family: 'Syne', sans-serif !important;
                font-weight: 700 !important;
                letter-spacing: -0.02em !important;
                color: #f8fafc !important;
            }

            /* Preserve Material Icons font family so icon names never display as raw text */
            span[data-testid="stIconMaterial"], 
            [class*="material-symbols"], 
            [class*="material-icons"],
            div.stButton button span[data-testid="stIconMaterial"] {
                font-family: 'Material Symbols Rounded', 'Material Symbols Outlined', 'Material Icons' !important;
                font-style: normal !important;
                font-weight: normal !important;
                letter-spacing: normal !important;
                text-transform: none !important;
                display: inline-block !important;
                white-space: nowrap !important;
                word-wrap: normal !important;
                direction: ltr !important;
                -webkit-font-smoothing: antialiased !important;
            }

            /* Streamlit Button Restyling - Background, shadow, borders ONLY without breaking flex DOM */
            div.stButton > button {
                border-radius: 1.2rem !important;
                background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
                color: #ffffff !important;
                font-weight: 600 !important;
                font-size: 0.98rem !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.4) !important;
                transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease !important;
                min-height: 48px !important;
                cursor: pointer !important;
            }

            div.stButton > button:hover {
                transform: translateY(-2px) !important;
                background: linear-gradient(135deg, #818cf8 0%, #6366f1 100%) !important;
                box-shadow: 0 12px 25px -4px rgba(99, 102, 241, 0.6) !important;
                border-color: rgba(255, 255, 255, 0.3) !important;
            }

            div.stButton > button[kind="secondary"] {
                background: linear-gradient(135deg, #ec4899 0%, #db2777 100%) !important;
                box-shadow: 0 8px 20px -4px rgba(236, 72, 153, 0.4) !important;
            }

            div.stButton > button[kind="secondary"]:hover {
                background: linear-gradient(135deg, #f472b6 0%, #ec4899 100%) !important;
                box-shadow: 0 12px 25px -4px rgba(236, 72, 153, 0.6) !important;
            }

            div.stButton > button[kind="tertiary"] {
                background: rgba(30, 41, 59, 0.8) !important;
                color: #cbd5e1 !important;
                box-shadow: none !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }

            div.stButton > button[kind="tertiary"]:hover {
                background: rgba(51, 65, 85, 0.9) !important;
                color: #ffffff !important;
                border-color: rgba(255, 255, 255, 0.2) !important;
            }

            /* Form Inputs */
            div[data-baseweb="input"] input {
                background-color: rgba(15, 23, 42, 0.6) !important;
                color: #f8fafc !important;
                border-radius: 0.85rem !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                padding: 0.65rem 1rem !important;
            }

            div[data-baseweb="input"]:focus-within {
                border-color: #818cf8 !important;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3) !important;
            }

            div[data-baseweb="select"] > div {
                background-color: rgba(15, 23, 42, 0.6) !important;
                border-radius: 0.85rem !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                color: #f8fafc !important;
            }

            /* Modals & Dialogs */
            div[role="dialog"] {
                background: rgba(15, 23, 42, 0.95) !important;
                backdrop-filter: blur(25px) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
                border-radius: 2rem !important;
                box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8) !important;
                color: #f8fafc !important;
            }

            /* Dataframes */
            div[data-testid="stDataFrame"] {
                border-radius: 1.2rem !important;
                overflow: hidden !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
            }

            /* Dividers */
            hr {
                border-color: rgba(255, 255, 255, 0.1) !important;
                margin: 2rem 0 !important;
            }
        </style>
    """, unsafe_allow_html=True)