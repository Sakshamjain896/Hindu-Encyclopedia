import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import './DivineCard.css';

const DivineCard = ({ deityData, isSelected, onToggleSelect, onOpenPanel }) => {
  const cardRef = useRef(null);
  const haloRef = useRef(null);
  const elementsRef = useRef([]);

  const handleMouseEnter = () => {
    if (gsap) {
      gsap.to(cardRef.current, { y: -15, scale: 1.02, duration: 0.6, ease: "power3.out" });
      gsap.to(haloRef.current, { opacity: 1, scale: 1.2, duration: 0.8, ease: "power2.out" });
      
      if (elementsRef.current.length > 0) {
        gsap.fromTo(elementsRef.current, 
          { opacity: 0, y: 20, 
            // 3D rotation reveal
            rotationX: 45 },
          { opacity: 1, y: 0, rotationX: 0, duration: 0.8, stagger: 0.1, ease: "back.out(1.5)" }
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (gsap) {
      gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.6, ease: "power3.out" });
      gsap.to(haloRef.current, { opacity: 0, scale: 0.9, duration: 0.5 });
      
      if (elementsRef.current.length > 0) {
        gsap.to(elementsRef.current, { opacity: 0, y: 15, rotationX: 20, duration: 0.4 });
      }
    }
  };

  return (
    <div 
      className={`divine-card-wrapper ${isSelected ? 'selected' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => {
        if (e.target.closest('input') || e.target.closest('.divine-shard')) return;
        onOpenPanel(deityData);
      }}
      ref={cardRef}
    >
      <div className="divine-halo" ref={haloRef}></div>
      <div className="divine-card-content">
        <input
          type="checkbox"
          className="compare-checkbox divine-checkbox"
          checked={isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => onToggleSelect(deityData)} 
        />
        <div className="image-container">
          <img 
            src={deityData.img || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png"} 
            alt={deityData.name} 
          />
          <div className="image-glow-overlay"></div>
        </div>
        <div className="divine-info">
          <h3>{deityData.name}</h3>
          <h4>{deityData.title}</h4>
          <p>{deityData.desc}</p>
        </div>
      </div>

      {deityData.avatars && deityData.avatars.length > 0 && (
        <div className="divine-shards-container">
          {deityData.avatars.map((avatar, i) => (
            <div
              key={avatar.name}
              className="divine-shard"
              ref={el => elementsRef.current[i] = el}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={avatar.img} alt={avatar.name} />
              <div className="shard-info">
                <span>{avatar.name}</span>
                <small>{avatar.type}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DivineCard;