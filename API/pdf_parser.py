# pdf_parser.py
import fitz  # PyMuPDF
import logging

logger = logging.getLogger(__name__)

def parse_pdf(file_path: str) -> str:
    """Parse a PDF file and extract its text content."""
    logger.info(f"Attempting to parse PDF: {file_path}")
    try:
        doc = fitz.open(file_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        logger.info(f"Successfully parsed PDF, extracted {len(text)} characters")
        return text.strip()
    except Exception as e:
        logger.error(f"Error parsing PDF: {str(e)}")
        raise
