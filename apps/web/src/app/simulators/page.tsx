'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEBUG_SCENARIOS, HIL_SCENARIOS } from '@/lib/data/simulators'
import { Bug, Cpu, AlertTriangle, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'

type SimType = 'debug' | 'hil'

export default function SimulatorsPage() {
    const [simType, setSimType] = useState<SimType>('debug')
    const [activeScenario, setActiveScenario] = useState<number | null>(null)
    const [showAnswer, setShowAnswer] = useState(false)
    const [userAnswer, setUserAnswer] = useState('')

    const scenarios = simType === 'debug' ? DEBUG_SCENARIOS : HIL_SCENARIOS

    if (activeScenario !== null) {
        const scenario = scenarios[activeScenario]
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => { setActiveScenario(null); setShowAnswer(false); setUserAnswer('') }} className="btn-secondary py-2 px-3">
                        <ArrowLeft size={14} /> Back
                    </button>
                    <h1 className="text-xl font-bold">{scenario.title}</h1>
                    {'difficulty' in scenario && (
                        <span className={`badge badge-${(scenario as typeof DEBUG_SCENARIOS[0]).difficulty.toLowerCase()}`}>
                            {(scenario as typeof DEBUG_SCENARIOS[0]).difficulty}
                        </span>
                    )}
                </div>

                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Scenario</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{scenario.description}</p>
                </div>

                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                        📋 System Logs
                    </h3>
                    <pre className="code-block text-xs text-green-300/80 whitespace-pre-wrap">
                        {scenario.logs}
                    </pre>
                </div>

                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold mb-3">🔍 Your Analysis</h3>
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="What is the root cause? What would you fix?"
                        className="w-full bg-white/[0.04] border border-white/[0.06] rounded-lg p-4 text-sm text-[var(--text-primary)] min-h-[120px] outline-none focus:border-indigo-500/30 resize-none"
                    />
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowAnswer(!showAnswer)} className="btn-primary py-2">
                        {showAnswer ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showAnswer ? 'Hide Answer' : 'Reveal Root Cause'}
                    </button>
                </div>

                <AnimatePresence>
                    {showAnswer && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="glass-card p-5 border-l-4 border-emerald-500"
                        >
                            <h3 className="text-sm font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                                <CheckCircle2 size={14} /> Root Cause
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{scenario.rootCause}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Simulators</h1>
                <p className="text-[var(--text-secondary)] mt-1">Debug embedded systems failures from real-world logs</p>
            </div>

            <div className="tab-list w-fit">
                <button onClick={() => setSimType('debug')} className={`tab-trigger ${simType === 'debug' ? 'active' : ''}`}>
                    <Bug size={14} className="inline mr-1" /> Debugging Simulator
                </button>
                <button onClick={() => setSimType('hil')} className={`tab-trigger ${simType === 'hil' ? 'active' : ''}`}>
                    <Cpu size={14} className="inline mr-1" /> HIL Failure Sim
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {scenarios.map((s, i) => (
                    <motion.div
                        key={i}
                        className="glass-card p-5 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        onClick={() => setActiveScenario(i)}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={20} className="text-amber-400 mt-0.5" />
                            <div>
                                <h3 className="font-semibold mb-1">{s.title}</h3>
                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{s.description}</p>
                                {'tags' in s && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {(s as typeof DEBUG_SCENARIOS[0]).tags.map(t => (
                                            <span key={t} className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
