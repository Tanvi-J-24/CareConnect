import { useState, useEffect } from 'react';
import api from '../api';
import { Building2, Save, Calendar, Clock, ShieldAlert, Activity, CheckCircle2 } from 'lucide-react';

const ClinicDashboard = ({ user }) => {
  const [facility, setFacility] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const CLINIC_ID = user.facility_id || 1; 

  const fetchData = async () => {
    try {
      const [facRes, appsRes, emergRes, statsRes] = await Promise.all([
        api.get('/api/facilities'),
        api.get(`/api/appointments?facility_id=${CLINIC_ID}`),
        api.get('/api/emergency'),
        api.get('/api/dashboard/stats')
      ]);
      
      const myFacility = facRes.data.find(f => f.id === CLINIC_ID);
      setFacility(myFacility || null);
      setAppointments(appsRes.data.reverse());
      setEmergencies(emergRes.data.reverse());
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch clinic data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFacility(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/api/facilities/${CLINIC_ID}`, facility);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const updateAppStatus = async (id, status) => {
    try {
      await api.put(`/api/appointments/${id}`, { status });
      fetchData(); 
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const updateEmergStatus = async (id, status) => {
    try {
      await api.put(`/api/emergency/${id}`, { status });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-retro-teal"></div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-extrabold text-slate-800 flex items-center">
          <Building2 className="h-8 w-8 text-retro-teal mr-3" />
          Clinic Dashboard
        </h1>
        <p className="text-lg text-slate-700 font-medium mt-2">Manage your facility profile, appointments, and emergency requests.</p>
      </header>

      {/* Global Stats (Admin features merged) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 text-slate-600 font-bold">
            <Calendar className="h-6 w-6 text-retro-teal" />
            <span>Platform Apps</span>
          </div>
          <p className="text-4xl font-black text-slate-900">{stats?.total_appointments || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 text-slate-600 font-bold">
            <Clock className="h-6 w-6 text-retro-yellow" />
            <span>Pending Apps</span>
          </div>
          <p className="text-4xl font-black text-slate-900">{stats?.pending_appointments || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 text-slate-600 font-bold">
            <ShieldAlert className="h-6 w-6 text-retro-red" />
            <span>Emergencies</span>
          </div>
          <p className="text-4xl font-black text-slate-900">{stats?.emergency_requests || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center space-x-3 mb-3 text-slate-600 font-bold">
            <Activity className="h-6 w-6 text-retro-peach" />
            <span>Ambulance Reqs</span>
          </div>
          <p className="text-4xl font-black text-slate-900">{stats?.ambulance_requests || 0}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Facility Profile */}
        {facility && (
          <section className="glass-card rounded-3xl border border-white/60 shadow-sm p-8 flex flex-col">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Facility Profile</h2>
            <form onSubmit={handleSaveProfile} className="space-y-5 flex-1 flex flex-col">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Clinic Name</label>
                <input type="text" name="name" value={facility.name} onChange={handleChange} className="w-full a11y-input rounded-xl px-4 py-2.5 font-medium" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                <textarea name="description" value={facility.description || ''} onChange={handleChange} rows="2" className="w-full a11y-input rounded-xl px-4 py-2.5 font-medium" placeholder="Describe your clinic..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                  <input type="text" name="location" value={facility.location} onChange={handleChange} className="w-full a11y-input rounded-xl px-4 py-2.5 font-medium" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Contact No.</label>
                  <input type="text" name="contact" value={facility.contact || ''} onChange={handleChange} className="w-full a11y-input rounded-xl px-4 py-2.5 font-medium" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Services Offered</label>
                <input type="text" name="services" value={facility.services} onChange={handleChange} className="w-full a11y-input rounded-xl px-4 py-2.5 font-medium" />
              </div>
              
              <div className="flex items-center space-x-3 bg-white/50 p-4 rounded-xl border border-white/60 mt-4 mb-4">
                <input
                  type="checkbox"
                  id="is_listed"
                  name="is_listed"
                  checked={facility.is_listed}
                  onChange={handleChange}
                  className="w-5 h-5 text-retro-teal bg-white border-slate-300 rounded focus:ring-retro-teal focus:ring-2"
                />
                <label htmlFor="is_listed" className="font-extrabold text-slate-800">
                  List this facility publicly
                </label>
              </div>

              <div className="mt-auto">
                <button type="submit" disabled={saving} className="w-full bg-retro-teal text-white font-bold py-3 px-4 rounded-xl hover:bg-retro-teal-dark transition-colors flex justify-center items-center">
                  {saving ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : <><Save className="w-5 h-5 mr-2" /> Save Profile</>}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Incoming Appointments & Emergencies */}
        <div className="space-y-8 flex flex-col">
          
          <section className="glass-card rounded-3xl border border-white/60 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <header className="bg-white/40 p-5 border-b border-white/40">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center">
                <Calendar className="h-6 w-6 text-retro-teal mr-3" />
                My Clinic's Appointments
              </h2>
            </header>
            <div className="overflow-y-auto bg-white/20 p-4 flex-1">
              {appointments.length === 0 ? (
                <p className="text-slate-500 text-center font-bold mt-4">No appointments scheduled.</p>
              ) : (
                <ul className="space-y-3">
                  {appointments.map(app => (
                    <li key={app.id} className="bg-white/60 rounded-xl p-4 shadow-sm border border-white flex justify-between items-center">
                      <div>
                        <p className="font-extrabold text-slate-900">{app.patient?.name}</p>
                        <p className="text-sm font-bold text-slate-600 flex items-center mt-1">
                          <Clock className="w-3.5 h-3.5 mr-1 text-retro-teal" /> {app.date} at {app.time}
                        </p>
                      </div>
                      <select 
                        value={app.status}
                        onChange={(e) => updateAppStatus(app.id, e.target.value)}
                        className={`text-xs font-bold rounded-lg px-2 py-1 outline-none border focus:ring-2 focus:ring-retro-teal ${
                          app.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                          app.status === 'Cancelled' ? 'bg-slate-200 text-slate-700 border-slate-300' :
                          app.status === 'Rescheduled' ? 'bg-retro-purple/20 text-retro-purple border-retro-purple/30' :
                          'bg-retro-teal/20 text-retro-teal-dark border-retro-teal/30'
                        }`}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          <section className="glass-card rounded-3xl border border-white/60 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
            <header className="bg-white/40 p-5 border-b border-white/40">
              <h2 className="font-extrabold text-xl text-slate-800 flex items-center">
                <ShieldAlert className="h-6 w-6 text-retro-red mr-3" />
                Active Emergency Requests
              </h2>
            </header>
            <div className="overflow-y-auto bg-white/20 p-4 flex-1">
              {emergencies.length === 0 ? (
                <p className="text-slate-500 text-center font-bold mt-4">No emergency requests.</p>
              ) : (
                <ul className="space-y-3">
                  {emergencies.slice(0, 10).map(req => (
                    <li key={req.id} className="bg-white/60 rounded-xl p-4 shadow-sm border border-white">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-extrabold text-slate-900">{req.patient_name}</p>
                        <select 
                          value={req.status}
                          onChange={(e) => updateEmergStatus(req.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2 py-1 outline-none border focus:ring-2 focus:ring-retro-teal ${
                            req.status === 'Completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            req.status === 'Assigned' ? 'bg-retro-yellow/30 text-yellow-800 border-retro-yellow/40' :
                            'bg-retro-red/20 text-retro-red-dark border-retro-red/30'
                          }`}
                        >
                          <option value="Request Received">Received</option>
                          <option value="Assigned">Assigned</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      <p className="text-xs font-bold text-slate-600 mb-1">{req.emergency_type} {req.ambulance_required && <span className="ml-2 bg-retro-red/10 text-retro-red px-1 rounded border border-retro-red/20">AMB</span>}</p>
                      <p className="text-xs text-slate-500">{req.location}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default ClinicDashboard;
