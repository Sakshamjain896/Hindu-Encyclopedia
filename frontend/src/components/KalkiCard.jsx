import React from 'react';
import './KalkiCard.css';

const KalkiCard = ({ deityData, isSelected, onToggleSelect, onOpenPanel }) => {
  const handleCardClick = (e) => {
    if (e.target.closest('.compare-checkbox')) return;
    if (onOpenPanel) onOpenPanel(deityData);
  };

  return (
    <div 
      className={`platinum-card-wrapper ${isSelected ? 'active' : ''}`}
      onClick={handleCardClick}
    >
      <input
        type="checkbox"
        className="compare-checkbox dimensional-checkbox"
        checked={isSelected}
        onClick={(e) => e.stopPropagation()}
        onChange={() => onToggleSelect && onToggleSelect(deityData)} 
        style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}
      />
      
      {/* 1. The Rotating Liquid Metal Gradient (Runs in background) */}
      <div className="liquid-border-animator"></div>
      
      {/* 2. The Frosted Glass Core (Hides the center of the gradient) */}
      <div className="platinum-card-core">
        
        {/* The Aurora Hover Glow */}
        <div className="aurora-glow"></div>

        <div className="card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="avatar-ring" style={{ marginTop: '20px' }}>
            <img src={deityData?.img || "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Om_symbol.svg/1024px-Om_symbol.svg.png"} alt={deityData?.name || "Kalki"} />
          </div>
          <h3 className="metallic-text gold-text">{deityData?.name || "KALKI"}</h3>
          <p className="metallic-text cyan-text">{deityData?.title || "THE SUPREME PURIFIER"}</p>

          <div style={{ padding: '0 15px', marginTop: '15px', color: '#1f2937', fontSize: '0.85em', textAlign: 'center', fontWeight: '500', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {deityData?.desc}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default KalkiCard;
