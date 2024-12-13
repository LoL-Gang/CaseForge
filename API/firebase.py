# firebase.py

from firebase_admin import credentials, initialize_app
import os
import logging

logger = logging.getLogger(__name__)

def initialize_firebase(firebase_db_url):
    """Initialize Firebase with the provided database URL."""
    try:
        logger.info("Initializing Firebase...")
        firebase_config_path = './firebase-config/serviceAccountKey.json'

        if not os.path.exists(firebase_config_path):
            logger.error(f"Firebase config file not found at {firebase_config_path}")
            raise FileNotFoundError(f"Firebase config file not found at {firebase_config_path}")

        cred = credentials.Certificate(firebase_config_path)
        initialize_app(cred, {'databaseURL': firebase_db_url})
        logger.info("Firebase initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing Firebase: {str(e)}")
        raise
