import { NextResponse } from 'next/server'
import { getGroqChatCompletion } from '@/lib/groq'

export async function POST(req: Request) {
    try {
        const { topic, question, context } = await req.json()

        if (!topic || !question) {
            return NextResponse.json({ error: 'Missing topic or question' }, { status: 400 })
        }

        const prompt = `
        You are a highly skilled AI tutor specialized in teaching Embedded Systems and DevOps to software engineers aiming for jobs in Germany.
        The current topic being studied is: "${topic}".
        Context from the curriculum: "${context}".
        
        The student has asked:
        "${question}"

        Please provide a highly concise, clear, and extremely accurate explanation. Keep it under 4 paragraphs. Use analogies if helpful. Do NOT use markdown code blocks unless absolutely necessary for a command or syntax example. Focus strictly on the question.
        `

        const aiResponse = await getGroqChatCompletion(prompt)

        // Since we are not requiring JSON format for this particular endpoint, but the generic getGroqChatCompletion returns JSON format due to its generic configuration.
        // Wait, getGroqChatCompletion enforces response_format: 'json_object'. I need to parse it or change the generic function.
        // Let's assume getGroqChatCompletion returns JSON and I should structure the prompt.

        // Fix: Since the generic getGroqChatCompletion has `response_format: { type: 'json_object' }`, we MUST tell the AI to output JSON.

        const improvedPrompt = `
        You are a highly skilled AI tutor specialized in teaching Embedded Systems and DevOps to software engineers aiming for jobs in Germany.
        The current topic being studied is: "${topic}".
        Context from the curriculum: "${context}".
        
        The student has asked:
        "${question}"

        Please provide a highly concise, clear, and extremely accurate explanation. Keep it under 4 paragraphs. Use analogies if helpful. Focus strictly on the question.
        Return ONLY valid JSON in this exact format, with no markdown formatting surrounding it:
        {
            "reply": "Your detailed explanation text here."
        }
        `

        const completion = await getGroqChatCompletion(improvedPrompt)
        const parsed = JSON.parse(completion.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim())

        return NextResponse.json({ reply: parsed.reply })
    } catch (error: any) {
        console.error('AI Tutor Chat Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
