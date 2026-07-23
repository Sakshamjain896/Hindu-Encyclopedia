// src/hooks/useYugaSpeech.js
import { useState, useEffect, useRef, useCallback } from 'react';

export const useYugaSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const speak = useCallback(({ text, rate = 0.9, pitch = 1.0, lang = 'en-US' }) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    setCurrentCharIndex(0);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = lang;

    // Track real-time spoken word boundary
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentCharIndex(event.charIndex);
      }
    };

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentCharIndex(text.length); // Complete
    };
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setCurrentCharIndex(0);
    }
  }, []);

  return { speak, stop, isSpeaking, currentCharIndex };
};