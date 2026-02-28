import { NextResponse } from 'next/server'
import { getGroqChatCompletion } from '@/lib/groq'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { companyName } = await req.json()

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
    }

    // Check if we already generated this company
    const existing = await prisma.generatedCompany.findUnique({
      where: { name: companyName }
    })

    if (existing) {
      return NextResponse.json({ message: 'Company already exists', company: existing })
    }

    // 1. Generate Company Profile via Groq
    const profilePrompt = `
        You are an expert tech recruiter and Embedded DevOps engineer in Germany.
        A candidate wants to interview at ${companyName} for an Embedded Software or Embedded DevOps role.
        Crawl your knowledge base (Reddit, Glassdoor, industry news) to generate a deeply detailed profile for this company.
        Return ONLY a raw JSON object with NO markdown formatting, NO backticks, and NO conversational text.

        The JSON must match this structure exactly:
        {
          "name": "${companyName}",
          "logo": "🏢", // Best matching emoji
          "overview": "Detailed 3-4 sentence paragraph about what they do, their history, and their German presence.",
          "products": ["Product Line 1", "Product Line 2", "Product Line 3"],
          "focus": ["Key Tech Focus 1", "Key Tech Focus 2", "Key Tech Focus 3"],
          "dsaDifficulty": "EASY" | "MEDIUM" | "HARD" | "EXPERT",
          "embeddedDepth": "MEDIUM" | "HIGH" | "EXPERT",
          "safetyEmphasis": "LOW" | "MEDIUM" | "HIGH" | "EXPERT",
          "devopsStack": ["GitLab", "Docker", "CMake", "Yocto"], // 4-6 specific tools they use
          "interviewTips": [
            "Highly specific tip 1 about their culture or interview style",
            "Highly specific tip 2 about what technical topics they drill deep on",
            "Highly specific tip 3"
          ],
          "interviewRounds": [
            { "name": "Round 1 Name", "description": "Round 1 Description" },
            { "name": "Round 2 Name", "description": "Round 2 Description" }
            // Include typical 3-5 rounds
          ]
        }
        `

    const profileContent = await getGroqChatCompletion(profilePrompt)
    const profileData = JSON.parse(profileContent.replace(/```json/g, '').replace(/```/g, '').trim())

    // 2. Insert Company into DB
    const newCompany = await prisma.generatedCompany.create({
      data: {
        name: profileData.name,
        logo: profileData.logo,
        overview: profileData.overview,
        products: profileData.products,
        focus: profileData.focus,
        dsaDifficulty: profileData.dsaDifficulty,
        embeddedDepth: profileData.embeddedDepth,
        safetyEmphasis: profileData.safetyEmphasis,
        devopsStack: profileData.devopsStack,
        interviewTips: profileData.interviewTips,
        interviewRounds: profileData.interviewRounds,
      }
    })

    // 3. Generate 3 Specific DSA/Embedded Questions for this company
    const qsPrompt = `
        Generate 3 technical interview questions (DSA or Embedded concepts) that are highly likely to be asked at ${companyName}.
        Return ONLY a raw JSON array of objects. NO markdown.
        Structure:
        [
          {
            "title": "Question Title",
            "description": "Question description and constraints",
            "difficulty": "EASY" | "MEDIUM" | "HARD",
            "type": "DSA" | "DEBUG" | "SYSTEM_DESIGN",
            "tags": ["tag1", "tag2"]
          }
        ]
        `
    const qsContent = await getGroqChatCompletion(qsPrompt)
    const qsData = JSON.parse(qsContent.replace(/```json/g, '').replace(/```/g, '').trim())

    // Find a default topic to attach these questions to (e.g., the first topic)
    const defaultTopic = await prisma.topic.findFirst()

    if (defaultTopic && Array.isArray(qsData)) {
      for (const q of qsData) {
        await prisma.question.create({
          data: {
            title: q.title,
            description: q.description,
            difficulty: q.difficulty || "MEDIUM",
            type: q.type || "DSA",
            tags: q.tags || [],
            companyTags: [newCompany.name],
            topicId: defaultTopic.id
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      company: newCompany,
      generatedQuestions: qsData
    })

  } catch (error: any) {
    console.error('Company Crawler Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
