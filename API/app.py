# app.py

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

        # Check or create the data directory
        data_dir = "./Data"
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
            logger.info(f"Created Data directory at {data_dir}")

        # Initialize case study files and parse PDFs
        case_study_files = ["./Data/case_study1.pdf"]  # You can add more files here
        case_studies = []

        for i, file_path in enumerate(case_study_files):
            logger.info(f"Processing file {i+1}/{len(case_study_files)}: {file_path}")

            if not os.path.exists(file_path):
                logger.error(f"Case study file not found at {file_path}")
                return jsonify({"error": f"Case study file not found: {file_path}"}), 404

            text = parse_pdf(file_path)
            if not text:
                logger.error("No text extracted from PDF")
                return jsonify({"error": "Failed to extract text from PDF"}), 500

            case_studies.append({"id": i, "text": text})
            logger.info(f"Successfully processed file {i+1}")

        # Store vectors and find a similar case study
        logger.info("Storing vectors in ChromaDB...")
        store_vectors_in_chromadb(case_studies)

        logger.info("Finding similar case study...")
        query_vector = vectorize_text("Generate a product management case study")
        similar_case_study = find_similar_case_study(query_vector)

        if not similar_case_study:
            logger.error("No similar case study found")
            return jsonify({"error": "Failed to find similar case study"}), 500

        # Generate new case study
        logger.info("Generating new case study...")
        try:
            generated_case_study = generate_case_study(similar_case_study, parameters)
        except Exception as e:
            logger.error(f"Error generating case study: {str(e)}")
            return jsonify({
                "case_study": "Error generating case study",
                "error": str(e),
                "questions_and_answers": [
                    {
                        "question": "Error occurred",
                        "answer": f"An error occurred while generating the content: {str(e)}"
                    }
                ]
            }), 500

        if not generated_case_study:
            logger.error("Failed to generate case study")
            return jsonify({"error": "Failed to generate case study"}), 500

        # Log the generated case study for debugging
        logger.info(f"Generated case study length: {len(generated_case_study)}")
        logger.info("Case study preview: " + generated_case_study[:200] + "...")

        # Generate Q&A based on the generated case study
        logger.info("Generating Q&A...")
        try:
            qa = generate_qa(generated_case_study, parameters)
        except Exception as e:
            logger.error(f"Error generating Q&A: {str(e)}")
            return jsonify({
                "case_study": generated_case_study,
                "questions_and_answers": [
                    {
                        "question": "Error occurred",
                        "answer": f"An error occurred while generating the Q&A: {str(e)}"
                    }
                ],
                "metadata": {
                    "generated_at": datetime.now().isoformat(),
                    "parameters": parameters,
                    "case_study_length": len(generated_case_study),
                    "num_qa_pairs": 0
                }
            }), 500

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
