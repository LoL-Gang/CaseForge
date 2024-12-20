from flask import Flask, request, jsonify
from flask_cors import CORS
from concurrent.futures import ThreadPoolExecutor
import asyncio
import logging
from datetime import datetime
from gemini_api import generate_case_study, generate_qa

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def run_async(func, *args, **kwargs):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    result = loop.run_until_complete(func(*args, **kwargs))
    loop.close()
    return result

@app.route('/generate', methods=['POST'])
def generate():
    logger.info("Received request to generate case study")
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    parameters = {
        'role': data.get('interviewRole', ''),
        'industry': data.get('industry', ''),
        'difficulty': data.get('difficulty', 'Medium'),
        'focus_area': 'Product Strategy'  # Example focus area
    }

    try:
        with ThreadPoolExecutor() as executor:
            future_case_study = executor.submit(run_async, generate_case_study, "", parameters)
            generated_case_study = future_case_study.result()

            future_qa = executor.submit(run_async, generate_qa, generated_case_study, parameters)
            qa = future_qa.result()

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

        return jsonify(response_data)
    except Exception as e:
        logger.error(f"Error processing generate request: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
