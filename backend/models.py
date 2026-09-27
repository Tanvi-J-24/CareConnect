from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=True)
    facility_id = Column(Integer, ForeignKey("facilities.id"), nullable=True)

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    gender = Column(String)
    phone = Column(String)
    blood_group = Column(String)
    emergency_contact = Column(String)
    
    appointments = relationship("Appointment", back_populates="patient")

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    description = Column(String, default="")
    contact = Column(String, default="")
    is_listed = Column(Boolean, default=True)
    services = Column(String) # Comma separated
    emergency_availability = Column(Boolean, default=False)
    appointment_availability = Column(Boolean, default=True)

    doctors = relationship("Doctor", back_populates="facility")
    appointments = relationship("Appointment", back_populates="facility")

class Doctor(Base):
    __tablename__ = "doctors"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)
    facility_id = Column(Integer, ForeignKey("facilities.id"))

    facility = relationship("Facility", back_populates="doctors")
    appointments = relationship("Appointment", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    facility_id = Column(Integer, ForeignKey("facilities.id"))
    date = Column(String)
    time = Column(String)
    status = Column(String, default="Scheduled") # Scheduled, Completed, Cancelled

    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    facility = relationship("Facility", back_populates="appointments")

class EmergencyRequest(Base):
    __tablename__ = "emergency_requests"
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String)
    phone = Column(String)
    location = Column(String)
    emergency_type = Column(String)
    ambulance_required = Column(Boolean, default=False)
    notes = Column(String)
    status = Column(String, default="Request Received") # Request Received, Assigned, Completed

class BloodBank(Base):
    __tablename__ = "blood_banks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    blood_group = Column(String)
    available_units = Column(Integer)
    availability_status = Column(String) # Available, Low, Unavailable
