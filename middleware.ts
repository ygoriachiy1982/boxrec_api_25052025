import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit, getRateLimitHeaders } from "@/lib/rate-limiter"
import { Logger } from "@/lib/logger"

export async function middleware(request: NextRequest) {
  const logger = Logger.getInstance()
  const path = request.nextUrl.pathname
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Rate limiting for all API routes
  if (path.startsWith("/api/")) {
    const rateLimitResult = await rateLimit(ip, 100, 3600) // 100 requests per hour

    if (!rateLimitResult.success) {
      logger.warn("Rate limit exceeded", { ip, path })
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      )
    }

    // Add rate limit headers to response
    const response = NextResponse.next()
    const headers = getRateLimitHeaders(rateLimitResult)
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
  }

  // Authentication check for protected API routes
  if (path.startsWith("/api/") && !path.startsWith("/api/auth") && !path.startsWith("/api/docs")) {
    const phpSessionId = request.cookies.get("PHPSESSID")

    if (!phpSessionId) {
      logger.warn("Unauthorized API access attempt", { ip, path })
      return NextResponse.json({ error: "Not authenticated. Please login first." }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}
