from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os

from database import engine, Base, get_db
import models, schemas

Base.metadata.create_all(bind=engine)

app = FastAPI(title="CareConnect API")

# Enable CORS for local dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth Endpoints
@app.post("/api/login", response_model=schemas.UserResponse)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username, models.User.password == user.password).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return db_user

# Patient Endpoints
@app.post("/api/patients", response_model=schemas.PatientResponse)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    db_patient = models.Patient(**patient.model_dump())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@app.get("/api/patients", response_model=list[schemas.PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return db.query(models.Patient).all()

# Facilities Endpoints
@app.get("/api/facilities", response_model=list[schemas.FacilityResponse])
def get_facilities(search: str = None, db: Session = Depends(get_db)):
    query = db.query(models.Facility).filter(models.Facility.is_listed == True)
    if search:
        query = query.filter(models.Facility.name.icontains(search) | models.Facility.services.icontains(search))
    return query.all()

@app.put("/api/facilities/{facility_id}", response_model=schemas.FacilityResponse)
def update_facility(facility_id: int, facility_update: schemas.FacilityUpdate, db: Session = Depends(get_db)):
    db_fac = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    if not db_fac:
        raise HTTPException(status_code=404, detail="Facility not found")
    for key, value in facility_update.model_dump().items():
        setattr(db_fac, key, value)
    db.commit()
    db.refresh(db_fac)
    return db_fac

# Doctors Endpoints
@app.get("/api/doctors", response_model=list[schemas.DoctorResponse])
def get_doctors(facility_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Doctor)
    if facility_id:
        query = query.filter(models.Doctor.facility_id == facility_id)
    return query.all()

# Appointments Endpoints
@app.post("/api/appointments", response_model=schemas.AppointmentResponse)
def create_appointment(appointment: schemas.AppointmentCreate, db: Session = Depends(get_db)):
    db_app = models.Appointment(**appointment.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    return db_app

@app.get("/api/appointments", response_model=list[schemas.AppointmentResponse])
def get_appointments(patient_id: int = None, facility_id: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Appointment)
    if patient_id:
        query = query.filter(models.Appointment.patient_id == patient_id)
    if facility_id:
        query = query.filter(models.Appointment.facility_id == facility_id)
    return query.all()

@app.put("/api/appointments/{app_id}", response_model=schemas.AppointmentResponse)
def update_appointment(app_id: int, app_update: schemas.AppointmentUpdate, db: Session = Depends(get_db)):
    db_app = db.query(models.Appointment).filter(models.Appointment.id == app_id).first()
    if not db_app:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    if app_update.status:
        db_app.status = app_update.status
    if app_update.date:
        db_app.date = app_update.date
    if app_update.time:
        db_app.time = app_update.time
        
    db.commit()
    db.refresh(db_app)
    return db_app

# Emergency Requests
@app.post("/api/emergency", response_model=schemas.EmergencyRequestResponse)
def create_emergency(req: schemas.EmergencyRequestCreate, db: Session = Depends(get_db)):
    db_req = models.EmergencyRequest(**req.model_dump())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@app.get("/api/emergency", response_model=list[schemas.EmergencyRequestResponse])
def get_emergency_requests(db: Session = Depends(get_db)):
    return db.query(models.EmergencyRequest).all()

@app.put("/api/emergency/{req_id}", response_model=schemas.EmergencyRequestResponse)
def update_emergency(req_id: int, req_update: schemas.EmergencyRequestUpdate, db: Session = Depends(get_db)):
    db_req = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.id == req_id).first()
    if not db_req:
        raise HTTPException(status_code=404, detail="Request not found")
    db_req.status = req_update.status
    db.commit()
    db.refresh(db_req)
    return db_req

# Blood Banks
@app.get("/api/blood-banks", response_model=list[schemas.BloodBankResponse])
def get_blood_banks(blood_group: str = None, location: str = None, db: Session = Depends(get_db)):
    query = db.query(models.BloodBank)
    if blood_group:
        query = query.filter(models.BloodBank.blood_group == blood_group)
    if location:
        query = query.filter(models.BloodBank.location.icontains(location))
    return query.all()

# Dashboard Stats
@app.get("/api/dashboard/stats")
def get_stats(db: Session = Depends(get_db)):
    total_appointments = db.query(models.Appointment).count()
    pending_appointments = db.query(models.Appointment).filter(models.Appointment.status == "Scheduled").count()
    emergency_requests = db.query(models.EmergencyRequest).count()
    ambulance_requests = db.query(models.EmergencyRequest).filter(models.EmergencyRequest.ambulance_required == True).count()
    return {
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "emergency_requests": emergency_requests,
        "ambulance_requests": ambulance_requests
    }

# Serve frontend build if exists
frontend_build_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_build_path):
    app.mount("/", StaticFiles(directory=frontend_build_path, html=True), name="frontend")
