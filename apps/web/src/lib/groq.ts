import Groq from 'groq-sdk'

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function getGroqChatCompletion(prompt: string) {
    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
    })
    return completion.choices[0]?.message?.content || '{}'
}

export async function evaluateCode(code: string, language: string, problem: string, testCases: unknown) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are a senior embedded systems engineer at a German automotive company (Bosch/Continental/BMW). 
You are evaluating code submissions for embedded software interviews.
Evaluate with focus on: correctness, time/space complexity, C/C++ best practices, memory safety, const correctness, MISRA compliance where applicable.
Always respond in valid JSON format with these fields:
{
  "correct": boolean,
  "score": number (0-100),
  "timeComplexity": string,
  "spaceComplexity": string,
  "feedback": string (detailed, constructive),
  "errors": string[] (specific issues),
  "optimizations": string[] (suggestions),
  "weakAreas": string[] (skill tags where user needs improvement),
  "strongAreas": string[] (skill tags where user excels)
}`
            },
            {
                role: 'user',
                content: `Problem: ${problem}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\`\n\nTest Cases: ${JSON.stringify(testCases)}`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

export async function getHint(problem: string, currentCode: string, language: string) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are a helpful interview coach for embedded software engineering positions in Germany. 
Give a subtle hint without revealing the full solution. Focus on the algorithmic approach.
Respond in JSON: { "hint": string, "approach": string, "relatedConcept": string }`
            },
            {
                role: 'user',
                content: `Problem: ${problem}\n\nCurrent code:\n\`\`\`${language}\n${currentCode}\n\`\`\`\n\nGive me a hint.`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.5,
        max_tokens: 512,
        response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

export async function reviewCode(code: string, language: string) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are a senior code reviewer at a German automotive company following strict coding standards.
Review with focus on: MISRA C/C++ compliance, memory safety, const correctness, error handling, unit test coverage, naming conventions.
Respond in JSON:
{
  "overallScore": number (0-100),
  "issues": [{ "severity": "critical"|"warning"|"info", "line": number|null, "message": string, "category": string }],
  "suggestions": string[],
  "misraViolations": string[],
  "memoryIssues": string[],
  "positives": string[]
}`
            },
            {
                role: 'user',
                content: `Review this ${language} code:\n\`\`\`${language}\n${code}\n\`\`\``
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

export async function generateFlashcards(topic: string, context: string) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `Generate flashcards for embedded systems interview preparation targeting German automotive companies.
Each flashcard should test practical knowledge. Include code snippets where relevant.
Respond in JSON: { "flashcards": [{ "front": string, "back": string, "tags": string[] }] }`
            },
            {
                role: 'user',
                content: `Generate 5 flashcards for the topic: "${topic}"\nContext: ${context}`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

export async function analyzeGap(weakAreas: { tag: string; failureCount: number }[], progressData: unknown) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are an AI career coach specializing in embedded software engineering careers in Germany (DACH region).
Analyze the user's weak areas and progress data to provide actionable recommendations.
Respond in JSON:
{
  "readinessScore": number (0-100),
  "embeddedScore": number (0-100),
  "devopsScore": number (0-100),
  "interviewProbability": number (0-100),
  "topWeakAreas": string[],
  "topStrongAreas": string[],
  "suggestedFocusModule": string,
  "recommendations": string[],
  "weeklyPlan": string[]
}`
            },
            {
                role: 'user',
                content: `Weak Areas: ${JSON.stringify(weakAreas)}\nProgress: ${JSON.stringify(progressData)}`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 1024,
        response_format: { type: 'json_object' },
    })

    return JSON.parse(completion.choices[0]?.message?.content || '{}')
}

export async function discussSystemDesign(scenario: string, userMessage: string, history: { role: string; content: string }[]) {
    const completion = await groq.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: `You are a principal embedded systems architect at a major German automotive company.
You're conducting a system design interview. Guide the candidate through the design, asking probing questions.
Focus on real-world constraints: safety (ISO 26262), timing, memory, power, communication protocols (CAN, UDS).
Be encouraging but thorough. Point out missed considerations.`
            },
            ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
            {
                role: 'user',
                content: `Scenario: ${scenario}\n\n${userMessage}`
            }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        max_tokens: 1024,
    })

    return completion.choices[0]?.message?.content || ''
}
