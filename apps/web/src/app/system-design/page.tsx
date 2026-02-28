'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CURRICULUM } from '@/lib/data/curriculum'
import { Cpu, Send, User, Bot, ArrowLeft, Sparkles } from 'lucide-react'

const SD_TOPICS = CURRICULUM.modules.find(m => m.slug === 'system-design')?.topics || []

interface Message {
    role: 'user' | 'assistant'
    content: string
}

export default function SystemDesignPage() {
    const [selectedTopic, setSelectedTopic] = useState<typeof SD_TOPICS[0] | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const chatRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
    }, [messages])

    const startDesign = (topic: typeof SD_TOPICS[0]) => {
        setSelectedTopic(topic)
        setMessages([{
            role: 'assistant',
            content: `Welcome to the **${topic.name}** system design session.\n\n${topic.description}\n\nLet's begin. How would you approach designing this system? Start by describing the high-level architecture and key components you'd consider.`
        }])
    }

    const sendMessage = async () => {
        if (!input.trim() || !selectedTopic) return
        const userMsg: Message = { role: 'user', content: input }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setLoading(true)

        try {
            const res = await fetch('/api/ai/system-design', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scenario: `${selectedTopic.name}: ${selectedTopic.description}`,
                    message: input,
                    history: messages
                })
            })
            const data = await res.json()
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
        } catch {
            setMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, the AI service is temporarily unavailable. Please try again.' }])
        }
        setLoading(false)
    }

    if (selectedTopic) {
        return (
            <div className="flex flex-col h-[calc(100vh-48px)] -m-6">
                {/* Header */}
                <div className="flex items-center gap-3 px-6 py-3 bg-[var(--bg-secondary)] border-b border-white/[0.06]">
                    <button onClick={() => { setSelectedTopic(null); setMessages([]) }} className="btn-secondary py-2 px-3">
                        <ArrowLeft size={14} /> Back
                    </button>
                    <Cpu size={18} className="text-indigo-400" />
                    <span className="font-medium">{selectedTopic.name}</span>
                    <span className="badge badge-medium text-[10px] ml-auto">AI Discussion Partner</span>
                </div>

                {/* Chat */}
                <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                                    <Bot size={14} className="text-indigo-400" />
                                </div>
                            )}
                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-indigo-500/20 text-[var(--text-primary)]'
                                : 'glass-card'
                                }`}>
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                            </div>
                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <User size={14} className="text-emerald-400" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                    {loading && (
                        <div className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <Bot size={14} className="text-indigo-400" />
                            </div>
                            <div className="glass-card px-4 py-3">
                                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="px-6 py-4 border-t border-white/[0.06] bg-[var(--bg-secondary)]">
                    <div className="flex gap-3">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                            placeholder="Describe your design approach..."
                            className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/30"
                        />
                        <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary py-3 px-5">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Embedded DevOps System Design</h1>
                <p className="text-[var(--text-secondary)] mt-1">15 real-world scenarios from German automotive & industrial companies — discuss with AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {SD_TOPICS.map((topic, i) => (
                    <motion.div
                        key={topic.slug}
                        className="glass-card p-5 cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => startDesign(topic)}
                        whileHover={{ scale: 1.02 }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                                <span className="text-sm font-bold text-indigo-400">{i + 1}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm mb-1">{topic.name}</h3>
                                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">{topic.description}</p>
                            </div>
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-[10px] text-indigo-400">
                            <Sparkles size={10} /> AI Discussion Partner
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
