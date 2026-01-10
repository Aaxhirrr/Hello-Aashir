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

// Utility functions
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
        v += a * noise(st);
        st *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    // 1. Setup Coordinates
    vec2 uv = vUv - 0.5;
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;
    
    // Global Scale 
    uv *= 1.35;
    
    // === ROTATION (Diagonal Slant) ===
    // Rotate the entire coordinate system to give the disk a diagonal axis
    float angle = -0.5; // -28 degrees approx
    float c = cos(angle);
    float s = sin(angle);
    mat2 rotPre = mat2(c, -s, s, c);
    uv = rotPre * uv;
    
    vec3 col = vec3(0.0);
    float r = length(uv);

    // === CONFIGURATION ===
    float kRadius = 0.15; // Schwarzschild radius
    float kDiskInner = 0.22;
    float kDiskOuter = 0.55;
    float kHaloRadius = kRadius * 1.5;
    float kHaloWidth = 0.06;
    
    // Animation
    float time = iTime * 0.2;
    
    // === GEOMETRY 1: THE ACCRETION DISK (Tilted & Offset) ===
    float tilt = 3.0; // High tilt = thin ellipse (Side view)
    
    // Offset the disk slightly UP (but less than before) to align circle "above" center
    vec2 diskUV = vec2(uv.x, (uv.y - 0.02) * tilt); 
    
    float diskR = length(diskUV);
    float diskAngle = atan(diskUV.y, diskUV.x);
    
    // Disk Rendering
    float diskMask = smoothstep(kDiskInner, kDiskInner + 0.05, diskR) * 
                     smoothstep(kDiskOuter, kDiskOuter - 0.1, diskR);
    
    if (diskMask > 0.01) {
        // Detailed gas texture with rotation
        float rotAngle = diskAngle - time * 2.0 / (diskR + 0.1); 
        
        vec2 noiseUV = vec2(cos(rotAngle), sin(rotAngle)) * diskR * 10.0;
        
        float gas = fbm(noiseUV + vec2(time, 0.0)); 
        float rings = sin(diskR * 60.0) * 0.1 + 0.9; 
        
        float doppler = smoothstep(-1.2, 1.2, -uv.x * 1.5);
        
        float intensity = diskMask * gas * rings * (0.6 + 0.4 * doppler);
        
        vec3 diskColor = mix(vec3(0.7, 0.2, 0.05), vec3(1.0, 0.9, 0.5), intensity);
        diskColor += vec3(0.2, 0.1, 0.0) * smoothstep(0.5, 1.0, gas);
        
        col += diskColor * intensity * 1.5;
    }
    
    // === GEOMETRY 2: GRAVITATIONAL LENSING (The Halo) ===
    // The Halo (Einstein Ring) also needs to shift to match the perspective roughly, 
    // or stay centered on the mass (black hole).
    // Physically, the Einstein ring is centered on the mass.
    // But visually, if we shift the disk, we should shift the "arch" logic.
    
    float haloDist = abs(r - kHaloRadius);
    
    if (haloDist < kHaloWidth) {
        float haloAlpha = smoothstep(kHaloWidth, 0.0, haloDist);
        
        float haloAngle = atan(uv.y, uv.x);
        vec2 haloNoiseUV = vec2(cos(haloAngle), sin(haloAngle)) * r * 20.0;
        float haloGas = fbm(haloNoiseUV - vec2(time * 0.5, time * 0.5));
        
        // Arch Masking: visible mostly at top/bottom relative to the rotated axis
        float verticalArch = smoothstep(0.1, 1.0, abs(uv.y) * 2.5);
        
        vec3 haloColor = mix(vec3(0.6, 0.1, 0.0), vec3(1.0, 0.8, 0.4), haloGas);
        col += haloColor * haloAlpha * haloGas * verticalArch;
    }

    // === GEOMETRY 3: THE EVENT HORIZON (Shadow) ===
    // Black sphere is ALWAYS at (0,0) (uv space before offset)
    
    bool isInsideHole = r < kRadius;
    
    // Logic: If overlap, who wins?
    // In front of hole: Front part of disk.
    // Behind hole: Back part of disk (which we don't render in disk pass usually) + Halo.
    
    // We need to know if the disk pixel is "in front" or "behind".
    // 3D Approximation:
    // With offset, disk center is at y=0.06.
    // Front half is usually diskUV.y < 0.
    
    bool isFrontDisk = (diskUV.y < 0.0) && (diskMask > 0.01); 
    
    if (isInsideHole) {
        if (!isFrontDisk) {
            col = vec3(0.0); // Shadow blocks everything behind
        }
    }
    
    // Photosphere
    float photoDist = abs(r - kRadius);
    if (photoDist < 0.012) {
         if (!isFrontDisk) {
            col += vec3(1.0, 0.95, 0.8) * smoothstep(0.012, 0.0, photoDist);
         }
    }
    
    // === BACKGROUND STARS ===
    if (length(col) < 0.1) {
         float s = random(uv * 4.0);
         if (s > 0.993) {
             float twinkle = sin(iTime * 1.0 + s * 100.0) * 0.5 + 0.5;
             col += vec3(twinkle * 0.5);
         }
    }

    gl_FragColor = vec4(col, 1.0);
}
`

function BlackHoleMesh() {
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

            // Scale mesh to fill viewport exactly
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
                blending={THREE.NormalBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

export function BlackHole() {
    return (
        <div className="absolute inset-0 bg-black w-full h-full -z-10">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
                <BlackHoleMesh />
            </Canvas>
        </div>
    )
}

