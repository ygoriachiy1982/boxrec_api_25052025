import { createBoxrecClient, createBrowserClient } from "@/lib/boxrec-client"

// Example usage in Node.js environment
export async function serverExample() {
  const client = createBoxrecClient({
    baseUrl: "https://your-api-domain.com",
  })

  try {
    // Authenticate
    await client.authenticate("your_username", "your_password")

    // Get a specific boxer
    const boxer = await client.getBoxer("348759") // Tyson Fury
    console.log(`${boxer.name} (${boxer.nickname})`)
    console.log(`Record: ${boxer.record.wins}-${boxer.record.losses}-${boxer.record.draws}`)

    // Search for boxers
    const searchResults = await client.searchBoxers("Canelo")
    console.log(`Found ${searchResults.length} results for Canelo`)

    // Get heavyweight ratings
    const heavyweightRatings = await client.getRatings("heavyweight")
    console.log(`Top heavyweight: ${heavyweightRatings.ratings[0].name}`)

    // Batch fetch multiple boxers
    const boxerIds = ["348759", "356831", "348758"] // Multiple boxer IDs
    const boxers = await client.getBatchBoxers(boxerIds)
    boxers.forEach((boxer) => {
      console.log(`${boxer.name}: ${boxer.record.wins}-${boxer.record.losses}-${boxer.record.draws}`)
    })

    // Get top boxers across multiple divisions
    const topBoxers = await client.getTopBoxersAcrossDivisions(["heavyweight", "middleweight", "welterweight"], 5)

    Object.entries(topBoxers).forEach(([division, boxers]) => {
      console.log(`\n${division.toUpperCase()}:`)
      boxers.forEach((boxer, index) => {
        console.log(`${index + 1}. ${boxer.name} (${boxer.points} points)`)
      })
    })
  } catch (error) {
    console.error("API Error:", error)
  }
}

// Example usage in browser environment
export async function browserExample() {
  const client = createBrowserClient()

  try {
    // Authenticate with user input
    const username = prompt("Enter BoxRec username:")
    const password = prompt("Enter BoxRec password:")

    if (username && password) {
      await client.authenticate(username, password)

      // Now you can use the authenticated client
      const searchResults = await client.searchBoxers("Muhammad Ali")
      console.log("Search results:", searchResults)
    }
  } catch (error) {
    console.error("Browser API Error:", error)
  }
}
