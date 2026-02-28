'use client'

import { create } from 'zustand'

interface ProgressState {
    moduleProgress: Record<string, number> // slug → mastery %
    topicProgress: Record<string, number>
    timeSpent: Record<string, number> // slug → seconds
    weakAreas: string[]
    strongAreas: string[]
    readinessScore: number
    embeddedScore: number
    devopsScore: number
    interviewProbability: number
    suggestedModule: string
    selectedCompany: string | null
    setModuleProgress: (slug: string, pct: number) => void
    setTopicProgress: (slug: string, pct: number) => void
    addTimeSpent: (slug: string, seconds: number) => void
    setAnalytics: (data: Partial<ProgressState>) => void
    setSelectedCompany: (company: string | null) => void
}

export const useProgressStore = create<ProgressState>((set) => ({
    moduleProgress: {},
    topicProgress: {},
    timeSpent: {},
    weakAreas: ['Pointers', 'Bit Manipulation', 'AUTOSAR', 'Yocto'],
    strongAreas: ['Arrays', 'Docker', 'Git'],
    readinessScore: 42,
    embeddedScore: 38,
    devopsScore: 55,
    interviewProbability: 35,
    suggestedModule: 'Modern C & C++',
    selectedCompany: null,
    setModuleProgress: (slug, pct) =>
        set((s) => ({ moduleProgress: { ...s.moduleProgress, [slug]: pct } })),
    setTopicProgress: (slug, pct) =>
        set((s) => ({ topicProgress: { ...s.topicProgress, [slug]: pct } })),
    addTimeSpent: (slug, seconds) =>
        set((s) => ({ timeSpent: { ...s.timeSpent, [slug]: (s.timeSpent[slug] || 0) + seconds } })),
    setAnalytics: (data) => set((s) => ({ ...s, ...data })),
    setSelectedCompany: (company) => set({ selectedCompany: company }),
}))
