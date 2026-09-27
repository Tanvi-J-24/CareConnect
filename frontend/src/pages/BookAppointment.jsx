import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, User, Clock, CheckCircle2 } from 'lucide-react';

const BookAppointment = ({ user }) => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    facility_id: '',
    doctor_id: '',
    date: '',
    time: '',
    patient_id: user.patient_id || 1
  });

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get('/api/facilities');
        setFacilities(res.data);
      } catch (error) {
        console.error('Failed to fetch facilities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (formData.facility_id) {
      const fetchDoctors = async () => {
        try {
          const res = await api.get(`/api/doctors?facility_id=${formData.facility_id}`);
          setDoctors(res.data);
        } catch (error) {
          console.error('Failed to fetch doctors', error);
        }
      };
      fetchDoctors();
    } else {
      setDoctors([]);
    }
  }, [formData.facility_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'facility_id') {
      setFormData(prev => ({ ...prev, doctor_id: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/appointments', formData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
    } catch (error) {
      console.error('Booking failed', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-retro-teal"></div>
    </div>
  );

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] animate-in zoom-in duration-500 glass-card rounded-3xl p-10 max-w-lg mx-auto text-center" role="alert">
        <div className="bg-retro-teal/20 text-retro-teal-dark p-6 rounded-full mb-6 border border-retro-teal/30 shadow-inner">
          <CheckCircle2 className="h-20 w-20" aria-hidden="true" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Booking Confirmed!</h2>
        <p className="text-lg text-slate-700 font-medium">Redirecting to your appointments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Book an Appointment</h1>
        <p className="text-lg text-slate-700 font-medium mt-2">Select a facility, doctor, and time slot for your visit.</p>
      </header>

      <section className="glass-card rounded-3xl shadow-sm overflow-hidden border border-white/60">
        <div className="bg-retro-teal/10 border-b border-retro-teal/20 p-6 flex items-center space-x-4">
          <div className="bg-white/80 p-2 rounded-full border border-white shadow-sm" aria-hidden="true">
            <User className="h-6 w-6 text-retro-teal-dark" />
          </div>
          <span className="text-lg font-bold text-retro-teal-dark">Booking for: {user?.username || 'Patient'}</span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8" aria-label="Appointment Booking Form">
          
          <div className="space-y-2">
            <label htmlFor="facility_id" className="text-base font-bold text-slate-800">
              Select Facility <span className="text-retro-red" aria-hidden="true">*</span>
              <span className="sr-only">Required</span>
            </label>
            <select 
              id="facility_id"
              name="facility_id" 
              value={formData.facility_id} 
              onChange={handleChange} 
              required
              aria-required="true"
              className="w-full a11y-input rounded-xl px-4 py-3.5 transition-shadow shadow-sm font-medium"
            >
              <option value="">-- Choose a facility --</option>
              {facilities.map(f => (
                <option key={f.id} value={f.id}>{f.name} - {f.location}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="doctor_id" className="text-base font-bold text-slate-800">
              Select Doctor <span className="text-retro-red" aria-hidden="true">*</span>
            </label>
            <select 
              id="doctor_id"
              name="doctor_id" 
              value={formData.doctor_id} 
              onChange={handleChange} 
              required
              aria-required="true"
              disabled={!formData.facility_id || doctors.length === 0}
              className="w-full a11y-input rounded-xl px-4 py-3.5 transition-shadow shadow-sm disabled:opacity-60 disabled:cursor-not-allowed font-medium"
            >
              <option value="">-- Choose a doctor --</option>
              {doctors.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="date" className="text-base font-bold text-slate-800">
                Date <span className="text-retro-red" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
                <input 
                  id="date"
                  type="date" 
                  name="date" 
                  value={formData.date} 
                  onChange={handleChange} 
                  required
                  aria-required="true"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full a11y-input rounded-xl pl-12 pr-4 py-3.5 transition-shadow shadow-sm font-medium"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="time" className="text-base font-bold text-slate-800">
                Time <span className="text-retro-red" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
                <select 
                  id="time"
                  name="time" 
                  value={formData.time} 
                  onChange={handleChange} 
                  required
                  aria-required="true"
                  className="w-full a11y-input rounded-xl pl-12 pr-4 py-3.5 transition-shadow shadow-sm font-medium appearance-none"
                >
                  <option value="">Select Time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-8 border-t border-slate-300/30 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-retro-teal hover:bg-retro-teal-dark text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center disabled:opacity-70 disabled:cursor-not-allowed text-lg w-full md:w-auto justify-center outline-none focus-visible:ring-4 focus-visible:ring-retro-teal/40"
            >
              {submitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3" aria-hidden="true"></div>
                  Booking...
                </>
              ) : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default BookAppointment;
