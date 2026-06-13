import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function BhasmaBackground({ children }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = useMemo(() => ({
    background: {
      color: {
        value: "#000000", // Pitch black
      }
    },
    fullScreen: { enable: false },
    fpsLimit: 60,
    particles: {
      number: {
        value: 150,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#ff1a1a", "#ff4d4d", "#b30000", "#660000", "#ff8c00"], // Red/orange embers
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: {
          enable: true,
          speed: 1.5,
          sync: false,
        },
      },
      size: {
        value: { min: 1, max: 4 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 1,
          sync: false,
        }
      },
      move: {
        enable: true,
        speed: 2,
        direction: "bottom", // Falling embers
        random: true,
        straight: false,
        outModes: {
          default: "out",
        },
      },
    },
    detectRetina: true,
  }), []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000' }}>
      
      {/* The tsparticles Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        {init && (
          <Particles
            id="tsparticles-bhasma"
            options={particlesOptions}
            style={{ width: '100%', height: '100%' }}
          />
        )}
      </div>

      {/* Your UI Content (Cards, Text) sits on top */}
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', height: '100%', overflowY: 'auto' }}>
        {children}
      </div>

    </div>
  );
}