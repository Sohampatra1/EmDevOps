import { NextRequest, NextResponse } from 'next/server'
import { getHint } from '@/lib/groq'

export async function POST(req: NextRequest) {
    try {
        const { problem, code, language } = await req.json()
        const result = await getHint(problem, code, language)
        return NextResponse.json(result)
    } catch (error) {
        console.error('AI Hint Error:', error)
        return NextResponse.json(
            { hint: 'Think about the problem step by step.', approach: 'Break it down', relatedConcept: 'Divide and conquer' },
            { status: 500 }
        )
    }
}
