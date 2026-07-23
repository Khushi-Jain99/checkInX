import streamlit as st

def subject_card(name, code, section, stats=None, footer_callback=None):
    html = f"""
        <div style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.95)); backdrop-filter: blur(16px); border-left: 6px solid #6366f1; padding: 22px 24px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.35);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                <h3 style="margin:0; color: #f8fafc; font-family:'Syne', sans-serif; font-size: 1.4rem; font-weight:700;">{name}</h3>
                <span style="background: rgba(99, 102, 241, 0.2); color: #c7d2fe; border: 1px solid rgba(129, 140, 248, 0.3); padding: 3px 10px; border-radius: 8px; font-size: 0.85rem; font-weight: 600;">{code}</span>
            </div>
            <p style="color:#94a3b8; margin: 0 0 14px 0; font-size: 0.9rem;">Section: <span style="color:#e2e8f0; font-weight:600;">{section}</span></p>
    """
    
    if stats:
        html += """
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
        """
        for icon, label, value in stats:
            html += f'''
                <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08); padding: 6px 14px; border-radius: 12px; font-size: 0.88rem; color:#cbd5e1;">
                    {icon} <span style="color:#ffffff; font-weight:700;">{value}</span> {label}
                </div>
            '''
        html += "</div>"

    html += "</div>"

    st.markdown(html, unsafe_allow_html=True)

    if footer_callback:
        footer_callback()