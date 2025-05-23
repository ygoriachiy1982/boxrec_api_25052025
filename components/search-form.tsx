"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { SearchResults } from "./search-results"
import { useBoxrecApi } from "@/hooks/use-boxrec-api"

export function SearchForm() {
  const [query, setQuery] = useState("")
  const { isAuthenticated } = useAuth()
  const { searchBoxers, isLoading, error } = useBoxrecApi()
  const [results, setResults] = useState<any[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && isAuthenticated) {
      const searchResults = await searchBoxers(query.trim())
      if (searchResults) {
        setResults(searchResults)
      }
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Boxers
          </CardTitle>
          <CardDescription>Find professional boxers by name</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter boxer name (e.g., Canelo, Tyson Fury)"
              disabled={!isAuthenticated || isLoading}
            />
            <Button type="submit" className="w-full" disabled={!isAuthenticated || isLoading || !query.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>

          {!isAuthenticated && (
            <div className="mt-4 text-sm text-muted-foreground text-center">
              Please authenticate with BoxRec to search
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && <SearchResults results={results} />}
    </div>
  )
}
