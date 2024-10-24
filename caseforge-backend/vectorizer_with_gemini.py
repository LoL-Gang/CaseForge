import fitz  # PyMuPDF for PDF parsing
import spacy
import chromadb  # ChromaDB for local vector storage
import requests
import json
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
api_key = os.getenv('GEMINI_API_KEY')

# Load spaCy model
nlp = spacy.load("en_core_web_md")

# Initialize ChromaDB client
client = chromadb.Client()
collection = client.create_collection("case_study_vectors")

# Parse PDF function
def parse_pdf(file_path):
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

# Vectorize text
def vectorize_text(text):
    return nlp(text).vector

# Store vectors in ChromaDB
def store_vectors_in_chromadb(case_studies):
    for i, case in enumerate(case_studies):
        vector = vectorize_text(case["text"]).tolist()
        print(f"Storing vector for case study {i}")  # Debugging print
        collection.add(
            ids=[str(case["id"])],
            embeddings=[vector],
            metadatas=[{"text": case["text"]}]
        )

# Find the most similar case study using ChromaDB
def find_similar_case_study(query_vector):
    results = collection.query(
        query_embeddings=[query_vector.tolist()],
        n_results=1
    )
    
    if results and "metadatas" in results and len(results["metadatas"]) > 0:
        return results["metadatas"][0][0]["text"]
    else:
        raise ValueError("No similar case study found or 'metadatas' is missing.")

# Push query and similar case study to Gemini API
def push_to_gemini(prompt):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={api_key}"

    prompt_template = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(url, json=prompt_template, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        error_message = f"Failed to generate content, status code: {response.status_code}, message: {response.text}"
        print(f"Error response: {response.text}")  # Debugging print
        return {"error": error_message}

# Generate case study
def generate_case_study(case_study_text, parameters):
    prompt = f"""Generate a case study based on the following parameters:
    {json.dumps(parameters, indent=2)}
    
    Use the following existing case study as a reference:
    {case_study_text}
    
    Create a new case study that incorporates the given parameters and follows a similar structure to the reference case study."""

    result = push_to_gemini(prompt)
    
    if "error" in result:
        return result
    
    try:
        return result['candidates'][0]['content']['parts'][0]['text']
    except (IndexError, KeyError) as e:
        print("Error extracting case study from response:", e)
        print("Full response:", result)  # Debugging print
        return {"error": "Failed to extract case study from the response."}

# Generate questions and answers
def generate_qa(case_study, parameters):
    prompt = f"""Based on the following case study and parameters:

    Case Study:
    {case_study}

    Parameters:
    {json.dumps(parameters, indent=2)}

    Generate 5 relevant questions and their corresponding answers. Each question should test a different aspect of the case study and align with the learning objectives. Format the output as a JSON object with 'questions' as the key and a list of question-answer pairs as the value."""

    result = push_to_gemini(prompt)
    
    if "error" in result:
        return result
    
    qa_text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', "")
    
    if qa_text.strip() == "":
        print("No Q&A content returned.")
        return {"error": "No Q&A content returned from the API."}
    
    try:
        return json.loads(qa_text)  # Parse the JSON string into a Python object
    except json.JSONDecodeError as e:
        print("Error parsing Q&A JSON:", e)
        print("Raw Q&A text:", qa_text)  # Debugging print
        return {"error": "Failed to parse Q&A JSON."}

# Main function to handle query and integration with Gemini API
def generate_full_case_study(case_study_files, parameters):
    # Parse and vectorize PDFs
    case_studies = []
    for i, file_path in enumerate(case_study_files):
        text = parse_pdf(file_path)
        case_studies.append({"id": i, "text": text})

    # Store case study vectors in ChromaDB
    store_vectors_in_chromadb(case_studies)

    # Use a generic query to find a similar case study
    query = "Generate a product management case study"
    query_vector = vectorize_text(query)

    # Find the most similar case study
    similar_case_study = find_similar_case_study(query_vector)

    # Generate the new case study
    case_study = generate_case_study(similar_case_study, parameters)

    # Generate questions and answers
    qa = generate_qa(case_study, parameters)

    return {
        "case_study": case_study,
        "questions_and_answers": qa
    }

# Flask app
app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate():
    parameters = request.json['parameters']
    case_study_files = ["./Data/case_study1.pdf"]  # Update this path as needed
    result = generate_full_case_study(case_study_files, parameters)
    return jsonify(result)

if __name__ == "__main__":
    app.run(port=5000, debug=True)