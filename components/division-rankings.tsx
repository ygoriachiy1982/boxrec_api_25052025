"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Loader2, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useBoxrecApi } from "@/hooks/use-boxrec-api"
import { BoxerProfile } from "./boxer-profile"

const DIVISIONS = [
  { value: "heavyweight", label: "Heavyweight" },
  { value: "cruiserweight", label: "Cruiserweight" },
  { value: "lightheavyweight", label: "Light Heavyweight" },
  { value: "supermiddleweight", label: "Super Middleweight" },
  { value: "middleweight", label: "Middleweight" },
  { value: "superwelterweight", label: "Super Welterweight" },
  { value: "welterweight", label: "Welterweight" },
  { value: "superLightweight", label: "Super Lightweight" },
  { value: "lightweight", label: "Lightweight" },
  { value: "superfeatherweight", label: "Super Featherweight" },
  { value: "featherweight", label: "Featherweight" },
  { value: "superbantamweight", label: "Super Bantamweight" },
  { value: "bantamweight", label: "Bantamweight" },
  { value: "superflyweight", label: "Super Flyweight" },
  { value: "flyweight", label: "Flyweight" },
  { value: "lightflyweight", label: "Light Flyweight" },
  { value: "minimumweight", label: "Minimumweight" },
]

export function DivisionRankings() {
  const [selectedDivision, setSelectedDivision] = useState("heavyweight")
  const [rankings, setRankings] = useState<any>(null)
  const [selectedBoxer, setSelectedBoxer] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const { getRatings, getBoxer } = useBoxrecApi()

  useEffect(() => {
    if (isAuthenticated && selectedDivision) {
      loadRankings(selectedDivision)
    }
  }, [isAuthenticated, selectedDivision])

  const loadRankings = async (division: string) => {
    setIsLoading(true)
    const ratingsData = await getRatings(division)
    if (ratingsData) {
      setRankings(ratingsData)
    }
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
            <Trophy className="h-5 w-5" />
            Division Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Please authenticate to view division rankings</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Division Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Select value={selectedDivision} onValueChange={setSelectedDivision}>
              <SelectTrigger>
                <SelectValue placeholder="Select a division" />
              </SelectTrigger>
              <SelectContent>
                {DIVISIONS.map((division) => (
                  <SelectItem key={division.value} value={division.value}>
                    {division.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Loading rankings...
              </div>
            ) : rankings ? (
              <div className="space-y-2">
                <h3 className="font-medium capitalize mb-3">{rankings.division} Division - Top 15</h3>
                {rankings.ratings.slice(0, 15).map((boxer: any) => (
                  <div
                    key={boxer.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={boxer.rank <= 3 ? "default" : "secondary"}
                        className={
                          boxer.rank === 1
                            ? "bg-yellow-500"
                            : boxer.rank === 2
                              ? "bg-gray-400"
                              : boxer.rank === 3
                                ? "bg-amber-600"
                                : ""
                        }
                      >
                        #{boxer.rank}
                      </Badge>
                      <div>
                        <div className="font-medium">{boxer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {boxer.record} • {boxer.points} pts
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewBoxer(boxer.id)}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {selectedBoxer && <BoxerProfile boxer={selectedBoxer} onClose={() => setSelectedBoxer(null)} />}
    </div>
  )
}
