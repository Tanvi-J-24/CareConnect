import { useState, useEffect } from 'react';
import api from '../api';
import { HeartPulse, Search, MapPin, Droplets, PhoneCall } from 'lucide-react';

const BloodSearch = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  const fetchBloodBanks = async () => {
    setLoading(true);
    try {
      let url = '/api/blood-banks?';
      if (filterGroup) url += `blood_group=${encodeURIComponent(filterGroup)}&`;
      if (filterLocation) url += `location=${encodeURIComponent(filterLocation)}`;
      const res = await api.get(url);
      setBloodBanks(res.data);
    } catch (error) {
      console.error('Failed to fetch blood banks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBanks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBloodBanks();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section className="glass-card p-6 md:p-8 rounded-3xl border border-white/60 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-6" aria-labelledby="blood-search-heading">
        <div>
          <h1 id="blood-search-heading" className="text-3xl font-extrabold text-slate-800 flex items-center">
            <HeartPulse className="h-8 w-8 text-retro-red mr-3" aria-hidden="true" />
            Blood Availability
          </h1>
          <p className="text-lg text-slate-700 font-medium mt-2">Search real-time blood inventory across partnered banks.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto" aria-label="Search Blood Banks">
          <div className="space-y-1 sm:space-y-0">
            <label htmlFor="blood_group" className="sr-only">Blood Group</label>
            <select 
              id="blood_group"
              value={filterGroup} 
              onChange={e => setFilterGroup(e.target.value)}
              className="w-full sm:w-auto a11y-input rounded-xl px-4 py-3 font-bold appearance-none shadow-sm"
            >
              <option value="">All Groups</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          
          <div className="relative flex-1 sm:w-56 space-y-1 sm:space-y-0">
            <label htmlFor="location" className="sr-only">Location/City</label>
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 pointer-events-none" aria-hidden="true" />
            <input 
              id="location"
              type="text" 
              placeholder="City or Area"
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full a11y-input rounded-xl pl-11 pr-4 py-3 font-bold shadow-sm"
            />
          </div>
          <button 
            type="submit" 
            className="bg-retro-teal hover:bg-retro-teal-dark text-white px-6 py-3 rounded-xl font-bold transition-colors flex items-center justify-center shadow-sm outline-none focus-visible:ring-4 focus-visible:ring-retro-teal/40"
          >
            <Search className="h-5 w-5 mr-2" aria-hidden="true" />
            Search
          </button>
        </form>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" role="list">
        {loading ? (
          <div className="col-span-full py-16 text-center" aria-live="polite" aria-busy="true">
            <div className="animate-spin h-10 w-10 border-b-4 border-retro-red mx-auto"></div>
          </div>
        ) : bloodBanks.length === 0 ? (
          <div className="col-span-full glass-card rounded-3xl p-16 text-center border border-white/60 shadow-sm">
            <HeartPulse className="h-16 w-16 text-slate-400 opacity-50 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-xl font-extrabold text-slate-800">No blood banks found</h3>
            <p className="text-lg font-medium text-slate-600 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          bloodBanks.map(bank => (
            <article key={bank.id} className="glass-card rounded-3xl border border-white/60 shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-lg transition-shadow" role="listitem">
              <div className="bg-white/40 p-6 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-white/60 min-w-[140px]">
                <div className="bg-retro-red/10 text-retro-red-dark w-20 h-20 rounded-full flex items-center justify-center mb-3 shadow-inner border border-retro-red/20" aria-hidden="true">
                  <span className="text-3xl font-black">{bank.blood_group}</span>
                </div>
                <div className="text-center">
                  <span className="text-3xl font-extrabold text-slate-900">{bank.available_units}</span>
                  <span className="text-xs text-slate-600 block uppercase tracking-wider font-bold mt-1">Units</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between bg-white/20">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">{bank.name}</h3>
                  <div className="flex items-start text-sm font-bold text-slate-600 mb-4">
                    <MapPin className="h-4 w-4 mr-2 shrink-0 mt-0.5 text-retro-teal" aria-hidden="true" />
                    <span>{bank.location}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-300/30">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                    bank.availability_status === 'Available' ? 'bg-green-100 text-green-800 border-green-200' :
                    bank.availability_status === 'Low' ? 'bg-retro-yellow/30 text-yellow-800 border-retro-yellow/40' :
                    'bg-retro-red/20 text-retro-red-dark border-retro-red/30'
                  }`}>
                    {bank.availability_status}
                  </span>
                  <button 
                    className="text-retro-teal-dark hover:text-retro-teal font-extrabold flex items-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-teal rounded-lg px-2 py-1"
                    aria-label={`Contact ${bank.name}`}
                  >
                    <PhoneCall className="h-4 w-4 mr-2" aria-hidden="true" />
                    Contact Bank
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
      
      <aside className="glass-card border-l-4 border-retro-red p-5 rounded-r-2xl" aria-label="Disclaimer">
        <p className="text-base font-bold text-retro-red-dark flex items-start">
          <Droplets className="h-6 w-6 mr-3 shrink-0" aria-hidden="true" />
          <span><strong>Demonstration Data:</strong> This is sample inventory information. Do not use for actual medical emergencies.</span>
        </p>
      </aside>
    </div>
  );
};

export default BloodSearch;
