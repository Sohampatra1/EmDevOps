import { CURRICULUM } from '@/lib/data/curriculum'
import { getTopicContent } from '@/lib/data/topic-content'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import TopicInteractiveUI from './TopicInteractiveUI'

interface Props {
    params: {
        module: string
        topic: string
    }
}

export default async function TopicPage({ params }: Props) {
    const { module, topic } = await params

    // Find module and topic from base curriculum
    const moduleData = CURRICULUM.modules.find(m => m.slug === module)
    if (!moduleData) notFound()

    const topicData = moduleData.topics.find(t => t.slug === topic)
    if (!topicData) notFound()

    // Get the deep dive content
    const content = getTopicContent(topicData.slug)

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-12">
            <div>
                <Link href="/curriculum" className="inline-flex items-center text-sm text-[var(--text-secondary)] hover:text-white mb-4 transition-colors">
                    <ArrowLeft size={16} className="mr-1" /> Back to Curriculum
                </Link>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{moduleData.icon}</span>
                    <span className="text-[var(--text-muted)] font-mono text-sm">{moduleData.name} /</span>
                </div>
                <h1 className="text-3xl font-bold gradient-text pb-1">{topicData.name}</h1>
                <p className="text-[var(--text-secondary)] mt-1">{topicData.description}</p>
            </div>

            <TopicInteractiveUI content={content} moduleData={moduleData} topicData={topicData} />
        </div>
    )
}
