import React, { useState, useRef } from 'react';
import { Mail, Lock, AlertCircle, ArrowRight, KeyRound, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isPending, setIsPending]   = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [loginOtpRequired, setLoginOtpRequired] = useState(false);
  const [loginOtp, setLoginOtp] = useState('');

  const [forgotPasswordStep, setForgotPasswordStep] = useState(0);
  const [resetEmail, setResetEmail]   = useState('');
  const [otp, setOtp]                 = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const btnRef  = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const navigate = useNavigate();

  /* ── helpers ── */
  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const id = ++rippleId.current;
    setRipples(prev => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 650);
  };

  const resetForgot = () => { setForgotPasswordStep(0); setError(''); setResetEmail(''); setOtp(''); setNewPassword(''); };

  /* ── API handlers ── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError(''); setIsPending(false);
    try {
      if (loginOtpRequired) {
        // Step 2: Verify login OTP
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res  = await fetch(`${baseUrl}/api/auth/community-login/verify`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, otp: loginOtp }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to authenticate');
        }
        localStorage.setItem('communityToken', data.token);
        localStorage.setItem('communityUser', JSON.stringify(data.user));
        navigate('/member-dashboard');
        window.location.reload();
      } else {
        // Step 1: Send credentials, await OTP
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
        const res  = await fetch(`${baseUrl}/api/auth/community-login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          if (res.status === 403 && data.error.includes('pending')) setIsPending(true);
          throw new Error(data.error || 'Failed to authenticate');
        }
        if (data.requiresOtp) {
          setLoginOtpRequired(true);
        } else {
          // fallback if backend didn't require OTP for some reason
          localStorage.setItem('communityToken', data.token);
          localStorage.setItem('communityUser', JSON.stringify(data.user));
          navigate('/member-dashboard');
          window.location.reload();
        }
      }
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const handleForgotPasswordRequest = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const res = await fetch(`${baseUrl}/api/membership/send-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to send OTP'); }
      setForgotPasswordStep(2);
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const res = await fetch(`${baseUrl}/api/membership/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Invalid OTP'); }
      setForgotPasswordStep(3);
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setIsLoading(true); setError('');
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const res = await fetch(`${baseUrl}/api/auth/community/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp, new_password: newPassword }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to reset password'); }
      resetForgot();
      alert('Password successfully reset. Please log in with your new password.');
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  /* ── step metadata ── */
  const stepMeta = [
    { icon: null,       title: 'Login',            sub: 'Sign in to the FITIS Member Community' },
    { icon: <Mail size={32} className="ml-step-icon" />,  title: 'Forgot Password', sub: 'Enter your registered email to receive an OTP' },
    { icon: <KeyRound size={32} className="ml-step-icon" />, title: 'Verify OTP',   sub: `Enter the 6-digit code sent to ${resetEmail}` },
    { icon: <Lock size={32} className="ml-step-icon" />,  title: 'New Password',    sub: 'Choose a strong new password' },
  ];

  const current = stepMeta[forgotPasswordStep];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

        @keyframes rippleAnim   { 0%{transform:scale(0);opacity:.45} 100%{transform:scale(6);opacity:0} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        @keyframes floatAvatar  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp       { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blobMove     { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-20px) scale(1.08)} 66%{transform:translate(-15px,10px) scale(.95)} }

        *{box-sizing:border-box;margin:0;padding:0}

        .ml-page {
          min-height:100vh;
          display:flex;
          align-items:stretch;
          font-family:'Inter',ui-sans-serif,system-ui,sans-serif;
          background:#f1f5f9;
        }

        /* LEFT */
        .ml-left {
          flex:1;
          background:linear-gradient(145deg,#004a99 0%,#0066cc 50%,#005ab5 100%);
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          padding:3rem 2.5rem;
          position:relative;
          overflow:hidden;
          min-height:100vh;
        }
        .ml-blob {
          position:absolute;
          border-radius:50%;
          background:rgba(255,255,255,.07);
          animation:blobMove 10s ease-in-out infinite;
        }
        .ml-blob-1{width:300px;height:300px;top:-90px;left:-90px;animation-delay:0s}
        .ml-blob-2{width:220px;height:220px;bottom:-70px;right:-70px;animation-delay:3s}
        .ml-blob-3{width:160px;height:160px;bottom:28%;left:-50px;animation-delay:6s}

        .ml-left-inner {
          position:relative;
          z-index:2;
          display:flex;
          flex-direction:column;
          align-items:center;
          text-align:center;
        }

        .ml-logo-wrap {
          background:rgba(255,255,255,.15);
          border-radius:20px;
          padding:.9rem 1.4rem;
          margin-bottom:2rem;
          backdrop-filter:blur(8px);
          border:1px solid rgba(255,255,255,.25);
        }
        .ml-logo { height:60px; object-fit:contain; filter:brightness(0) invert(1); }

        .ml-welcome {
          font-family:'Space Grotesk',sans-serif;
          font-size:1.9rem;
          font-weight:700;
          color:#fff;
          line-height:1.2;
          margin-bottom:.55rem;
        }
        .ml-tagline { font-size:.875rem; color:rgba(255,255,255,.7); max-width:240px; line-height:1.65; }

        .ml-avatar {
          width:210px;
          margin-top:2.5rem;
          animation:floatAvatar 4s ease-in-out infinite;
          filter:drop-shadow(0 20px 20px rgba(0,0,0,.25));
        }

        .ml-badges {
          display:flex;
          gap:.6rem;
          margin-top:2rem;
          flex-wrap:wrap;
          justify-content:center;
        }
        .ml-badge {
          background:rgba(255,255,255,.15);
          border:1px solid rgba(255,255,255,.25);
          border-radius:999px;
          padding:.35rem .85rem;
          font-size:.75rem;
          color:rgba(255,255,255,.9);
          font-weight:500;
          backdrop-filter:blur(6px);
        }

        /* RIGHT */
        .ml-right {
          width:440px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:#fff;
          padding:3rem 2.75rem;
          min-height:100vh;
        }

        .ml-form-box {
          width:100%;
          animation:fadeUp .5s cubic-bezier(.16,1,.3,1) both;
        }

        .ml-step-icon {
          color:#004a99;
          margin-bottom:.75rem;
          display:block;
        }

        .ml-back-link {
          display:inline-flex;
          align-items:center;
          gap:.35rem;
          color:#64748b;
          text-decoration:none;
          font-size:.85rem;
          font-weight:500;
          margin-bottom:1.5rem;
          transition:color .2s;
        }
        .ml-back-link:hover { color:#004a99; }

        .ml-form-title {
          font-family:'Space Grotesk',sans-serif;
          font-size:1.65rem;
          font-weight:700;
          color:#1e293b;
          margin-bottom:.3rem;
        }
        .ml-form-sub { font-size:.83rem; color:#94a3b8; margin-bottom:1.75rem; line-height:1.5; }
        .ml-accent-bar { height:3px; width:36px; background:#004a99; border-radius:2px; margin-bottom:1.75rem; }

        .ml-label { display:block; font-size:.78rem; font-weight:600; color:#475569; margin-bottom:.4rem; letter-spacing:.03em; }

        .ml-input-wrap { position:relative; margin-bottom:1.15rem; }
        .ml-input-icon {
          position:absolute;
          left:.85rem;
          top:50%;
          transform:translateY(-50%);
          color:#94a3b8;
          pointer-events:none;
          display:flex;
        }
        .ml-input {
          width:100%;
          background:#f8fafc;
          border:1.5px solid #e2e8f0;
          border-radius:10px;
          padding:.78rem .9rem .78rem 2.65rem;
          font-size:.915rem;
          color:#1e293b;
          font-family:'Inter',sans-serif;
          transition:border-color .2s,box-shadow .2s,background .2s;
          outline:none;
        }
        .ml-input::placeholder{color:#b0bcc8}
        .ml-input:focus {
          border-color:#004a99;
          background:#fff;
          box-shadow:0 0 0 3px rgba(0,74,153,.1);
        }
        .ml-input-otp {
          letter-spacing:.35em;
          font-size:1.1rem;
          font-weight:700;
          text-align:center;
          padding-left:.9rem;
        }

        .ml-error {
          border-radius:8px;
          padding:.65rem .9rem;
          font-size:.82rem;
          margin-bottom:1.1rem;
          display:flex;
          align-items:flex-start;
          gap:.45rem;
          line-height:1.5;
        }
        .ml-error-red  { background:#fef2f2; border:1.5px solid #fecaca; color:#dc2626; }
        .ml-error-amber{ background:#fffbeb; border:1.5px solid #fde68a; color:#b45309; }

        .ml-forgot-btn {
          background:none; border:none; cursor:pointer;
          font-size:.8rem; font-weight:600; color:#004a99;
          margin-bottom:1.1rem; display:block; margin-left:auto;
          transition:color .2s;
        }
        .ml-forgot-btn:hover{color:#003d80}

        /* primary button */
        .ml-btn {
          position:relative; overflow:hidden;
          width:100%; padding:.85rem 1.25rem;
          border:none; border-radius:10px;
          background:linear-gradient(135deg,#004a99,#0066cc);
          color:#fff;
          font-size:.93rem; font-weight:600;
          font-family:'Inter',sans-serif;
          cursor:pointer;
          transition:background .25s,box-shadow .25s,transform .15s;
          box-shadow:0 4px 14px rgba(0,74,153,.4);
        }
        .ml-btn:hover:not(:disabled){
          background:linear-gradient(135deg,#003d80,#0055aa);
          box-shadow:0 6px 20px rgba(0,74,153,.5);
          transform:translateY(-1px);
        }
        .ml-btn:active:not(:disabled){ transform:translateY(0); box-shadow:0 2px 8px rgba(0,74,153,.3); }
        .ml-btn:disabled{ opacity:.65; cursor:not-allowed; }

        .ml-ripple {
          position:absolute; border-radius:50%;
          width:80px; height:80px; margin-left:-40px; margin-top:-40px;
          background:rgba(255,255,255,.38);
          pointer-events:none;
          animation:rippleAnim .65s linear forwards;
        }
        .ml-btn-inner { position:relative; z-index:1; display:flex; align-items:center; justify-content:center; gap:.45rem; }
        .ml-spinner {
          width:15px; height:15px;
          border:2px solid rgba(255,255,255,.3); border-top-color:#fff;
          border-radius:50%;
          animation:spin .7s linear infinite;
        }

        /* secondary / back button */
        .ml-btn-secondary {
          flex:1; padding:.82rem 1rem;
          border:1.5px solid #e2e8f0; border-radius:10px;
          background:#f8fafc; color:#475569;
          font-size:.89rem; font-weight:600; font-family:'Inter',sans-serif;
          cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.35rem;
          transition:background .2s,border-color .2s;
        }
        .ml-btn-secondary:hover{ background:#f1f5f9; border-color:#cbd5e1; }

        .ml-btn-row { display:flex; gap:.75rem; }

        .ml-divider { height:1px; background:#f1f5f9; margin:1.5rem 0; }

        .ml-signup-row { text-align:center; font-size:.83rem; color:#64748b; margin-top:1.5rem; }
        .ml-signup-row a { color:#004a99; font-weight:600; text-decoration:none; }
        .ml-signup-row a:hover{ text-decoration:underline; }

        .ml-footer { text-align:center; margin-top:1.75rem; font-size:.7rem; color:#b0bcc8; line-height:1.6; }

        @media(max-width:768px){
          .ml-page{ flex-direction:column; }
          .ml-left{ min-height:auto; padding:2.5rem 1.5rem; }
          .ml-avatar{ width:150px; margin-top:1.5rem; }
          .ml-right{ width:100%; padding:2rem 1.5rem; }
        }
      `}</style>

      <div className="ml-page">

        {/* ── LEFT BLUE PANEL ── */}
        <div className="ml-left">
          <div className="ml-blob ml-blob-1" />
          <div className="ml-blob ml-blob-2" />
          <div className="ml-blob ml-blob-3" />

          <div className="ml-left-inner">
            <div className="ml-logo-wrap">
              <img src="/fitis-logo-white.png" alt="FITIS Logo" className="ml-logo" />
            </div>

            <h2 className="ml-welcome">Hello 👋 Welcome!</h2>
            <p className="ml-tagline">
              Access your FITIS member benefits, community, and resources all in one place.
            </p>

            <img src="/admin-avatar.png" alt="Member" className="ml-avatar" />

            <div className="ml-badges">
              <span className="ml-badge">🏢 Member Community</span>
              <span className="ml-badge">📋 Benefits Portal</span>
              <span className="ml-badge">🔒 Secure Access</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="ml-right">
          <div className="ml-form-box">

            {/* Back to Website */}
            <Link to="/" className="ml-back-link">
              <ChevronLeft size={16} /> Back to Website
            </Link>

            {/* Step icon (non-login steps) */}
            {forgotPasswordStep > 0 && current.icon}

            <h1 className="ml-form-title">{current.title}</h1>
            <p className="ml-form-sub">{current.sub}</p>
            <div className="ml-accent-bar" />

            {/* Error */}
            {error && (
              <div className={`ml-error ${isPending ? 'ml-error-amber' : 'ml-error-red'}`}>
                <AlertCircle size={15} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {/* ── STEP 0 : Login ── */}
            {forgotPasswordStep === 0 && (
              <form onSubmit={handleLogin}>
                {!loginOtpRequired ? (
                  <>
                    <label className="ml-label" htmlFor="ml-email">Official Email</label>
                    <div className="ml-input-wrap">
                      <span className="ml-input-icon"><Mail size={16} /></span>
                      <input
                        id="ml-email" type="email" required
                        className="ml-input" placeholder="contact@company.com"
                        value={email} onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                      />
                    </div>

                    <label className="ml-label" htmlFor="ml-password">Password</label>
                    <div className="ml-input-wrap">
                      <span className="ml-input-icon"><Lock size={16} /></span>
                      <input
                        id="ml-password" type="password" required
                        className="ml-input" placeholder="••••••••"
                        value={password} onChange={e => setPassword(e.target.value)}
                        autoComplete="current-password"
                      />
                    </div>

                    <button
                      type="button"
                      className="ml-forgot-btn"
                      onClick={() => { setForgotPasswordStep(1); setError(''); }}
                    >
                      Forgot Password?
                    </button>
                  </>
                ) : (
                  <>
                    <label className="ml-label" htmlFor="ml-login-otp">Login Verification Code</label>
                    <div className="ml-input-wrap">
                      <input
                        id="ml-login-otp" type="text" required maxLength={6}
                        className="ml-input ml-input-otp" placeholder="123456"
                        value={loginOtp} onChange={e => setLoginOtp(e.target.value)}
                      />
                    </div>
                    <p style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '1.25rem', marginTop: '-.6rem' }}>
                      A 6-digit code has been sent to your email to verify your login.
                    </p>
                  </>
                )}

                <button
                  ref={btnRef}
                  type="submit"
                  className="ml-btn"
                  disabled={isLoading}
                  onClick={addRipple}
                  id="member-login-submit"
                >
                  {ripples.map(r => (
                    <span key={r.id} className="ml-ripple" style={{ left: r.x, top: r.y }} />
                  ))}
                  <span className="ml-btn-inner">
                    {isLoading
                      ? <><span className="ml-spinner" /> Processing…</>
                      : loginOtpRequired ? <>Verify & Login <ArrowRight size={16} /></> : <>Sign In <ArrowRight size={16} /></>
                    }
                  </span>
                </button>

                <div className="ml-divider" />
                <div className="ml-signup-row">
                  Not part of the community yet?{' '}
                  <Link to="/signup">Apply Now</Link>
                </div>
              </form>
            )}

            {/* ── STEP 1 : Enter email for OTP ── */}
            {forgotPasswordStep === 1 && (
              <form onSubmit={handleForgotPasswordRequest}>
                <label className="ml-label" htmlFor="ml-reset-email">Registered Email</label>
                <div className="ml-input-wrap">
                  <span className="ml-input-icon"><Mail size={16} /></span>
                  <input
                    id="ml-reset-email" type="email" required
                    className="ml-input" placeholder="contact@company.com"
                    value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                  />
                </div>
                <p style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '1.25rem', marginTop: '-.6rem' }}>
                  We will send a one-time password to this email.
                </p>
                <div className="ml-btn-row">
                  <button type="button" className="ml-btn-secondary" onClick={() => { setForgotPasswordStep(0); setError(''); }}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button type="submit" className="ml-btn" disabled={isLoading} style={{ flex: 2 }}>
                    <span className="ml-btn-inner">
                      {isLoading ? <><span className="ml-spinner" /> Sending…</> : 'Send OTP'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 2 : Verify OTP ── */}
            {forgotPasswordStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <label className="ml-label" htmlFor="ml-otp">One-Time Password</label>
                <div className="ml-input-wrap">
                  <input
                    id="ml-otp" type="text" required maxLength={6}
                    className="ml-input ml-input-otp" placeholder="123456"
                    value={otp} onChange={e => setOtp(e.target.value)}
                  />
                </div>
                <p style={{ fontSize: '.78rem', color: '#94a3b8', marginBottom: '1.25rem', marginTop: '-.6rem' }}>
                  6-digit code sent to <strong style={{ color: '#475569' }}>{resetEmail}</strong>
                </p>
                <div className="ml-btn-row">
                  <button type="button" className="ml-btn-secondary" onClick={() => { setForgotPasswordStep(1); setError(''); }}>
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button type="submit" className="ml-btn" disabled={isLoading} style={{ flex: 2 }}>
                    <span className="ml-btn-inner">
                      {isLoading ? <><span className="ml-spinner" /> Verifying…</> : 'Verify OTP'}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* ── STEP 3 : New Password ── */}
            {forgotPasswordStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <label className="ml-label" htmlFor="ml-new-password">New Password</label>
                <div className="ml-input-wrap">
                  <span className="ml-input-icon"><Lock size={16} /></span>
                  <input
                    id="ml-new-password" type="password" required
                    className="ml-input" placeholder="••••••••"
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="ml-btn" disabled={isLoading} style={{ marginTop: '.25rem' }}>
                  <span className="ml-btn-inner">
                    {isLoading ? <><span className="ml-spinner" /> Resetting…</> : 'Reset Password'}
                  </span>
                </button>
              </form>
            )}

            <p className="ml-footer">
              Federation of Information Technology Industry Sri Lanka<br />
              © {new Date().getFullYear()} FITIS. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

