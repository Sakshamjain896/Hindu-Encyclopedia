import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import "./AsuraBoonPanel.css";

// Register useGSAP
gsap.registerPlugin(useGSAP);

export default function AsuraBoonPanel({ asuraName, boonText, flawText }) {
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);
  
  // Separate refs for the boon container and the flaw container 
  // to allow seamless cross-fading and scaling.
  const boonRef = useRef(null);
  const flawRef = useRef(null);

  useGSAP(() => {
    if (!boonRef.current || !flawRef.current) return;
    
    if (isRevealed) {
      // 1. Shatter the Boon aggressively 
      gsap.to(boonRef.current, {
        scale: 1.1,
        opacity: 0,
        filter: "blur(10px)",
        duration: 0.5,
        ease: "power2.inOut"
      });

      // 2. Reveal the Flaw with a piercing drop
      gsap.fromTo(flawRef.current, 
        { 
          y: 30, 
          scale: 0.95,
          opacity: 0, 
          filter: "blur(5px)",
          pointerEvents: "none"
        },
        { 
          y: 0, 
          scale: 1,
          opacity: 1, 
          filter: "blur(0px)",
          pointerEvents: "auto",
          duration: 0.8, 
          ease: "back.out(1.5)", 
          delay: 0.3 
        }
      );
    } else {
      // Restore the Boon smoothly
      gsap.to(flawRef.current, {
        y: 20,
        opacity: 0,
        filter: "blur(5px)",
        pointerEvents: "none",
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(boonRef.current, {
        scale: 1,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.6,
        delay: 0.3,
        ease: "power2.out"
      });
    }
  }, { dependencies: [isRevealed], scope: containerRef });

  return (
    <div className="asura-boon-panel" ref={containerRef}>
      {/* Boon State (Foreground initially) */}
      <div className="asura-boon-content" ref={boonRef}>
        <div className="boon-header">
          <span className="boon-label">The Divine Boon</span>
          <span className="asura-name-highlight">{asuraName}</span>
        </div>
        <p className="boon-text">"{boonText}"</p>
        
        <button 
          className="shatter-btn" 
          onClick={() => setIsRevealed(true)}
          aria-label="Reveal the Asura's flaw"
        >
          Shatter the Illusion
        </button>
      </div>

      {/* Flaw State (Hidden initially) */}
      <div className="asura-flaw-content" ref={flawRef}>
        <div className="flaw-header">
          <span className="flaw-label">The Fatal Truth</span>
          <span className="asura-name-highlight">{asuraName}</span>
        </div>
        <p className="flaw-text">"{flawText}"</p>
        
        <button 
          className="reset-boon-btn" 
          onClick={() => setIsRevealed(false)}
        >
          Restore Illusion
        </button>
      </div>
    </div>
  );
}