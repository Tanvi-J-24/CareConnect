import { Link, Outlet, useLocation } from 'react-router-dom';
import { Calendar, HeartPulse, Building2, User, LayoutDashboard, ShieldAlert, LogOut } from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = {
    patient: [
      { name: 'Dashboard', path: '/', icon: LayoutDashboard },
      { name: 'Find Healthcare', path: '/facilities', icon: Building2 },
      { name: 'Book Appointment', path: '/book', icon: Calendar },
      { name: 'My Appointments', path: '/appointments', icon: User },
      { name: 'Emergency', path: '/emergency', icon: ShieldAlert, color: 'text-retro-red' },
      { name: 'Blood Availability', path: '/blood', icon: HeartPulse },
    ],
    clinic: [
      { name: 'Clinic Dashboard', path: '/', icon: LayoutDashboard },
    ]
  };

  const currentNav = navItems[user.role] || [];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with Glassmorphism */}
      <aside 
        className="w-72 flex flex-col glass-panel border-r-0 border-white/40 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10"
        aria-label="Sidebar Navigation"
      >
        <div className="p-6 flex flex-col space-y-4 border-b border-white/30">
          <div className="flex items-center space-x-3">
            <div className="bg-retro-teal p-2.5 rounded-xl shadow-sm" aria-hidden="true">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">CareConnect</h1>
          </div>
          
          <div className="bg-white/70 border border-white/80 rounded-xl p-3 shadow-sm flex items-center justify-between mt-2">
            <div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{user.role}</p>
              <p className="text-sm font-extrabold text-slate-800 truncate max-w-[120px]">{user.username}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-retro-red hover:bg-retro-red/10 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-retro-red"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6" aria-label="Main Navigation">
          <ul className="space-y-2 px-4">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/70 text-retro-teal-dark font-bold shadow-sm border border-white/80' 
                        : 'text-slate-700 font-medium hover:bg-white/40 hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <Icon 
                      className={`h-5 w-5 mr-3.5 ${item.color || (isActive ? 'text-retro-teal' : 'text-slate-500')}`} 
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 overflow-y-auto relative"
        aria-label="Main Content"
      >
        <div className="p-6 md:p-10 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
