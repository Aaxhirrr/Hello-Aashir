"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

interface Star {
    id: number
    top: number
    left: number
    delay: number
    duration: number
}

export function ShootingStars() {
    const [stars, setStars] = useState<Star[]>([])

    useEffect(() => {
        const spawnStar = () => {
            // Create a new star
            const newStar = {
                id: Date.now(),
                top: Math.random() * 50, // Top 50% of screen
                left: Math.random() * 100, // Anywhere horizontally
                delay: 0,
                duration: Math.random() * 1 + 0.5 // 0.5s to 1.5s (FAST)
            }

            setStars(prev => [...prev, newStar])

            // Cleanup this specific star after its duration
            setTimeout(() => {
                setStars(prev => prev.filter(s => s.id !== newStar.id))
            }, newStar.duration * 1000 + 100)
        }

        // Spawn loop
        // Random interval between occasional (2s) and rare (6s), with chance of burst
        const loop = () => {
            const nextSpawn = Math.random() * 4000 + 1000
            spawnStar()
            timeoutRef.current = setTimeout(loop, nextSpawn)
        }

        let timeoutRef = { current: setTimeout(loop, 2000) }

        return () => clearTimeout(timeoutRef.current)
    }, [])

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[1]">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 3, ease: "easeInOut" }}
            >
                {stars.map(star => (
                    <span
                        key={star.id}
                        className="absolute w-[2px] h-[2px] bg-white rounded-full opacity-0"
                        style={{
                            top: `${star.top}%`,
                            left: `${star.left}%`,
                            boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.1), 0 0 20px rgba(255, 255, 255, 1)",
                            animation: `shooting-star ${star.duration}s linear forwards`
                        }}
                    >
                        {/* Tail */}
                        <span className="absolute top-1/2 right-[0px] -translate-y-1/2 w-[300px] h-[1px] bg-gradient-to-l from-white via-transparent to-transparent opacity-80" />
                    </span>
                ))}
            </motion.div>

            <style jsx>{`
        @keyframes shooting-star {
          0% {
            transform: rotate(315deg) translateX(0);
            opacity: 1;
          }
          70% {
            opacity: 1; 
          }
          100% {
            transform: rotate(315deg) translateX(-1500px);
            opacity: 0;
          }
        }
      `}</style>
        </div>
    )
}
