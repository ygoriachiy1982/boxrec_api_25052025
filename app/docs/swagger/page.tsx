"use client"

import { useEffect, useRef } from "react"

declare global {
  interface Window {
    SwaggerUIBundle: any
  }
}

export default function SwaggerPage() {
  const swaggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Swagger UI CSS and JS
    const loadSwaggerUI = async () => {
      // Load CSS
      const link = document.createElement("link")
      link.rel = "stylesheet"
      link.href = "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css"
      document.head.appendChild(link)

      // Load JS
      const script = document.createElement("script")
      script.src = "https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"
      script.onload = () => {
        if (window.SwaggerUIBundle && swaggerRef.current) {
          window.SwaggerUIBundle({
            url: "/api/docs/swagger.json",
            dom_id: "#swagger-ui",
            presets: [window.SwaggerUIBundle.presets.apis, window.SwaggerUIBundle.presets.standalone],
            layout: "StandaloneLayout",
            deepLinking: true,
            showExtensions: true,
            showCommonExtensions: true,
          })
        }
      }
      document.head.appendChild(script)
    }

    loadSwaggerUI()

    return () => {
      // Cleanup
      const links = document.querySelectorAll('link[href*="swagger-ui"]')
      const scripts = document.querySelectorAll('script[src*="swagger-ui"]')
      links.forEach((link) => link.remove())
      scripts.forEach((script) => script.remove())
    }
  }, [])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">BoxRec API Documentation</h1>
        <p className="mb-6 text-muted-foreground">Interactive API documentation powered by Swagger UI</p>
      </div>
      <div id="swagger-ui" ref={swaggerRef} />
    </div>
  )
}
