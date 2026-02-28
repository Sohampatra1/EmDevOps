import { NextRequest, NextResponse } from 'next/server'
import { discussSystemDesign } from '@/lib/groq'

export async function POST(req: NextRequest) {
    try {
        const { scenario, message, history } = await req.json()
        const result = await discussSystemDesign(scenario, message, history || [])
        return NextResponse.json({ response: result })
    } catch (error) {
        console.error('System Design Discussion Error:', error)
        return NextResponse.json({ response: 'I apologize, the AI service is temporarily unavailable. Please try again.' }, { status: 500 })
    }
}
