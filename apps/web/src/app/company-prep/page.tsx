'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { COMPANY_PROFILES } from '@/lib/data/company-profiles'
import { Building2, Target, Shield, Wrench, BookOpen, ChevronRight, Clock, Plus, Loader2, Sparkles, Server } from 'lucide-react'
import { useProgressStore } from '@/stores/progress-store'

type CompanyKey = string

interface InterviewRound {
    name: string;
    description: string;
}

interface CompanyProfile {
    name: string;
    logo: string;
    focus: string[];
    dsaDifficulty: string;
    embeddedDepth: string;
    safetyEmphasis: string;
    devopsStack: string[];
    interviewTips: string[];
    interviewRounds: InterviewRound[];
    overview?: string;
    products?: string[];
}

export default function CompanyPrepPage() {
    const [selected, setSelected] = useState<CompanyKey | null>(null)
    const { setSelectedCompany } = useProgressStore()

    const [customCompanies, setCustomCompanies] = useState<Record<string, CompanyProfile>>({})
    const [isAdding, setIsAdding] = useState(false)
    const [newCompanyName, setNewCompanyName] = useState('')
    const [isGenerating, setIsGenerating] = useState(false)

    // Merge static and generated companies
    const allCompanies: Record<string, CompanyProfile> = {
        ...COMPANY_PROFILES,
        ...customCompanies
    }

    // Fetch generated companies on mount
    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies')
                if (res.ok) {
                    const data = await res.json()
                    const mapped: Record<string, CompanyProfile> = {}
                    data.companies.forEach((c: any) => {
                        mapped[c.name.toLowerCase().replace(/\\s+/g, '-')] = c
                    })
                    setCustomCompanies(mapped)
                }
            } catch (error) {
                console.error('Failed to load companies:', error)
            }
        }
        fetchCompanies()
    }, [])

    const selectCompany = (key: CompanyKey) => {
        setSelected(key)
        setSelectedCompany(key)
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCompanyName.trim()) return

        setIsGenerating(true)
        try {
            const res = await fetch('/api/ai/company-research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyName: newCompanyName })
            })
            const data = await res.json()

            if (data.company) {
                const key = data.company.name.toLowerCase().replace(/\\s+/g, '-')
                setCustomCompanies(prev => ({ ...prev, [key]: data.company }))
                selectCompany(key)
            }
        } catch (error) {
            console.error('Generation Error:', error)
        } finally {
            setIsGenerating(false)
            setIsAdding(false)
            setNewCompanyName('')
        }
    }

    const company: CompanyProfile | null = selected ? allCompanies[selected] : null

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Company-Specific Preparation</h1>
                    <p className="text-[var(--text-secondary)] mt-1">Select a top German employer or ask AI to research a specific company</p>
                </div>
            </div>

            {/* Company Selector Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                {Object.keys(allCompanies).map((key, i) => {
                    const c = allCompanies[key]
                    return (
                        <motion.div
                            key={key}
                            className={`glass-card p-4 text-center cursor-pointer relative overflow-hidden transition-all duration-300 ${selected === key ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)] backdrop-blur-3xl' : 'hover:border-slate-600'}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => selectCompany(key)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="text-3xl mb-2 filter drop-shadow-md">{c.logo}</div>
                            <div className="text-sm font-semibold text-slate-200">{c.name}</div>
                            {selected === key && (
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]"
                                    layoutId="activeCompanyTab"
                                />
                            )}
                        </motion.div>
                    )
                })}

                {/* Add Custom Company Button */}
                <motion.div
                    className="glass-card p-4 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-colors group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsAdding(!isAdding)}
                    whileHover={{ scale: 1.02 }}
                >
                    <div className="w-10 h-10 rounded-full border border-dashed border-slate-600 group-hover:border-emerald-500 flex items-center justify-center mb-2 transition-colors">
                        <Plus className="text-slate-400 group-hover:text-emerald-400 transition-colors" size={20} />
                    </div>
                    <div className="text-sm font-semibold text-slate-400 group-hover:text-emerald-400 transition-colors">Add Company</div>
                </motion.div>
            </div>

            {/* Inline AI Generation Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <form onSubmit={handleGenerate} className="glass-card p-5 border-emerald-500/30 bg-gradient-to-r from-emerald-500/5 to-transparent flex flex-col md:flex-row gap-4 items-center">
                            <div className="p-3 bg-emerald-500/10 rounded-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <Sparkles className="text-emerald-400 relative z-10" />
                            </div>
                            <div className="flex-1 w-full">
                                <h3 className="text-emerald-100 font-semibold mb-1">AI Company Crawler</h3>
                                <p className="text-xs text-emerald-100/60 mb-3">The AI will scout tech stacks, culture, and interview prep data.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="e.g. Porsche, NVIDIA, Infineon..."
                                        className="flex-1 bg-slate-900/80 border border-slate-700 rounded-lg px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 backdrop-blur-xl transition-all"
                                        value={newCompanyName}
                                        onChange={e => setNewCompanyName(e.target.value)}
                                        disabled={isGenerating}
                                        autoFocus
                                    />
                                    <button
                                        type="submit"
                                        disabled={isGenerating || !newCompanyName.trim()}
                                        className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2"
                                    >
                                        {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Crawling...</> : 'Generate Data'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Company Details Panel */}
            {company && (
                <motion.div
                    key={company.name} // Force re-animation on change
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    className="space-y-6"
                >
                    {/* Deep Overview Profile (For AI Generated Companies) */}
                    {company.overview && (
                        <div className="glass-card p-6 border-indigo-500/20 bg-gradient-to-br from-slate-900/80 to-indigo-900/10 backdrop-blur-2xl">
                            <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-indigo-100">
                                {company.logo} About {company.name}
                            </h2>
                            <p className="text-[var(--text-secondary)] leading-relaxed text-sm mb-4">
                                {company.overview}
                            </p>

                            {company.products && company.products.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                                        <Server size={12} /> Key Products & Projects
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {company.products.map(p => (
                                            <span key={p} className="px-3 py-1 bg-slate-800/80 border border-slate-700/50 rounded-full text-xs text-slate-300 shadow-sm">{p}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="glass-card hover:-translate-y-1 transition-transform duration-300 p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Target size={64} /></div>
                            <div className="flex items-center gap-2 mb-3">
                                <Target size={16} className="text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">DSA Difficulty</span>
                            </div>
                            <span className={`badge badge-${company.dsaDifficulty.toLowerCase()} shadow-lg`}>{company.dsaDifficulty}</span>
                        </div>
                        <div className="glass-card hover:-translate-y-1 transition-transform duration-300 p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Building2 size={64} /></div>
                            <div className="flex items-center gap-2 mb-3">
                                <Building2 size={16} className="text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Embedded Depth</span>
                            </div>
                            <span className={`badge ${company.embeddedDepth === 'HIGH' || company.embeddedDepth === 'EXPERT' ? 'badge-hard shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'badge-medium shadow-[0_0_10px_rgba(245,158,11,0.2)]'}`}>{company.embeddedDepth}</span>
                        </div>
                        <div className="glass-card hover:-translate-y-1 transition-transform duration-300 p-5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Shield size={64} /></div>
                            <div className="flex items-center gap-2 mb-3">
                                <Shield size={16} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Safety Emphasis</span>
                            </div>
                            <span className={`badge ${company.safetyEmphasis === 'HIGH' || company.safetyEmphasis === 'EXPERT' ? 'badge-hard shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'badge-medium shadow-[0_0_10px_rgba(245,158,11,0.2)]'}`}>{company.safetyEmphasis}</span>
                        </div>
                        <div className="glass-card hover:-translate-y-1 transition-transform duration-300 p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Wrench size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">DevOps Stack</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {company.devopsStack.map((s: string) => (
                                    <span key={s} className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded shadow-[0_0_5px_rgba(34,211,238,0.1)]">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {/* Focus Areas & Interview Tips */}
                        <div className="space-y-6">
                            <div className="glass-card p-6 backdrop-blur-2xl bg-slate-900/60 shadow-xl border-t-0 border-l-0 border-r-0 border-b-2 border-slate-800">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wider uppercase text-slate-300">
                                    <Target size={16} className="text-indigo-400" /> Focus Areas
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {company.focus.map((f: string) => (
                                        <span key={f} className="badge badge-medium shadow-sm">{f}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="glass-card p-6 backdrop-blur-2xl bg-slate-900/60 shadow-xl">
                                <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 tracking-wider uppercase text-slate-300">
                                    <BookOpen size={16} className="text-emerald-400" /> Interview Insights
                                </h3>
                                <ul className="space-y-4">
                                    {company.interviewTips.map((tip: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="mt-0.5 p-1 bg-indigo-500/10 rounded border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                                <ChevronRight size={12} className="text-indigo-400 group-hover:text-indigo-300" />
                                            </div>
                                            <span className="text-sm text-[var(--text-secondary)] leading-relaxed group-hover:text-slate-200 transition-colors">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Interview Rounds Timeline */}
                        <div className="glass-card p-6 relative overflow-hidden backdrop-blur-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border-amber-500/10">
                            <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
                                <Clock size={300} />
                            </div>
                            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 tracking-wider uppercase text-slate-300">
                                <Clock size={16} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" /> The Interview Process
                            </h3>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
                                {company.interviewRounds.map((round: InterviewRound, i: number) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-900 group-hover:border-amber-500 group-hover:bg-amber-500/10 text-slate-400 shadow-[0_0_10px_rgba(0,0,0,0.5)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-all duration-300 z-10">
                                            <span className="text-[10px] font-bold group-hover:text-amber-400">{i + 1}</span>
                                        </div>
                                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-2rem)] glass-card p-5 rounded-xl border border-transparent group-hover:border-amber-500/30 group-hover:bg-slate-800/80 transition-all duration-300 shadow-sm relative hover:-translate-y-1">
                                            <div className="font-bold text-slate-200 text-sm mb-2">{round.name}</div>
                                            <div className="text-slate-400 text-xs leading-relaxed">{round.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

