import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

export function getScoreGrade(score: number): { grade: string; color: string } {
    if (score >= 90) return { grade: 'A+', color: '#22c55e' }
    if (score >= 80) return { grade: 'A', color: '#84cc16' }
    if (score >= 70) return { grade: 'B', color: '#eab308' }
    if (score >= 60) return { grade: 'C', color: '#f97316' }
    return { grade: 'D', color: '#ef4444' }
}
