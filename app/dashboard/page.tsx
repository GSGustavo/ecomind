"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Satellite, Home, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { MapView } from "@/components/map-view"
import { AIChatPanel } from "@/components/ai-chat-panel"
import { VulnerabilityCharts } from "@/components/vulnerability-charts"
import type { VulnerabilityType, Vulnerability, SimulationResult } from "@/lib/types"
import vulnerabilitiesData from "@/data/mock-vulnerabilities.json"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const country = searchParams.get("country") || ""
  const state = searchParams.get("state") || ""
  const city = searchParams.get("city") || ""
  const initialVulnerabilities = (searchParams.get("vulnerabilities")?.split(",") as VulnerabilityType[]) || []

  const [selectedTypes, setSelectedTypes] = React.useState<VulnerabilityType[]>(initialVulnerabilities)
  const [severityFilter, setSeverityFilter] = React.useState(0)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [simulatedVulnerabilities, setSimulatedVulnerabilities] = React.useState<Vulnerability[] | null>(null)
  const [showCharts, setShowCharts] = React.useState(true)

  // Filter vulnerabilities based on location and filters
  const baseVulnerabilities = React.useMemo(() => {
    return (vulnerabilitiesData as Vulnerability[]).filter((v) => {
      const matchesLocation = v.city === city && v.state === state && v.country === country
      return matchesLocation
    })
  }, [city, state, country])

  const displayVulnerabilities = simulatedVulnerabilities || baseVulnerabilities

  const filteredVulnerabilities = React.useMemo(() => {
    return displayVulnerabilities.filter((v) => {
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(v.type)
      const matchesSeverity = v.severity >= severityFilter
      return matchesType && matchesSeverity
    })
  }, [displayVulnerabilities, selectedTypes, severityFilter])

  // Calculate map center from vulnerabilities
  const mapCenter = React.useMemo(() => {
    if (filteredVulnerabilities.length === 0) {
      return { lat: 40.7128, lng: -74.006 } // Default to NYC
    }
    const avgLat = filteredVulnerabilities.reduce((sum, v) => sum + v.latitude, 0) / filteredVulnerabilities.length
    const avgLng = filteredVulnerabilities.reduce((sum, v) => sum + v.longitude, 0) / filteredVulnerabilities.length
    return { lat: avgLat, lng: avgLng }
  }, [filteredVulnerabilities])

  const handleReset = () => {
    setSelectedTypes(initialVulnerabilities)
    setSeverityFilter(0)
    setSimulatedVulnerabilities(null)
  }

  const handleExport = () => {
    alert("Export functionality would generate a PDF report here")
  }

  const handleSimulationApply = (result: SimulationResult) => {
    setSimulatedVulnerabilities(result.vulnerabilities)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Navbar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="h-9 w-9">
            <Home className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0B3D91]">
              <Satellite className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">EcoMind Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                {city}, {state}, {country}
                {simulatedVulnerabilities && <span className="ml-2 text-[#2ECC71]">(Simulated)</span>}
              </p>
            </div>
          </div>
        </div>
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <DashboardSidebar
          selectedTypes={selectedTypes}
          onTypeChange={setSelectedTypes}
          severityFilter={severityFilter}
          onSeverityChange={setSeverityFilter}
          onReset={handleReset}
          onExport={handleExport}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Dashboard Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Top Section: Map + AI Chat */}
          <div className="flex flex-1 overflow-hidden">
            {/* Map Container */}
            <div className="flex-1 bg-muted/20 p-6">
              {/* <MapView vulnerabilities={filteredVulnerabilities} center={mapCenter} /> */}
            </div>

            {/* AI Chat Panel */}
            <div className="w-96 border-l border-border bg-background p-4">
              <AIChatPanel vulnerabilities={baseVulnerabilities} onSimulationApply={handleSimulationApply} />
            </div>
          </div>

          {/* Bottom Section: Charts (Collapsible) */}
          <div className="border-t border-border bg-card">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-accent"
            >
              <h2 className="font-semibold">Data Visualization & Analytics</h2>
              {showCharts ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </button>

            {showCharts && (
              <div className="max-h-[500px] overflow-y-auto p-6">
                <VulnerabilityCharts
                  vulnerabilities={baseVulnerabilities}
                  simulatedVulnerabilities={simulatedVulnerabilities}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
