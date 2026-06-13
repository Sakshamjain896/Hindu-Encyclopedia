import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Float } from "@react-three/drei";

const GoldVeinShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#050505") }, // Deep Black
    uColor2: { value: new THREE.Color("#d4af37") }, // Gold
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv * 3.0; // scale
      
      // Moving noise to simulate flowing liquid marble
      float n1 = snoise(uv + uTime * 0.1);
      float n2 = snoise(uv * 2.0 - uTime * 0.15);
      float n3 = snoise(uv * 4.0 + uTime * 0.05);
      
      // The magic formula for sharp, thin gold veins
      // We take the absolute value of the noise to create sharp ridges
      float veins = abs(n1 + n2 * 0.5 + n3 * 0.25);
      
      // Invert and sharpen: 
      // small values become intense, large values become 0
      veins = 1.0 - veins;
      veins = smoothstep(0.85, 1.0, veins); // thresholding to make sharp distinct lines
      
      // Subtle background flow
      float bgFlow = snoise(uv * 0.5 - uTime * 0.05) * 0.5 + 0.5;
      vec3 baseBlack = mix(vec3(0.02), vec3(0.08), bgFlow);

      // Add a slight bloom/glow to the veins
      float glow = exp(-abs(n1 + n2 * 0.5 + n3 * 0.25) * 4.0);
      vec3 finalColor = mix(baseBlack, uColor2, veins + glow * 0.3);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

function MarblePlane() {
  const meshRef = useRef();
  
  // Create a unique material instance so it doesn't conflict if rendered multiple times
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color("#050505") },
      uColor2: { value: new THREE.Color("#e1b854") } // Bright gold
    },
    vertexShader: GoldVeinShaderMaterial.vertexShader,
    fragmentShader: GoldVeinShaderMaterial.fragmentShader
  }), []);

  useFrame(({ clock }) => {
    if (material) {
      material.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -1]}>
      {/* Plane huge enough to cover standard bounds */}
      <planeGeometry args={[10, 10]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export default function KalkiPanelBackground() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none", overflow: "hidden", borderRadius: "4px" }}>
      <Canvas camera={{ position: [0, 0, 1] }} gl={{ antialias: true }}>
        <MarblePlane />
      </Canvas>
    </div>
  );
}

