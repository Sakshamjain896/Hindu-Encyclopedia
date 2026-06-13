import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec2 vUv;

  // Simple 2D noise
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
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
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
    // Keep aspect ratio roughly 280x400
    vec2 uv = vUv;
    uv.y *= 1.4;
    uv *= 2.5; 
    
    // Animate flow
    uv.y += time * 0.08; 
    
    // Multi-octave noise for rich cracking
    float n1 = snoise(uv * 1.2 + time * 0.1);
    float n2 = snoise(uv * 3.0 - time * 0.05);
    float n3 = snoise(uv * 6.0 + time * 0.02);
    
    // Sharp ridge-like noise for cracks using absolute value
    float combined = abs(n1 * 0.6 + n2 * 0.3 + n3 * 0.1);
    
    // Smoothstep creates the hard 'crack' edges
    float crack = smoothstep(0.01, 0.05, 0.08 - combined);
    
    // Stone base color (Obsidian)
    vec3 stoneColor = vec3(0.03, 0.04, 0.05);
    stoneColor += snoise(uv * 10.0) * 0.015; // subtle stone grain
    
    // Fire/Magma color
    vec3 fireColor = vec3(1.0, 0.2, 0.0); // deep red-orange
    fireColor += vec3(min(1.0, (n2 + 1.0)*0.5), 0.5, 0.) * min(1.0, n3+0.5); // hot yellow-orange spots
    
    // Pulsate the fire intensity
    float pulse = (sin(time * 3.0) + 1.0) * 0.5;
    fireColor *= 0.7 + 0.5 * pulse;
    
    // Magma bleed onto stone (soft glow around cracks)
    float glow = smoothstep(0.05, 0.2, 0.15 - combined);
    stoneColor += fireColor * glow * 0.4;
    
    vec3 finalColor = mix(stoneColor, fireColor, crack);
    
    // Subtle Vignette at the edges
    float dist = distance(vUv, vec2(0.5));
    finalColor *= smoothstep(0.8, 0.3, dist);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const MagmaPlane = () => {
  const materialRef = useRef();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(() => ({
    time: { value: 0 }
  }), []);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

const MagmaCardLayer = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none', background: '#000' }}>
      <Canvas 
         camera={{ position: [0, 0, 1] }} 
         gl={{ alpha: false, antialias: false, powerPreference: 'low-power' }} 
         dpr={[1, 1.2]} 
      >
        <MagmaPlane />
      </Canvas>
    </div>
  );
};

export default MagmaCardLayer;
