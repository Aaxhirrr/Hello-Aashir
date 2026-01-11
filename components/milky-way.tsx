"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import * as THREE from "three"

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float iTime;
uniform vec2 iResolution;
varying vec2 vUv;

// --- NOISE FUNCTIONS ---
float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i + vec2(0.0, 0.0));
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(2.0);
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = vUv - 0.5;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;
    
    // === CINEMATIC TILT (Like Black Hole) ===
    float angle = -0.6; // Diagonal tilt
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    uv = rot * uv;
    
    // === SQUASH INTO GALACTIC DISK/TRAIL ===
    // This makes it look like a side-view galaxy or "trail"
    uv.y *= 3.5; 
    
    // Zoom/Scale
    uv *= 1.5;
    
    // === ANIMATION ===
    // Slow drift, exactly like the black hole settling
    float t = iTime * 0.15;
    
    // Flow along the "trail" (x-axis in rotated space)
    vec2 flow = vec2(t * 0.5, t * 0.1);
    
    // Generate Nebula Structure
    // We offset logic based on distance from center line (y) to make it dense in middle
    float density = 1.0 - smoothstep(0.0, 1.0, abs(uv.y));
    
    float gas = fbm(uv * 2.0 + flow); // Base structure
    float detail = fbm(uv * 4.0 - flow * 0.5); // Counter-flow detail
    
    // Combine
    float nebula = (gas + detail) * 0.5;
    nebula *= density * density; // Fade out vertical edges strongly
    
    // === COLOR PALETTE (Interstellar) ===
    vec3 colDeep = vec3(0.05, 0.0, 0.1); // Deep Void Purple
    vec3 colMid = vec3(0.1, 0.1, 0.4);   // Cosmic Blue
    vec3 colCore = vec3(1.0, 0.8, 0.5);  // Core Gold/White
    
    vec3 col = mix(colDeep, colMid, smoothstep(0.2, 0.6, nebula));
    col = mix(col, colCore, smoothstep(0.6, 1.2, nebula));
    
    // Add "Stars" or dust specs in the trail
    float dust = hash(uv * 10.0 + t);
    if (dust > 0.98 && nebula > 0.3) {
        float twinkle = sin(t * 5.0 + dust * 100.0) * 0.5 + 0.5;
        col += vec3(twinkle * 0.8);
    }
    
    // Soften edges
    float alpha = smoothstep(0.0, 0.4, nebula);
    
    // Final composite
    gl_FragColor = vec4(col, alpha * 0.7);
}
`

function MilkyWayMesh() {
    const mesh = useRef<THREE.Mesh>(null)

    const uniforms = useMemo(
        () => ({
            iTime: { value: 0 },
            iResolution: { value: new THREE.Vector2(1, 1) }
        }),
        []
    )

    useFrame((state) => {
        if (mesh.current) {
            uniforms.iTime.value = state.clock.getElapsedTime()
            uniforms.iResolution.value.set(state.viewport.width, state.viewport.height)
            mesh.current.scale.set(state.viewport.width, state.viewport.height, 1) // Fullscreen
        }
    })

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[1, 1]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

export function MilkyWay() {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 opacity-80 pointer-events-none mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
                <MilkyWayMesh />
            </Canvas>
        </div>
    )
}
