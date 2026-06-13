import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function KaliYugaBackground({ isGodMode }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- SCENE SETUP ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 100;

    let cleanup;

    if (isGodMode) {
        // === THE CELESTIAL COMET (Kalki's Descent) ===
        // Background: Deep Cosmos / Obsidian Blue
        const deepCosmos = 0x020617; 
        renderer.setClearColor(deepCosmos);
        scene.fog = new THREE.FogExp2(deepCosmos, 0.002); 

        // 1. Vast Starfield (Distant Static Stars)
        const starCount = 3000;
        const starGeo = new THREE.BufferGeometry();
        const starPos = [];
        for(let i=0; i<starCount; i++) {
            starPos.push((Math.random() - 0.5) * 600); // Wide X
            starPos.push((Math.random() - 0.5) * 600); // Wide Y
            starPos.push((Math.random() - 0.5) * 400); // Deep Z
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.7,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // 2. High-Speed Meteors (Kalki's Cosmic Army)
        // We use stretched instances to create "streaks"
        const meteorCount = 40;
        const meteorGeo = new THREE.CylinderGeometry(0.05, 0.4, 60, 8); // Long tail
        // Align cylinder with diagonal movement (Top points South-West)
        meteorGeo.rotateZ(3 * Math.PI / 4); 
        
        const meteorMat = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9, // Electric Cyan
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
        });

        const meteorMesh = new THREE.InstancedMesh(meteorGeo, meteorMat, meteorCount);
        const dummy = new THREE.Object3D();
        const meteorData = [];

        for(let i=0; i<meteorCount; i++) {
            // Start positions randomly spread
            const x = (Math.random() - 0.5) * 400;
            const y = (Math.random() - 0.5) * 400;
            const z = (Math.random() - 0.5) * 200;
            
            // Random speed (very fast)
            const speed = 2 + Math.random() * 3;
            
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
            meteorMesh.setMatrixAt(i, dummy.matrix);

            meteorData.push({ x, y, z, speed });
        }
        scene.add(meteorMesh);

        // 3. The "Blinding Flash" Effect (Simulated via ambient light pulse)
        const ambientLight = new THREE.AmbientLight(0x0ea5e9, 0.5);
        scene.add(ambientLight);

        let time = 0;

        const animateKalki = () => {
            time += 0.01;
            
            // Animate Meteors (Slashing Diagonally Down-Left)
            for(let i=0; i<meteorCount; i++) {
                const m = meteorData[i];
                // Move diagonally: x needs to decrease, y needs to decrease
                m.x -= m.speed; 
                m.y -= m.speed; 

                // Reset logic: If off-screen bottom-left, move to top-right
                if (m.y < -250 || m.x < -250) {
                    m.x = 200 + Math.random() * 200; // Start far right
                    m.y = 200 + Math.random() * 200; // Start far top
                    m.speed = 2 + Math.random() * 4; // New random speed
                }

                dummy.position.set(m.x, m.y, m.z);
                dummy.updateMatrix();
                meteorMesh.setMatrixAt(i, dummy.matrix);
            }
            meteorMesh.instanceMatrix.needsUpdate = true;

            // Pulse the stars slightly
            // stars.rotation.z += 0.0002; // Very slow rotation of galaxy
            
            renderer.render(scene, camera);
            cleanup = requestAnimationFrame(animateKalki);
        };
        animateKalki();

    } else {
        // === CONCRETE, ASH & RUST (Kali Theme) ===
        const smogColor = 0x111111; 
        scene.background = new THREE.Color(smogColor);
        scene.fog = new THREE.FogExp2(smogColor, 0.0035); 

        // --- FALLING ASH (Grey/White Debris) ---
        const ashCount = 2500;
        const ashGeo = new THREE.BufferGeometry();
        const ashPos = new Float32Array(ashCount * 3);
        const ashVel = new Float32Array(ashCount); // Fall speed
        
        for (let i = 0; i < ashCount; i++) {
            ashPos[i * 3] = (Math.random() - 0.5) * 400;     // X spread
            ashPos[i * 3 + 1] = (Math.random() - 0.5) * 400; // Y spread
            ashPos[i * 3 + 2] = (Math.random() - 0.5) * 200; // Z depth
            ashVel[i] = 0.05 + Math.random() * 0.15;         // Slow drift
        }
        
        ashGeo.setAttribute('position', new THREE.BufferAttribute(ashPos, 3));

        // Ash Texture 
        const canvas = document.createElement('canvas');
        canvas.width = 32; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const grad = ctx.createRadialGradient(16,16,0,16,16,16);
        grad.addColorStop(0, 'rgba(200,200,200,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0,0,32,32);
        const ashTexture = new THREE.CanvasTexture(canvas);

        const ashMat = new THREE.PointsMaterial({
            color: 0x888888, // Medium Grey
            size: 0.9,
            map: ashTexture,
            transparent: true,
            opacity: 0.7,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        const ashSystem = new THREE.Points(ashGeo, ashMat);
        scene.add(ashSystem);

        // --- GLOWING EMBERS ---
        const emberCount = 200;
        const emberGeo = new THREE.BufferGeometry();
        const emberPos = new Float32Array(emberCount * 3);
        const emberVel = new Float32Array(emberCount);

        for (let i = 0; i < emberCount; i++) {
            emberPos[i * 3] = (Math.random() - 0.5) * 300;
            emberPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
            emberPos[i * 3 + 2] = (Math.random() - 0.5) * 100;
            emberVel[i] = 0.1 + Math.random() * 0.4;
        }
        emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPos, 3));

        const emberMat = new THREE.PointsMaterial({
            color: 0xff4500, // Burning Red-Orange
            size: 1.8,
            map: ashTexture, 
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending, 
            depthWrite: false
        });

        const emberSystem = new THREE.Points(emberGeo, emberMat);
        scene.add(emberSystem);

        let time = 0;
        const animateKali = () => {
            time += 0.01;

            // Animate Ash
            const aPositions = ashGeo.attributes.position.array;
            for(let i=0; i<ashCount; i++) {
                aPositions[i*3+1] -= ashVel[i];
                aPositions[i*3] += Math.sin(time + aPositions[i*3+1] * 0.05) * 0.05;
                aPositions[i*3+2] += Math.cos(time + aPositions[i*3+1] * 0.05) * 0.05;

                if(aPositions[i*3+1] < -200) {
                    aPositions[i*3+1] = 200;
                    aPositions[i*3] = (Math.random() - 0.5) * 400;
                }
            }
            ashGeo.attributes.position.needsUpdate = true;

            // Animate Embers
            const ePositions = emberGeo.attributes.position.array;
            for(let i=0; i<emberCount; i++) {
                ePositions[i*3+1] -= emberVel[i];
                ePositions[i*3] += (Math.random() - 0.5) * 0.2; 
                
                if(ePositions[i*3+1] < -150) {
                    ePositions[i*3+1] = 150;
                    ePositions[i*3] = (Math.random() - 0.5) * 300;
                }
            }
            emberGeo.attributes.position.needsUpdate = true;

            // Subtle camera movement
            camera.position.x = Math.sin(time * 0.1) * 2;
            camera.position.y = Math.cos(time * 0.15) * 2;
            camera.lookAt(0,0,0);

            renderer.render(scene, camera);
            cleanup = requestAnimationFrame(animateKali);
        };
        animateKali();
    }

    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
        if(cleanup) cancelAnimationFrame(cleanup);
        window.removeEventListener('resize', handleResize);
        if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
    };
  }, [isGodMode]); // Re-run when mode changes

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none' 
      }}
    />
  );
}