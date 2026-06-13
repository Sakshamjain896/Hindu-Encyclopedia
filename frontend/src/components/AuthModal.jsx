import { useState } from 'react';
import useAppSound from '../hooks/useAppSound';

export default function AuthModal({ isOpen, onClose, onLogin }) {
  const { playClick, playHover, playSuccess, playError } = useAppSound();
  const [rightPanel, setRightPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error or unreachable. Please ensuring backend is running.');
      }
      
      const data = await res.json();
      if (!res.ok) {
        playError();
        throw new Error(data.message || data.error || 'Login failed');
      }
      
      playSuccess();
      onLogin(data);
      onClose();
    } catch (err) {
      playError();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    playClick();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, email, password })
      });
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server error or unreachable. Please ensuring backend is running.');
      }

      const data = await res.json();
      if (!res.ok) {
        playError();
        throw new Error(data.message || data.error || 'Registration failed');
      }
      
      playSuccess();
      onLogin(data);
      onClose();
    } catch (err) {
      playError();
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="authModalWrapper"
      className={isOpen ? 'show' : ''}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      
      <div className={`auth-container ${rightPanel ? 'right-panel-active' : ''}`}>
        <span className="close-auth-modal" onClick={onClose}>
          &times;
        </span>
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h2>Embrace the Dark</h2>
            
            <span>or use your email for registration</span>
            <input name="name" type="text" placeholder="Name" required minLength={2} />
            <input name="email" type="email" placeholder="Email" required />
            <div style={{ position: 'relative', width: '100%' }}>
              <input name="password" type={showRegisterPassword ? 'text' : 'password'} placeholder="Password" required minLength={6} style={{ marginBottom: 0 }} />
              <span onClick={() => setShowRegisterPassword(!showRegisterPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.7, color: 'var(--text-color)' }}>
                {showRegisterPassword ? 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  : 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                }
              </span>
            </div>
            {error && <p className="error-msg" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{error}</p>}
            <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>{loading ? 'Forging...' : 'Forge Destiny'}</button>
            <button type="button" className="mobile-auth-toggle" onClick={() => setRightPanel(false)}>
              Already have a shrine? Sign In
            </button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h2>Enter the Shrine</h2>
            
            <span>or use your account</span>
            <input name="email" type="email" placeholder="Email" required />
            <div style={{ position: 'relative', width: '100%' }}>
              <input name="password" type={showLoginPassword ? 'text' : 'password'} placeholder="Password" required minLength={6} style={{ marginBottom: 0 }} />
              <span onClick={() => setShowLoginPassword(!showLoginPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', opacity: 0.7, color: 'var(--text-color)' }}>
                {showLoginPassword ? 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  : 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                }
              </span>
            </div>
            <a href="#" style={{ color: '#777', textDecoration: 'none', fontSize: '13px', margin: '10px 0' }}>
              Forgot your password?
            </a>
            {error && <p className="error-msg" style={{color: 'red', fontSize: '12px', marginTop: '4px'}}>{error}</p>}
            <button type="submit" disabled={loading} style={{ marginTop: '15px' }}>{loading ? 'Entering...' : 'Sign In'}</button>
            <button type="button" className="mobile-auth-toggle" onClick={() => setRightPanel(true)}>
              Seek power? Sign Up
            </button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h2>Seek the Light?</h2>
              <p>Return to the divine realm and access your personal shrines.</p>
              <button className="auth-ghost" onClick={() => setRightPanel(false)}>
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h2>Embrace the Dark?</h2>
              <p>Forge a new path, summon forbidden entities, and challenge the heavens.</p>
              <button className="auth-ghost" onClick={() => setRightPanel(true)}>
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);

}