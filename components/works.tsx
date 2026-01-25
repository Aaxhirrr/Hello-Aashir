"use client"

import { useState, useMemo, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useTexture, Billboard, Html } from "@react-three/drei"
import * as THREE from "three"

const projects = [
  {
    id: "01",
    title: "Kairos",
    subtitle: "Agentic Trading",
    description: "Orchestrates Claude 3.5 with multiple APIs (PolyMarket, Nevua) for personalized trading.",
    tags: ["Next.js", "Anthropic", "PolyMarket"],
    image: "/images/kairos.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Kairos",
    private: false,
    award: "1st Place - Anthropic x HacksASU"
  },
  {
    id: "02",
    title: "Clozyt.flo",
    subtitle: "Fashion Algo",
    description: "TikTok-style fashion recommender with real-time FastAPI backend & FAISS.",
    tags: ["FastAPI", "React", "FAISS"],
    image: "/images/clozyt.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Clozyt.flo",
    private: false,
    award: "1st Place - DevLabs DevHacks"
  },
  {
    id: "03",
    title: "Aithena",
    subtitle: "Neural Network",
    description: "AI-powered social network for students with Google Gemini reasoning core.",
    tags: ["React", "FastAPI", "Firebase"],
    image: "/images/aithena.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Aithena",
    private: false,
    award: null
  },
  {
    id: "04",
    title: "Four o' Three",
    subtitle: "Data Optimizer",
    description: "Financial data optimizer for loan/retirement profiles.",
    tags: ["Python", "SQL", "AWS"],
    image: "/images/four_o_three.png",
    year: "2024",
    link: "#",
    private: true,
    award: "3rd Place - FinTech Hackathon"
  },
  {
    id: "05",
    title: "Data Den",
    subtitle: "GPU Workspace",
    description: "AI-powered GPU tutoring & benchmarking platform for NVIDIA hardware.",
    tags: ["RAPIDS", "Gradio", "LangGraph"],
    image: "/images/Data_Den.png",
    year: "2025",
    link: "https://github.com/Aaxhirrr/Data-Den",
    private: false,
    award: "3rd Place - NVIDIA x AI Spark"
  },
]

function ParticleSphere({ onProjectSelect }: { onProjectSelect: (project: any) => void }) {
  const PARTICLE_COUNT = 1000
  const PARTICLE_SIZE_MIN = 0.003
  const PARTICLE_SIZE_MAX = 0.008
  const SPHERE_RADIUS = 3.5 // EVEN CLOSER
  const POSITION_RANDOMNESS = 1.5
  const ROTATION_SPEED_Y = 0.001

  const groupRef = useRef<THREE.Group>(null)

  const textureUrls = projects.map(p => p.image)
  const textures = useTexture(textureUrls)

  useMemo(() => {
    textures.forEach((texture) => {
      if (texture) {
        texture.colorSpace = THREE.SRGBColorSpace
      }
    })
  }, [textures])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / PARTICLE_COUNT)
      const theta = Math.sqrt(PARTICLE_COUNT * Math.PI) * phi
      const radiusVariation = SPHERE_RADIUS + (Math.random() - 0.5) * POSITION_RANDOMNESS
      const x = radiusVariation * Math.cos(theta) * Math.sin(phi)
      const y = radiusVariation * Math.cos(phi)
      const z = radiusVariation * Math.sin(theta) * Math.sin(phi)

      temp.push({
        position: [x, y, z] as [number, number, number],
        scale: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        color: new THREE.Color().setHSL(
          Math.random() * 0.1 + 0.05, 0.8, 0.6 + Math.random() * 0.3
        ),
      })
    }
    return temp
  }, [])

  const orbitingImages = useMemo(() => {
    const temp = []
    const total = projects.length

    for (let i = 0; i < total; i++) {
      const angle = (i / total) * Math.PI * 2
      const x = SPHERE_RADIUS * Math.cos(angle)
      const y = 0
      const z = SPHERE_RADIUS * Math.sin(angle)

      temp.push({
        position: [x, y, z] as [number, number, number],
        projectIndex: i,
      })
    }
    return temp
  }, [])

  // ALWAYS rotate - no pause
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += ROTATION_SPEED_Y
    }
  })

  return (
    <group ref={groupRef}>
      {/* Particles */}
      {particles.map((p, i) => (
        <mesh key={`p-${i}`} position={p.position} scale={p.scale}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Orbiting Project Images */}
      {orbitingImages.map((img, i) => (
        <Billboard
          key={`img-${i}`}
          position={img.position}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <group scale={[1, 1, 1]}>
            <mesh
              onClick={(e) => {
                e.stopPropagation()
                onProjectSelect(projects[img.projectIndex])
              }}
              onPointerOver={() => document.body.style.cursor = 'pointer'}
              onPointerOut={() => document.body.style.cursor = 'auto'}
            >
              <planeGeometry args={[1.8, 1.8]} />
              {/* DoubleSide allows viewing from back, transparent confirms shape */}
              <meshBasicMaterial map={textures[img.projectIndex]} side={THREE.DoubleSide} transparent />
            </mesh>

            {/* HTML Text Label to match website font correctly */}
            <Html
              transform
              position={[0, -1.2, 0]}
              center
              distanceFactor={10}
              style={{ pointerEvents: 'none' }}
            >
              <div className="font-mono text-white text-xs tracking-[0.2em] whitespace-nowrap bg-black/50 backdrop-blur-sm px-2 py-1 rounded border border-white/10 uppercase">
                {projects[img.projectIndex].title}
              </div>
            </Html>
          </group>
        </Billboard>
      ))}
    </group>
  )
}

export function Works() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)

  return (
    <section id="works" className="relative w-full h-[85vh] min-h-[600px] bg-black overflow-hidden flex flex-col justify-center">

      {/* Header Overlay */}
      <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center pointer-events-none">
        <p className="font-mono text-[10px] tracking-[0.4em] text-amber-500/60 uppercase">
          05 // PROJECT ORBIT
        </p>
        <h2 className="font-sans text-4xl md:text-6xl font-bold tracking-tighter text-white">
          Selected <span className="italic font-serif font-light text-white/50">Works</span>
        </h2>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [-8, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />

        <ParticleSphere onProjectSelect={setSelectedProject} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          rotateSpeed={0.5}
        />
      </Canvas>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl"
              >
                ✕
              </button>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 aspect-video md:aspect-square bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-3xl font-bold text-white">{selectedProject.title}</h3>
                      <p className="text-amber-500/80 font-mono text-xs tracking-widest uppercase">{selectedProject.subtitle}</p>
                    </div>
                    <span className="text-white/20 font-mono text-4xl font-bold">{selectedProject.id}</span>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-6 border-l-2 border-white/10 pl-4 py-1">
                    {selectedProject.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedProject.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-white/5 rounded text-[10px] text-white/40 uppercase tracking-wider font-mono border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={selectedProject.link}
                      target="_blank"
                      className={`px-6 py-2 rounded-full font-mono text-xs uppercase tracking-widest transition-all ${selectedProject.private
                        ? "bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed"
                        : "bg-white text-black hover:bg-amber-400 hover:scale-105"
                        }`}
                    >
                      {selectedProject.private ? "Private Repo" : "View Source"}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  )
}
