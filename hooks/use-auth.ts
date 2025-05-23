"use client"

import { useState, useEffect, createContext, useContext } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  authenticate: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const context = useContext(AuthContext)

  const authenticate = async (username: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://v0-box-rec-api-setup.m5dzpbqd.vercel.app/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      setIsAuthenticated(true)
      localStorage.setItem("boxrec_authenticated", "true")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("boxrec_authenticated")
  }

  // Check if user was previously authenticated
  useEffect(() => {
    const wasAuthenticated = localStorage.getItem("boxrec_authenticated")
    if (wasAuthenticated) {
      setIsAuthenticated(true)
    }
  }, [])

  if (!context) {
    // Return a default implementation when used outside provider
    return {
      isAuthenticated,
      isLoading,
      error,
      authenticate,
      logout,
    }
  }
  return context
}
