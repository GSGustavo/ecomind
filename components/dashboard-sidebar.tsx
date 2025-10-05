"use client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Download, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react"
import type { VulnerabilityType } from "@/lib/types"
import { vulnerabilityColors } from "@/lib/vulnerability-colors"

interface DashboardSidebarProps {
  selectedTypes: VulnerabilityType[]
  onTypeChange: (types: VulnerabilityType[]) => void
  severityFilter: number
  onSeverityChange: (value: number) => void
  onReset: () => void
  onExport: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

const allVulnerabilityTypes: VulnerabilityType[] = [
  "Air Pollution",
  "Water Pollution",
  "Heat Island",
  "Lack of Green Areas",
  "Poor Transport Access",
  "Health Infrastructure Deficiency",
  "Education Deficiency",
]

export function DashboardSidebar({
  selectedTypes,
  onTypeChange,
  severityFilter,
  onSeverityChange,
  onReset,
  onExport,
  isCollapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  if (isCollapsed) {
    return (
      <div className="flex h-full w-12 flex-col items-center border-r border-border bg-card py-4">
        <Button variant="ghost" size="icon" onClick={onToggleCollapse} className="mb-4">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">Filters & Controls</h2>
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          {/* Vulnerability Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Vulnerability Types</Label>
            <div className="space-y-2">
              {allVulnerabilityTypes.map((type) => {
                const isSelected = selectedTypes.includes(type)
                const color = vulnerabilityColors[type]

                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (isSelected) {
                        onTypeChange(selectedTypes.filter((t) => t !== type))
                      } else {
                        onTypeChange([...selectedTypes, type])
                      }
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm transition-colors ${
                      isSelected ? "border-primary bg-primary/10" : "border-border bg-background hover:bg-accent"
                    }`}
                  >
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="flex-1">{type}</span>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Severity Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Minimum Severity Level</Label>
            <div className="space-y-2">
              <Slider
                value={[severityFilter]}
                onValueChange={(values) => onSeverityChange(values[0])}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low (0)</span>
                <span className="font-medium text-foreground">{severityFilter.toFixed(1)}</span>
                <span>Critical (1)</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Severity Legend</Label>
            <div className="space-y-2 rounded-lg border border-border bg-background p-3">
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-[#E74C3C]" />
                <span>Critical (0.8 - 1.0)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-[#E67E22]" />
                <span>High (0.6 - 0.8)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-[#F1C40F]" />
                <span>Medium (0.4 - 0.6)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="h-3 w-3 rounded-full bg-[#2ECC71]" />
                <span>Low (0 - 0.4)</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Action Buttons */}
      <div className="space-y-2 border-t border-border p-4">
        <Button variant="outline" className="w-full bg-transparent" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset Filters
        </Button>
        <Button className="w-full bg-[#0B3D91] hover:bg-[#0B3D91]/90" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>
    </div>
  )
}
