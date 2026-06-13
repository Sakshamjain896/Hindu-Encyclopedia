import React, { useRef } from 'react';
import gsap from 'gsap';
import './AsuraCard.css';

const AsuraCard = ({ deityData, isSelected, onToggleSelect, onOpenPanel }) => {
  const containerRef = useRef(null);
  const fireRef = useRef(null);
  const elementsRef = useRef([]);

  const handleMouseEnter = () => {
    if (gsap) {
      // Violent/Glitchy jitter on hover for Demonic Asura
      gsap.to(containerRef.current, { 
        duration: 0.1, 
        x: 'random(-4, 4)', 
        y: 'random(-4, 4)', 
        rotationZ: 'random(-1, 1)', 
        repeat: 3, 
        yoyo: true, 
        onComplete: () => gsap.set(containerRef.current, {x:0, y:0, rotationZ:0})
      });

      // Fire erupts from bottom
      gsap.to(fireRef.current, { opacity: 1, scaleY: 1.2, duration: 0.4, ease: "power2.out" });

      if (elementsRef.current.length > 0) {
        // Blood-red shards fly outwards
        gsap.fromTo(elementsRef.current, 
          { opacity: 0, scale: 0.5, y: 50, x: 0 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.6, 
            stagger: 0.08, 
            ease: "elastic.out(1, 0.4)",
            x: (i) => (i % 2 === 0 ? '-=50' : '+=50'), 
            y: (i) => '-=' + (80 + i * 20),
            rotationZ: 'random(-30, 30)'
          }
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (gsap) {
      gsap.to(fireRef.current, { opacity: 0, scaleY: 0, duration: 0.3 });
      
      if (elementsRef.current.length > 0) {
        gsap.to(elementsRef.current, { opacity: 0, scale: 0.5, y: 50, x: 0, duration: 0.4, stagger: 0.05 });
      }
    }
  };

  return (
    <div 
      className={`asura-card-wrapper ${isSelected ? 'asura-selected' : ''}`}
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (e.target.closest('input') || e.target.closest('.asura-shard')) return;
        onOpenPanel(deityData);
      }}
    >
      <div className="asura-hellfire" ref={fireRef}></div>
      <div className="asura-card-content">
        <input
          type="checkbox"
          className="compare-checkbox asura-checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggleSelect(deityData)} 
        />
        
        <div className="asura-image-clipper">
          <img 
            className="asura-main-img"
            src={deityData.img || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png"} 
            alt={deityData.name} 
          />
          <div className="asura-vignette"></div>
        </div>

        <div className="asura-text-block">
          <h3 className="asura-name" data-text={deityData.name}>{deityData.name}</h3>
          <h4 className="asura-title">{deityData.title}</h4>
          <div className="asura-divider"></div>
          <p className="asura-desc">{deityData.desc}</p>
        </div>
      </div>

      {deityData.avatars && deityData.avatars.length > 0 && (
        <div className="asura-shards-layer">
          {deityData.avatars.map((avatar, i) => (
            <div
              key={avatar.name}
              className="asura-shard"
              ref={el => elementsRef.current[i] = el}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={avatar.img} alt={avatar.name} />
              <div className="asura-shard-label">{avatar.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AsuraCard;