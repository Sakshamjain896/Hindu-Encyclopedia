import React, { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import './YugaChronicles.css';

gsap.registerPlugin(useGSAP);

const narrativeData = [
  { id: 'samudra', era: 'Satya Yuga', focus: 'Creation', title: 'Samudra Manthan', subtitle: 'Churning of the Cosmic Ocean', desc: 'An unprecedented divine pact between Devas and Asuras to churn the Kshira Sagara for the nectar of immortality. Under immense cosmic friction, magnificent treasures and the world-ending Halahala poison arose before the ultimate prize.', img: 'https://png.pngtree.com/thumb_back/fw800/background/20251120/pngtree-samudra-manthana-churning-the-ocean-image_20491764.webp' },
  { id: 'narasimha', era: 'Satya Yuga', focus: 'Conflict', title: 'Narasimha Avatar', subtitle: 'The Half-Lion Incarnation', desc: 'Lord Vishnu incarnates as the fierce half-man, half-lion to bypass a complex boon of invincibility. He ends the cosmic tyranny of the demon king Hiranyakashipu, protecting his absolute devotee Prahlada at the threshold of day and night.', img: 'https://www.pinkvilla.com/images/2025-11/344114581_mahavatar-narsimha-oscars-sq-webp.webp' },
  { id: 'ramayana', era: 'Treta Yuga', focus: 'Philosophy', title: 'The Ramayana Epic', subtitle: 'The Path of Righteousness', desc: 'The divine earthly journey of Lord Rama, illustrating supreme dharma, devotion, and the steadfast victory of divine light over the darkness embodied by the multi-headed rakshasa king Ravana in the citadel of Lanka.', img: 'https://media.assettype.com/thequint/2024-01/f9ea022f-3e68-4995-9ff0-50c1d7beea8c/GEdgTgeWIAIs8j9.jpeg?auto=format,compress&fmt=webp&format=webp&w=1200&h=900&dpr=1.0' },
  { id: 'kaliya_mardan', era: 'Dvapara Yuga', focus: 'Conflict', title: 'Kaliya Manthan', subtitle: 'Subduing the Poisonous Serpent', desc: 'The divine child Krishna leaps into the poisoned waters of the Yamuna and dances upon the myriad hoods of the mighty Naga, Kaliya, purifying the river and restoring harmony to the ecology of Vrindavan.', img: 'https://t4.ftcdn.net/jpg/18/22/78/93/360_F_1822789369_dullRYcbzEav1JkTjpKRx4yh82L5W7fT.jpg' },
  { id: 'kansa_wadh', era: 'Dvapara Yuga', focus: 'Conflict', title: 'Kansa Wadh', subtitle: 'The Fall of the Tyrant King', desc: 'Fulfilling the great prophecy, Krishna storms the gladiatorial arena in Mathura, overpowers the colossal elephant Kuvalayapida, defeats the royal wrestlers, and ultimately slays his tyrannical uncle, King Kamsa, liberating the kingdom.', img: 'https://www.jkyog.org/blog/content/images/2025/04/DALL-E-2024-10-30-14.56.18---A-detailed-and-vibrant-scene-depicting-Lord-Krishna-slaying-King-Kansa-in-a-royal-palace-setting--with-no-other-people-and-no-debris-or-trash-on-the-g.webp' },
  { id: 'mahabharata', era: 'Dvapara Yuga', focus: 'Conflict', title: 'The Mahabharata War', subtitle: 'The Great Kurukshetra Conflict', desc: 'A monumental, tragic clash of duty, kinship, and morality marking the twilight of the age. It is amidst this frozen battlefield that Lord Krishna imparts eternal cosmic wisdom to a despondent Arjuna through the profound Bhagavad Gita.', img: 'https://pbs.twimg.com/media/GDLN8BtXkAEPioR.jpg' },
  { id: 'kalki', era: 'Kali Yuga', focus: 'Creation', title: 'The Kalki Prophecy', subtitle: 'The Final Purificator', desc: 'Prophesied to appear at the absolute twilight of the darkest age. Riding a white steed and wielding a blazing, comet-like sword, Kalki will descend to cleanse the earth of ultimate adharma and inaugurate a pristine new Satya Yuga.', img: 'https://miro.medium.com/1*R2HOHT0Uj7ccvvSx-DoEmA.png' }
];

export default function YugaChronicles({ onClose }) {
  const containerRef = useRef(null);
  const cinematicTl = useRef(null);
  
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedFocus, setSelectedFocus] = useState('All');
  const [filteredData, setFilteredData] = useState(narrativeData);
  const [activeEvent, setActiveEvent] = useState(narrativeData[0]);
  const [isCinematicMode, setIsCinematicMode] = useState(false);

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    const fd = narrativeData.filter(d => {
      const eraMatch = selectedEra === 'All' || d.era === selectedEra;
      const focusMatch = selectedFocus === 'All' || d.focus === selectedFocus;
      return eraMatch && focusMatch;
    });
    setFilteredData(fd);
    if(fd.length > 0 && !isCinematicMode) {
      setActiveEvent(fd[0]);
    }
  }, [selectedEra, selectedFocus]);

  const handleEngageCinematic = () => {
    if(filteredData.length === 0) return;
    
    setIsCinematicMode(true);
    
    if (cinematicTl.current) cinematicTl.current.kill();
    cinematicTl.current = gsap.timeline({ 
      onComplete: () => setIsCinematicMode(false) 
    });
    
    filteredData.forEach((ev, i) => {
      // Fade out current stage
      if(i !== 0) {
          cinematicTl.current.to('.cinematic-stage', { opacity: 0, duration: 0.8, ease: "power2.inOut" });
      } else {
          cinematicTl.current.set('.cinematic-stage', { opacity: 0 });
      }
      
      // Swap content
      cinematicTl.current.call(() => setActiveEvent(ev));
      
      // Cinematic Push In & Fade Up
      cinematicTl.current.fromTo('.cinematic-stage', 
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out", clearProps: "scale" }
      );
      
      // Hold for reading
      cinematicTl.current.to({}, { duration: 4.5 });
    });
  };

  const handleNodeClick = (ev) => {
    if(isCinematicMode) return;
    gsap.fromTo('.cinematic-stage', 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
    );
    setActiveEvent(ev);
  };

  const handleClose = () => {
     if(cinematicTl.current) cinematicTl.current.kill();
     gsap.to(containerRef.current, {
         opacity: 0,
         scale: 0.95,
         duration: 0.6,
         ease: 'power2.in',
         onComplete: onClose
     });
  };

  const particleOptions = {
    background: { color: { value: "transparent" } },
    fpsLimit: 60,
    particles: {
      color: { value: "#ffffff" }, 
      links: { enable: false },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "out" },
        random: true,
        speed: 0.2,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 80 },
      opacity: {
        value: { min: 0.1, max: 0.4 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.1 }
      },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 2.5 } },
    },
    detectRetina: true,
  };

  return (
    <div className="yuga-chronicles-page cinematic-mode-wrapper" ref={containerRef}>
      {/* Background Layer */}
      {activeEvent && (
        <div className="cinematic-backdrop">
          <img src={activeEvent.img} alt={activeEvent.title} />
          <div className="backdrop-overlay"></div>
        </div>
      )}
      
      <Particles id="tsparticles-yuga" init={particlesInit} options={particleOptions} />
      
      {/* Top Controls UI */}
      <div className={`cinematic-controls ${isCinematicMode ? 'disabled' : ''}`}>
        <button className="chronicles-close-btn" onClick={handleClose} disabled={isCinematicMode}>
           ← End Journey
        </button>
        
        <div className="controls-group">
          <div className="filter-block">
            <span className="filter-label">Cosmic Era</span>
            <select value={selectedEra} onChange={e => setSelectedEra(e.target.value)} disabled={isCinematicMode} className="cinematic-select">
              <option value="All">All Eras</option>
              <option value="Satya Yuga">Satya Yuga</option>
              <option value="Treta Yuga">Treta Yuga</option>
              <option value="Dvapara Yuga">Dvapara Yuga</option>
              <option value="Kali Yuga">Kali Yuga</option>
            </select>
          </div>
          
          <div className="filter-block">
            <span className="filter-label">Narrative Focus</span>
            <select value={selectedFocus} onChange={e => setSelectedFocus(e.target.value)} disabled={isCinematicMode} className="cinematic-select">
              <option value="All">All Domains</option>
              <option value="Creation">Creation</option>
              <option value="Conflict">Conflict</option>
              <option value="Philosophy">Philosophy</option>
            </select>
          </div>
          
          <button 
            className={`engage-btn ${isCinematicMode ? 'active' : ''}`} 
            onClick={handleEngageCinematic} 
            disabled={isCinematicMode || filteredData.length === 0}
          >
            {isCinematicMode ? 'Cinematic Mode Engaged...' : 'Engage Cinematic Mode'}
          </button>
        </div>
      </div>

      {/* Main Cinematic Stage */}
      <div className="cinematic-stage">
        {activeEvent ? (
          <div className="epic-node-display">
            <div className="epic-text-panel frosted-glass">
              <div className="epic-meta">
                <span className="meta-tag">{activeEvent.era}</span>
                <span className="meta-dot">•</span>
                <span className="meta-tag">{activeEvent.focus}</span>
              </div>
              <h1 className="epic-title">{activeEvent.title}</h1>
              <h2 className="epic-subtitle">{activeEvent.subtitle}</h2>
              <div className="epic-divider"></div>
              <p className="epic-desc">{activeEvent.desc}</p>
            </div>
            
            <div className="epic-visual-panel frosted-glass">
              <div className="image-wrapper">
                <img src={activeEvent.img} alt={activeEvent.title} />
              </div>
            </div>
          </div>
        ) : (
          <div className="no-events-msg">No ancient texts match these filters...</div>
        )}
      </div>

      {/* Interactive Timeline Canvas */}
      <div className={`epic-timeline ${isCinematicMode ? 'disabled' : ''}`}>
        <div className="timeline-track"></div>
        {filteredData.map((ev) => (
          <div 
            key={ev.id} 
            className={`timeline-node ${activeEvent?.id === ev.id ? 'active' : ''} ${isCinematicMode ? 'locked' : ''}`}
            onClick={() => handleNodeClick(ev)}
          >
            <div className="node-point"></div>
            <div className="node-label">{ev.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
