# vectorization.py

import spacy
import chromadb
import numpy as np
import os
import logging

from chromadb import Client 
from chromadb.config import Settings
from chromadb.errors import NotFoundError,InvalidCollectionException

logger = logging.getLogger(__name__)

# Initialize spaCy model
try:
    logger.info("Loading spaCy model...")
    nlp = spacy.load("en_core_web_md")
    logger.info("spaCy model loaded successfully")
except OSError:
    logger.warning("spaCy model not found, downloading...")
    os.system("python -m spacy download en_core_web_md")
    nlp = spacy.load("en_core_web_md")
    logger.info("spaCy model downloaded and loaded")

# Initialize ChromaDB client and collection
client = None
collection = None

def initialize_chromadb():
    """Initialize ChromaDB and create/get the collection."""
    global client, collection
    try:
        logger.info("Initializing ChromaDB...")
        chroma_path = "./chroma_db"
        client = chromadb.PersistentClient(path=chroma_path)

        
        # Create directory if it doesn't exist
        if not os.path.exists(chroma_path):
            os.makedirs(chroma_path)
            logger.info(f"Created ChromaDB directory at {chroma_path}")

        # # Initialize ChromaDB Settings
        # settings = Settings(
        #     chroma_db_impl="duckdb+parquet",  # Specify the database implementation
        #     persist_directory=chroma_path      # Directory to persist the database
        # )

        # # Initialize ChromaDB Client with Settings
        # client = Client(settings=settings)
        client.heartbeat() 
        try:
            collection = client.get_collection("case_study_vectors")
            logger.info("Retrieved existing ChromaDB collection")
        except InvalidCollectionException:
            collection = client.create_collection("case_study_vectors")
            logger.info("Created new ChromaDB collection")

        logger.info("ChromaDB initialized successfully")
    except Exception as e:
        logger.error(f"Error initializing ChromaDB: {str(e)}")
        raise

def vectorize_text(text: str) -> np.ndarray:
    """Convert text to vector representation using spaCy."""
    logger.info(f"Vectorizing text of length: {len(text)}")
    try:
        doc = nlp(text)
        logger.info("Text vectorized successfully")
        return doc.vector
    except Exception as e:
        logger.error(f"Error vectorizing text: {str(e)}")
        raise

def store_vectors_in_chromadb(case_studies: list) -> None:
    """Store text vectors in ChromaDB."""
    logger.info(f"Storing vectors for {len(case_studies)} case studies")
    try:
        for case_study in case_studies:
            text = case_study['text']
            vector = vectorize_text(text)
            vector_list = vector.tolist()

            collection.add(
                embeddings=[vector_list],
                documents=[text],
                ids=[str(case_study['id'])]
            )
        # Persist data to disk
        # client.persist()
        logger.info("Vectors stored and persisted successfully in ChromaDB")
    except Exception as e:
        logger.error(f"Error storing vectors in ChromaDB: {str(e)}")
        raise

def find_similar_case_study(query_vector: np.ndarray, n_results: int = 1) -> str:
    """Find similar case studies in ChromaDB."""
    logger.info("Searching for similar case studies")
    try:
        results = collection.query(
            query_embeddings=[query_vector.tolist()],
            n_results=n_results,
            include=['documents']  # Ensure that documents are included in the results
        )

        if results and results['documents']:
            logger.info("Similar case study found")
            return results['documents'][0][0]
        logger.warning("No similar case study found")
        return ""
    except Exception as e:
        logger.error(f"Error finding similar case study: {str(e)}")
        raise
