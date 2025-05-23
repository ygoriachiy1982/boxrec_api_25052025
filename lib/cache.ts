import { kv } from "@vercel/kv"

export class CacheManager {
  private static instance: CacheManager

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cached = await kv.get<T>(`cache:${key}`)
      return cached
    } catch (error) {
      console.error("Cache get error:", error)
      return null
    }
  }

  async set<T>(key: string, value: T, ttl = 3600): Promise<void> {
    try {
      await kv.setex(`cache:${key}`, ttl, JSON.stringify(value))
    } catch (error) {
      console.error("Cache set error:", error)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await kv.del(`cache:${key}`)
    } catch (error) {
      console.error("Cache delete error:", error)
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await kv.exists(`cache:${key}`)
      return result === 1
    } catch (error) {
      console.error("Cache exists error:", error)
      return false
    }
  }

  // Cache keys for different data types
  static keys = {
    boxer: (id: string) => `boxer:${id}`,
    search: (query: string) => `search:${query.toLowerCase()}`,
    ratings: (division: string) => `ratings:${division}`,
    session: (sessionId: string) => `session:${sessionId}`,
  }
}
