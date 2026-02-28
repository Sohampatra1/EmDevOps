'use client'

import { motion } from 'framer-motion'
import { CURRICULUM } from '@/lib/data/curriculum'
import { BookOpen, ChevronRight, Cpu, Cloud } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function CurriculumPage() {
    const [filter, setFilter] = useState<'all' | 'embedded' | 'devops'>('all')

    const filtered = filter === 'all'
        ? CURRICULUM.modules
        : CURRICULUM.modules.filter(m => m.domain === filter)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold gradient-text">Curriculum</h1>
                <p className="text-[var(--text-secondary)] mt-1">10 modules, 49 topics — your path to EU embedded mastery</p>
            </div>

            {/* Filter Tabs */}
            <div className="tab-list w-fit">
                {(['all', 'embedded', 'devops'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`tab-trigger ${filter === f ? 'active' : ''}`}
                    >
                        {f === 'all' ? '📚 All' : f === 'embedded' ? '⚡ Embedded' : '☁️ DevOps'}
                    </button>
                ))}
            </div>

            {/* Module Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((mod, i) => (
                    <motion.div
                        key={mod.slug}
                        className="glass-card p-5"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{mod.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">{mod.name}</h3>
                                    <span className={`badge ${mod.domain === 'embedded' ? 'badge-medium' : 'badge-easy'} mt-1`}>
                                        {mod.domain === 'embedded' ? <Cpu size={10} /> : <Cloud size={10} />}
                                        {mod.domain}
                                    </span>
                                </div>
                            </div>
                            <span className="text-xs text-[var(--text-muted)]">{mod.topics.length} topics</span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">{mod.description}</p>

                        {/* Progress */}
                        <div className="progress-bar mb-4">
                            <div className="progress-fill" style={{ width: `${Math.random() * 40}%` }} />
                        </div>

                        {/* Topics */}
                        <div className="space-y-1">
                            {mod.topics.map(topic => (
                                <Link key={topic.slug} href={`/curriculum/${mod.slug}/${topic.slug}`}>
                                    <div className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-2">
                                            <BookOpen size={12} className="text-[var(--text-muted)]" />
                                            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                                                {topic.name}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className="text-[var(--text-muted)] group-hover:text-indigo-400 transition-colors" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
