import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getBoxerData } from "@/lib/boxrec-api"
import { CacheManager } from "@/lib/cache"
import { Logger, withPerformanceLogging } from "@/lib/logger"

const cache = CacheManager.getInstance()
const logger = Logger.getInstance()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const startTime = Date.now()

  try {
    const boxerId = params.id

    if (!boxerId) {
      logger.warn("Missing boxer ID in request")
      return NextResponse.json({ error: "Boxer ID is required" }, { status: 400 })
    }

    // Check cache first
    const cacheKey = CacheManager.keys.boxer(boxerId)
    const cachedData = await cache.get(cacheKey)

    if (cachedData) {
      logger.info("Boxer data served from cache", { boxerId, duration: Date.now() - startTime })
      return NextResponse.json(cachedData)
    }

    // Get cookies for authentication
    const cookieStore = cookies()
    const cookieString = Array.from(cookieStore.getAll())
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ")

    if (!cookieString.includes("PHPSESSID")) {
      logger.warn("Unauthenticated request for boxer data", { boxerId })
      return NextResponse.json({ error: "Not authenticated. Please login first." }, { status: 401 })
    }

    // Get boxer data with performance logging
    const getBoxerDataWithLogging = withPerformanceLogging(getBoxerData, `getBoxerData:${boxerId}`)
    const boxerData = await getBoxerDataWithLogging(boxerId, cookieString)

    // Cache the result for 1 hour
    await cache.set(cacheKey, boxerData, 3600)

    logger.info("Boxer data fetched and cached", {
      boxerId,
      duration: Date.now() - startTime,
      cached: false,
    })

    return NextResponse.json(boxerData)
  } catch (error) {
    logger.error("Error fetching boxer data", { boxerId: params.id }, error)
    return NextResponse.json({ error: "Failed to fetch boxer data" }, { status: 500 })
  }
}
