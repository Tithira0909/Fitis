import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
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
      
      // Navigate to dashboard
      navigate('/member-dashboard');
      // Temporary window reload to refresh the Navbar state
      window.location.reload();


    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send OTP');
      }

      setForgotPasswordStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/membership/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid OTP');
      }

      setForgotPasswordStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${baseUrl}/api/auth/community/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, new_password: newPassword })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }

      setForgotPasswordStep(0);
      setResetEmail('');
      setOtp('');
      setNewPassword('');
      alert('Password successfully reset. Please log in with your new password.');
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

          {forgotPasswordStep === 0 ? (
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
              
              <div className="flex justify-end">
                <button type="button" onClick={() => { setForgotPasswordStep(1); setError(''); }} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot Password?</button>
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
          ) : forgotPasswordStep === 1 ? (
            <form onSubmit={handleForgotPasswordRequest} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Enter your Official Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail size={18} className="text-slate-400" /></div>
                  <input 
                    type="email" 
                    required 
                    value={resetEmail} 
                    onChange={e => setResetEmail(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white text-slate-900 font-medium" 
                    placeholder="contact@company.com" 
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">We will send a One-Time Password to this email.</p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => { setForgotPasswordStep(0); setError(''); }} className="w-1/3 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Back</button>
                <button type="submit" disabled={isLoading} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center">
                  {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Send OTP'}
                </button>
              </div>
            </form>
          ) : forgotPasswordStep === 2 ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Enter OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><KeyRound size={18} className="text-slate-400" /></div>
                  <input 
                    type="text" 
                    required 
                    value={otp} 
                    onChange={e => setOtp(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white text-slate-900 font-bold tracking-widest text-lg" 
                    placeholder="123456" 
                    maxLength={6}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">Enter the 6-digit code sent to {resetEmail}</p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => { setForgotPasswordStep(1); setError(''); }} className="w-1/3 py-4 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">Back</button>
                <button type="submit" disabled={isLoading} className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center">
                  {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Verify OTP'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock size={18} className="text-slate-400" /></div>
                  <input 
                    type="password" 
                    required 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white text-slate-900 font-medium" 
                    placeholder="••••••••" 
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg shadow-blue-600/20">
                {isLoading ? <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Reset Password'}
              </button>
            </form>
          )}
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
