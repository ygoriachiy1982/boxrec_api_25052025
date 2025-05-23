interface BoxrecClientConfig {
  baseUrl: string
  timeout?: number
}

interface BoxerProfile {
  id: string
  name: string
  nickname: string
  record: {
    wins: number
    losses: number
    draws: number
  }
  kos: number
  personal_info: Record<string, string>
  bouts: any[]
}

interface SearchResult {
  id: string
  name: string
  record: string
  last_fight: string
}

interface RatingsResponse {
  division: string
  ratings: {
    rank: number
    id: string
    name: string
    points: number
    record: string
  }[]
}

export class BoxrecApiClient {
  private baseUrl: string
  private timeout: number

  constructor(config: BoxrecClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "")
    this.timeout = config.timeout || 30000
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return response.json()
    } catch (error) {
      clearTimeout(timeoutId)
      throw error
    }
  }

  /**
   * Authenticate with BoxRec credentials
   */
  async authenticate(username: string, password: string): Promise<{ success: boolean; message: string }> {
    return this.request("/api/auth", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  /**
   * Get boxer profile by ID
   */
  async getBoxer(id: string): Promise<BoxerProfile> {
    return this.request(`/api/boxer/${id}`)
  }

  /**
   * Search for boxers by name
   */
  async searchBoxers(query: string): Promise<SearchResult[]> {
    const encodedQuery = encodeURIComponent(query)
    return this.request(`/api/search?query=${encodedQuery}`)
  }

  /**
   * Get ratings for a weight division
   */
  async getRatings(division: string): Promise<RatingsResponse> {
    return this.request(`/api/ratings/${division}`)
  }

  /**
   * Batch fetch multiple boxers
   */
  async getBatchBoxers(ids: string[]): Promise<BoxerProfile[]> {
    const promises = ids.map((id) => this.getBoxer(id))
    return Promise.all(promises)
  }

  /**
   * Get top boxers from multiple divisions
   */
  async getTopBoxersAcrossDivisions(
    divisions: string[],
    limit = 10,
  ): Promise<Record<string, RatingsResponse["ratings"]>> {
    const promises = divisions.map(async (division) => {
      const ratings = await this.getRatings(division)
      return [division, ratings.ratings.slice(0, limit)]
    })

    const results = await Promise.all(promises)
    return Object.fromEntries(results)
  }
}

// Factory function for creating client instances
export function createBoxrecClient(config: BoxrecClientConfig): BoxrecApiClient {
  return new BoxrecApiClient(config)
}

// Browser-specific client for frontend use
export function createBrowserClient(): BoxrecApiClient {
  return new BoxrecApiClient({
    baseUrl: typeof window !== "undefined" ? window.location.origin : "",
  })
}
