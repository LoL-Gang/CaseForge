# CaseForge

CaseForge is a dynamic case study generator that leverages the Gemini API to create comprehensive and hypothetical case studies. It offers an intuitive interface with easy-to-use dropdowns for customization, enabling users to practice with detailed Q&A scenarios.

## Features
- **Dynamic Case Study Generation**: Automatically generates case studies using the Gemini API.
- **User-Friendly Interface**: Easy dropdown selections for customization.
- **Q&A Practice**: Presents detailed hypothetical scenarios with corresponding questions and answers.
- **Modular Architecture**: Clear separation of frontend, backend, and API logic.

---

## File Structure Overview

### Root Directory
```
CaseForge/
├── API/
├── caseforge-backend/
├── FRONTEND/
├── .gitignore
├── LICENSE
└── readme.md
```

### API Directory
Contains Python-based API logic for interacting with the Gemini API and processing case study data.
```
API/
├── chroma_db/              # Directory for database interactions.
├── Data/                   # Directory containing data-related files.
├── env/                    # Environment-related configurations.
├── firebase-config/       # Firebase configurations.
├── .env                   # Environment variable file.
├── .gitignore
├── api_readme.md          # API-specific documentation.
├── app.py                 # Main API application file.
├── config.py              # Configuration settings for the API.
├── firebase.py            # Firebase helper functions.
├── gemini_api.py          # Integration with Gemini API.
├── pdf_parser.py          # PDF parsing utilities.
├── requirements.txt       # Python dependencies.
├── server_*.log           # Server log files.
├── utils.py               # Utility functions.
└── vectorization.py       # Vectorization logic for data.
```

### Backend Directory
Combines both Python and Node.js logic for backend services.
```
caseforge-backend/
├── chroma_db/              # Database logic.
├── Data/                   # Data-related files.
├── env/                    # Environment configurations.
├── firebase-config/       # Firebase configurations.
├── node_modules/          # Node.js dependencies.
├── venv/                  # Python virtual environment.
├── .env                   # Environment variable file.
├── index.html             # HTML entry point for backend rendering.
├── package.json           # Node.js dependencies.
├── requirements.txt       # Python dependencies.
├── server.js              # Main Node.js backend server.
└── vectorizer_with_gemini.py # Data vectorization logic.
```

### Frontend Directory
Contains the React-based frontend for user interactions.
```
FRONTEND/
├── case-forge-frontend/
├── frontend_readme.md     # Frontend-specific documentation.
├── .gitignore
├── LICENSE
├── readme.md
```

#### Frontend Details
```
case-forge-frontend/
├── public/                # Public assets like images and favicon.
├── src/                   # Source code for the React app.
│   ├── assets/         # Static assets.
│   ├── components/    # Reusable React components.
│   ├── lib/           # Libraries and helper functions.
│   ├── router/        # Routing logic.
│   ├── screens/      # Individual screen components.
│   └── main.tsx      # Main entry point for React app.
├── .gitignore
├── package.json           # Node.js dependencies.
├── tailwind.config.js      # Tailwind CSS configuration.
└── vite.config.ts         # Vite configuration file.
```

---

## Code Explanation

### API
- **app.py**: The main Flask application file. Manages API routes and integrates with the Gemini API.
- **gemini_api.py**: Handles requests to and responses from the Gemini API.
- **vectorization.py**: Processes and vectorizes data for case study generation.

### Backend
- **server.js**: Node.js server responsible for handling backend logic and API endpoints.
- **vectorizer_with_gemini.py**: Additional processing for vectorization integrated with the Gemini API.

### Frontend
- **main.tsx**: The entry point of the React application.
- **components/**: Modular React components for UI elements.
- **screens/**: Contains different page layouts for the app.

---

## Setup Instructions

### Prerequisites
- Node.js
- Python 3.x
- Vite (for frontend)
- Firebase (for backend integration)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-repo/CaseForge.git
   cd CaseForge
   ```

2. **Set Up API**:
   ```bash
   cd API
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set Up Backend**:
   ```bash
   cd caseforge-backend
   npm install
   ```

4. **Set Up Frontend**:
   ```bash
   cd FRONTEND/case-forge-frontend
   npm install
   npm run dev
   ```

5. **Run the Application**:
   - API: `python app.py`
   - Backend: `node server.js`
   - Frontend: `npm run dev`

---

## Contribution Guidelines
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description.

---

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

---

## Contact
For further questions, reach out at [email@example.com].

