"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Trophy, Target, Calendar, MapPin, Ruler, Weight } from "lucide-react"

interface BoxerProfileProps {
  boxer: any
  onClose: () => void
}

export function BoxerProfile({ boxer, onClose }: BoxerProfileProps) {
  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-blue-50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              {boxer.name}
              {boxer.nickname && <span className="text-lg text-muted-foreground ml-2">"{boxer.nickname}"</span>}
            </CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Record & Stats */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Professional Record
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-green-600">
                  {boxer.record.wins}W
                </Badge>
                <Badge variant="destructive">{boxer.record.losses}L</Badge>
                <Badge variant="secondary">{boxer.record.draws}D</Badge>
                <Badge variant="outline">{boxer.kos} KOs</Badge>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <div className="space-y-2 text-sm">
                {boxer.personal_info.nationality && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    <span className="font-medium">Nationality:</span>
                    <span>{boxer.personal_info.nationality}</span>
                  </div>
                )}
                {boxer.personal_info.birth_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span className="font-medium">Born:</span>
                    <span>{boxer.personal_info.birth_date}</span>
                  </div>
                )}
                {boxer.personal_info.height && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3 w-3" />
                    <span className="font-medium">Height:</span>
                    <span>{boxer.personal_info.height}</span>
                  </div>
                )}
                {boxer.personal_info.reach && (
                  <div className="flex items-center gap-2">
                    <Target className="h-3 w-3" />
                    <span className="font-medium">Reach:</span>
                    <span>{boxer.personal_info.reach}</span>
                  </div>
                )}
                {boxer.personal_info.division && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-3 w-3" />
                    <span className="font-medium">Division:</span>
                    <span className="capitalize">{boxer.personal_info.division}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Bouts */}
          <div>
            <h3 className="font-semibold mb-2">Recent Bouts</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {boxer.bouts.slice(0, 10).map((bout: any, index: number) => (
                <div key={index} className="p-2 border rounded text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{bout.opponent}</div>
                      <div className="text-muted-foreground">{bout.date}</div>
                    </div>
                    <Badge
                      variant={
                        bout.result.includes("W") ? "default" : bout.result.includes("L") ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      {bout.result}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
