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
    for (int i = 0; i < 6; i++) {
        v += a * noise(p);
        p = rot * p * 2.0 + vec2(2.0);
        a *= 0.5;
    }
    return v;
}

// === STAR FIELD GENERATOR ===
float getStars(vec2 uv) {
    float n = hash(uv * 150.0); // High frequency 
    float smallStars = pow(n, 18.0) * 100.0; // Dense small stars
    
    float n2 = hash(uv * 40.0);
    float mediumStars = pow(n2, 22.0) * 20.0; // Sparse bright stars
    
    return smallStars + mediumStars;
}

void main() {
    vec2 uv = vUv - 0.5;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;
    
    // === 1. ALIGNMENT (Diagonal Andromeda Tilt) ===
    float angle = -0.65; // ~37 degrees
    float c = cos(angle);
    float s = sin(angle);
    mat2 rot = mat2(c, -s, s, c);
    
    vec2 rotatedUV = rot * uv;
    
    // Squash Y to form the disk
    vec2 diskUV = rotatedUV;
    diskUV.y *= 3.8; // High aspect ratio disk
    
    // Drift Animation
    float t = iTime * 0.08;
    
    // === 2. GALAXY STRUCTURE ===
    // Radial distance from center of disk
    float r = length(diskUV);
    
    // Spiral Arms / Dust Features (Domain Warping + FBM)
    vec2 noiseUV = diskUV * 1.8;
    noiseUV.x -= t * 0.15; // Flow along the major axis
    
    float structure = fbm(noiseUV + vec2(r, t * 0.05));
    
    // Main Body Mask (Elliptical Glow)
    float coreMask = 1.0 / (r * 4.0 + 0.1);
    float diskMask = smoothstep(0.8, 0.0, r);
    float bandMask = smoothstep(0.0, 0.6, abs(rotatedUV.y * 3.0)); // Darker edges vertically
    
    // Dust Lanes (Dark brown streaks)
    float dust = fbm(noiseUV * 4.0 - t * 0.2);
    float dustLanes = smoothstep(0.3, 0.7, dust) * diskMask * 1.2;
    
    // === 3. COLOR PALETTE (Ref: Bright White Core, Blue Arms, Brown Dust) ===
    vec3 colDeep = vec3(0.01, 0.01, 0.04); // Deep Space
    vec3 colBlue = vec3(0.1, 0.3, 0.6);    // Outer Arms
    vec3 colWhite = vec3(1.0, 0.95, 0.85); // Core Brightness
    vec3 colDust = vec3(0.3, 0.1, 0.05);   // Red/Brown Dust
    
    // Base Glow
    vec3 col = colDeep;
    col += colBlue * structure * diskMask * 0.8;
    
    // Add Core
    col += colWhite * coreMask * 0.6;
    col = mix(col, colWhite, smoothstep(0.0, 0.2, r) * structure);
    
    // Apply Dust Absorption (Subtract light where dust is thick)
    col = mix(col, colDust, dustLanes * 0.7);
    
    // === 5. VIGNETTE (Only affects nebula/background, NOT stars) ===
    float vignette = 1.0 - smoothstep(0.5, 1.8, length(uv));
    col *= vignette; // Darken the galaxy edges
    
    // === 6. STARS (Bright and sharp, unaffected by vignette) ===
    // We want stars to be visible in the black void around the galaxy
    float stars = getStars(uv + vec2(t * 0.01, 0.0)); // Use raw UV for static stars (or slight drift)
    
    // Star Color (Blue-ish white)
    col += vec3(0.95, 0.98, 1.0) * stars;

    gl_FragColor = vec4(col, 1.0);
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
            mesh.current.scale.set(state.viewport.width, state.viewport.height, 1)
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
                blending={THREE.NormalBlending} // Normal blending for richer colors/dust
                depthWrite={false}
            />
        </mesh>
    )
}

export function MilkyWay() {
    return (
        <div className="absolute inset-0 w-full h-full opacity-100 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
                <MilkyWayMesh />
            </Canvas>
        </div>
    )
}
