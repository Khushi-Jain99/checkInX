import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    try:
        import streamlit as st
        supabase_url = st.secrets.get("SUPABASE_URL", supabase_url)
        supabase_key = st.secrets.get("SUPABASE_KEY", supabase_key)
    except Exception:
        pass

if not supabase_url or not supabase_key:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY environment variables must be set.")

supabase: Client = create_client(supabase_url, supabase_key)