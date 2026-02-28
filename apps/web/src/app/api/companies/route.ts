import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const companies = await prisma.generatedCompany.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ companies })
    } catch (error: any) {
        console.error('Fetch Companies Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
