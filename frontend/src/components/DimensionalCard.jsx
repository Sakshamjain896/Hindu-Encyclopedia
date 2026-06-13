import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import './DimensionalCard.css'; 
import MagmaCardLayer from './MagmaCardLayer';

const DimensionalCard = ({ deityData, isSelected, onToggleSelect, onOpenPanel, isKaliMode }) => {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const voidRef = useRef(null);
  const avatarsRef = useRef([]);
  const linesRef = useRef([]);

  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    // Reset initial states safely
    if (cardRef.current) gsap.set(cardRef.current, { scale: 1, opacity: 1, y: 0 });
    if (voidRef.current) gsap.set(voidRef.current, { opacity: 0, scale: 0.8 });
    if (avatarsRef.current && avatarsRef.current.length > 0) gsap.set(avatarsRef.current, { opacity: 0, scale: 0, x: 0, y: 0 });

    tl.current = gsap.timeline({ paused: true });

    tl.current
      // 1. Gently lift and dim the main card instead of splitting it
      .to(cardRef.current, {
          y: -10,
          scale: 0.95,
          boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          duration: 0.4,
          ease: "power2.out"
      }, 0)

      // 2. Ignite the void glow behind it (cosmic reveal)
      .to(voidRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.2)" }, 0)

      // 3. Eject the Avatar Shards from behind the card
      .fromTo(avatarsRef.current,
        { opacity: 0, scale: 0, x: 0, y: 0, rotationZ: -15 },
        { 
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "back.out(1.5)",
          rotationZ: 0,
          // Spread them out wider so they peek around the solid card
          x: (i) => (i - 1) * 140, // Wider spread
          y: (i) => i === 1 ? -160 : -110 // Higher arc
        },
      "-=0.4");
      
      if(deityData?.avatars?.length > 0) {
        // 4. Draw the connecting data nodes
        tl.current.fromTo(linesRef.current,
            { strokeDashoffset: 200 },
            { strokeDashoffset: 0, duration: 0.4, stagger: 0.1, ease: 'power1.out' },
        "-=0.4");
      }

    return () => {
        if (tl.current) tl.current.kill();
    };
  }, [deityData]);

  const handleMouseEnter = () => {
    if (!deityData.avatars || deityData.avatars.length === 0) return;

    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setIsHovered(true);
      if(tl.current) tl.current.play();
    }, 200); 
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    if (isHovered && tl.current) {
        tl.current.reverse();
    }
    setIsHovered(false);
  };

  const handleCardClick = (e) => {
    if (e.target.closest('.compare-checkbox') || e.target.closest('.rift-shard')) return;
    onOpenPanel(deityData);
  };

  return (
    <div
        className={`dimensional-wrapper ${isSelected ? 'active' : ''}`}
        ref={wrapperRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
    >

      <input
        type="checkbox"
        className="compare-checkbox dimensional-checkbox"
        checked={isSelected}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggleSelect(deityData)} 
      />

      <div className="cosmic-void-container" ref={voidRef}>
        <div className="void-glow"></div>
        <div className="stars-layer"></div>

        {deityData.avatars && deityData.avatars.length > 0 && (
            <svg className="rift-svg-lines" viewBox="0 0 300 300" style={{ transform: 'scale(1.2)' }}>
                {deityData.avatars.map((_, i) => (
                    <line 
                        key={`line-${i}`}
                        ref={el => linesRef.current[i] = el}
                        x1="150" y1="180"
                        x2={150 + (i - 1) * 140} y2={150 + (i === 1 ? -160 : -110)}
                        stroke={deityData.avatars[i].type === 'fierce' ? '#ef4444' : '#0ea5e9'}
                        strokeWidth="2"
                        strokeDasharray="200"
                        strokeDashoffset="200"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.7))' }}
                    />
                ))}
            </svg>
        )}

        <div className="shards-container" style={{ zIndex: 10 }}>
          {deityData.avatars && deityData.avatars.map((avatar, i) => (
            <div
              key={avatar.name}
              className={`rift-shard ${avatar.type}`}
              ref={el => avatarsRef.current[i] = el}
            >
              <div className="shatter-effect"></div>
              <img src={avatar.img} alt={avatar.name} />
              <h4>{avatar.name}</h4>
              <p className="node-class">{avatar.type.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SINGLE SOLID CARD REPLACING SPLIT HALVES */}
      <div className="solid-card" ref={cardRef}>
        <img
          src={deityData.img || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png"}
          onError={(e) => { e.target.onerror = null; e.target.src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png" }}
          alt={deityData.name}
          className="main-img"
        />
        <div className="base-info">
             {isKaliMode && (
               <div className="magma-bg-overlay">
                 <MagmaCardLayer />
                 <div className="magma-dark-fade"></div>
               </div>
             )}
             <h3 className="name">{deityData.name}</h3>
             <p className="title">{deityData.title}</p>
             <div className="desc">{deityData.desc}</div>
        </div>
      </div>

    </div>
  );
};

export default DimensionalCard;
