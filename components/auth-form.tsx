"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function AuthForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const { isAuthenticated, isLoading, error, authenticate, logout } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      await authenticate(username, password)
      // Clear form on success
      if (!error) {
        setUsername("")
        setPassword("")
      }
    }
  }

  if (isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Authenticated
          </CardTitle>
          <CardDescription>You are connected to BoxRec API</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={logout} variant="outline" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>BoxRec Authentication</CardTitle>
        <CardDescription>Enter your BoxRec.com credentials to access boxing data</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">BoxRec Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your BoxRec username"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">BoxRec Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your BoxRec password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Connect to BoxRec"
            )}
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          Your credentials are only used to authenticate with BoxRec and are not stored.
        </div>
      </CardContent>
    </Card>
  )
}
