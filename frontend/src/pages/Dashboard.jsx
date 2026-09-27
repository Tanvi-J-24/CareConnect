import { Link } from 'react-router-dom';
import { Calendar, ShieldAlert, HeartPulse, Building2, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const quickActions = [
    { name: 'Book Appointment', desc: 'Schedule a visit with a doctor', icon: Calendar, color: 'bg-retro-teal', path: '/book' },
    { name: 'Emergency Assistance', desc: 'Request immediate help & ambulance', icon: ShieldAlert, color: 'bg-retro-red', path: '/emergency' },
    { name: 'Find Blood', desc: 'Check real-time blood availability', icon: HeartPulse, color: 'bg-retro-peach', path: '/blood' },
    { name: 'Healthcare Facilities', desc: 'Explore nearby clinics and hospitals', icon: Building2, color: 'bg-retro-purple', path: '/facilities' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Hero Banner with Glassmorphism */}
      <section 
        className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
        aria-labelledby="dashboard-heading"
      >
        <div className="relative z-10 max-w-2xl">
          <h2 id="dashboard-heading" className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">
            CareConnect connects patients looking for healthcare with clinics looking to be <span className="text-retro-teal-dark">discovered.</span>
          </h2>
          <p className="text-slate-700 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
            Discover local healthcare facilities, manage appointments, and coordinate essential healthcare services in one place.
          </p>
        </div>
        <div className="hidden md:block bg-retro-yellow/20 p-8 rounded-full border border-retro-yellow/30 shadow-inner" aria-hidden="true">
          <HeartPulse size={120} className="text-retro-yellow opacity-80 drop-shadow-md" />
        </div>
      </section>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h3 id="quick-actions-heading" className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.path}
                aria-label={`Navigate to ${action.name}`}
                className="group glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 block outline-none"
              >
                <div 
                  className={`${action.color} text-white p-4 rounded-xl inline-flex mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h4 className="font-bold text-slate-900 text-lg mb-2 flex items-center justify-between">
                  {action.name}
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-800 transition-colors" />
                </h4>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{action.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Upcoming & Emergency */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upcoming Appointment */}
        <section 
          className="lg:col-span-2 glass-card rounded-2xl p-8"
          aria-labelledby="upcoming-heading"
        >
          <h3 id="upcoming-heading" className="text-xl font-bold text-slate-800 mb-5">Upcoming Appointment</h3>
          <div className="flex items-center space-x-5 p-5 bg-white/70 rounded-xl border border-white/80 shadow-sm transition-colors hover:bg-white/90">
            <div className="bg-retro-teal/15 p-4 rounded-full text-retro-teal-dark border border-retro-teal/20" aria-hidden="true">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">Dr. Anil Sharma <span className="text-slate-500 font-medium text-base">- Cardiologist</span></p>
              <p className="text-slate-700 font-medium mt-1">Pune General Hospital • Tomorrow, 10:00 AM</p>
            </div>
          </div>
        </section>
        
        {/* Emergency Hotline */}
        <section 
          className="bg-retro-red text-white rounded-2xl p-8 shadow-md flex flex-col justify-center relative overflow-hidden"
          aria-labelledby="hotline-heading"
        >
          <ShieldAlert className="absolute -right-6 -bottom-6 h-40 w-40 text-retro-red-dark opacity-40 mix-blend-multiply" aria-hidden="true" />
          <div className="relative z-10">
            <h3 id="hotline-heading" className="text-2xl font-bold mb-3">Emergency Hotline</h3>
            <p className="text-red-50 text-base font-medium mb-6 leading-relaxed">
              For immediate medical assistance and ambulance coordination.
            </p>
            <Link 
              to="/emergency" 
              className="bg-white text-retro-red-dark font-bold py-3 px-6 rounded-xl inline-flex items-center justify-center transition-all hover:bg-red-50 hover:shadow-lg hover:-translate-y-0.5 outline-none focus-visible:ring-4 focus-visible:ring-white/50 w-full"
              aria-label="Request Ambulance Now"
            >
              Request Ambulance
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
