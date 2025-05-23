import * as cheerio from "cheerio"

const BOXREC_URL = "https://boxrec.com"

/**
 * Fetches boxer data from BoxRec by ID
 */
export async function getBoxerData(boxerId: string, cookieString: string) {
  const url = `${BOXREC_URL}/en/proboxer/${boxerId}`

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Cookie: cookieString,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch boxer data: ${response.status}`)
  }

  const html = await response.text()
  return parseBoxerProfile(html, boxerId)
}

/**
 * Searches for boxers by name
 */
export async function searchBoxers(query: string, cookieString: string) {
  const url = `${BOXREC_URL}/en/search?p%5Bfirst_name%5D=${encodeURIComponent(query)}&p%5Blast_name%5D=&p%5Brole%5D=proboxer&p%5Bstatus%5D=&p%5Bcountry%5D=&p%5Bdivision%5D=&p%5Bsex%5D=&p%5Bstance%5D=&p%5Bresidence%5D=&p%5Bbirthplace%5D=`

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Cookie: cookieString,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to search boxers: ${response.status}`)
  }

  const html = await response.text()
  return parseSearchResults(html)
}

/**
 * Gets ratings for a specific weight division
 */
export async function getRatings(division: string, cookieString: string) {
  const divisionMap: Record<string, string> = {
    heavyweight: "4",
    cruiserweight: "3",
    lightheavyweight: "12",
    supermiddleweight: "15",
    middleweight: "13",
    superwelterweight: "16",
    welterweight: "17",
    superLightweight: "14",
    lightweight: "11",
    superfeatherweight: "S",
    featherweight: "8",
    superbantamweight: "E",
    bantamweight: "7",
    superflyweight: "D",
    flyweight: "9",
    lightflyweight: "10",
    minimumweight: "M",
  }

  const divisionCode = divisionMap[division.toLowerCase()] || division
  const url = `${BOXREC_URL}/en/ratings?division=${divisionCode}`

  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      Cookie: cookieString,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch ratings: ${response.status}`)
  }

  const html = await response.text()
  return parseRatings(html, division)
}

/**
 * Parses boxer profile HTML
 */
function parseBoxerProfile(html: string, boxerId: string) {
  const $ = cheerio.load(html)

  // Basic info
  const name = $(".boxerTitle h1").text().trim()
  const nickname = $(".boxerTitle span.nickname").text().trim().replace(/"/g, "")

  // Record
  const recordText = $(".profileWLD .bgW, .profileWLD .bgL, .profileWLD .bgD")
    .map((_, el) => $(el).text().trim())
    .get()
    .join("")
  const recordMatch = recordText.match(/(\d+)-(\d+)-(\d+)/)
  const record = recordMatch
    ? {
        wins: Number.parseInt(recordMatch[1]),
        losses: Number.parseInt(recordMatch[2]),
        draws: Number.parseInt(recordMatch[3]),
      }
    : { wins: 0, losses: 0, draws: 0 }

  // KOs
  const koText = $(".profileWLD .textWon").text()
  const koMatch = koText.match(/(\d+)KOs/)
  const kos = koMatch ? Number.parseInt(koMatch[1]) : 0

  // Personal info
  const infoTable = $(".dataTable")
  const personalInfo: Record<string, string> = {}

  infoTable.find("tr").each((_, row) => {
    const key = $(row).find("th").text().trim().toLowerCase().replace(/\s+/g, "_")
    const value = $(row).find("td").text().trim()
    if (key && value) {
      personalInfo[key] = value
    }
  })

  // Bouts
  const bouts: any[] = []
  $(".dataTable.fighterTable tbody tr").each((_, row) => {
    const date = $(row).find("td").eq(0).text().trim()
    const opponent = $(row).find('td a[href*="/proboxer/"]').text().trim()
    const opponentId = $(row).find('td a[href*="/proboxer/"]').attr("href")?.split("/").pop() || ""
    const result = $(row).find("td").eq(6).text().trim()

    if (date && opponent) {
      bouts.push({
        date,
        opponent,
        opponent_id: opponentId,
        result,
      })
    }
  })

  return {
    id: boxerId,
    name,
    nickname,
    record,
    kos,
    personal_info: personalInfo,
    bouts,
  }
}

/**
 * Parses search results HTML
 */
function parseSearchResults(html: string) {
  const $ = cheerio.load(html)
  const results: any[] = []

  $(".dataTable tbody tr").each((_, row) => {
    const nameEl = $(row).find('td a[href*="/proboxer/"]')
    const name = nameEl.text().trim()
    const id = nameEl.attr("href")?.split("/").pop() || ""

    const record = $(row).find("td").eq(3).text().trim()
    const lastFight = $(row).find("td").eq(4).text().trim()

    if (name && id) {
      results.push({
        id,
        name,
        record,
        last_fight: lastFight,
      })
    }
  })

  return results
}

/**
 * Parses ratings HTML
 */
function parseRatings(html: string, division: string) {
  const $ = cheerio.load(html)
  const ratings: any[] = []

  $(".dataTable tbody tr").each((_, row) => {
    const rank = $(row).find("td").eq(0).text().trim()
    const nameEl = $(row).find('td a[href*="/proboxer/"]')
    const name = nameEl.text().trim()
    const id = nameEl.attr("href")?.split("/").pop() || ""

    const points = $(row).find("td").eq(3).text().trim()
    const record = $(row).find("td").eq(5).text().trim()

    if (name && id) {
      ratings.push({
        rank: Number.parseInt(rank) || 0,
        id,
        name,
        points: Number.parseFloat(points) || 0,
        record,
      })
    }
  })

  return {
    division,
    ratings,
  }
}
