import streamlit as st
import segno
import io


@st.dialog("Share Class Link")
def share_subject_dialog(subject_name, subject_code):
    app_domain = "CheckInX-main.streamlit.app"
    join_url = f"{app_domain}/?join-code={subject_code}"

    st.markdown(f"<h3 style='color:#a5b4fc; margin-bottom:1rem;'>Share {subject_name}</h3>", unsafe_allow_html=True)

    qr = segno.make(join_url)
    out = io.BytesIO()
    qr.save(out, kind='png', scale=10, border=2)

    col1, col2 = st.columns(2)

    with col1:
        st.markdown('<p style="font-weight:700; color:#f8fafc; margin-bottom:4px;">Join Link</p>', unsafe_allow_html=True)
        st.code(join_url, language="text")
        st.markdown('<p style="font-weight:700; color:#f8fafc; margin-bottom:4px;">Class Code</p>', unsafe_allow_html=True)
        st.code(subject_code, language="text")
        st.info('Share this link or code with your students via WhatsApp or Email')

    with col2:
        st.markdown('<p style="font-weight:700; color:#f8fafc; text-align:center; margin-bottom:8px;">Scan QR Code</p>', unsafe_allow_html=True)
        st.image(out.getvalue(), caption='Scan to auto-enroll', use_container_width=True)