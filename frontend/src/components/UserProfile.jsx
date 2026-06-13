import { useState } from 'react';
import PaymentModal from './PaymentModal';
import useAppSound from '../hooks/useAppSound';

export default function UserProfile({ user, onLogout, onToggleKaliYuga, isKaliYuga, onUpdateUser }) {
  const { playClick, playHover, playSuccess, playError } = useAppSound();
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleUnlock = async () => {
    playClick();
    if ((user.tokens || 0) < 500) {
      playError();
      alert("Insufficient Tokens! You need 500 Tokens to unlock the Kali Yuga age.");
      setShowPayment(true);
      return;
    }

    if (window.confirm("Unlock 'Kali Yuga' Theme for 500 Tokens?")) {
      try {
        const res = await fetch('/api/unlock-premium', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || user._id })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        playSuccess();
        onUpdateUser(data.user);
        alert("The Dark Age Unlocked. Press the toggle to enter.");
      } catch (err) {
        playError();
        alert(err.message);
      }
    }
  };

  return (
    <>
      <div className="profile-wrapper" style={{position: 'relative'}}>
        <div 
          className="profile-trigger" 
          onClick={() => { playClick(); setIsOpen(!isOpen); }}
          onMouseEnter={playHover}
          title={user.username || user.name || 'User'}
        >
          <img 
            src={user.avatar || `https://ui-avatars.com/api/?name=${user.username || user.name || 'User'}&background=random`} 
            alt="User Profile" 
            className="profile-avatar"
          />
          <span className="profile-name">{(user.username || user.name || 'User').split(' ')[0]}</span>
        </div>

        {isOpen && (
          <div className="profile-dropdown">
            <div className="profile-header">
              <h4>{user.username || user.name || 'User'}</h4>
              <p>{user.email}</p>
            </div>
            
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{user.tokens || 0} <span className="celestial-shard"></span></span>
                <span className="stat-label">Celestial Shards</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{user.karma || 0}</span>
                <span className="stat-label">Karma</span>
              </div>
            </div>

            <button className="menu-btn buy-tokens" onMouseEnter={playHover} onClick={() => { playClick(); setShowPayment(true); }}>
              Buy Tokens 
            </button>

            {user.premium ? (
              <button className={`menu-btn ${isKaliYuga ? 'active-kali' : ''}`} onMouseEnter={playHover} onClick={() => { playClick(); onToggleKaliYuga(); setIsOpen(false); }}>
                {isKaliYuga ? 'Exit Kali Yuga' : 'Enter Kali Yuga 🧭'}
              </button>
            ) : (
              <button className="menu-btn locked" onMouseEnter={playHover} onClick={handleUnlock}>
                Unlock Kali Yuga (500 <span className="celestial-shard inline-shard"></span>) 🔒
              </button>
            )}

            <hr style={{margin: '15px 0', border: 'none', borderTop: '1px solid rgba(184, 150, 77, 0.2)', width: '80%', marginLeft: '10%'}}/>
            
            <button className="logout-btn" onMouseEnter={playHover} onClick={() => { playClick(); onLogout(); }}>
              Abandon Shrine
            </button>
          </div>
        )}
      </div>
      
      <PaymentModal 
        isOpen={showPayment} 
        onClose={() => setShowPayment(false)} 
        user={user}
        onUpdateUser={onUpdateUser}
      />

      <style>{`
        /* --- HALLOWED TEMPLE UI --- */
        
        /* Base Ghost Button */
        .profile-dropdown .menu-btn {
          width: 100% !important;
          padding: 14px !important;
          margin: 10px 0 !important;
          background: transparent !important;
          border: 1px solid rgba(184, 150, 77, 0.4) !important;
          color: #8c6b2e !important; /* Deep Gold Text */
          border-radius: 2px !important;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Cinzel', serif;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        /* Hover Glow */
        .profile-dropdown .menu-btn:hover {
          background: rgba(184, 150, 77, 0.05) !important;
          border-color: #d4af37 !important;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.3) !important;
          color: #d4af37 !important;
          text-shadow: 0 0 5px rgba(212, 175, 55, 0.4);
          transform: translateY(-1px);
        }

        /* --- "Buy Tokens" Special Style --- */
        .profile-dropdown .menu-btn.buy-tokens {
          border-color: #b8964d !important;
        }
        
        /* --- "Kali Yuga" Styles (Dharma Compass) --- */
        .profile-dropdown .menu-btn.active-kali {
           /* Same ghost style, maybe darker border */
           border-color: #8c6b2e !important;
        }

        .profile-dropdown .menu-btn.locked {
          opacity: 0.5;
          filter: sepia(1);
          border-style: dotted !important;
        }

        /* --- Abandon Shrine (Logout) --- */
        .logout-btn {
            margin-top: 20px;
            width: 100%;
            padding: 12px;
            background: transparent;
            border: 1px solid rgba(101, 67, 33, 0.4); /* Wood Brown Border */
            color: #5D4037; /* Deep Wood Text */
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            transition: all 0.3s ease;
            border-radius: 2px;
            font-family: 'Cinzel', serif;
            font-weight: 700;
            cursor: pointer;
            opacity: 0.8;
        }
        .logout-btn:hover {
            border-color: #8D6E63; /* Lighter Wood on hover */
            color: #8D6E63;
            background: rgba(93, 64, 55, 0.05);
            box-shadow: 0 0 10px rgba(93, 64, 55, 0.1);
            opacity: 1;
            transform: translateY(-1px);
        }

        /* --- Stone Emblem (Lotus / Dharma Wheel) --- */
        /* Replacing the shard with a Lotus via CSS shapes is complex, using Emoji with stone filter */
        .celestial-shard {
            display: inline-block;
            width: auto; height: auto;
            background: none;
            box-shadow: none;
            font-size: 1.2em;
            filter: sepia(1) contrast(0.8) brightness(0.9) drop-shadow(1px 1px 0 rgba(255,255,255,0.5));
            transform: none;
            margin-left: 5px;
            border: none;
        }
        .celestial-shard::before, .celestial-shard::after { content: none; }
        
        /* Inject the Lotus Emojis via content since we removed the CSS diamond */
        .celestial-shard::before {
            content: '🪷'; 
            display: inline-block;
        }

        .inline-shard {
            font-size: 1em;
            vertical-align: middle;
        }
        
        /* Stat Numbers */
        .stat-value {
          font-family: 'Cinzel', serif;
          font-size: 1.4rem;
          color: #8c6b2e;
          text-shadow: 1px 1px 0 #fff;
        }
      `}</style>
    </>
  );
}