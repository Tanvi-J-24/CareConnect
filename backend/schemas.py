from pydantic import BaseModel
from typing import Optional, List

# Auth
class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    patient_id: Optional[int]
    facility_id: Optional[int]
    class Config:
        from_attributes = True

# Patients
class PatientBase(BaseModel):
    name: str
    age: int
    gender: str
    phone: str
    blood_group: str
    emergency_contact: str

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    class Config:
        from_attributes = True

# Facilities
class FacilityBase(BaseModel):
    name: str
    location: str
    description: Optional[str] = ""
    contact: Optional[str] = ""
    is_listed: Optional[bool] = True
    services: str
    emergency_availability: bool
    appointment_availability: bool

class FacilityUpdate(FacilityBase):
    pass

class FacilityResponse(FacilityBase):
    id: int
    class Config:
        from_attributes = True

# Doctors
class DoctorResponse(BaseModel):
    id: int
    name: str
    specialty: str
    facility_id: int
    class Config:
        from_attributes = True

# Appointments
class AppointmentBase(BaseModel):
    patient_id: int
    doctor_id: int
    facility_id: int
    date: str
    time: str

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    status: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None

class AppointmentResponse(AppointmentBase):
    id: int
    status: str
    patient: Optional[PatientResponse] = None
    doctor: Optional[DoctorResponse] = None
    facility: Optional[FacilityResponse] = None
    class Config:
        from_attributes = True

# Emergency
class EmergencyRequestBase(BaseModel):
    patient_name: str
    phone: str
    location: str
    emergency_type: str
    ambulance_required: bool
    notes: Optional[str] = ""

class EmergencyRequestCreate(EmergencyRequestBase):
    pass

class EmergencyRequestUpdate(BaseModel):
    status: str

class EmergencyRequestResponse(EmergencyRequestBase):
    id: int
    status: str
    class Config:
        from_attributes = True

# Blood Bank
class BloodBankResponse(BaseModel):
    id: int
    name: str
    location: str
    blood_group: str
    available_units: int
    availability_status: str
    class Config:
        from_attributes = True
