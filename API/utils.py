# utils.py

import logging
from datetime import datetime
from logging.handlers import RotatingFileHandler

logger = logging.getLogger(__name__)

def setup_logging():
    """Configure logging for the application."""
    logger.setLevel(logging.DEBUG)  # Set to DEBUG for detailed logs
    formatter = logging.Formatter(
        '%(asctime)s - %(levelname)s - %(name)s - %(message)s'
    )

    # Rotating File Handler: 5 files, 1MB each
    file_handler = RotatingFileHandler(
        f'server_{datetime.now().strftime("%Y%m%d")}.log',
        maxBytes=1_000_000,
        backupCount=5
    )
    file_handler.setFormatter(formatter)

    # Stream Handler (console)
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    # Add handlers to the logger
    logger.addHandler(file_handler)
    logger.addHandler(stream_handler)

def extract_qa_pairs(text: str) -> list:
    """Extract Q&A pairs from text if JSON parsing fails."""
    logger.info("Attempting to extract Q&A pairs from text")
    qa_pairs = []
    lines = text.split('\n')
    current_question = None
    current_answer = []

    for line in lines:
        line = line.strip()
        if line.startswith(('Q:', 'Question:')):
            if current_question:
                qa_pairs.append({
                    'question': current_question,
                    'answer': ' '.join(current_answer)
                })
            current_question = line.split(':', 1)[1].strip()
            current_answer = []
        elif line.startswith(('A:', 'Answer:')) and current_question:
            answer_text = line.split(':', 1)[1].strip()
            current_answer.append(answer_text)
        elif line and current_question:
            current_answer.append(line)

    if current_question:
        qa_pairs.append({
            'question': current_question,
            'answer': ' '.join(current_answer)
        })

    logger.info(f"Extracted {len(qa_pairs)} Q&A pairs")
    return qa_pairs
