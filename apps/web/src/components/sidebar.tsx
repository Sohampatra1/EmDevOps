'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, BookOpen, Code2, Layers, Wrench,
    Bug, Building2, Cpu, FlaskConical, ChevronLeft,
    ChevronRight, Zap
} from 'lucide-react'
import { useAppStore } from '@/stores/app-store'

const NAV_ITEMS = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/curriculum', label: 'Curriculum', icon: BookOpen },
    { href: '/interview', label: 'DSA Interview', icon: Code2 },
    { href: '/flashcards', label: 'Flashcards', icon: Layers },
    { href: '/labs', label: 'Practical Labs', icon: Wrench },
    { href: '/simulators', label: 'Simulators', icon: Bug },
    { href: '/company-prep', label: 'Company Prep', icon: Building2 },
    { href: '/system-design', label: 'System Design', icon: Cpu },
    { href: '/code-review', label: 'Code Review', icon: FlaskConical },
]

export function Sidebar() {
    const pathname = usePathname()
    const { sidebarCollapsed, toggleCollapsed } = useAppStore()

    return (
        <motion.aside
            className="sidebar fixed left-0 top-0 h-screen z-40 flex flex-col"
            animate={{ width: sidebarCollapsed ? 72 : 260 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-white/[0.06]">
                <motion.div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: 'var(--gradient-primary)' }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                >
                    🇩🇪
                </motion.div>
                <AnimatePresence>
                    {!sidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <div className="text-sm font-bold gradient-text">EmDevOps</div>
                            <div className="text-[10px] text-[var(--text-muted)]">EU Accelerator</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto">
                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/' && pathname.startsWith(item.href))
                        const Icon = item.icon

                        return (
                            <Link key={item.href} href={item.href}>
                                <motion.div
                                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon size={18} />
                                    <AnimatePresence>
                                        {!sidebarCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {isActive && !sidebarCollapsed && (
                                        <motion.div
                                            className="ml-auto w-2 h-2 rounded-full"
                                            style={{ background: 'var(--accent-indigo)' }}
                                            layoutId="activeIndicator"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Collapse Toggle */}
            <div className="px-3 py-4 border-t border-white/[0.06]">
                <button
                    onClick={toggleCollapsed}
                    className="sidebar-item w-full justify-center"
                >
                    {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    {!sidebarCollapsed && <span>Collapse</span>}
                </button>
            </div>

            {/* Day Counter */}
            {!sidebarCollapsed && (
                <div className="px-4 py-4 border-t border-white/[0.06]">
                    <div className="glass-card p-3 flex items-center gap-3">
                        <Zap className="text-amber-400" size={18} />
                        <div>
                            <div className="text-xs text-[var(--text-muted)]">Day</div>
                            <div className="text-lg font-bold gradient-text">1 / 90</div>
                        </div>
                    </div>
                </div>
            )}
        </motion.aside>
    )
}
