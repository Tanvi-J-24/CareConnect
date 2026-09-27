import { useState } from 'react';
import api from '../api';
import { HeartPulse, User, Building2 } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = async (username, password) => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/login', { username, password });
      onLogin(res.data);
    } catch (err) {
      setError('Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full rounded-3xl p-8 border border-white/60 shadow-lg">
        <div className="text-center mb-8">
          <div className="bg-retro-teal inline-block p-3 rounded-2xl shadow-sm mb-4">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">CareConnect</h1>
          <p className="text-slate-600 font-medium mt-2">Select a demo role to sign in</p>
        </div>

        {error && (
          <div className="bg-retro-red/10 border border-retro-red/20 text-retro-red-dark px-4 py-3 rounded-xl mb-6 font-bold text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={() => handleQuickLogin('patient', 'password')}
            disabled={loading}
            className="w-full bg-white border-2 border-retro-teal text-retro-teal-dark hover:bg-retro-teal/10 py-4 rounded-xl font-extrabold transition-all outline-none focus-visible:ring-4 focus-visible:ring-retro-teal flex items-center justify-center shadow-sm text-lg"
          >
            {loading ? <span className="animate-spin h-6 w-6 border-2 border-retro-teal border-t-transparent rounded-full"></span> : (
              <>
                <User className="h-6 w-6 mr-3" />
                Sign in as Patient
              </>
            )}
          </button>
          
          <button 
            onClick={() => handleQuickLogin('clinic', 'password')}
            disabled={loading}
            className="w-full bg-white border-2 border-retro-purple text-retro-purple hover:bg-retro-purple/10 py-4 rounded-xl font-extrabold transition-all outline-none focus-visible:ring-4 focus-visible:ring-retro-purple flex items-center justify-center shadow-sm text-lg"
          >
            {loading ? <span className="animate-spin h-6 w-6 border-2 border-retro-purple border-t-transparent rounded-full"></span> : (
              <>
                <Building2 className="h-6 w-6 mr-3" />
                Sign in as Clinic Admin
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
