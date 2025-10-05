"use client"

import * as React from "react"
import type { Vulnerability } from "@/lib/types"
import { getSeverityColor, vulnerabilityColors } from "@/lib/vulnerability-colors"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"

interface MapViewProps {
  vulnerabilities: Vulnerability[]
  center: { lat: number; lng: number }
}

export function MapView({ vulnerabilities, center }: MapViewProps) {
  const mapRef = React.useRef<HTMLDivElement>(null)
  const [selectedVulnerability, setSelectedVulnerability] = React.useState<Vulnerability | null>(null)
  const [mapInstance, setMapInstance] = React.useState<any>(null)

  React.useEffect(() => {
    if (!mapRef.current) return

    // Load Mapbox GL JS
    const loadMapbox = async () => {
      // @ts-ignore
      if (typeof window !== "undefined" && !window.mapboxgl) {
        const mapboxgl = await import("mapbox-gl")
        // @ts-ignore
        window.mapboxgl = mapboxgl.default

        // Load Mapbox CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v3.0.1/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)
      }

      // @ts-ignore
      const mapboxgl = window.mapboxgl

      // Use a public Mapbox token (you can replace with your own)
      mapboxgl.accessToken = "pk.eyJ1IjoiZXhhbXBsZS11c2VyIiwiYSI6ImNrOHp5cjBvZjAyMnEzbW1yNjNmZmF3ZjYifQ.example"

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [center.lng, center.lat],
        zoom: 11,
      })

      map.on("load", () => {
        setMapInstance(map)
      })

      return () => map.remove()
    }

    loadMapbox()
  }, [center])

  React.useEffect(() => {
    if (!mapInstance) return

    // Clear existing markers
    const markers = document.querySelectorAll(".mapbox-marker")
    markers.forEach((marker) => marker.remove())

    // Add markers for each vulnerability
    vulnerabilities.forEach((vulnerability) => {
      // @ts-ignore
      const mapboxgl = window.mapboxgl

      const el = document.createElement("div")
      el.className = "mapbox-marker"
      el.style.width = "24px"
      el.style.height = "24px"
      el.style.borderRadius = "50%"
      el.style.backgroundColor = getSeverityColor(vulnerability.severity)
      el.style.border = "2px solid white"
      el.style.cursor = "pointer"
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)"

      el.addEventListener("click", () => {
        setSelectedVulnerability(vulnerability)
      })

      new mapboxgl.Marker(el).setLngLat([vulnerability.longitude, vulnerability.latitude]).addTo(mapInstance)
    })
  }, [mapInstance, vulnerabilities])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />

      {/* Vulnerability Detail Card */}
      {selectedVulnerability && (
        <Card className="absolute right-4 top-4 w-80 p-4 shadow-lg">
          <div className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: vulnerabilityColors[selectedVulnerability.type] }}
              />
              <h3 className="font-semibold">{selectedVulnerability.type}</h3>
            </div>
            <button
              onClick={() => setSelectedVulnerability(null)}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">
                {selectedVulnerability.city}, {selectedVulnerability.state}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">Severity Level</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedVulnerability.severity * 100}%`,
                      backgroundColor: getSeverityColor(selectedVulnerability.severity),
                    }}
                  />
                </div>
                <span className="font-medium">{(selectedVulnerability.severity * 100).toFixed(0)}%</span>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground">Population Affected</p>
              <p className="font-medium">{selectedVulnerability.population_affected.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-muted-foreground">Description</p>
              <p className="text-xs">{selectedVulnerability.description}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Map Controls Info */}
      <div className="absolute bottom-4 left-4 rounded-lg border border-border bg-card/90 p-3 text-xs backdrop-blur-sm">
        <p className="font-semibold">Map Controls</p>
        <p className="text-muted-foreground">Click markers to view details</p>
        <p className="text-muted-foreground">Scroll to zoom • Drag to pan</p>
      </div>
    </div>
  )
}
