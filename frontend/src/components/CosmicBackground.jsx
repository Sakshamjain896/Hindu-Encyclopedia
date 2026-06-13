import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const CosmicBackground = ({ children }) => {
  const [init, setInit] = useState(false);

  // Initialize the engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const amritaParticlesConfig = {
    background: {
      // High-quality dark cosmic nebula fallback
      position: "50% 50%",
      repeat: "no-repeat",
      size: "cover",
      color: { value: "#0206177" } // Deep space black-blue
    },
    fpsLimit: 60,
    particles: {
      color: {
        // Gold, Pale Gold, and Pearl White particles
        value: ["#fbbf24", "#fef08a", "#ffffff"], 
      },
      move: {
        direction: "top", // Dheere-dheere upar ki taraf float karenge
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.6, // Very slow and soothing
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 120, // Kitne particles screen par dikhenge
      },
      opacity: {
        value: { min: 0.1, max: 0.8 },
        animation: {
          enable: true,
          speed: 1, // Twinkling / breathing effect
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 }, // Alag-alag size ke dust particles
      },
      shadow: {
        enable: true,
        color: "#fbbf24",
        blur: 10, // Creates the glowing aura around the dust
      }
    },
    detectRetina: true,
  };

  return (
    <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "100%", zIndex: 0 }}>
      {/* 1. The Particle Background */}
      {init && (
        <Particles
          id="tsparticles"
          options={amritaParticlesConfig}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0, // Keeps it behind everything
          }}
        />
      )}

      {/* 2. Your Encyclopedia Content (Cards, Text, etc.) */}
      {children && (
        <div style={{ position: "relative", zIndex: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default CosmicBackground;
