import Redis from 'ioredis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis = globalForRedis.redis || new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
})

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Leitner-Redis Queue Operations
export async function addToReviewQueue(questionId: string, priority: number) {
    await redis.zadd('review-queue', priority, questionId)
}

export async function getReviewQueue(count: number = 10): Promise<string[]> {
    return redis.zrange('review-queue', 0, count - 1)
}

export async function removeFromReviewQueue(questionId: string) {
    await redis.zrem('review-queue', questionId)
}

export async function getDailyReviewCount(): Promise<number> {
    return redis.zcard('review-queue')
}
