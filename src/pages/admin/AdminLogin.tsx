import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../lib/auth';

export const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const navigate = useNavigate();
  const btnRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5004';
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (response.ok) {
        login(data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++rippleId.current;
    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 650);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap');

        @keyframes rippleAnim {
          0%   { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(6); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatAvatar {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobMove {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(20px, -20px) scale(1.08); }
          66%       { transform: translate(-15px, 10px) scale(0.95); }
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .al-page {
          min-height: 100vh;
          display: flex;
          align-items: stretch;
          font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
          background: #f1f5f9;
        }

        /* ── LEFT PANEL ──────────────────────────────── */
        .al-left {
          flex: 1;
          background: linear-gradient(145deg, #004a99 0%, #0066cc 50%, #005ab5 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2.5rem;
          position: relative;
          overflow: hidden;
          min-height: 100vh;
        }

        /* decorative blobs */
        .al-blob {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.07);
          animation: blobMove 10s ease-in-out infinite;
        }
        .al-blob-1 { width: 280px; height: 280px; top: -80px; left: -80px; animation-delay: 0s; }
        .al-blob-2 { width: 200px; height: 200px; bottom: -60px; right: -60px; animation-delay: 3s; }
        .al-blob-3 { width: 150px; height: 150px; bottom: 30%; left: -50px; animation-delay: 6s; }

        .al-left-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .al-logo-wrap {
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          padding: 1rem 1.5rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
        }

        .al-logo {
          height: 64px;
          object-fit: contain;
          filter: brightness(0) invert(1);
        }

        .al-welcome {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 0.6rem;
        }

        .al-tagline {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.7);
          max-width: 240px;
          line-height: 1.6;
        }

        .al-avatar {
          width: 220px;
          margin-top: 2.5rem;
          animation: floatAvatar 4s ease-in-out infinite;
          filter: drop-shadow(0 24px 24px rgba(0,0,0,0.25));
        }

        /* ── RIGHT PANEL ──────────────────────────────── */
        .al-right {
          width: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          padding: 3rem 2.5rem;
          min-height: 100vh;
        }

        .al-form-box {
          width: 100%;
          animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }

        .al-form-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.35rem;
        }

        .al-form-sub {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 2rem;
        }

        .al-divider-line {
          height: 2px;
          width: 40px;
          background: #004a99;
          border-radius: 2px;
          margin-bottom: 2rem;
        }

        .al-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 0.4rem;
          letter-spacing: 0.03em;
        }

        .al-input-wrap {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .al-input-icon {
          position: absolute;
          left: 0.85rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
        }

        .al-input {
          width: 100%;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.78rem 0.9rem 0.78rem 2.6rem;
          font-size: 0.92rem;
          color: #1e293b;
          font-family: 'Inter', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          outline: none;
        }

        .al-input::placeholder { color: #b0bcc8; }

        .al-input:focus {
          border-color: #004a99;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,74,153,0.1);
        }

        .al-error {
          background: #fef2f2;
          border: 1.5px solid #fecaca;
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          font-size: 0.82rem;
          color: #dc2626;
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .al-btn {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding: 0.85rem 1.25rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #004a99, #0066cc);
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          transition: background 0.25s, box-shadow 0.25s, transform 0.15s;
          box-shadow: 0 4px 14px rgba(0,74,153,0.4);
          margin-top: 0.25rem;
        }

        .al-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #003d80, #0055aa);
          box-shadow: 0 6px 20px rgba(0,74,153,0.5);
          transform: translateY(-1px);
        }

        .al-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(0,74,153,0.3);
        }

        .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .al-ripple {
          position: absolute;
          border-radius: 50%;
          width: 80px; height: 80px;
          margin-left: -40px; margin-top: -40px;
          background: rgba(255,255,255,0.38);
          pointer-events: none;
          animation: rippleAnim 0.65s linear forwards;
        }

        .al-btn-inner {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .al-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .al-footer {
          margin-top: 2rem;
          font-size: 0.72rem;
          color: #b0bcc8;
          text-align: center;
          line-height: 1.6;
        }

        /* ── Responsive ──────────────────────────────── */
        @media (max-width: 768px) {
          .al-page { flex-direction: column; }
          .al-left { min-height: auto; padding: 2.5rem 1.5rem; }
          .al-avatar { width: 150px; margin-top: 1.5rem; }
          .al-right { width: 100%; padding: 2rem 1.5rem; }
        }
      `}</style>

      <div className="al-page">

        {/* ── LEFT BLUE PANEL ── */}
        <div className="al-left">
          <div className="al-blob al-blob-1" />
          <div className="al-blob al-blob-2" />
          <div className="al-blob al-blob-3" />

          <div className="al-left-inner">
            <div className="al-logo-wrap">
              <img src="/fitis-logo-white.png" alt="FITIS Logo" className="al-logo" />
            </div>

            <h2 className="al-welcome">Hello 👋 Welcome!</h2>
            <p className="al-tagline">
              Sign in to access the FITIS administration dashboard.
            </p>

            <img src="/admin-avatar.png" alt="Admin" className="al-avatar" />
          </div>
        </div>

        {/* ── RIGHT WHITE FORM PANEL ── */}
        <div className="al-right">
          <div className="al-form-box">
            <h1 className="al-form-title">Login</h1>
            <p className="al-form-sub">Please sign in to admin dashboard</p>
            <div className="al-divider-line" />

            {error && (
              <div className="al-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div>
                <label className="al-label" htmlFor="admin-username">Email / Username</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    className="al-input"
                    id="admin-username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="al-label" htmlFor="admin-password">Password</label>
                <div className="al-input-wrap">
                  <span className="al-input-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    className="al-input"
                    id="admin-password"
                    type="password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
              </div>

              <button
                ref={btnRef}
                type="submit"
                className="al-btn"
                disabled={isLoading}
                onClick={handleRipple}
                id="admin-login-submit"
              >
                {ripples.map(r => (
                  <span
                    key={r.id}
                    className="al-ripple"
                    style={{ left: r.x, top: r.y }}
                  />
                ))}
                <span className="al-btn-inner">
                  {isLoading ? (
                    <><span className="al-spinner" /> Signing in…</>
                  ) : 'Login'}
                </span>
              </button>
            </form>

            <p className="al-footer">
              Federation of Information Technology Industry Sri Lanka<br />
              © {new Date().getFullYear()} FITIS. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </>
  );
};

