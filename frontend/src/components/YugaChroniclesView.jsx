// src/components/YugaChroniclesView.jsx
import React, { useEffect } from 'react';
import { useYugaSpeech } from '../hooks/useYugaSpeech';
import { CinematicCaptions } from './CinematicCaptions';

export const YugaChroniclesView = ({ activeScene, isCinematicMode }) => {
  const { speak, stop, isSpeaking, currentCharIndex } = useYugaSpeech();

  useEffect(() => {
    if (isCinematicMode && activeScene?.narrationText) {
      speak({
        text: activeScene.narrationText,
        rate: 0.88,
        pitch: 0.95
      });
    } else {
      stop();
    }
  }, [activeScene, isCinematicMode, speak, stop]);

  return (
    <div className="yuga-section-wrapper" style={{ position: 'relative', width: '100%' }}>
      
      {/* Main Panel Card (Image + Description) */}
      <div className="main-panel-card">
        {/* Your existing panel content: Title, Description, Right Image */}
      </div>

      {/* Subtitles synced with SpeechSynthesis */}
      <CinematicCaptions 
        text={activeScene?.narrationText}
        currentCharIndex={currentCharIndex}
        isSpeaking={isSpeaking}
      />

      {/* Timeline Navigation (SAMUDRA MANTHAN ... KANSA WADH ... THE KALKI PROPHECY) */}
      <nav className="bottom-timeline-nav">
        {/* Timeline items */}
      </nav>
      
    </div>
  );
};