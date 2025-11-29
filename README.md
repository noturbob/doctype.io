Doctype.io

A RAG-powered document Q&A system that allows users to upload PDFs and ask questions about them using AI.
🚀 Features

    📄 PDF document upload and processing
    🤖 AI-powered question answering using Google Gemini
    💾 Vector storage with Upstash
    🔐 Authentication with Clerk
    ⚡ Built with FastAPI + React

🛠️ Tech Stack

Backend:

    FastAPI
    LangChain
    Google Generative AI (Gemini)
    Upstash Vector Database
    PyPDF for document processing

Frontend:

    React TypeScript
    Clerk for authentication
    Tailwind
    Framer Motion

📦 Installation
Backend Setup

    Navigate to backend directory:

bash

cd backend

    Create virtual environment:

bash

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

    Install dependencies:

bash

pip install -r requirements.txt

    Create .env file (copy from .env.example):

bash

cp .env.example .env

    Add your API keys to .env:

    Get Google API key from Google AI Studio
    Get Upstash credentials from Upstash Console
    Get Clerk secret key from Clerk Dashboard

    Run the server:

bash

uvicorn app.main:app --reload

Backend will be available at http://127.0.0.1:8000
Frontend Setup

    Navigate to frontend directory:

bash

cd frontend

    Install dependencies:

bash

npm install

    Create .env file (copy from .env.example):

bash

cp .env.example .env

    Add your Clerk publishable key to .env
    Start the development server:

bash

npm start

Frontend will be available at http://localhost:3000
🎯 Usage

    Start both backend and frontend servers
    Sign in with Clerk
    Upload a PDF document
    Ask questions about the document
    Get AI-powered answers based on the document content

🔑 Environment Variables
Backend (.env)

GOOGLE_API_KEY=your_google_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_token
CLERK_SECRET_KEY=your_clerk_secret_key
FRONTEND_URL=http://localhost:3000

Frontend (.env)

REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

📝 API Documentation

Once the backend is running, visit http://127.0.0.1:8000/docs for interactive API documentation.
Endpoints

    GET / - Health check
    POST /ingest - Upload and process PDF
    POST /chat - Ask questions about uploaded documents

⚠️ Rate Limits

Google's free tier has limits:

    1,500 requests per day
    15 requests per minute

The system includes automatic rate limiting and retry logic to handle these limits gracefully.
🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
📄 License

This project is open source and available under the MIT License.
🙏 Acknowledgments

    Google Generative AI for embeddings and chat
    Upstash for vector storage
    LangChain for RAG orchestration
    Clerk for authentication

