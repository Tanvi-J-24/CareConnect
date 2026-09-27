import { useState, useEffect } from 'react';
import api from '../api';
import { Calendar, Clock, MapPin, User, CheckCircle2, Clock3, XCircle, RefreshCw, X } from 'lucide-react';

const MyAppointments = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reschedule Modal State
  const [rescheduleApp, setRescheduleApp] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const patientId = user?.patient_id || 1;
      const res = await api.get(`/api/appointments?patient_id=${patientId}`);
      setAppointments(res.data.reverse()); 
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await api.put(`/api/appointments/${id}`, { status: 'Cancelled' });
      fetchAppointments();
    } catch (error) {
      alert("Failed to cancel appointment.");
    }
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.put(`/api/appointments/${rescheduleApp.id}`, { 
        date: newDate, 
        time: newTime,
        status: 'Rescheduled'
      });
      setRescheduleApp(null);
      fetchAppointments();
    } catch (error) {
      alert("Failed to reschedule.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return <span className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-retro-teal/20 text-retro-teal-dark border border-retro-teal/30"><Clock3 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true"/> Scheduled</span>;
      case 'Rescheduled':
        return <span className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-retro-purple/20 text-retro-purple border border-retro-purple/30"><RefreshCw className="w-3.5 h-3.5 mr-1.5" aria-hidden="true"/> Rescheduled</span>;
      case 'Completed':
        return <span className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" aria-hidden="true"/> Completed</span>;
      case 'Cancelled':
        return <span className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300"><XCircle className="w-3.5 h-3.5 mr-1.5" aria-hidden="true"/> Cancelled</span>;
      default:
        return <span className="flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800">{status}</span>;
    }
  };

  if (loading && appointments.length === 0) return (
    <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-retro-teal"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800">My Appointments</h1>
        <p className="text-lg text-slate-700 font-medium mt-2">View and manage your upcoming and past medical visits.</p>
      </header>

      {appointments.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center text-slate-600 border border-white/60">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-400 opacity-50" aria-hidden="true" />
          <p className="text-lg font-medium text-slate-800">You don't have any appointments booked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {appointments.map(app => (
            <article key={app.id} className="glass-card rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-shadow flex flex-col" role="listitem">
              <header className="p-6 border-b border-white/30 flex justify-between items-start bg-white/40 rounded-t-2xl">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl leading-tight">{app.doctor?.name || 'Unknown Doctor'}</h3>
                  <p className="text-sm font-bold text-retro-teal-dark mt-1">{app.doctor?.specialty}</p>
                </div>
                {getStatusBadge(app.status)}
              </header>
              <div className="p-6 space-y-4 flex-1 text-slate-800 font-medium">
                <div className="flex items-center text-sm">
                  <Calendar className="h-5 w-5 mr-3 text-retro-teal" aria-hidden="true" />
                  <span className="sr-only">Date: </span>{app.date}
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-5 w-5 mr-3 text-retro-teal" aria-hidden="true" />
                  <span className="sr-only">Time: </span>{app.time}
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="h-5 w-5 mr-3 text-retro-teal shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Location: </span>{app.facility?.name}
                    <br/><span className="text-xs text-slate-600 mt-1 block">{app.facility?.location}</span>
                  </span>
                </div>
              </div>
              
              {(app.status === 'Scheduled' || app.status === 'Rescheduled') && (
                <footer className="p-4 bg-white/50 border-t border-white/40 rounded-b-2xl flex gap-3">
                  <button 
                    onClick={() => {
                      setRescheduleApp(app);
                      setNewDate(app.date);
                      setNewTime(app.time);
                    }}
                    className="flex-1 bg-retro-teal text-white py-2 rounded-lg text-sm font-bold hover:bg-retro-teal-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-teal"
                  >
                    Reschedule
                  </button>
                  <button 
                    onClick={() => handleCancel(app.id)}
                    className="flex-1 bg-white border border-retro-red text-retro-red py-2 rounded-lg text-sm font-bold hover:bg-retro-red/10 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-red"
                  >
                    Cancel
                  </button>
                </footer>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleApp && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setRescheduleApp(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 outline-none focus-visible:ring-2 focus-visible:ring-retro-teal rounded-full p-1">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Reschedule Appointment</h2>
            <p className="text-slate-600 font-medium mb-6">Choose a new date and time for your visit with {rescheduleApp.doctor?.name}.</p>
            
            <form onSubmit={submitReschedule} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Date</label>
                <input 
                  type="date" 
                  value={newDate} 
                  onChange={e => setNewDate(e.target.value)} 
                  required 
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full a11y-input rounded-xl px-4 py-3 font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">New Time</label>
                <select 
                  value={newTime} 
                  onChange={e => setNewTime(e.target.value)} 
                  required 
                  className="w-full a11y-input rounded-xl px-4 py-3 font-bold"
                >
                  <option value="">Select Time</option>
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full bg-retro-teal text-white py-3.5 rounded-xl font-bold hover:bg-retro-teal-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-teal mt-4 flex justify-center items-center"
              >
                {isUpdating ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Confirm Reschedule'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
