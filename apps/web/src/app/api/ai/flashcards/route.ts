import { NextRequest, NextResponse } from 'next/server'
import { generateFlashcards } from '@/lib/groq'

export async function POST(req: NextRequest) {
    try {
        const { topic, context } = await req.json()
        const result = await generateFlashcards(topic, context)
        return NextResponse.json(result)
    } catch (error) {
        console.error('Flashcard Generation Error:', error)
        return NextResponse.json({ flashcards: [] }, { status: 500 })
    }
}
