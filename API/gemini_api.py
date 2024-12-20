import aiohttp
import json
import logging
import re
from config import api_key
from utils import extract_qa_pairs
from aiohttp import ClientTimeout

logger = logging.getLogger(__name__)

async def generate_case_study(similar_case_study: str, parameters: dict) -> str:
    """Generate a new case study using Gemini API asynchronously."""
    logger.info("Generating case study with Gemini API")
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }
    prompt = f"""
    Create a detailed case study based on the following specifications:

    Industry: {parameters.get('industry', 'Technology')}
    Role: {parameters.get('role', 'Product Manager')}
    Difficulty: {parameters.get('difficulty', 'Medium')}
    Estimated Completion Time: {parameters.get('time_constraint', 'No Time Limit')}
    Focus Area: Product Strategy

    Requirements:
    1. Background & Context
       - Detailed company description
       - Current market dynamics
       - Identification of key challenges
    
    2. Problem Statement
       - Clear articulation of the main problem
       - Stakeholders involved
       - Expected business impact
    
    3. Data & Constraints
       - Data availability and key metrics
       - Technical constraints
       - Budget and resource limitations
       - Timeline implications
    
    4. Proposed Solution
       - Various strategies and approaches
       - Evaluation of trade-offs
       - Key success metrics
    
    5. Implementation Plan
       - Proposed timeline
       - Resources allocation
       - Risk management strategies
    
    Note: Ensure the case study is realistic, includes specific metrics and data, matches the difficulty level of {parameters.get('difficulty')}, and can be realistically approached within {parameters.get('time_constraint')}.
    """

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

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload, timeout=ClientTimeout(total=30)) as response:
                logger.info(f"Gemini API response status: {response.status}")
                if response.status == 200:
                    content = await response.json()
                    generated_text = content['candidates'][0]['content']['parts'][0]['text']
                    logger.info(f"Successfully generated case study of length: {len(generated_text)}")
                    return generated_text
                else:
                    response_text = await response.text()
                    logger.error(f"Gemini API error: {response_text}")
                    raise Exception(f"Failed to generate case study: {response_text}")
    except Exception as e:
        logger.error(f"Error in generate_case_study: {str(e)}")
        raise

async def generate_qa(case_study: str, parameters: dict) -> list:
    """Generate questions and answers using Gemini API asynchronously."""
    logger.info("Generating Q&A with Gemini API")
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": api_key
    }
    prompt = f"""
    Based on this case study, generate 5 insightful questions with detailed answers, focusing on strategic and operational challenges.

    Case Study Text:
    {case_study}

    Questions should:
    - Be challenging and provoke critical thinking.
    - Be relevant to the role of {parameters.get('role')} and the industry of {parameters.get('industry')}.
    - Test decision-making capabilities and practical application.
    - Include justification for each answer.
    - Cover various aspects of the case study.

    Note: Ensure the questions are appropriate for completion within {parameters.get('time_constraint')}.
    
    Please format as a JSON array of Q&A pairs.
    """

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

    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(url, headers=headers, json=payload, timeout=ClientTimeout(total=60)) as response:
                logger.info(f"Gemini API Q&A response status: {response.status}")
                if response.status == 200:
                    content = await response.json()
                    qa_text = content['candidates'][0]['content']['parts'][0]['text']
                    logger.info(f"Raw Q&A response: {qa_text}")
                    try :
                        json_match = re.search(r'\[.*\]', qa_text.replace('\n', ''), re.DOTALL)
                        if json_match:
                            qa_text = json_match.group()
                        qa_list = json.loads(qa_text)
                        logger.info(f"Successfully generated {len(qa_list)} Q&A pairs")
                        return qa_list
                    except json.JSONDecodeError as e :
                        logger.error(f"Error parsing Q&A JSON response: {str(e)}")
                        return extract_qa_pairs(qa_text)
                    
                else:
                    response_text = await response.text()
                    logger.error(f"Gemini API Q&A error: {response_text}")
                    raise Exception(f"Failed to generate Q&A: {response_text}")
                
    except Exception as e:
        logger.error(f"Error in generate_qa: {str(e)}")
        raise
    
