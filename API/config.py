# config.py

import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

api_key = os.getenv('GEMINI_API_KEY')
firebase_db_url = os.getenv('FIREBASE_DATABASE_URL')

if not api_key:
    logger.error("GEMINI_API_KEY not found in environment variables")
    raise ValueError("GEMINI_API_KEY is required")

if not firebase_db_url:
    logger.error("FIREBASE_DATABASE_URL not found in environment variables")
    raise ValueError("FIREBASE_DATABASE_URL is required")
