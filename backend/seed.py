from database import SessionLocal, engine, Base
import models

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(models.Facility).count() == 0:
        facilities = [
            models.Facility(name="Pune General Hospital", location="Shivajinagar, Pune", description="A large multi-specialty hospital providing comprehensive healthcare.", contact="020-12345678", is_listed=True, services="Emergency, Cardiology, Orthopedics", emergency_availability=True, appointment_availability=True),
            models.Facility(name="City Care Clinic", location="Kothrud, Pune", description="A friendly neighborhood clinic for everyday medical needs.", contact="020-87654321", is_listed=True, services="General Medicine, Pediatrics", emergency_availability=False, appointment_availability=True),
            models.Facility(name="Sanjeevani Hospital", location="Wakad, Pune", description="Advanced trauma and surgical center.", contact="020-55555555", is_listed=True, services="Trauma Center, Surgery, Maternity", emergency_availability=True, appointment_availability=True),
        ]
        db.add_all(facilities)
        db.commit()

    if db.query(models.Patient).count() == 0:
        patients = [
            models.Patient(name="Demo Patient 1", age=30, gender="Male", phone="9876543210", blood_group="O+", emergency_contact="9876543211"),
        ]
        db.add_all(patients)
        db.commit()

    if db.query(models.User).count() == 0:
        users = [
            models.User(username="patient", password="password", role="patient", patient_id=1),
            models.User(username="clinic", password="password", role="clinic", facility_id=1)
        ]
        db.add_all(users)
        db.commit()

    if db.query(models.Doctor).count() == 0:
        doctors = [
            models.Doctor(name="Dr. Anil Sharma", specialty="Cardiologist", facility_id=1),
            models.Doctor(name="Dr. Sunita Patel", specialty="Orthopedic", facility_id=1),
            models.Doctor(name="Dr. Ramesh Gupta", specialty="General Physician", facility_id=2),
            models.Doctor(name="Dr. Neha Deshmukh", specialty="Pediatrician", facility_id=2),
            models.Doctor(name="Dr. Vikram Singh", specialty="Surgeon", facility_id=3),
        ]
        db.add_all(doctors)
        db.commit()

    if db.query(models.BloodBank).count() == 0:
        blood_banks = [
            models.BloodBank(name="LifeLine Blood Bank", location="Deccan Gymkhana, Pune", blood_group="A+", available_units=15, availability_status="Available"),
            models.BloodBank(name="LifeLine Blood Bank", location="Deccan Gymkhana, Pune", blood_group="O+", available_units=5, availability_status="Low"),
            models.BloodBank(name="Pune Red Cross Society", location="Camp, Pune", blood_group="B-", available_units=0, availability_status="Unavailable"),
            models.BloodBank(name="Pune Red Cross Society", location="Camp, Pune", blood_group="AB+", available_units=20, availability_status="Available"),
            models.BloodBank(name="Sanjeevani Blood Centre", location="Wakad, Pune", blood_group="O-", available_units=8, availability_status="Available"),
        ]
        db.add_all(blood_banks)
        db.commit()

    db.close()
    print("Database seeded successfully with demo data.")

if __name__ == "__main__":
    seed_data()
