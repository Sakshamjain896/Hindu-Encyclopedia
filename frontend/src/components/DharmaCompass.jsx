import React, { useState, useEffect } from 'react';
import useAppSound from '../hooks/useAppSound';
import { motion } from 'framer-motion';
import KalkiPanelBackground from './KalkiPanelBackground';

const DATA_SETS = {
  // 1. GOD MODE (SATYA YUGA) - Default Divine
  GOD_DEFAULT: {
    title: "The Divine Path",
    subtitle: "Which cosmic force guides your soul?",
    questions: [
      {
        text: "How do you respond to injustice?",
        options: [
          { text: "Uphold the law and duty regardless of cost", type: "Dharma" },
          { text: "Seek wisdom to understand the root cause", type: "Jnana" },
          { text: "Protect the innocent with fierce compassion", type: "Karma" }
        ]
      },
      {
        text: "What is your ultimate goal?",
        options: [
          { text: "Order and cosmic balance", type: "Dharma" },
          { text: "Liberation from the cycle (Moksha)", type: "Jnana" },
          { text: "To serve humanity and the divine", type: "Karma" }
        ]
      },
      {
        text: "Your weapon of choice?",
        options: [
          { text: "The Sudarshana Chakra (Divine Law)", type: "Dharma" },
          { text: "The Vedas (Sacred Knowledge)", type: "Jnana" },
          { text: "The Bow & Arrow (Action)", type: "Karma" }
        ]
      }
    ],
    results: {
      Dharma: { deity: "Lord Vishnu / Rama", desc: "The Preserver. You represent righteousness, valuing duty (Dharma) above all else." },
      Jnana: { deity: "Lord Shiva / Brahma", desc: "The Seer. You seek the ultimate truth, looking beyond the illusions of the material world." },
      Karma: { deity: "Lord Hanuman / Arjuna", desc: "The Warrior. You believe in action. For you, service to others is the highest form of worship." }
    }
  },

  // 2. ASURA MODE (DEFAULT) - Ambition & Power
  ASURA_DEFAULT: {
    title: "The Asura's Ambition",
    subtitle: "What fuels your conquest of the Three Worlds?",
    questions: [
      {
        text: "Why do you challenge the Gods?",
        options: [
          { text: "To prove that merit outweighs birthright", type: "Power" },
          { text: "To rewrite the unjust laws of heaven", type: "Rebellion" },
          { text: "To gain immortality and dominance", type: "Ego" }
        ]
      },
      {
        text: "How do you gain strength?",
        options: [
          { text: "Through extreme penance (Tapasya)", type: "Power" },
          { text: "By outsmarting my enemies", type: "Rebellion" },
          { text: "By absorbing the power of others", type: "Ego" }
        ]
      },
      {
        text: "What is your philosophy?",
        options: [
          { text: "Might makes Right", type: "Power" },
          { text: "Knowledge is Power", type: "Rebellion" },
          { text: "I am the Supreme Reality", type: "Ego" }
        ]
      }
    ],
    results: {
      Power: { deity: "Mahabali", desc: "The Benevolent Conqueror. You have immense power but use it with a sense of nobility and charity." },
      Rebellion: { deity: "Ravana", desc: "The Scholar King. Your intellect is unmatched, but your defiance of the natural order is your tragic flaw." },
      Ego: { deity: "Hiranyakashipu", desc: "The Tyrant. You fear nothing and believe yourself to be the master of the universe." }
    }
  },

  GOD_KALI: {
    title: "The Final Avatar's Call",
    subtitle: "The world is ending. How will you save it?",
    questions: [
      {
        text: "Corruption has taken over the world. You...",
        options: [
          { text: "Burn it all down to start anew", type: "Purge" },
          { text: "Rally the few righteous souls left", type: "Lead" },
          { text: "Meditate until the chaos passes", type: "Wait" }
        ]
      },
      {
        text: "What defines the Kali Yuga?",
        options: [
          { text: "The loss of truth", type: "Purge" },
          { text: "The suffering of the weak", type: "Lead" },
          { text: "The inevitability of time", type: "Wait" }
        ]
      },
      {
        text: "Select your role in the final war.",
        options: [
          { text: "The Sword of Kalki", type: "Purge" },
          { text: "The Shield of Dharma", type: "Lead" },
          { text: "The Silent Witness", type: "Wait" }
        ]
      }
    ],
    results: {
      Purge: { deity: "Lord Kalki", desc: "The Destroyer of Filth. You have no mercy for the corrupt. You bring the end to birth the new beginning." },
      Lead: { deity: "Lord Parashurama", desc: "The Mentor. You guide the lost through the darkest times with harsh discipline." },
      Wait: { deity: "Veda Vyasa", desc: "The Chronicler. You preserve knowledge for the next cycle, ensuring wisdom survives the apocalypse." }
    }
  },

  ASURA_KALI: {
    title: "Embrace the Kali Yuga",
    subtitle: "Chaos is a ladder. How high will you climb?",
    questions: [
      {
        text: "The world is crumbling. What is your move?",
        options: [
          { text: "Accelerate the decay for profit", type: "Greed" },
          { text: "Manipulate the leaders into war", type: "Chaos" },
          { text: "Feast on the confusion of others", type: "Entropy" }
        ]
      },
      {
        text: "What is the greatest weakness of humanity?",
        options: [
          { text: "Their desire for gold", type: "Greed" },
          { text: "Their blind faith", type: "Chaos" },
          { text: "Their fear of death", type: "Entropy" }
        ]
      },
      {
        text: "Your kingdom is built on...",
        options: [
          { text: "Lies and Propaganda", type: "Greed" },
          { text: "Violence and Fear", type: "Chaos" },
          { text: "Addiction and Distraction", type: "Entropy" }
        ]
      }
    ],
    results: {
      Greed: { deity: "Kali Purusha", desc: "The Lord of the Age. You embody the very essence of the Kali Yuga—materialism, greed, and moral decay." },
      Chaos: { deity: "Koka & Vikoka", desc: "The Agents of Anarchy. You thrive on conflict and disorder, leading the armies of the faithless." },
      Entropy: { deity: "Rahu", desc: "The Eclipse. You consume the light, spreading confusion and smoke wherever you go." }
    }
  }
};

export default function DharmaCompass({ isGodMode, isKaliYugaMode }) {
  const [step, setStep] = useState('start'); // start, q0, q1, q2, result
  const [scores, setScores] = useState({ Dharma: 0, Chaos: 0, Maya: 0 }); // Initialize for default
  const [result, setResult] = useState(null);
  const [activeData, setActiveData] = useState(DATA_SETS.GOD_DEFAULT);

  const { playClick, playHover, playSuccess } = useAppSound();

  useEffect(() => {
    let modeKey = 'GOD_DEFAULT';
    if (isGodMode && !isKaliYugaMode) modeKey = 'GOD_DEFAULT';
    else if (!isGodMode && !isKaliYugaMode) modeKey = 'ASURA_DEFAULT';
    else if (isGodMode && isKaliYugaMode) modeKey = 'GOD_KALI';
    else if (!isGodMode && isKaliYugaMode) modeKey = 'ASURA_KALI';
    
    setActiveData(DATA_SETS[modeKey]);
    setStep('start');
    setResult(null);
  }, [isGodMode, isKaliYugaMode]);

  const startQuiz = () => {
    playClick();
    setStep('q0');
    setScores({}); // Reset scores on start
  };

  const handleAnswer = (option) => {
    playClick();
    const type = option.type;
    const newScores = { ...scores, [type]: (scores[type] || 0) + 1 };
    setScores(newScores);

    const currentQIndex = parseInt(step.charAt(1));
    if (currentQIndex < activeData.questions.length - 1) {
      setStep(`q${currentQIndex + 1}`);
    } else {
      let maxScore = -1;
      let winner = null;
      Object.keys(newScores).forEach(key => {
        if (newScores[key] > maxScore) {
          maxScore = newScores[key];
          winner = key;
        }
      });
      
      const winningResult = activeData.results[winner] || Object.values(activeData.results)[0];
      setResult(winningResult);
      setStep('result');
      playSuccess();
    }
  };

  const resetQuiz = () => {
    playClick();
    setStep('start');
    setResult(null);
    setScores({});
  };

  const currentQuestionText = activeData.questions[parseInt(step.charAt(1))]?.text || "";

  return (
    <motion.div 
      className={isKaliYugaMode && isGodMode ? 'dharma-compass marble-card' : `container-box dharma-compass ${!isGodMode ? 'asura-border' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {isKaliYugaMode && isGodMode && <div className="card-glare"></div>}
      <div className={isKaliYugaMode && isGodMode ? "gold-border-box" : ""} style={{ width: '100%', boxSizing: 'border-box' }}>
        <h3 className={isKaliYugaMode && isGodMode ? 'card-title' : ''} style={{ color: isGodMode ? (isKaliYugaMode ? '#fff' : 'var(--gold)') : '#ef4444', textShadow: isGodMode ? 'none' : '0 0 5px #ef4444' }}>
          {activeData.title}
        </h3>

        {step === 'start' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ marginBottom: '20px', fontSize: '1.1em', opacity: 0.9, color: isKaliYugaMode && isGodMode ? '#e0f2fe' : 'inherit' }}>
              {activeData.subtitle}
            </p>
            <button className={isKaliYugaMode && isGodMode ? "glowing-btn gold-premium-btn" : "glowing-btn"} onMouseEnter={playHover} onClick={startQuiz} 
                    style={{ 
                      borderColor: isGodMode ? 'var(--gold)' : '#ef4444', 
                      color: isGodMode ? (isKaliYugaMode ? '#fff' : 'var(--gold)') : '#fee2e2'
                    }}>
              {isKaliYugaMode ? (isGodMode ? "Seek the Avatar" : "Embrace the Toxicity") : (isGodMode ? "Consult the Compass" : "Face the Asuras")}
            </button>
          </div>
        )}

        {step.startsWith('q') && (
          <div className="quiz-question" style={{ animation: 'fadeIn 0.5s' }}>
            <h4 style={{ color: isGodMode ? 'var(--text-main)' : '#fca5a5', marginBottom: '15px' }}>
            {currentQuestionText}
          </h4>
          <div className="options-grid">
            {activeData.questions[parseInt(step.charAt(1))].options.map((opt, idx) => (
              <button 
                key={idx} 
                className={`option-btn ${!isGodMode ? 'asura-opt' : ''}`}
                style={{ 
                   borderColor: isGodMode ? 'var(--gold)' : '#dc2626',
                   color: isGodMode ? 'var(--text-main)' : '#fee2e2',
                   backgroundColor: isGodMode ? 'rgba(255,215,0,0.1)' : 'rgba(220, 38, 38, 0.2)'
                }}
                onMouseEnter={playHover}
                onClick={() => handleAnswer(opt)}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'result' && result && (
        <div className="result-content" style={{ textAlign: 'center', animation: 'scaleIn 0.5s' }}>
          <div style={{ fontSize: '3em', marginBottom: '10px' }}>
            {isGodMode ? '🕉️' : '🔥'}
          </div>
          <h2 style={{ 
            color: isGodMode ? 'var(--gold)' : '#ef4444',
            textShadow: `0 0 10px ${isGodMode ? 'var(--gold)' : '#ef4444'}`
          }}>
            {result.deity}
          </h2>
          <p style={{ fontSize: '1.2em', margin: '15px 0', lineHeight: '1.6', fontStyle: 'italic', color: isGodMode ? 'inherit' : '#fca5a5' }}>
            {result.desc}
          </p>
          <button className={isKaliYugaMode && isGodMode ? "glowing-btn gold-premium-btn" : "glowing-btn"} onMouseEnter={playHover} onClick={resetQuiz} style={{ marginTop: '10px', borderColor: isGodMode ? 'var(--gold)' : '#ef4444' }}>
            Walk the Path Again
          </button>
        </div>
      )}
      </div>
    </motion.div>
  );
}



