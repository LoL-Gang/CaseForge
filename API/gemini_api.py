# gemini_api.py

import requests
import json
import logging
from config import api_key
import re
from utils import extract_qa_pairs
from requests.exceptions import Timeout

logger = logging.getLogger(__name__)

def generate_case_study(similar_case_study: str, parameters: dict) -> str:
    """Generate a new case study using Gemini API."""
    logger.info("Generating case study with Gemini API")
    try:
        prompt = f"""
        Create a detailed product management case study following these requirements:
        
        Context:
        - Industry: {parameters.get('industry', 'Technology')}
        - Role Focus: {parameters.get('role', 'Product Manager')}
        - Difficulty Level: {parameters.get('difficulty', 'Medium')}
        - Focus Area: {parameters.get('focus_area', 'Product Strategy')}
        
        Case Study Structure:
        1. Background & Context
           - Company description
           - Market situation
           - Current challenges
        
        2. Problem Statement
           - Clear definition of the main problem
           - Key stakeholders involved
           - Business impact
        
        3. Data & Constraints
           - Available data and metrics
           - Technical limitations
           - Budget/resource constraints
           - Timeline considerations
        
        4. Requirements
           - Business requirements
           - User needs
           - Technical requirements
        
        5. Solution Space
           - Potential approaches
           - Trade-offs analysis
           - Success metrics
        
        6. Implementation Considerations
           - Timeline
           - Resource allocation
           - Risk mitigation
        
        Reference case study for style (but create entirely new content):
        {similar_case_study}
        
        Important:
        - Make it detailed and realistic
        - Include specific numbers and metrics
        - Present clear trade-offs and decision points
        - Focus on {parameters.get('focus_area')} aspects
        - Match the {parameters.get('difficulty')} difficulty level
        - Make it relevant to {parameters.get('industry')} industry
        """

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }

        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        logger.info("Sending request to Gemini API...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        logger.info(f"Gemini API response status: {response.status_code}")

        if response.status_code == 200:
            content = response.json()
            generated_text = content['candidates'][0]['content']['parts'][0]['text']
            logger.info(f"Successfully generated case study of length: {len(generated_text)}")
            return generated_text
        else:
            logger.error(f"Gemini API error: {response.text}")
            raise Exception(f"Failed to generate case study: {response.text}")
    except Timeout:
        logger.error("Gemini API request timed out")
        raise Exception("Gemini API request timed out")
    except Exception as e:
        logger.error(f"Error in generate_case_study: {str(e)}")
        raise

def generate_qa(case_study: str, parameters: dict) -> list:
    """Generate questions and answers using Gemini API."""
    logger.info("Generating Q&A with Gemini API")
    try:
        prompt = f"""
        Based on this case study, generate 5 challenging and thought-provoking questions with detailed answers.
        Focus on critical thinking and decision-making aspects.

        Case Study:
        {case_study}

        Generate questions that:
        - Match the {parameters.get('difficulty', 'Medium')} difficulty level
        - Focus on {parameters.get('focus_area', 'Product Strategy')} aspects
        - Test both strategic thinking and practical implementation
        - Require analysis and justification in answers
        - Cover different aspects of the case study

        Format each Q&A pair as:
        {{
            "question": "Detailed question here?",
            "answer": "Comprehensive answer with analysis and justification"
        }}

        Provide exactly 5 Q&A pairs in a valid JSON array.
        """

        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        headers = {
            "Content-Type": "application/json",
            "x-goog-api-key": api_key
        }

        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 2048,
            }
        }

        logger.info("Sending request to Gemini API for Q&A...")
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        logger.info(f"Gemini API Q&A response status: {response.status_code}")

        if response.status_code == 200:
            content = response.json()
            qa_text = content['candidates'][0]['content']['parts'][0]['text']
            logger.info(f"Raw Q&A response: {qa_text}")

            try:
                # Try to find JSON array in the response
                json_match = re.search(r'\[.*\]', qa_text.replace('\n', ''), re.DOTALL)
                if json_match:
                    qa_text = json_match.group()

                qa_list = json.loads(qa_text)
                logger.info(f"Successfully generated {len(qa_list)} Q&A pairs")
                return qa_list
            except json.JSONDecodeError as e:
                logger.error(f"Error parsing Q&A JSON response: {str(e)}")
                logger.info("Falling back to manual Q&A extraction")
                return extract_qa_pairs(qa_text)
        else:
            logger.error(f"Gemini API Q&A error: {response.text}")
            raise Exception(f"Failed to generate Q&A: {response.text}")
    except Timeout:
        logger.error("Gemini API Q&A request timed out")
        raise Exception("Gemini API Q&A request timed out")
    except Exception as e:
        logger.error(f"Error in generate_qa: {str(e)}")
        raise
