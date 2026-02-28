// Spaced Repetition Engine using Leitner System + Exponential Decay
// Memory Strength: S = P * e^(-k * t)
// P = base performance score (0-1)
// k = decay constant based on difficulty
// t = time elapsed since last review (in days)

export interface RepetitionState {
    memoryStrength: number
    nextReviewDate: Date
    interval: number  // days
    boxLevel: number  // Leitner box 0-4
    basePerformance: number
    decayConstant: number
}

const DECAY_CONSTANTS: Record<string, number> = {
    EASY: 0.05,
    MEDIUM: 0.1,
    HARD: 0.15,
    EXPERT: 0.2,
}

const MEMORY_THRESHOLD = 0.4 // Below this, item goes to review queue

const INTERVALS = [1, 3, 7, 14, 30] // Leitner box intervals in days

export function calculateMemoryStrength(
    basePerformance: number,
    decayConstant: number,
    daysSinceReview: number
): number {
    return basePerformance * Math.exp(-decayConstant * daysSinceReview)
}

export function shouldReview(
    basePerformance: number,
    decayConstant: number,
    daysSinceReview: number
): boolean {
    const strength = calculateMemoryStrength(basePerformance, decayConstant, daysSinceReview)
    return strength < MEMORY_THRESHOLD
}

export function updateRepetitionState(
    current: RepetitionState,
    correct: boolean,
    difficulty: string
): RepetitionState {
    const k = DECAY_CONSTANTS[difficulty] || 0.1

    let newBox = current.boxLevel
    let newPerformance = current.basePerformance

    if (correct) {
        // Move up one Leitner box (max 4)
        newBox = Math.min(current.boxLevel + 1, 4)
        // Increase base performance
        newPerformance = Math.min(current.basePerformance + 0.1, 1.0)
    } else {
        // Reset to box 0
        newBox = 0
        // Decrease base performance
        newPerformance = Math.max(current.basePerformance - 0.15, 0.1)
    }

    const interval = INTERVALS[newBox]
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + interval)

    const memoryStrength = calculateMemoryStrength(newPerformance, k, 0)

    return {
        memoryStrength,
        nextReviewDate: nextReview,
        interval,
        boxLevel: newBox,
        basePerformance: newPerformance,
        decayConstant: k,
    }
}

export function getDaysSince(date: Date | null): number {
    if (!date) return 999
    const now = new Date()
    const diff = now.getTime() - new Date(date).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function getStrengthColor(strength: number): string {
    if (strength >= 0.8) return '#22c55e' // green
    if (strength >= 0.6) return '#84cc16' // lime
    if (strength >= 0.4) return '#eab308' // yellow
    if (strength >= 0.2) return '#f97316' // orange
    return '#ef4444' // red
}

export function getStrengthLabel(strength: number): string {
    if (strength >= 0.8) return 'Strong'
    if (strength >= 0.6) return 'Good'
    if (strength >= 0.4) return 'Fading'
    if (strength >= 0.2) return 'Weak'
    return 'Critical'
}
