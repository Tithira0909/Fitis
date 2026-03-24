import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setIsPending(false);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/auth/community-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.error.includes('pending')) {
          setIsPending(true);
        }
        throw new Error(data.error || 'Failed to authenticate');
      }

      // Store tokens and user info
      localStorage.setItem('communityToken', data.token);
      localStorage.setItem('communityUser', JSON.stringify(data.user));
      
      // Navigate to homepage or dashboard
      navigate('/');
      // Temporary window reload to refresh the Navbar state
      window.location.reload();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Welcome Back</h1>
          <p className="text-gray-500 font-medium">Log in to the FITIS Member Community</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl mb-6 flex items-start ${isPending ? 'bg-orange-50 text-orange-800 border border-orange-200' : 'bg-red-50 text-red-800 border border-red-200'}`}
            >
              <AlertCircle className={`w-5 h-5 mt-0.5 mr-3 shrink-0 ${isPending ? 'text-orange-600' : 'text-red-600'}`} />
              <div className="text-sm font-medium leading-relaxed">{error}</div>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Official Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                <input 
                  type="email" 
                  autoComplete="email"
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400" 
                  placeholder="contact@company.com" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div>
                <input 
                  type="password" 
                  autoComplete="current-password"
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-xl shadow-blue-600/20 active:translate-y-0 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center">Sign In <ArrowRight className="ml-2 w-5 h-5" /></span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 font-medium">
            Not part of the community yet? <Link to="/signup" className="text-blue-600 font-bold hover:text-blue-800 transition-colors ml-1">Apply Now</Link>
          </p>
        </div>
      </motion.div>

    </div>
  );
};
