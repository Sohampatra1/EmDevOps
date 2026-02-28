'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CURRICULUM } from '@/lib/data/curriculum'
import { RotateCcw, ChevronLeft, ChevronRight, Sparkles, Layers } from 'lucide-react'

interface Flashcard {
    front: string
    back: string
    tags: string[]
}

const DEFAULT_CARDS: Flashcard[] = [
    { front: 'What is the volatile keyword in C?', back: 'volatile tells the compiler that a variable may change at any time without any action being taken by the code the compiler finds nearby. It prevents compiler optimization that could skip re-reading the variable. Essential for memory-mapped I/O registers and ISR-shared variables.', tags: ['C', 'memory'] },
    { front: 'Explain RAII in C++', back: 'Resource Acquisition Is Initialization (RAII) ties resource lifetime to object lifetime. Resources (memory, file handles, locks) are acquired in the constructor and released in the destructor. This guarantees cleanup even if exceptions occur. Smart pointers (unique_ptr, shared_ptr) are RAII wrappers.', tags: ['C++', 'RAII'] },
    { front: 'What is the CAN bus arbitration mechanism?', back: 'CAN uses bitwise arbitration during the ID field. Dominant bit (0) wins over recessive (1). The message with the lowest ID wins bus access without data loss. This provides deterministic priority-based access — critical for automotive real-time systems.', tags: ['CAN', 'protocols'] },
    { front: 'What is a Yocto meta-layer?', back: 'A meta-layer in Yocto/OpenEmbedded is a collection of related recipes, configuration files, and classes. Layers are stacked and can override/extend other layers. Examples: meta-poky (core), meta-raspberrypi (BSP), meta-custom (your recipes). Configured via bblayers.conf.', tags: ['Yocto', 'Linux'] },
    { front: 'Explain systemd unit file types', back: '.service (daemon processes), .timer (scheduled tasks, replaces cron), .socket (socket activation), .target (grouping units, like runlevels), .mount (filesystem mounts), .device (hardware). Key directives: ExecStart, Restart, WantedBy, After, Requires.', tags: ['systemd', 'Linux'] },
    { front: 'What is ASIL in ISO 26262?', back: 'Automotive Safety Integrity Level (ASIL) ranges from A (lowest) to D (highest). Determined by Severity, Exposure, and Controllability. ASIL D requires the most rigorous development process, testing, and documentation. QM = Quality Management (no safety requirements).', tags: ['ISO 26262', 'safety'] },
    { front: 'CMake: target_link_libraries vs link_libraries', back: 'target_link_libraries(mylib PUBLIC dep) is modern CMake — it attaches dependencies to specific targets with visibility (PUBLIC/PRIVATE/INTERFACE). link_libraries() is global/legacy — affects ALL targets. Always use target-based commands in modern CMake for proper dependency propagation.', tags: ['CMake', 'build'] },
    { front: 'Docker multi-stage build for cross-compilation', back: 'Stage 1: FROM ubuntu AS builder — install cross-compiler (arm-linux-gnueabihf-gcc), build the project. Stage 2: FROM scratch or minimal image — COPY --from=builder the binary. Results in a tiny final image containing only the cross-compiled binary. Essential for CI/CD pipelines.', tags: ['Docker', 'cross-compile'] },
]

export default function FlashcardsPage() {
    const [cards, setCards] = useState<Flashcard[]>(DEFAULT_CARDS)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [flipped, setFlipped] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState('')

    const allTopics = CURRICULUM.modules.flatMap(m => m.topics)
    const current = cards[currentIndex]

    const next = () => {
        setFlipped(false)
        setTimeout(() => setCurrentIndex((currentIndex + 1) % cards.length), 200)
    }

    const prev = () => {
        setFlipped(false)
        setTimeout(() => setCurrentIndex((currentIndex - 1 + cards.length) % cards.length), 200)
    }

    const generateCards = async () => {
        if (!selectedTopic) return
        setGenerating(true)
        try {
            const topic = allTopics.find(t => t.slug === selectedTopic)
            const res = await fetch('/api/ai/flashcards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic: topic?.name || selectedTopic, context: topic?.description || '' })
            })
            const data = await res.json()
            if (data.flashcards?.length) {
                setCards(prev => [...prev, ...data.flashcards])
            }
        } catch (e) { console.error(e) }
        setGenerating(false)
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Flashcards</h1>
                <p className="text-[var(--text-secondary)] mt-1">Quick syntax & concept review with spaced repetition</p>
            </div>

            {/* Generate Section */}
            <div className="glass-card p-4 flex items-center gap-3 flex-wrap">
                <Sparkles size={16} className="text-violet-400" />
                <select
                    value={selectedTopic}
                    onChange={e => setSelectedTopic(e.target.value)}
                    className="bg-white/[0.06] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-[var(--text-primary)] outline-none flex-1 min-w-[200px]"
                >
                    <option value="">Select a topic to generate cards...</option>
                    {allTopics.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
                </select>
                <button onClick={generateCards} disabled={generating || !selectedTopic} className="btn-primary py-2">
                    {generating ? 'Generating...' : 'Generate AI Cards'}
                </button>
            </div>

            {/* Card Counter */}
            <div className="text-center text-sm text-[var(--text-muted)]">
                Card {currentIndex + 1} of {cards.length}
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
                <div
                    className={`flashcard ${flipped ? 'flipped' : ''} w-full max-w-[600px] h-[350px]`}
                    onClick={() => setFlipped(!flipped)}
                >
                    <div className="flashcard-inner">
                        <div className="flashcard-front glass-card flex flex-col items-center justify-center p-8 text-center">
                            <Layers size={24} className="text-indigo-400 mb-4" />
                            <p className="text-lg font-medium">{current.front}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-4">Click to flip</p>
                        </div>
                        <div className="flashcard-back glass-card flex flex-col items-center justify-center p-8 text-center" style={{ background: 'rgba(99, 102, 241, 0.08)' }}>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{current.back}</p>
                            <div className="flex gap-1 mt-4">
                                {current.tags.map(t => (
                                    <span key={t} className="text-[10px] bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded">{t}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center gap-4">
                <button onClick={prev} className="btn-secondary py-2">
                    <ChevronLeft size={16} /> Previous
                </button>
                <button onClick={() => setFlipped(!flipped)} className="btn-secondary py-2">
                    <RotateCcw size={16} /> Flip
                </button>
                <button onClick={next} className="btn-primary py-2">
                    Next <ChevronRight size={16} />
                </button>
            </div>

            {/* Difficulty Rating */}
            <div className="flex justify-center gap-3">
                <span className="text-xs text-[var(--text-muted)]">How well did you know this?</span>
                {['😟 Again', '🤔 Hard', '😊 Good', '🎯 Easy'].map((label, i) => (
                    <button key={i} onClick={next} className="text-xs btn-secondary py-1 px-3 hover:border-indigo-500/30">
                        {label}
                    </button>
                ))}
            </div>
        </div>
    )
}
