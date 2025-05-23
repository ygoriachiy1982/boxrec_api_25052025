"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Eye } from "lucide-react"
import { useState } from "react"
import { BoxerProfile } from "./boxer-profile"
import { useBoxrecApi } from "@/hooks/use-boxrec-api"

interface SearchResult {
  id: string
  name: string
  record: string
  last_fight: string
}

interface SearchResultsProps {
  results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  const [selectedBoxer, setSelectedBoxer] = useState<any>(null)
  const [isLoadingBoxer, setIsLoadingBoxer] = useState(false)
  const { getBoxer } = useBoxrecApi()

  const handleViewBoxer = async (boxerId: string) => {
    setIsLoadingBoxer(true)
    const boxer = await getBoxer(boxerId)
    if (boxer) {
      setSelectedBoxer(boxer)
    }
    setIsLoadingBoxer(false)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Search Results ({results.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{result.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{result.record}</Badge>
                    {result.last_fight && (
                      <span className="text-sm text-muted-foreground">Last fight: {result.last_fight}</span>
                    )}
                  </div>
                </div>
                <Button size="sm" onClick={() => handleViewBoxer(result.id)} disabled={isLoadingBoxer}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedBoxer && <BoxerProfile boxer={selectedBoxer} onClose={() => setSelectedBoxer(null)} />}
    </div>
  )
}
