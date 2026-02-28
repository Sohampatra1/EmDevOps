'use client'

import { Sidebar } from '@/components/sidebar'
import { useAppStore } from '@/stores/app-store'
import { motion } from 'framer-motion'

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const { sidebarCollapsed } = useAppStore()

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <motion.main
                className="flex-1 min-h-screen"
                animate={{ marginLeft: sidebarCollapsed ? 72 : 260 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            >
                <div className="p-6 max-w-[1600px] mx-auto">
                    {children}
                </div>
            </motion.main>
        </div>
    )
}
