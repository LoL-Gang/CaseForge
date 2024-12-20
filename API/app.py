from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from firebase import initialize_firebase
from config import api_key, firebase_db_url
from pdf_parser import parse_pdf
from vectorization import (
    initialize_chromadb,
    store_vectors_in_chromadb,
    find_similar_case_study,
    vectorize_text
)
from gemini_api import generate_case_study, generate_qa
from utils import setup_logging, extract_qa_pairs
import os
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

logger.info("Starting server initialization...")

# Initialize Firebase
initialize_firebase(firebase_db_url)

# Initialize ChromaDB and spaCy model
initialize_chromadb()

def run_async(func, *args, **kwargs):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(func(*args, **kwargs))
    loop.close()
    return result

@app.route('/')
def index():
    """Serve the HTML interface."""
    return send_file('test.html')

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint to verify server is working."""
    logger.info("Test endpoint called")
    return jsonify({
        "message": "Server is working!",
        "status": "OK",
        "endpoints": {
            "test": "GET /test",
            "generate": "POST /generate"
        },
        "api_status": {
            "firebase": "connected" if firebase_db_url else "not configured",
            "gemini": "configured" if api_key else "not configured",
            "spacy": "loaded",
            "chromadb": "initialized"
        }
    })

@app.route('/generate', methods=['POST'])
def generate():
    """Generate endpoint for case study generation."""
    logger.info("\n=== Starting generate endpoint ===")

    try:
        # Check if the request has JSON content
        if not request.is_json:
            logger.error("Request must be JSON")
            return jsonify({"error": "Request must be JSON"}), 400

        data = request.get_json()
        logger.debug(f"Raw request data: {data}")

        parameters = data.get('parameters')
        logger.info(f"Parameters received: {parameters}")

        if not parameters:
            logger.error("No parameters provided")
            return jsonify({"error": "No parameters provided"}), 400

        # Validate required parameters
        required_params = ['industry', 'role', 'difficulty', 'focus_area']
        missing_params = [param for param in required_params if param not in parameters]
        if missing_params:
            logger.error(f"Missing required parameters: {missing_params}")
            return jsonify({"error": f"Missing required parameters: {missing_params}"}), 400

        # Additional validation
        allowed_difficulties = ["Easy", "Medium", "Hard"]
        if parameters['difficulty'] not in allowed_difficulties:
            logger.error(f"Invalid difficulty level: {parameters['difficulty']}")
            return jsonify({"error": f"Invalid difficulty level. Allowed values: {allowed_difficulties}"}), 400

        # Execute the async functions in a thread pool
        with ThreadPoolExecutor() as executor:
            future_case_study = executor.submit(run_async, generate_case_study, "some reference case study text", parameters)
            generated_case_study = future_case_study.result()  # This will wait for the async function to complete

            if not generated_case_study:
                logger.error("Failed to generate case study")
                return jsonify({"error": "Failed to generate case study"}), 500

            future_qa = executor.submit(run_async, generate_qa, generated_case_study, parameters)
            qa = future_qa.result()  # This will wait for the async function to complete

        logger.info(f"Q&A generation completed. Generated {len(qa)} pairs")

        # Prepare response data
        response_data = {
            "case_study": generated_case_study,
            "questions_and_answers": qa,
            "metadata": {
                "generated_at": datetime.now().isoformat(),
                "parameters": parameters,
                "case_study_length": len(generated_case_study),
                "num_qa_pairs": len(qa)
            }
        }

        # Log response preparation
        logger.info("Preparing response with case study and Q&A")
        logger.info(f"Response data keys: {response_data.keys()}")

        logger.info("=== Generate endpoint completed successfully ===\n")
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Error in generate endpoint: {str(e)}")
        return jsonify({
            "error": str(e),
            "case_study": "Error generating case study",
            "questions_and_answers": [{
                "question": "Error occurred",
                "answer": f"An error occurred while generating the content: {str(e)}"
            }]
        }), 500

if __name__ == '__main__':
    # Bind to localhost (127.0.0.1) and port 3000 for testing
    app.run(host='127.0.0.1', port=3000, debug=True)
