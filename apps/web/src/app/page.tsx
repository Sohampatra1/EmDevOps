'use client'

import { motion } from 'framer-motion'
import { useProgressStore } from '@/stores/progress-store'
import {
  TrendingUp, Target, Cpu, Cloud, AlertTriangle,
  CheckCircle2, Clock, BarChart3, Zap, ArrowRight
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from 'recharts'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const }
  })
}

const improvementData = [
  { day: 'W1', score: 15 }, { day: 'W2', score: 28 }, { day: 'W3', score: 35 },
  { day: 'W4', score: 42 }, { day: 'W5', score: 48 }, { day: 'W6', score: 55 },
]

const moduleTimeData = [
  { name: 'C/C++', hours: 12 }, { name: 'Linux', hours: 8 }, { name: 'Qt/QML', hours: 4 },
  { name: 'Protocols', hours: 6 }, { name: 'CI/CD', hours: 10 }, { name: 'Docker', hours: 7 },
  { name: 'DSA', hours: 14 }, { name: 'SysDesign', hours: 3 },
]

export default function Dashboard() {
  const store = useProgressStore()

  const scoreCards = [
    { label: '🇩🇪 Germany Readiness', value: store.readinessScore, color: '#6366f1', icon: Target },
    { label: 'Embedded Score', value: store.embeddedScore, color: '#8b5cf6', icon: Cpu },
    { label: 'DevOps Score', value: store.devopsScore, color: '#06b6d4', icon: Cloud },
    { label: 'Interview Probability', value: store.interviewProbability, color: '#10b981', icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Your 90-day journey to Embedded DevOps mastery in Germany
        </p>
      </motion.div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreCards.map((card, i) => (
          <motion.div
            key={card.label}
            className="glass-card p-5"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={i + 1}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
                {card.label}
              </span>
              <card.icon size={16} style={{ color: card.color }} />
            </div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black" style={{ color: card.color }}>
                {card.value}
              </span>
              <span className="text-lg text-[var(--text-muted)] mb-1">%</span>
            </div>
            <div className="progress-bar mt-3">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${card.value}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                style={{ background: `linear-gradient(90deg, ${card.color}, ${card.color}88)` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Improvement Graph */}
        <motion.div className="glass-card p-5" variants={fadeUp} initial="hidden" animate="visible" custom={5}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 size={16} className="text-indigo-400" />
              Improvement Over Time
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={improvementData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#5a5a6e" fontSize={12} />
              <YAxis stroke="#5a5a6e" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                labelStyle={{ color: '#f0f0f5' }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Time Per Module */}
        <motion.div className="glass-card p-5" variants={fadeUp} initial="hidden" animate="visible" custom={6}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" />
              Time Spent Per Module (hours)
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={moduleTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#5a5a6e" fontSize={11} />
              <YAxis stroke="#5a5a6e" fontSize={12} />
              <Tooltip
                contentStyle={{ background: '#16161f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              />
              <Bar dataKey="hours" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Weak & Strong Areas + Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div className="glass-card p-5" variants={fadeUp} initial="hidden" animate="visible" custom={7}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-rose-400" />
            Weak Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {store.weakAreas.map(area => (
              <span key={area} className="badge badge-hard">{area}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card p-5" variants={fadeUp} initial="hidden" animate="visible" custom={8}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-emerald-400" />
            Strong Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {store.strongAreas.map(area => (
              <span key={area} className="badge badge-easy">{area}</span>
            ))}
          </div>
        </motion.div>

        <motion.div className="glass-card p-5" variants={fadeUp} initial="hidden" animate="visible" custom={9}>
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Zap size={16} className="text-amber-400" />
            AI Suggested Focus
          </h3>
          <p className="text-xl font-bold gradient-text mb-2">{store.suggestedModule}</p>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Based on your weak areas and progress analysis
          </p>
          <Link href="/curriculum" className="btn-primary text-xs py-2 px-4">
            Start Learning <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3" variants={fadeUp} initial="hidden" animate="visible" custom={10}>
        {[
          { href: '/interview', label: 'Start DSA Practice', icon: '🧮', color: '#6366f1' },
          { href: '/flashcards', label: 'Review Flashcards', icon: '🃏', color: '#8b5cf6' },
          { href: '/labs', label: 'Open Lab', icon: '🔧', color: '#06b6d4' },
          { href: '/simulators', label: 'Debug Challenge', icon: '🐛', color: '#f43f5e' },
        ].map(action => (
          <Link key={action.href} href={action.href}>
            <motion.div
              className="glass-card p-4 text-center cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-xs font-medium" style={{ color: action.color }}>{action.label}</div>
            </motion.div>
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
