import { NextRequest, NextResponse } from 'next/server'
import { evaluateCode } from '@/lib/groq'

export async function POST(req: NextRequest) {
    try {
        const { code, language, problem, testCases } = await req.json()
        const result = await evaluateCode(code, language, problem, testCases)
        return NextResponse.json(result)
    } catch (error) {
        console.error('AI Evaluate Error:', error)
        return NextResponse.json(
            { error: 'Failed to evaluate code', correct: false, score: 0, feedback: 'Service unavailable. Please try again.' },
            { status: 500 }
        )
    }
}
