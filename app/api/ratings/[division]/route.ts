import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getRatings } from "@/lib/boxrec-api"

export async function GET(request: Request, { params }: { params: { division: string } }) {
  try {
    const division = params.division

    if (!division) {
      return NextResponse.json({ error: "Weight division is required" }, { status: 400 })
    }

    // Get cookies for authentication
    const cookieStore = cookies()
    const cookieString = Array.from(cookieStore.getAll())
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ")

    if (!cookieString.includes("PHPSESSID")) {
      return NextResponse.json({ error: "Not authenticated. Please login first." }, { status: 401 })
    }

    // Get ratings for the division
    const ratingsData = await getRatings(division, cookieString)

    return NextResponse.json(ratingsData)
  } catch (error) {
    console.error("Error fetching ratings:", error)
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 })
  }
}
