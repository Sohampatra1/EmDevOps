import { NextRequest, NextResponse } from 'next/server'
import { reviewCode } from '@/lib/groq'

export async function POST(req: NextRequest) {
    try {
        const { code, language } = await req.json()
        const result = await reviewCode(code, language)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Code Review Error:', error)
        return NextResponse.json(
            { overallScore: 0, issues: [], suggestions: ['Service unavailable'], misraViolations: [], memoryIssues: [], positives: [] },
            { status: 500 }
        )
    }
}
