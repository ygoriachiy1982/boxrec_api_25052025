import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { searchBoxers } from "@/lib/boxrec-api"
import { CacheManager } from "@/lib/cache"
import { Logger, withPerformanceLogging } from "@/lib/logger"

const cache = CacheManager.getInstance()
const logger = Logger.getInstance()

export async function GET(request: Request) {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      logger.warn("Missing search query in request")
      return NextResponse.json({ error: "Search query is required" }, { status: 400 })
    }

    // Check cache first
    const cacheKey = CacheManager.keys.search(query)
    const cachedData = await cache.get(cacheKey)

    if (cachedData) {
      logger.info("Search results served from cache", { query, duration: Date.now() - startTime })
      return NextResponse.json(cachedData)
    }

    // Get cookies for authentication
    const cookieStore = cookies()
    const cookieString = Array.from(cookieStore.getAll())
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ")

    if (!cookieString.includes("PHPSESSID")) {
      logger.warn("Unauthenticated search request", { query })
      return NextResponse.json({ error: "Not authenticated. Please login first." }, { status: 401 })
    }

    // Search for boxers with performance logging
    const searchBoxersWithLogging = withPerformanceLogging(searchBoxers, `searchBoxers:${query}`)
    const searchResults = await searchBoxersWithLogging(query, cookieString)

    // Cache the result for 30 minutes
    await cache.set(cacheKey, searchResults, 1800)

    logger.info("Search completed and cached", {
      query,
      resultCount: searchResults.length,
      duration: Date.now() - startTime,
      cached: false,
    })

    return NextResponse.json(searchResults)
  } catch (error) {
    logger.error("Error searching boxers", { query: new URL(request.url).searchParams.get("query") }, error)
    return NextResponse.json({ error: "Failed to search boxers" }, { status: 500 })
  }
}
