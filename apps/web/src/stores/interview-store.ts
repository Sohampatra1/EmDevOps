'use client'

import { create } from 'zustand'

interface InterviewState {
    isActive: boolean
    questionId: string | null
    code: string
    language: 'c' | 'cpp' | 'python'
    timerSeconds: number
    timerRunning: boolean
    testResults: Array<{ input: string; expected: string; actual: string; passed: boolean }>
    aiScore: number | null
    aiFeedback: string | null
    aiErrors: string[]
    aiOptimizations: string[]
    hints: string[]
    showHint: boolean
    startInterview: (questionId: string, starterCode: string, duration: number) => void
    setCode: (code: string) => void
    setLanguage: (lang: 'c' | 'cpp' | 'python') => void
    tick: () => void
    setTestResults: (results: InterviewState['testResults']) => void
    setAIResult: (score: number, feedback: string, errors: string[], optimizations: string[]) => void
    requestHint: () => void
    reset: () => void
}

export const useInterviewStore = create<InterviewState>((set) => ({
    isActive: false,
    questionId: null,
    code: '',
    language: 'cpp',
    timerSeconds: 2700, // 45 min default
    timerRunning: false,
    testResults: [],
    aiScore: null,
    aiFeedback: null,
    aiErrors: [],
    aiOptimizations: [],
    hints: [],
    showHint: false,
    startInterview: (questionId, starterCode, duration) =>
        set({
            isActive: true,
            questionId,
            code: starterCode,
            timerSeconds: duration,
            timerRunning: true,
            testResults: [],
            aiScore: null,
            aiFeedback: null,
            aiErrors: [],
            aiOptimizations: [],
            showHint: false,
        }),
    setCode: (code) => set({ code }),
    setLanguage: (language) => set({ language }),
    tick: () =>
        set((s) => ({
            timerSeconds: Math.max(0, s.timerSeconds - 1),
            timerRunning: s.timerSeconds > 1,
        })),
    setTestResults: (testResults) => set({ testResults }),
    setAIResult: (aiScore, aiFeedback, aiErrors, aiOptimizations) =>
        set({ aiScore, aiFeedback, aiErrors, aiOptimizations, timerRunning: false }),
    requestHint: () => set({ showHint: true }),
    reset: () =>
        set({
            isActive: false,
            questionId: null,
            code: '',
            timerSeconds: 2700,
            timerRunning: false,
            testResults: [],
            aiScore: null,
            aiFeedback: null,
            aiErrors: [],
            aiOptimizations: [],
            showHint: false,
        }),
}))
