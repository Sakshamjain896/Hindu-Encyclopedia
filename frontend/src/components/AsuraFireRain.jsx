import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const CleanFireRain = () => {
  const meshRef = useRef();
  const count = 600; // Increased count slightly for better visibility

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * 50,
        y: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 30,
        speed: Math.random() * 0.2 + 0.15, // Fast, smooth downward speed
        scale: Math.random() * 0.6 + 0.4 // Size variation
      });
    }
    return temp;
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;
    
    particles.forEach((p, i) => {
      // Clean tilted direction (Down, Right, and slightly Towards Camera)
      p.y -= p.speed;
      p.x += p.speed * 0.35; 
      p.z += p.speed * 0.2; 

      // Reset smoothly when falling out of view
      if (p.y < -15 || p.x > 25 || p.z > 10) {
        p.y = 15 + Math.random() * 10;
        p.x = (Math.random() - 0.5) * 40 - 10; // Bias left so it flows right across screen
        p.z = (Math.random() - 0.5) * 30;
      }

      dummy.position.set(p.x, p.y, p.z);
      
      // Since it's moving Right (+x) and Down (-y), 
      // the top of the cylinder should tilt Left (positive Z rotation).
      dummy.rotation.z = 0.35; 
      
      dummy.scale.set(p.scale, p.scale, p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      {/* 
        A highly stylized stretched cylinder that looks like a sharp drop/streak of rain.
        Slightly thicker and brighter for better visibility.
      */}
      <cylinderGeometry args={[0.003, 0.012, 0.7, 4]} />
      <meshBasicMaterial 
        color="#ff5500" 
        transparent 
        opacity={0.65} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default function AsuraFireRain() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} gl={{ alpha: true }}>
        {/* Soft fog masks the deepest rain streaks making them fade into the cosmic dark */}
        <fog attach="fog" args={['#000000', 5, 25]} />
        <CleanFireRain />
      </Canvas>
    </div>
  );
}
