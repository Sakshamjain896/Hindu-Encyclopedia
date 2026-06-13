import React, { useEffect, useRef } from 'react';
import useAppSound from '../hooks/useAppSound';

const AsuraLightning = () => {
    const canvasRef = useRef(null);
    const { playThunder, playLightningStrike } = useAppSound();
    const lastThunderTime = useRef(0);
    const lastLightningTime = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Set Canvas Size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Configuration for the Blood Red Lightning
        const coreColor = '#fee2e2'; // Near white with slight red tint (brighter core)
        const glowColor = '#dc2626'; // Deep crimson red (Tailwind red-600)
        
        // Helper to draw a single segment
        const drawSegment = (p1, p2, thickness) => {
             ctx.beginPath();
             ctx.moveTo(p1.x, p1.y);
             ctx.lineTo(p2.x, p2.y);
             
             ctx.lineWidth = thickness;
             ctx.lineCap = 'round';
             ctx.lineJoin = 'round';
             ctx.shadowBlur = 15 * thickness; // Intense glow
             ctx.shadowColor = glowColor;
             ctx.strokeStyle = thickness > 1.5 ? coreColor : glowColor;
             
             ctx.stroke();
        };

        // Recursive lightning generator
        const castLightning = (x1, y1, x2, y2, displace, thickness) => {
            if (displace < 20) {
                drawSegment({x: x1, y: y1}, {x: x2, y: y2}, thickness);
                return;
            }

            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            
            // Jitter perpendicular to the line
            const normalX = -(y2 - y1);
            const normalY = x2 - x1;
            const len = Math.sqrt(normalX*normalX + normalY*normalY);
            const ndx = normalX / len;
            const ndy = normalY / len;
            
            const offset = (Math.random() - 0.5) * displace;
            
            const dX = midX + ndx * offset;
            const dY = midY + ndy * offset;

            castLightning(x1, y1, dX, dY, displace / 1.8, thickness);
            castLightning(dX, dY, x2, y2, displace / 1.8, thickness);
            
            // Branching
            if (Math.random() < 0.25 && thickness > 0.5) {
                 const branchAngle = (Math.random() - 0.5) * 1.5; // Radians
                 const branchLen = len * 0.4;
                 const branchEndX = dX + Math.cos(branchAngle) * branchLen;
                 const branchEndY = dY + Math.abs(Math.sin(branchAngle) * branchLen) + 50; // Tend downwards
                 
                 // Recurse for branch
                 castLightning(dX, dY, branchEndX, branchEndY, displace / 1.8, thickness * 0.6);
            }
        };

        // The Animation Loop
        const renderLoop = () => {
            // Fade out trail
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Add blending for glowing effect
            ctx.globalCompositeOperation = 'screen';

            // Randomly trigger a strike (e.g., 0.8% chance per frame)
            if (Math.random() < 0.008) {
                // Flash background - More intense and dynamic
                const flashIntensity = 0.2 + Math.random() * 0.1;
                ctx.fillStyle = `rgba(239, 68, 68, ${flashIntensity})`; // Red flash
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const now = Date.now();
                if (now - lastThunderTime.current > 7000) { 
                    // Occasionally play deep thunder
                     playThunder({ playbackRate: 0.9 + Math.random() * 0.2 });
                     lastThunderTime.current = now;
                } else if (now - lastLightningTime.current > 3000) {
                     // Otherwise play sharp crack
                     playLightningStrike({ playbackRate: 0.9 + Math.random() * 0.2 });
                     lastLightningTime.current = now;
                }

                const startX = Math.random() * canvas.width;
                const startY = -50; 
                const endX = startX + (Math.random() - 0.5) * (canvas.width * 0.9); // Wider spread
                const endY = canvas.height + 50; 

                // Multiple bolts for a "main" strike
                const mainThickness = 4 + Math.random() * 2;
                castLightning(startX, startY, endX, endY, 250, mainThickness);
                
                // Occasional secondary bolt
                if (Math.random() > 0.5) {
                    castLightning(startX + (Math.random() - 0.5) * 100, startY, endX + (Math.random() - 0.5) * 200, endY, 200, mainThickness * 0.6);
                }
            }

            animationFrameId = requestAnimationFrame(renderLoop);
        };

        renderLoop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="asura-lightning"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none',
                mixBlendMode: 'screen' 
            }}
        />
    );
};

export default AsuraLightning;
