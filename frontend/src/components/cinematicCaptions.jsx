// src/components/CinematicCaptions.jsx
import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CinematicCaptions = ({ text, currentCharIndex, isSpeaking }) => {
  // Parse text into word chunks with start/end character offsets
  const wordsWithOffsets = useMemo(() => {
    if (!text) return [];
    const words = text.split(' ');
    let currentPos = 0;

    return words.map((word) => {
      const start = text.indexOf(word, currentPos);
      const end = start + word.length;
      currentPos = end;
      return { word, start, end };
    });
  }, [text]);

  return (
    <AnimatePresence>
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            margin: '1.25rem auto 0 auto',
            maxWidth: '850px',
            padding: '0.85rem 1.75rem',
            background: 'rgba(12, 12, 18, 0.75)',
            backdropFilter: 'blur(12px)',
            borderRadius: '30px',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 0 12px rgba(255, 215, 0, 0.05)',
            textAlign: 'center',
            zIndex: 20,
          }}
        >
          <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: '1.6', letterSpacing: '0.3px' }}>
            {wordsWithOffsets.map(({ word, start, end }, index) => {
              const isPast = currentCharIndex >= end;
              const isCurrent = currentCharIndex >= start && currentCharIndex < end;

              return (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    marginRight: '0.3rem',
                    transition: 'all 0.2s ease',
                    color: isCurrent
                      ? '#FFD700'
                      : isPast
                      ? '#E5C158'
                      : 'rgba(255, 255, 255, 0.35)',
                    fontWeight: isCurrent ? '700' : '400',
                    textShadow: isCurrent
                      ? '0 0 12px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.4)'
                      : 'none',
                    transform: isCurrent ? 'scale(1.08)' : 'scale(1)',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};