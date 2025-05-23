"use client"

import { useState } from "react"

const API_BASE = "https://v0-box-rec-api-setup.m5dzpbqd.vercel.app"

export function useBoxrecApi() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "API request failed"
      setError(errorMessage)
      console.error("API Error:", errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const getBoxer = async (id: string) => {
    return apiRequest(`/api/boxer/${id}`)
  }

  const searchBoxers = async (query: string) => {
    const encodedQuery = encodeURIComponent(query)
    return apiRequest(`/api/search?query=${encodedQuery}`)
  }

  const getRatings = async (division: string) => {
    return apiRequest(`/api/ratings/${division}`)
  }

  return {
    getBoxer,
    searchBoxers,
    getRatings,
    isLoading,
    error,
  }
}
