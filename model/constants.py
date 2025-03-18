# constants.py
import os
from dotenv import load_dotenv # type: ignore

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DEFAULT_UPLOAD_DIR = "/Users/saketgudimella/Desktop/Codebase" # adjust as needed