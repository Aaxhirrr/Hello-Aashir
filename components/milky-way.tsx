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

// 2D Noise
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

// FBM (Fractal Brownian Motion)
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
    // Fix aspect ratio
    float aspect = iResolution.x / iResolution.y;
    uv.x *= aspect;
    
    // Zoom out a bit
    uv *= 2.0;
    
    // Time
    float t = iTime * 0.1;
    
    // Rotation logic
    float len = length(uv);
    float angle = atan(uv.y, uv.x);
    
    // Spiral rotation (slower at edges)
    float angleOffset = t * 0.5 + (1.0 / (len + 0.1)) * 0.5; 
    
    // Complex coordinate wrapping for nebula feel
    vec2 p = vec2(cos(angle + angleOffset), sin(angle + angleOffset)) * len;
    
    // 1. Base Galaxy Body
    // Distortion for gas clouds
    float gas = fbm(p * 3.0 + t * 0.2); 
    
    // 2. Color Palette (Interstellar: Purple, Blue, Gold)
    vec3 colPurple = vec3(0.2, 0.0, 0.3);
    vec3 colBlue = vec3(0.05, 0.1, 0.4);
    vec3 colGold = vec3(1.0, 0.8, 0.4);
    vec3 colBlack = vec3(0.0);
    
    // Mix colors based on noise
    vec3 col = mix(colBlack, colBlue, smoothstep(0.2, 0.6, gas));
    col = mix(col, colPurple, smoothstep(0.4, 0.8, gas));
    
    // 3. Bright Core / Dust Lanes
    float core = 1.0 / (len * 2.0 + 0.1); // Bright center
    col += colGold * core * 0.1;

    // 4. Alpha / Shape Mask
    // Fade out edges
    float mask = smoothstep(1.5, 0.5, len);
    
    // Final output
    gl_FragColor = vec4(col, mask * 0.6); // 0.6 opacity overall
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
                blending={THREE.AdditiveBlending} // Additive for glowing look
                depthWrite={false}
            />
        </mesh>
    )
}

export function MilkyWay() {
    return (
        <div className="absolute inset-0 w-full h-full -z-10 opacity-50 pointer-events-none mix-blend-screen">
            <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1]}> {/* Lower DPR for performance */}
                <MilkyWayMesh />
            </Canvas>
        </div>
    )
}
