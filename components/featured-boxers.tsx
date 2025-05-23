"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Eye, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useBoxrecApi } from "@/hooks/use-boxrec-api"
import { BoxerProfile } from "./boxer-profile"

const FEATURED_BOXER_IDS = [
  "348759", // Tyson Fury
  "356831", // Canelo Alvarez
  "348758", // Anthony Joshua
  "659461", // Gervonta Davis
]

export function FeaturedBoxers() {
  const [featuredBoxers, setFeaturedBoxers] = useState<any[]>([])
  const [selectedBoxer, setSelectedBoxer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { getBoxer } = useBoxrecApi()

  useEffect(() => {
    if (isAuthenticated) {
      loadFeaturedBoxers()
    }
  }, [isAuthenticated])

  const loadFeaturedBoxers = async () => {
    setIsLoading(true)
    const boxers = []

    for (const id of FEATURED_BOXER_IDS) {
      try {
        const boxer = await getBoxer(id)
        if (boxer) {
          boxers.push(boxer)
        }
      } catch (error) {
        console.error(`Failed to load boxer ${id}:`, error)
      }
    }

    setFeaturedBoxers(boxers)
    setIsLoading(false)
  }

  const handleViewBoxer = async (boxerId: string) => {
    const boxer = await getBoxer(boxerId)
    if (boxer) {
      setSelectedBoxer(boxer)
    }
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Featured Boxers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Please authenticate to view featured boxers</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Featured Boxers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading featured boxers...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredBoxers.map((boxer) => (
                <div key={boxer.id} className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">{boxer.name}</h3>
                      {boxer.nickname && <p className="text-sm text-muted-foreground">"{boxer.nickname}"</p>}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewBoxer(boxer.id)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-600">
                      {boxer.record.wins}W
                    </Badge>
                    <Badge variant="destructive">{boxer.record.losses}L</Badge>
                    <Badge variant="secondary">{boxer.record.draws}D</Badge>
                    <Badge variant="outline">{boxer.kos} KOs</Badge>
                  </div>
                  {boxer.personal_info.division && (
                    <div className="mt-2">
                      <Badge variant="outline" className="capitalize">
                        {boxer.personal_info.division}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBoxer && <BoxerProfile boxer={selectedBoxer} onClose={() => setSelectedBoxer(null)} />}
    </div>
  )
}
