# CareConnect MVP

One-stop healthcare coordination for appointments, clinic services and emergency assistance.

## Architecture

This project uses a simple monorepo architecture tailored for a fast hackathon MVP:
- **Backend:** FastAPI, SQLite (served on port 8000 locally).
- **Frontend:** React, Vite, Tailwind CSS (served on port 5173 locally).
- **Production:** A single Docker image where FastAPI mounts the built React static files to serve them directly, making it extremely easy to deploy to Google Cloud Run.

## Local Setup

### 1. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
python seed.py          # Seeds demo data
uvicorn main:app --reload
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Cloud Run Deployment

You can deploy the single container to Google Cloud Run using the following command:

```bash
gcloud run deploy careconnect --source . --platform managed --allow-unauthenticated --region us-central1 --port 8080
```

*Disclaimer: This application must NOT provide medical diagnosis, treatment recommendations, prescriptions, medical decision-making or clinical advice. It is strictly an administrative and healthcare-coordination platform.*
