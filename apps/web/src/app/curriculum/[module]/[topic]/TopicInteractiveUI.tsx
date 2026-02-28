'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Settings, Info, Factory, ExternalLink, ChevronDown, MessageSquare, X, Send, Sparkles, Loader2 } from 'lucide-react'

interface Props {
    content: any
    moduleData: any
    topicData: any
}

export default function TopicInteractiveUI({ content, moduleData, topicData }: Props) {
    const [expandedSubtopic, setExpandedSubtopic] = useState<number | null>(0)

    // AI Chat State
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([])
    const [currentMsg, setCurrentMsg] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const toggleSubtopic = (idx: number) => {
        if (expandedSubtopic === idx) setExpandedSubtopic(null)
        else setExpandedSubtopic(idx)
    }

    const handleAskAI = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentMsg.trim()) return

        const userText = currentMsg
        setChatMessages(p => [...p, { role: 'user', text: userText }])
        setCurrentMsg('')
        setIsTyping(true)

        try {
            // Re-using the company-research route logic or we can create a quick generic AI chat route
            // For now let's hit a new route we will create: /api/ai/topic-chat
            const res = await fetch('/api/ai/topic-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: topicData.name,
                    question: userText,
                    context: content.overview
                })
            })
            const data = await res.json()
            if (data.reply) {
                setChatMessages(p => [...p, { role: 'ai', text: data.reply }])
            }
        } catch (error) {
            console.error('AI error', error)
            setChatMessages(p => [...p, { role: 'ai', text: 'Error connecting to the AI tutor. Please try again.' }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
            {/* Left Column: Theory & Accordion Subtopics */}
            <div className="lg:col-span-2 space-y-6">
                <div className="glass-card p-6 md:p-8 backdrop-blur-2xl bg-slate-900/40 border-indigo-500/20 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2 pb-3 border-b border-indigo-500/20 text-indigo-100">
                        <Info size={22} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        Comprehensive Overview
                    </h2>
                    <p className="text-[var(--text-secondary)] leading-relaxed text-sm md:text-base">
                        {content.overview}
                    </p>
                </div>

                <h2 className="text-xl font-bold mt-10 mb-4 border-l-4 border-indigo-500 pl-4 text-slate-100 drop-shadow-sm flex items-center gap-2">
                    <BookOpen size={20} className="text-indigo-400" />
                    Interactive Subtopics
                </h2>

                <div className="space-y-4">
                    {content.subtopics.map((sub: any, idx: number) => {
                        const isExpanded = expandedSubtopic === idx
                        return (
                            <motion.div
                                key={idx}
                                className={`glass-card overflow-hidden transition-all duration-300 ${isExpanded ? 'border-indigo-500/40 bg-slate-900/60 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'}`}
                                layout
                            >
                                <button
                                    className="w-full text-left p-5 md:p-6 flex items-center justify-between focus:outline-none"
                                    onClick={() => toggleSubtopic(idx)}
                                >
                                    <h3 className={`text-lg font-bold transition-colors ${isExpanded ? 'text-indigo-300' : 'text-slate-200'}`}>
                                        {sub.title}
                                    </h3>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown size={20} className={isExpanded ? 'text-indigo-400' : 'text-slate-500'} />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="px-5 pb-6 md:px-6 space-y-5"
                                        >
                                            <div className="bg-slate-950/50 p-5 rounded-xl border border-indigo-500/10 shadow-inner">
                                                <div className="flex items-center gap-2 mb-3 text-indigo-300">
                                                    <BookOpen size={16} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Theoretical Depth</span>
                                                </div>
                                                <p className="text-sm text-slate-300 leading-relaxed">{sub.theory}</p>
                                            </div>
                                            <div className="bg-emerald-950/20 p-5 rounded-xl border border-emerald-500/10 shadow-inner">
                                                <div className="flex items-center gap-2 mb-3 text-emerald-400">
                                                    <Settings size={16} />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Real-World Application</span>
                                                </div>
                                                <p className="text-sm text-emerald-100/70 leading-relaxed">{sub.application}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Right Column: Context & Resources */}
            <div className="space-y-6">
                <div className="glass-card p-6 md:p-8 border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-2xl shadow-[0_8px_32px_rgba(245,158,11,0.05)]">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-300 border-b border-amber-500/20 pb-3">
                        <Factory size={20} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                        German Industry Context
                    </h2>
                    <p className="text-sm text-amber-100/80 leading-relaxed">
                        {content.germanContext}
                    </p>
                </div>

                <div className="glass-card p-6 md:p-8 backdrop-blur-2xl bg-slate-900/40">
                    <h2 className="text-lg font-bold mb-5 flex items-center gap-2 border-b border-slate-700/50 pb-3 text-slate-100">
                        <ExternalLink size={18} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                        Curated Resources
                    </h2>
                    <ul className="space-y-3">
                        {content.resources.map((res: any, idx: number) => (
                            <li key={idx}>
                                <a
                                    href={res.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex flex-col p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/40 transition-all duration-300 hover:shadow-[0_4px_15px_rgba(34,211,238,0.1)] hover:-translate-y-0.5"
                                >
                                    <span className="text-sm text-slate-200 group-hover:text-cyan-300 transition-colors font-semibold mb-1.5">
                                        {res.name}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 uppercase tracking-wider font-bold group-hover:text-cyan-600 transition-colors">
                                        <ExternalLink size={10} /> Read Article
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Floating Ask AI Button */}
            <motion.button
                className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)] flex items-center justify-center z-40 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsChatOpen(true)}
            >
                <Sparkles size={24} />
            </motion.button>

            {/* AI Chat Window */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-[350px] sm:w-[400px] max-h-[500px] flex flex-col glass-card border-indigo-500/30 bg-slate-900/95 backdrop-blur-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-white/10 bg-indigo-500/10 flex items-center justify-between flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-indigo-400" />
                                <span className="font-bold text-sm text-indigo-100">Topic Tutor AI</span>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] flex flex-col">
                            {chatMessages.length === 0 && (
                                <div className="text-center text-slate-400 text-sm mt-10">
                                    <Sparkles size={32} className="mx-auto text-indigo-500/50 mb-3" />
                                    <p>Stuck on <strong>{topicData.name}</strong>?</p>
                                    <p className="text-xs mt-1 opacity-70">Ask me to clarify concepts, explain analogies, or dive deeper.</p>
                                </div>
                            )}
                            {chatMessages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-tr-sm'
                                            : 'bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="max-w-[85%] p-3 rounded-2xl text-sm bg-slate-800 text-slate-200 border border-slate-700/50 rounded-tl-sm flex gap-1">
                                        <motion.div className="w-2 h-2 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                                        <motion.div className="w-2 h-2 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                                        <motion.div className="w-2 h-2 bg-indigo-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleAskAI} className="p-3 border-t border-white/10 bg-slate-900 flex gap-2 flex-shrink-0">
                            <input
                                type="text"
                                placeholder="Ask about this topic..."
                                className="flex-1 bg-slate-800 border-none rounded-full px-4 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={currentMsg}
                                onChange={e => setCurrentMsg(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!currentMsg.trim() || isTyping}
                                className="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-full disabled:opacity-50 transition-colors shrink-0"
                            >
                                <Send size={16} className="-ml-0.5" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
