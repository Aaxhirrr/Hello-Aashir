"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function GithubActivity() {
    // GitHub State
    const [ghActivity, setGhActivity] = useState<any[]>([])
    const [ghVelocity, setGhVelocity] = useState<number[]>(new Array(14).fill(0))
    const [ghLoading, setGhLoading] = useState(true)

    // LeetCode State
    const [lcLoading, setLcLoading] = useState(true)

    useEffect(() => {
        async function fetchGithubData() {
            try {
                // 1. Try Events API first
                const res = await fetch("https://api.github.com/users/Aaxhirrr/events?per_page=30")
                let foundEvents = false

                if (res.ok) {
                    const data = await res.json()

                    if (data.length > 0) {
                        foundEvents = true
                        const validEvents = data.map((e: any) => {
                            let msg = "Activity"
                            let repo = e.repo.name.split("/")[1]
                            let type = "SYS"

                            switch (e.type) {
                                case "PushEvent":
                                    msg = e.payload.commits?.[0]?.message || "Pushed code"
                                    type = "PUSH"
                                    break
                                case "CreateEvent":
                                    msg = `Created ${e.payload.ref_type}`
                                    type = "NEW"
                                    break
                                case "WatchEvent":
                                    msg = "Starred repository"
                                    type = "STAR"
                                    break
                                case "ForkEvent":
                                    msg = "Forked repository"
                                    type = "FORK"
                                    break
                                case "PullRequestEvent":
                                    msg = `${e.payload.action} PR #${e.payload.number}`
                                    type = "PR"
                                    break
                                default:
                                    return null
                            }
                            return {
                                sha: e.id.substring(0, 7),
                                msg: msg,
                                time: formatTimeAgo(new Date(e.created_at)),
                                repo: repo,
                                type: type
                            }
                        }).filter(Boolean)

                        setGhActivity(validEvents.slice(0, 6))

                        // Velocity
                        const velocityMap = new Array(14).fill(0)
                        data.forEach((e: any) => {
                            const daysAgo = Math.floor((new Date().getTime() - new Date(e.created_at).getTime()) / (1000 * 60 * 60 * 24))
                            if (daysAgo < 14) {
                                velocityMap[13 - daysAgo] += 1
                            }
                        })
                        setGhVelocity(velocityMap)
                    }
                }

                // 2. Fallback to Repos API if no events found
                if (!foundEvents) {
                    const repoRes = await fetch("https://api.github.com/users/Aaxhirrr/repos?sort=updated&per_page=6")
                    if (repoRes.ok) {
                        const repos = await repoRes.json()
                        const repoActivity = repos.map((r: any) => ({
                            sha: r.node_id.substring(0, 7),
                            msg: "Updated repository",
                            time: formatTimeAgo(new Date(r.updated_at)),
                            repo: r.name,
                            type: "UPD"
                        }))
                        setGhActivity(repoActivity)

                        // Fake velocity based on recent updates
                        const velocityMap = new Array(14).fill(0)
                        repos.forEach((r: any) => {
                            const daysAgo = Math.floor((new Date().getTime() - new Date(r.updated_at).getTime()) / (1000 * 60 * 60 * 24))
                            if (daysAgo < 14) {
                                velocityMap[13 - daysAgo] += 3 // Give it some weight
                            }
                        })
                        setGhVelocity(velocityMap)
                    }
                }

            } catch (err) {
                console.error("GitHub Fetch Error", err)
            } finally {
                setGhLoading(false)
            }

            // LeetCode loading just finishes immediately since we are in placeholder mode
            setLcLoading(false)
        }

        fetchGithubData()
    }, [])

    return (
        <section className="relative py-24 px-4 md:px-0 max-w-6xl mx-auto">

            {/* HUD Header */}
            <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-4">
                <div className={`w-2 h-2 ${ghLoading ? 'bg-amber-500' : 'bg-green-500'} rounded-full animate-pulse`} />
                <h3 className="font-mono text-sm tracking-widest text-white/50 uppercase">
                    06 // LIVE TELEMETRY
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: GitHub Activity (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Velocity Graph */}
                    <div className="p-6 border border-white/10 bg-white/[0.02] rounded-lg relative overflow-hidden group hover:border-white/20 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50" />

                        <h4 className="font-mono text-xs text-green-400/80 mb-6 flex justify-between">
                            <span>COMMIT_VELOCITY</span>
                            <span>LAST_14_DAYS</span>
                        </h4>

                        <div className="h-32 flex items-end justify-between gap-1">
                            {ghVelocity.map((count, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    whileInView={{ height: count > 0 ? `${Math.min((count / 5) * 100, 100)}%` : "2px" }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    className={`w-full ${count > 0 ? 'bg-green-500/40 hover:bg-green-500/80' : 'bg-white/5'} transition-colors rounded-sm relative group/bar`}
                                >
                                    {count > 0 && (
                                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-2 py-1 text-[9px] text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {count} Events
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Live Feed Module */}
                    <div className="border border-white/10 bg-black p-6 rounded-lg font-mono text-xs min-h-[200px]">
                        <div className="flex justify-between text-white/30 mb-4 uppercase tracking-wider">
                            <span>Incoming Transmissions</span>
                            <span>Target: Main</span>
                        </div>

                        <div className="space-y-4">
                            {ghActivity.length > 0 ? (
                                ghActivity.map((event, i) => (
                                    <div key={i} className="flex items-start gap-4 text-white/70 group hover:text-white transition-colors">
                                        <span className="text-green-500/50 w-12">{event.type}</span>
                                        <span className="text-white/30 w-16">{event.sha}</span>
                                        <span className="flex-1 truncate">
                                            <span className="text-green-500/80 mr-3">[{event.repo}]</span>
                                            {event.msg}
                                        </span>
                                        <span className="text-white/30 whitespace-nowrap">{event.time}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full py-12 text-white/20">
                                    <span className="w-12 h-[1px] bg-white/10 mb-2" />
                                    <p>NO SIGNAL DETECTED</p>
                                    <span className="text-[10px] mt-2">No public activity found on encrypted channels.</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* RIGHT: LeetCode Module - PLACEHOLDER MODE */}
                <div className="lg:col-span-1 h-full min-h-[300px]">
                    <div className="h-full border border-white/10 bg-white/[0.01] rounded-lg p-6 relative flex flex-col items-center justify-center text-center overflow-hidden">

                        {/* Background Grid Animation */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />

                        {/* Construction Icon / Graphic */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-2 border-dashed border-amber-500/30 rounded-full mb-6 relative"
                        >
                            <div className="absolute inset-2 border border-amber-500/50 rounded-full" />
                        </motion.div>

                        <h4 className="font-serif italic text-2xl text-white mb-2 relative z-10">
                            Algorithmic Core
                        </h4>

                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 text-xs font-mono tracking-widest mb-4">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                            CALIBRATING
                        </div>

                        <p className="text-white/40 text-sm max-w-[200px] leading-relaxed">
                            LeetCode metrics module is currently undergoing system upgrades.
                        </p>

                        <div className="absolute bottom-6 left-6 right-6 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="h-full w-1/2 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

function formatTimeAgo(date: Date) {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
}
