'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DSA_QUESTIONS } from '@/lib/data/dsa-questions'
import { useInterviewStore } from '@/stores/interview-store'
import { formatTime } from '@/lib/utils'
import { Clock, Play, Lightbulb, Send, ChevronRight, Code2, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

export default function InterviewPage() {
    const [selectedQ, setSelectedQ] = useState<typeof DSA_QUESTIONS[0] | null>(null)
    const store = useInterviewStore()
    const [loading, setLoading] = useState(false)
    const [hintLoading, setHintLoading] = useState(false)
    const [hintText, setHintText] = useState<string | null>(null)

    // Timer
    useEffect(() => {
        if (!store.timerRunning) return
        const interval = setInterval(() => store.tick(), 1000)
        return () => clearInterval(interval)
    }, [store.timerRunning, store])

    const startInterview = (q: typeof DSA_QUESTIONS[0]) => {
        setSelectedQ(q)
        store.startInterview(q.slug, q.starterCode || '', 2700)
        setHintText(null)
    }

    const getHint = useCallback(async () => {
        if (!selectedQ) return
        setHintLoading(true)
        try {
            const res = await fetch('/api/ai/hint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ problem: selectedQ.description, code: store.code, language: store.language })
            })
            const data = await res.json()
            setHintText(data.hint || 'Think about the problem step by step.')
        } catch { setHintText('Think about the problem step by step.') }
        setHintLoading(false)
    }, [selectedQ, store.code, store.language])

    const submitCode = useCallback(async () => {
        if (!selectedQ) return
        setLoading(true)
        try {
            const res = await fetch('/api/ai/evaluate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: store.code, language: store.language,
                    problem: selectedQ.description, testCases: selectedQ.testCases
                })
            })
            const data = await res.json()
            store.setAIResult(data.score || 0, data.feedback || '', data.errors || [], data.optimizations || [])
        } catch {
            store.setAIResult(0, 'Evaluation failed. Please try again.', [], [])
        }
        setLoading(false)
    }, [selectedQ, store])

    // Question List View
    if (!selectedQ) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">DSA Interview Mode</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Practice data structures & algorithms focused on embedded C/C++</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {DSA_QUESTIONS.map((q, i) => (
                        <motion.div
                            key={q.slug}
                            className="glass-card p-4 cursor-pointer"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => startInterview(q)}
                            whileHover={{ scale: 1.01 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Code2 size={18} className="text-indigo-400" />
                                    <div>
                                        <h3 className="font-medium">{q.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                            {q.companyTags.map(t => (
                                                <span key={t} className="text-[10px] text-[var(--text-muted)] bg-white/[0.04] px-2 py-0.5 rounded">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="text-[var(--text-muted)]" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        )
    }

    // Interview Mode View
    return (
        <div className="space-y-0 -m-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[var(--bg-secondary)] border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                    <button onClick={() => { setSelectedQ(null); store.reset() }} className="btn-secondary py-2 px-3">
                        <ArrowLeft size={14} /> Back
                    </button>
                    <span className={`badge badge-${selectedQ.difficulty.toLowerCase()}`}>{selectedQ.difficulty}</span>
                    <span className="text-sm font-medium">{selectedQ.title}</span>
                </div>
                <div className="flex items-center gap-3">
                    {/* Timer */}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${store.timerSeconds < 300 ? 'bg-red-500/10 text-red-400' : 'bg-white/[0.04] text-[var(--text-secondary)]'}`}>
                        <Clock size={14} />
                        <span className="font-mono text-sm font-bold">{formatTime(store.timerSeconds)}</span>
                    </div>
                    {/* Hint Button */}
                    <button onClick={getHint} disabled={hintLoading} className="btn-secondary py-2">
                        <Lightbulb size={14} className="text-amber-400" />
                        {hintLoading ? 'Thinking...' : 'AI Hint'}
                    </button>
                    {/* Submit */}
                    <button onClick={submitCode} disabled={loading} className="btn-primary py-2">
                        <Send size={14} />
                        {loading ? 'Evaluating...' : 'Submit & Evaluate'}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex h-[calc(100vh-60px)]">
                {/* Left: Problem Description */}
                <div className="w-[400px] min-w-[350px] border-r border-white/[0.06] overflow-y-auto p-5">
                    <h2 className="text-lg font-bold mb-3">{selectedQ.title}</h2>
                    <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                        {selectedQ.description}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                        {selectedQ.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-1 rounded">{tag}</span>
                        ))}
                    </div>
                    {selectedQ.companyTags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/[0.06]">
                            <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Company Tags</span>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {selectedQ.companyTags.map(t => (
                                    <span key={t} className="badge badge-medium text-[10px]">{t}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Hint */}
                    <AnimatePresence>
                        {hintText && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
                            >
                                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                                    <Lightbulb size={12} /> AI Hint
                                </div>
                                <p className="text-sm text-amber-200/80">{hintText}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Code + Results */}
                <div className="flex-1 flex flex-col">
                    {/* Language Tabs */}
                    <div className="flex items-center gap-1 px-4 py-2 bg-[var(--bg-secondary)] border-b border-white/[0.06]">
                        {(['c', 'cpp', 'python'] as const).map(lang => (
                            <button
                                key={lang}
                                onClick={() => store.setLanguage(lang)}
                                className={`tab-trigger text-xs ${store.language === lang ? 'active' : ''}`}
                            >
                                {lang === 'cpp' ? 'C++' : lang === 'c' ? 'C' : 'Python'}
                            </button>
                        ))}
                    </div>

                    {/* Monaco Editor */}
                    <div className="flex-1">
                        <MonacoEditor
                            height="100%"
                            language={store.language === 'cpp' ? 'cpp' : store.language}
                            theme="vs-dark"
                            value={store.code}
                            onChange={(v) => store.setCode(v || '')}
                            options={{
                                fontSize: 14,
                                fontFamily: "'JetBrains Mono', monospace",
                                minimap: { enabled: false },
                                padding: { top: 16 },
                                scrollBeyondLastLine: false,
                                lineNumbers: 'on',
                                tabSize: 4,
                                wordWrap: 'on',
                            }}
                        />
                    </div>

                    {/* Results Bottom Pane */}
                    <AnimatePresence>
                        {store.aiScore !== null && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/[0.06] bg-[var(--bg-secondary)] overflow-hidden"
                            >
                                <div className="p-4 max-h-[250px] overflow-y-auto">
                                    <div className="flex items-center gap-4 mb-3">
                                        <div className="flex items-center gap-2">
                                            {store.aiScore >= 70 ? (
                                                <CheckCircle2 className="text-emerald-400" size={20} />
                                            ) : (
                                                <XCircle className="text-rose-400" size={20} />
                                            )}
                                            <span className="text-2xl font-black" style={{ color: store.aiScore >= 70 ? '#10b981' : '#f43f5e' }}>
                                                {store.aiScore}/100
                                            </span>
                                        </div>
                                    </div>
                                    {store.aiFeedback && (
                                        <p className="text-sm text-[var(--text-secondary)] mb-3">{store.aiFeedback}</p>
                                    )}
                                    {store.aiErrors.length > 0 && (
                                        <div className="mb-3">
                                            <span className="text-xs font-semibold text-rose-400">Issues:</span>
                                            <ul className="mt-1 space-y-1">
                                                {store.aiErrors.map((e, i) => (
                                                    <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                        <XCircle size={10} className="text-rose-400 mt-0.5 shrink-0" /> {e}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {store.aiOptimizations.length > 0 && (
                                        <div>
                                            <span className="text-xs font-semibold text-cyan-400">Optimizations:</span>
                                            <ul className="mt-1 space-y-1">
                                                {store.aiOptimizations.map((o, i) => (
                                                    <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2">
                                                        <Lightbulb size={10} className="text-cyan-400 mt-0.5 shrink-0" /> {o}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}
