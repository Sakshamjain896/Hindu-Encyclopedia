import { useState, useEffect } from 'react';
import useAppSound from '../hooks/useAppSound';

export default function PaymentModal({ isOpen, onClose, user, onUpdateUser }) {
  const { playClick, playHover, playSuccess, playAnvil, playChime } = useAppSound();
  const [rightPanelActive, setRightPanelActive] = useState(false);
  const [amount, setAmount] = useState(100);
  const [status, setStatus] = useState('idle');
  const [transactionStep, setTransactionStep] = useState(0);

  const steps = [
      { hell: 'Initiating Dark Pact...', heaven: 'Offering Prayer...' },
      { hell: 'Drawing Blood from Source...', heaven: 'Transmitting Cosmic Energy...' },
      { hell: 'Demon Lord Approval...', heaven: 'Deva Verification...' },
      { hell: 'PACT SEALED', heaven: 'GRACE GRANTED' }
  ];

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setAmount(100);
      setRightPanelActive(false);
      setTransactionStep(0);
    }
  }, [isOpen]);

  const isHell = !rightPanelActive;

  const handlePurchase = (e) => {
    e.preventDefault();
    playClick();
    setStatus('processing');
    setTransactionStep(0);
    
    if (isHell) playAnvil(); else playChime();

    let currentStep = 0;
    const interval = setInterval(() => {
        currentStep++;
        if (currentStep < 3) {
            setTransactionStep(currentStep);
        } else {
            clearInterval(interval);
            finishTransaction();
        }
    }, 1500);
  };

const finishTransaction = async () => {
      try {
        const res = await fetch('/api/purchase-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id || user._id, amount })
        });
        const data = await res.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        onUpdateUser(data.user);
        setStatus('success');
        playSuccess();
        setTimeout(() => { onClose(); setStatus('idle'); }, 3000);
      } catch (err) {
        console.error("Token purchase failed:", err);
        setStatus('error');
        setTimeout(() => { setStatus('idle'); }, 3000);
      }
  };

  if (!isOpen) return null;

  return (
    <div id='paymentModalWrapper' className={isOpen ? 'show' : ''} onClick={(e) => { if (e.target.id === 'paymentModalWrapper') onClose(); }}>
      
      <div className={'payment-container ' + (rightPanelActive ? 'right-panel-active' : '')}>
        <span className='close-payment-modal' onClick={onClose} title='Close'>&times;</span>

        {/* --- KALI MODE (Left Panel - Bright Red Theme) --- */}
        <div className='payment-mode-kali'>
            <div className='payment-form-content'>
                {status === 'idle' ? (
                  <form onSubmit={handlePurchase} style={{width: '100%'}}>
                    <h2 className='text-3xl font-cinzel mb-2 uppercase tracking-wide text-red-500 drop-shadow-sm'>Asuric Pact</h2>
                    <p className='text-red-300 italic mb-6 font-medium'>Through sacrifice, gain power.</p>
                    
                    {/* NEW CARD SELECTOR: 3-Column Grid, Rectangular Cards */}
                    <div className='amount-selector mb-6 grid grid-cols-3 gap-3 w-full'>
                        {[100, 500, 1000].map(val => (
                            <div 
                                key={val} 
                                onClick={() => setAmount(val)}
                                className={`
                                    cursor-pointer relative overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-3 h-28
                                    ${amount === val 
                                        ? 'border-red-600 shadow-xl scale-105 ring-2 ring-red-900 ring-opacity-50' 
                                        : 'hover:-translate-y-1'
                                    }
                                `}
                            >
                                <div className={`text-2xl font-bold font-cinzel mb-1`}>{val}</div>
                                <div className='text-[10px] tracking-widest uppercase font-bold mb-2'>Shards</div>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full`}>
                                    ?{val * 0.5}
                                </div>
                                {/* Triangular Corner Indicator for Selection */}
                                {amount === val && (
                                     <div className='absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-transparent border-r-red-700'></div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='w-full max-w-xs mx-auto space-y-3'>
                        <input type='text' placeholder='XXXX XXXX XXXX XXXX' className='stone-input w-full shadow-inner' required maxLength='19' />
                        <div className='flex gap-3'>
                            <input type='text' placeholder='MM/YY' className='stone-input w-1/2 shadow-inner' required maxLength='5' />
                            <input type='password' placeholder='CVV' className='stone-input w-1/2 shadow-inner' required maxLength='3' />
                        </div>
                    </div>

                    <button type='submit' className='pay-submit-btn mt-6 w-full max-w-xs shadow-lg transform hover:-translate-y-1' onMouseEnter={playHover}>
                        SEAL PACT
                    </button>
                  </form>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full animate-pulse'>
                        {status === 'processing' && (
                            <>
                                <div className='transaction-loader red-loader'></div>
                                <div className='transaction-step text-xl tracking-widest text-red-400 font-bold mt-4'>{steps[transactionStep].hell}</div>
                                <p className='text-xs text-red-300 mt-2 font-mono'>Connecting to Narakasura Net...</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <div className='text-6xl mb-4 text-red-500'>?</div>
                                <h3 className='text-2xl text-red-500 font-cinzel tracking-widest'>PACT SEALED</h3>
                                <div className='mt-4 p-4 border-2 border-dashed border-red-800 bg-black/50 rounded-lg text-left w-64 font-mono text-sm text-red-300 shadow-lg'>
                                    <p>TXN ID: ASURA-{Math.floor(Math.random()*100000)}</p>
                                    <p>AMOUNT: {amount} SHARDS</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* --- KALKI MODE (Right Panel - Bright Blue Theme) --- */}
        <div className='payment-mode-kalki'>
            <div className='payment-form-content'>
                {status === 'idle' ? (
                  <form onSubmit={handlePurchase} style={{width: '100%'}}>
                    <h2 className='text-3xl font-cinzel mb-2 uppercase tracking-wide text-cyan-700 drop-shadow-sm'>Divine Offering</h2>
                    <p className='text-cyan-800 italic mb-6 font-medium'>Sustain the cosmic balance.</p>
                    
                    {/* NEW CARD SELECTOR: 3-Column Grid, Rectangular Cards */}
                    <div className='amount-selector mb-6 grid grid-cols-3 gap-3 w-full'>
                        {[100, 500, 1000].map(val => (
                            <div 
                                key={val} 
                                onClick={() => setAmount(val)}
                                className={`
                                    cursor-pointer relative overflow-hidden rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-3 h-28
                                    ${amount === val 
                                        ? 'border-cyan-600 bg-cyan-100 shadow-xl scale-105 ring-2 ring-cyan-400 ring-opacity-50' 
                                        : 'border-cyan-200 bg-white/60 hover:border-cyan-400 hover:bg-cyan-50 hover:-translate-y-1'
                                    }
                                `}
                            >
                                <div className={`text-2xl font-bold font-cinzel mb-1 ${amount === val ? 'text-cyan-700' : 'text-cyan-800'}`}>{val}</div>
                                <div className='text-[10px] tracking-widest text-cyan-600 uppercase font-bold mb-2'>Drops</div>
                                <div className={`text-sm font-bold px-3 py-1 rounded-full ${amount === val ? 'bg-cyan-600 text-white shadow-md' : 'bg-cyan-200 text-cyan-800'}`}>
                                    ?{val * 0.5}
                                </div>
                                {/* Triangular Corner Indicator for Selection */}
                                {amount === val && (
                                     <div className='absolute top-0 right-0 w-0 h-0 border-t-[24px] border-r-[24px] border-t-transparent border-r-cyan-600'></div>
                                )}
                            </div>
                        ))}
                    </div>

                     <div className='w-full max-w-xs mx-auto space-y-3'>
                        <input type='text' placeholder='devotee@cosmos' className='divine-input w-full shadow-inner' required />
                        <div className='text-xs text-cyan-700 font-medium text-center bg-cyan-50 p-2 rounded border border-cyan-200'>
                            ? Awaiting celestial approval...
                        </div>
                    </div>

                    <button type='submit' className='pay-submit-btn mt-6 w-full max-w-xs shadow-lg transform hover:-translate-y-1' style={{backgroundColor: '#0ea5e9', borderColor: '#38bdf8'}} onMouseEnter={playHover}>
                        MAKE OFFERING
                    </button>
                  </form>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full animate-pulse'>
                         {/* Transaction Animation */}
                        {status === 'processing' && (
                            <>
                                <div className='transaction-loader blue-loader'></div>
                                <div className='transaction-step text-xl tracking-widest text-cyan-800 font-bold mt-4'>{steps[transactionStep].heaven}</div>
                                <p className='text-xs text-cyan-600 mt-2 font-mono'>Connecting to Swarga Net...</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <div className='text-6xl mb-4 text-cyan-600'>?</div>
                                <h3 className='text-2xl text-cyan-700 font-cinzel tracking-widest'>GRACE GRANTED</h3>
                                <div className='mt-4 p-4 border-2 border-dashed border-cyan-300 bg-cyan-50 rounded text-left w-64 font-mono text-sm text-cyan-800 shadow-sm'>
                                    <p>TXN ID: DEVA-{Math.floor(Math.random()*100000)}</p>
                                    <p>AMOUNT: {amount} DROPS</p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* --- OVERLAY SWITCHER --- */}
        <div className='payment-overlay-container'>
            <div className='payment-overlay'>
                
                {/* Left Overlay: Visible when Right Panel Active (Kalki is active, this button takes back to Kali) */}
                <div className='payment-overlay-panel payment-overlay-left'>
                    <h2 className='text-3xl font-cinzel text-cyan-400 mb-4'>Seek Power?</h2>
                    <p className='text-cyan-100 mb-8'>If you crave the forbidden strength of the Asuras...</p>
                    <button className='payment-ghost-btn' onClick={() => { playHollowClick(); setRightPanelActive(false); }}>
                        Forge Pact (Card)
                    </button>
                </div>
                
                {/* Right Overlay: Visible when Left Panel Active (Kali is active, this button takes to Kalki) */}
                <div className='payment-overlay-panel payment-overlay-right'>
                    <h2 className='text-3xl font-cinzel text-red-500 mb-4'>Seek Purity?</h2>
                    <p className='text-red-100 mb-8'>If you wish to restore Dharma and aid the Avatar...</p>
                    <button className='payment-ghost-btn' onClick={() => { playDivineClick(); setRightPanelActive(true); }}>
                        Make Offering (UPI)
                    </button>
                </div>
            </div>
        </div>

        {/* Mobile Toggle (Hidden on Desktop via CSS) */}
        <div className='mobile-payment-toggle' onClick={() => setRightPanelActive(!rightPanelActive)}>
            {rightPanelActive ? 'Switch to Card (Asura)' : 'Switch to UPI (Divine)'}
        </div>

      </div>
    </div>
  );
  
  function playHollowClick() {
      playClick();
      // Add heavy thud sound if available or just click
  }
  function playDivineClick() {
      playClick(); 
      // Add chime sound if available
  }
}
