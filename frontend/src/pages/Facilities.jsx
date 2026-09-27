import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Building2, MapPin, Activity, CalendarCheck, Search } from 'lucide-react';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchFacilities = async (search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/api/facilities${search ? `?search=${search}` : ''}`);
      setFacilities(response.data);
    } catch (error) {
      console.error('Failed to fetch facilities', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFacilities(searchTerm);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Find Healthcare</h1>
          <p className="text-lg text-slate-700 font-medium mt-2">Discover local healthcare facilities and clinics.</p>
        </div>
        <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
          <input 
            type="text" 
            placeholder="Search clinics or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-72 a11y-input rounded-l-xl pl-4 pr-10 py-3 font-medium shadow-sm"
          />
          <button type="submit" className="bg-retro-teal text-white px-5 rounded-r-xl font-bold hover:bg-retro-teal-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-teal">
            <Search className="h-5 w-5" />
          </button>
        </form>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64" aria-live="polite" aria-busy="true">
          <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-retro-teal"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" role="list">
          {facilities.map((facility) => (
            <article key={facility.id} className="glass-card rounded-2xl border border-white/60 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-shadow" role="listitem">
              <header className="bg-white/50 p-6 border-b border-white/40 flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="bg-retro-purple/20 text-retro-purple border border-retro-purple/30 p-3 rounded-xl shadow-inner mt-1" aria-hidden="true">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-xl">{facility.name}</h3>
                    <p className="text-slate-600 text-sm mt-1 mb-2 line-clamp-2">{facility.description}</p>
                    <div className="flex flex-col text-sm font-bold text-slate-600 space-y-1">
                      <div className="flex items-center"><MapPin className="h-4 w-4 mr-1.5 text-slate-400" aria-hidden="true" /> {facility.location}</div>
                    </div>
                  </div>
                </div>
              </header>
              
              <div className="p-6 flex-1 bg-white/20">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Available Services</h4>
                <div className="flex flex-wrap gap-2 mb-2">
                  {facility.services.split(',').map((service, idx) => (
                    <span key={idx} className="bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                      {service.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <footer className="p-5 bg-white/40 border-t border-white/40 flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className={`flex items-center text-sm font-bold ${facility.emergency_availability ? 'text-retro-red-dark' : 'text-slate-500'}`} title={facility.emergency_availability ? '24/7 Emergency' : 'No Emergency'}>
                    <Activity className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className={`flex items-center text-sm font-bold ${facility.appointment_availability ? 'text-retro-teal-dark' : 'text-slate-500'}`} title={facility.appointment_availability ? 'Appointments Open' : 'Walk-in Only'}>
                    <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
                <Link to="/book" className="bg-retro-teal text-white px-4 py-2 rounded-lg font-bold hover:bg-retro-teal-dark transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-teal">
                  Book Appointment
                </Link>
              </footer>
            </article>
          ))}
          {facilities.length === 0 && (
            <div className="col-span-full glass-card rounded-3xl p-12 text-center text-slate-600 border border-white/60">
              <p className="text-lg font-bold">No facilities found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Facilities;
