import { kv } from "@vercel/kv"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function rateLimit(
  identifier: string,
  limit = 100,
  window = 3600, // 1 hour in seconds
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`

  try {
    const current = (await kv.get<number>(key)) || 0
    const remaining = Math.max(0, limit - current - 1)

    if (current >= limit) {
      const ttl = await kv.ttl(key)
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Date.now() + ttl * 1000,
      }
    }

    // Increment counter
    const pipeline = kv.pipeline()
    pipeline.incr(key)
    pipeline.expire(key, window)
    await pipeline.exec()

    return {
      success: true,
      limit,
      remaining,
      reset: Date.now() + window * 1000,
    }
  } catch (error) {
    console.error("Rate limiting error:", error)
    // Fallback: allow request if Redis is down
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: Date.now() + window * 1000,
    }
  }
}

export function getRateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.reset / 1000).toString(),
  }
}
