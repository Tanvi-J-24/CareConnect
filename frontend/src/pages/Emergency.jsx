import { useState } from 'react';
import api from '../api';
import { ShieldAlert, PhoneCall, MapPin, CheckCircle2, Activity, Truck } from 'lucide-react';

const Emergency = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submittedReq, setSubmittedReq] = useState(null);

  const [formData, setFormData] = useState({
    patient_name: '',
    phone: '',
    location: '',
    emergency_type: 'Medical Emergency',
    ambulance_required: true,
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/api/emergency', formData);
      setSubmittedReq(res.data);
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReq) {
    return (
      <div className="max-w-2xl mx-auto mt-8 animate-in fade-in zoom-in duration-500">
        <section className="glass-card rounded-3xl shadow-lg border border-white/60 overflow-hidden" aria-labelledby="status-heading">
          <div className="bg-retro-red text-white p-8 text-center relative overflow-hidden">
            <div className="relative z-10">
              <ShieldAlert className="h-20 w-20 mx-auto mb-4 animate-pulse drop-shadow-md" aria-hidden="true" />
              <h2 id="status-heading" className="text-3xl font-extrabold mb-2">Emergency Request Received</h2>
              <p className="text-red-50 text-lg font-bold">Request ID: #{submittedReq.id}</p>
            </div>
            <Activity className="absolute -right-4 -bottom-4 h-40 w-40 opacity-20 mix-blend-overlay" aria-hidden="true" />
          </div>
          
          <div className="p-10 bg-white/40">
            <h3 className="text-xl font-extrabold text-slate-800 mb-8 text-center">Live Status Tracker</h3>
            
            <div className="relative pl-4 sm:pl-0 max-w-sm mx-auto">
              <div className="absolute left-9 sm:left-4 top-4 bottom-12 w-1 bg-white border border-slate-200" aria-hidden="true"></div>
              
              <ul className="space-y-10 relative">
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-green-500 rounded-full p-2 relative z-10 border-4 border-white shadow-md">
                    <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-extrabold text-slate-900 text-lg">Request Received</h4>
                    <p className="text-base font-medium text-slate-700 mt-1">Your emergency request has been logged in our system.</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="flex-shrink-0 bg-retro-yellow rounded-full p-2 relative z-10 border-4 border-white shadow-md animate-pulse">
                    <Truck className="h-6 w-6 text-yellow-900" aria-hidden="true" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-extrabold text-slate-900 text-lg">Coordination</h4>
                    <p className="text-base font-medium text-slate-700 mt-1">
                      {submittedReq.ambulance_required 
                        ? 'Locating nearest available ambulance...' 
                        : 'Alerting nearest emergency facility...'}
                    </p>
                  </div>
                </li>

                <li className="flex items-start opacity-50">
                  <div className="flex-shrink-0 bg-slate-200 rounded-full p-2 relative z-10 border-4 border-white">
                    <CheckCircle2 className="h-6 w-6 text-slate-500" aria-hidden="true" />
                  </div>
                  <div className="ml-6">
                    <h4 className="font-extrabold text-slate-700 text-lg">Assigned / En Route</h4>
                    <p className="text-base font-medium text-slate-600 mt-1">Help is on the way to your location.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <aside className="mt-12 bg-white/70 p-6 rounded-2xl border border-white shadow-sm text-center">
              <p className="text-base font-bold text-slate-700 mb-2">For immediate assistance during coordination:</p>
              <p className="text-4xl font-black text-retro-red tracking-wider">108</p>
              <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-wide">National Ambulance Service</p>
            </aside>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <header className="glass-card border border-retro-red/30 rounded-3xl p-8 mb-8 flex items-start space-x-5 bg-retro-red/5">
        <div className="bg-retro-red/20 p-3 rounded-full mt-1 border border-retro-red/20" aria-hidden="true">
          <ShieldAlert className="h-10 w-10 text-retro-red-dark animate-pulse" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-retro-red-dark">Emergency Assistance</h1>
          <p className="text-lg font-bold text-retro-red-dark/80 mt-2 leading-relaxed">
            Submit an immediate request for medical emergencies or ambulance services. If this is life-threatening, please also call 108 immediately.
          </p>
        </div>
      </header>

      <section className="glass-card rounded-3xl shadow-sm border border-white/60 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8" aria-label="Emergency Request Form">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="patient_name" className="text-base font-bold text-slate-800">
                Patient Name <span className="text-retro-red" aria-hidden="true">*</span>
                <span className="sr-only">Required</span>
              </label>
              <input 
                id="patient_name"
                type="text" 
                name="patient_name" 
                value={formData.patient_name} 
                onChange={handleChange} 
                required
                aria-required="true"
                className="w-full a11y-input rounded-xl px-4 py-3.5 transition-shadow shadow-sm font-medium"
                placeholder="Enter name"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="text-base font-bold text-slate-800">
                Phone Number <span className="text-retro-red" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
                <input 
                  id="phone"
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required
                  aria-required="true"
                  className="w-full a11y-input rounded-xl pl-12 pr-4 py-3.5 transition-shadow shadow-sm font-medium"
                  placeholder="Mobile number"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-base font-bold text-slate-800">
              Current Location <span className="text-retro-red" aria-hidden="true">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input 
                id="location"
                type="text" 
                name="location" 
                value={formData.location} 
                onChange={handleChange} 
                required
                aria-required="true"
                className="w-full a11y-input rounded-xl pl-12 pr-4 py-3.5 transition-shadow shadow-sm font-medium"
                placeholder="Full address or landmark"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="emergency_type" className="text-base font-bold text-slate-800">
              Type of Emergency <span className="text-retro-red" aria-hidden="true">*</span>
            </label>
            <select 
              id="emergency_type"
              name="emergency_type" 
              value={formData.emergency_type} 
              onChange={handleChange} 
              required
              aria-required="true"
              className="w-full a11y-input rounded-xl px-4 py-3.5 transition-shadow shadow-sm font-medium appearance-none"
            >
              <option value="Medical Emergency">Medical Emergency</option>
              <option value="Accident / Trauma">Accident / Trauma</option>
              <option value="Cardiac Arrest">Cardiac Arrest</option>
              <option value="Respiratory Issue">Respiratory Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center space-x-4 bg-white/60 p-5 rounded-2xl border border-white shadow-sm">
            <input
              type="checkbox"
              id="ambulance_required"
              name="ambulance_required"
              checked={formData.ambulance_required}
              onChange={handleChange}
              className="w-6 h-6 text-retro-red bg-white border-slate-300 rounded focus:ring-retro-red focus:ring-2 accent-retro-red"
            />
            <label htmlFor="ambulance_required" className="text-lg font-extrabold text-slate-800 cursor-pointer">
              Request Ambulance Dispatch
            </label>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-base font-bold text-slate-800">Additional Notes (Optional)</label>
            <textarea 
              id="notes"
              name="notes" 
              value={formData.notes} 
              onChange={handleChange} 
              rows="3"
              className="w-full a11y-input rounded-xl px-4 py-3.5 transition-shadow shadow-sm font-medium resize-y"
              placeholder="Any details that might help emergency responders..."
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-retro-red hover:bg-retro-red-dark text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-xl outline-none focus-visible:ring-4 focus-visible:ring-retro-red/40"
          >
            {submitting ? 'Submitting...' : 'SUBMIT EMERGENCY REQUEST'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Emergency;
