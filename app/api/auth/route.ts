import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// BoxRec authentication URLs
const LOGIN_URL = "https://boxrec.com/en/login"
const BOXREC_URL = "https://boxrec.com"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // First, get the CSRF token
    const response = await fetch(LOGIN_URL, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to access BoxRec login page" }, { status: 500 })
    }

    const html = await response.text()
    const csrfToken = extractCsrfToken(html)

    if (!csrfToken) {
      return NextResponse.json({ error: "Failed to extract CSRF token" }, { status: 500 })
    }

    // Get cookies from the first request
    const initialCookies = extractCookiesFromResponse(response)

    // Now login with the CSRF token
    const loginResponse = await fetch(LOGIN_URL, {
      method: "POST",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: initialCookies,
      },
      body: new URLSearchParams({
        _csrf_token: csrfToken,
        _username: username,
        _password: password,
        "login[go]": "",
      }).toString(),
      redirect: "manual",
    })

    // Check if login was successful (302 redirect)
    if (loginResponse.status !== 302) {
      return NextResponse.json({ error: "Authentication failed. Check your credentials." }, { status: 401 })
    }

    // Extract session cookies
    const sessionCookies = extractCookiesFromResponse(loginResponse)

    // Store the cookies in the server's cookie jar
    const cookieStore = cookies()
    const parsedCookies = parseRawCookies(sessionCookies)

    for (const [name, value] of Object.entries(parsedCookies)) {
      cookieStore.set(name, value, {
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 1 day
      })
    }

    return NextResponse.json({
      success: true,
      message: "Successfully authenticated with BoxRec",
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed due to an internal error" }, { status: 500 })
  }
}

// Helper function to extract CSRF token from HTML
function extractCsrfToken(html: string): string | null {
  const match = html.match(/<input[^>]*name="_csrf_token"[^>]*value="([^"]*)"/)
  return match ? match[1] : null
}

// Helper function to extract cookies from response
function extractCookiesFromResponse(response: Response): string {
  const cookies = response.headers.getSetCookie?.() || []
  return cookies.join("; ")
}

// Helper function to parse raw cookies into an object
function parseRawCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {}

  cookieString.split(";").forEach((cookie) => {
    const parts = cookie.split("=")
    if (parts.length >= 2) {
      const name = parts[0].trim()
      const value = parts.slice(1).join("=").trim()
      if (name && !name.includes("path") && !name.includes("expires") && !name.includes("domain")) {
        cookies[name] = value
      }
    }
  })

  return cookies
}
