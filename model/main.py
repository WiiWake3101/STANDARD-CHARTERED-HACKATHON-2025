# main.py
import streamlit as st
import requests
import json
from constants import *
from utils import *
from streamlit_lottie import st_lottie
import os

st.set_page_config(page_title="Loan Check: Enterprise Loan Review")

# System prompt
system_prompt = """
[INST] <>
You are a helpful bank loan officer. You are going to be given a bank statement
to analyze, and you must provide accurate insights about its contents.

If a question doesn't make any sense or is not factually coherent, explain what is wrong with
the question instead of answering something incorrect. If you don't know the answer, don't share
inaccurate information. 

Your goal is to provide insightful answers about the financial background of an individual.
<>
"""

def query_openrouter(prompt, api_key):
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "google/gemma-3-1b-it:free",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                        ]
                    }
                ],
            })
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        st.error(f"Error querying OpenRouter: {e}")
        return None
    except KeyError as e:
        st.error(f"Error parsing OpenRouter response: {e}")
        return None

lottie_file = load_lottieurl()
st_lottie(lottie_file, height=175, quality="medium")
st.title("**Loan Check: Loan Analysis**")

if "uploaded" not in st.session_state:
    st.session_state["uploaded"] = False
    st.session_state["filename"] = None
    st.session_state["path"] = None
    st.session_state["upload_status"] = None

def reset():
    st.session_state["uploaded"] = False
    st.session_state["filename"] = None
    st.session_state["path"] = None
    st.session_state["upload_status"] = None

if not st.session_state["uploaded"]:
    st.write("Upload a bank statement and analyze loan worthiness.")
    input_file = st.file_uploader("Choose a PDF file")

    if input_file and does_file_have_pdf_extension(input_file):
        st.session_state["path"] = store_pdf_file(input_file, DEFAULT_UPLOAD_DIR)
        st.session_state["upload_status"] = "✅ File successfully uploaded!"
        st.session_state["filename"] = input_file.name
        st.success(st.session_state["upload_status"])
        with st.spinner("Analyzing document..."):
            try:
                documents_text = extract_text_from_pdf(st.session_state["path"])

                if not documents_text:
                    st.error("⚠️ No text found in the document. Please upload a valid PDF.")
                    reset()
                    st.stop()
                st.write(f"Document Preview:\n{documents_text[:500]}")
                st.session_state["uploaded"] = True
                st.rerun()
            except Exception as e:
                st.error(f"Error processing the document: {e}")
                reset()
                st.stop()

else:
    st.success(f"📄 Analyzing: {st.session_state['filename']}")
    st.write("You can now ask questions about the document or review the analysis below.")

    with st.spinner("Generating summary..."):
        try:
            documents_text = extract_text_from_pdf(st.session_state["path"])
            summary_query = f"""{system_prompt} {documents_text} Provide a detailed monthly summary of the following:
                1. Total monthly deposits
                2. Total monthly withdrawals
                3. Recurring payments
                4. Other noticeable spending habits
                
                Based on this information, analyze whether the individual is eligible for a loan.
                Highlight:
                - Potential loan decision (if possible)
                - Evidence
                - Red flags
                - Positive signs
                """
            summary_response = query_openrouter(summary_query, OPENROUTER_API_KEY)
            st.write("Financial Summary")
            st.write(summary_response)
        except Exception as e:
            st.error(f"Error generating summary: {e}")

    query = st.text_input("Try asking additional queries:")
    if query:
        with st.spinner("Fetching insights..."):
            try:
                documents_text = extract_text_from_pdf(st.session_state["path"])
                full_query = f"{system_prompt} {documents_text} {query}"
                response = query_openrouter(full_query, OPENROUTER_API_KEY)
                st.write("Response:")
                st.write(response)
            except Exception as e:
                st.error(f"Error fetching insights: {e}")

    if st.button("🔄 Upload New Document"):
        reset()
        st.rerun()
