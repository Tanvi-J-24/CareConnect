# CareConnect

### One-stop healthcare coordination for patients and clinics

CareConnect is a two-sided healthcare discovery and coordination platform.

Patients can discover local healthcare facilities, manage appointments, access emergency coordination services, and search demonstration blood availability.

Clinics can create and manage their facility profiles, list their services, become discoverable to patients, and manage incoming appointments and requests from one dashboard.

## Problem

People moving to a new area may struggle to discover nearby healthcare facilities and available services. At the same time, local and newly established clinics may have difficulty becoming discoverable to people in their surrounding area.

Healthcare coordination is also often fragmented across different platforms.

## Solution

CareConnect connects both sides of the healthcare journey:

**Patients**

* Discover healthcare facilities
* Search clinics and hospitals by location and services
* View facility information
* Book appointments
* Cancel or reschedule appointments
* Request emergency assistance
* Search demonstration blood availability

**Clinics**

* Create and manage facility profiles
* List healthcare services
* Make their facility discoverable to patients
* Manage incoming appointments
* Manage healthcare coordination requests

## Key USP

> **One platform connecting patients looking for healthcare with clinics looking to be discovered.**

CareConnect provides a unified layer for healthcare discovery, appointment management, and essential coordination workflows.

## Technologies Used

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** FastAPI, Python
* **Database:** SQLite, SQLAlchemy
* **Deployment:** Docker, Google Cloud Run
* **Version Control:** Git, GitHub

## Architecture

```text
Patient / Clinic
       ↓
React + Vite Frontend
       ↓
FastAPI Backend
       ↓
SQLAlchemy
       ↓
SQLite Database
       ↓
Docker Container
       ↓
Google Cloud Run
```

## Main Features

### Patient Dashboard

* Healthcare facility discovery
* Facility and service search
* Appointment booking
* Appointment cancellation
* Appointment rescheduling
* Emergency request
* Blood availability search
* Patient profile

### Clinic Dashboard

* Facility profile management
* Service management
* Facility listing
* Appointment management
* Patient/request management
* Healthcare coordination

### Authentication

Separate authentication and dashboard experiences are provided for patients and clinics.

## Running Locally

### Prerequisites

* Python 3.11+
* Node.js and npm
* Git

### Backend

```bash
cd backend
python -m venv venv
```

Windows:

```powershell
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

Open:

```text
http://localhost:8000
```

### Frontend Development

If running the frontend separately:

```bash
cd frontend
npm install
npm run dev
```

The production architecture builds the React frontend and serves it through FastAPI.

## Docker

Build:

```bash
docker build -t careconnect .
```

Run:

```bash
docker run -p 8080:8080 careconnect
```

Then open:

```text
http://localhost:8080
```

## Deployment

CareConnect can be deployed as a single container to Google Cloud Run.

Example:

```bash
gcloud run deploy careconnect --source . --platform managed --allow-unauthenticated --region asia-south1 --port 8080
```

## Healthcare Safety

CareConnect is an administrative healthcare coordination prototype.

It does **not** provide:

* Medical diagnosis
* Treatment recommendations
* Prescriptions
* Clinical decision-making

Emergency ambulance and blood availability features use demonstration/simulated data in this prototype. A production system would integrate verified healthcare, ambulance, and blood-bank providers.

## Future Scope

* Verified healthcare provider onboarding
* Real blood-bank integrations
* Ambulance service integrations
* Maps and location-based discovery
* Notifications
* PostgreSQL/Cloud SQL for production-scale data
* More advanced clinic and appointment management

## Project Status

**Hackathon MVP — Functional Prototype**
