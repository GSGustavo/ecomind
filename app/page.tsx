"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { VulnerabilityCheckbox } from "@/components/vulnerability-checkbox"
import { Globe, Satellite, TrendingUp } from "lucide-react"
import type { VulnerabilityType } from "@/lib/types"
import locationsData from "@/data/locations.json"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image";

const vulnerabilityTypes: VulnerabilityType[] = [
  "Lack of Green Areas",
  "Air Pollution",
  // "Water Pollution",
  // "Heat Islands",

  // "Poor Transport Access",
  // "Health Infrastructure Deficiency",
  // "Education Deficiency",
]

export default function HomePage() {
  const router = useRouter()
  const [country, setCountry] = useState<string>("")
  const [state, setState] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [selectedVulnerabilities, setSelectedVulnerabilities] = useState<Set<VulnerabilityType>>(new Set())

  const countries = Object.keys(locationsData)
  const states = country ? Object.keys(locationsData[country as keyof typeof locationsData] || {}) : []
  const cities =
    country && state ? (locationsData[country as keyof typeof locationsData]?.[state as never] as string[]) || [] : []

  const handleVulnerabilityToggle = (type: VulnerabilityType, checked: boolean) => {
    const newSet = new Set(selectedVulnerabilities)
    if (checked) {
      newSet.add(type)
    } else {
      newSet.delete(type)
    }
    setSelectedVulnerabilities(newSet)
  }

  const handleAnalyze = () => {
    if (!country || !state || !city || selectedVulnerabilities.size === 0) {
      return
    }

    const params = new URLSearchParams({
      country,
      state,
      city,
      vulnerabilities: Array.from(selectedVulnerabilities).join(","),
    })

    router.push(`/dashboard?${params.toString()}`)
  }

  const isFormValid = country && state && city && selectedVulnerabilities.size > 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-nasa-blue">
              <Image
                src="/logo.png"     
                alt="EcoMind Logo"
                width={200}         
                height={200}        
                priority
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">EcoMind</h1>
              <p className="text-xs text-muted-foreground">Powered by NASA Data</p>
            </div>
          </div>

          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl">
              Select Your Region
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-pretty">
              Explore your city's environmental health using NASA open data and simulate positive changes. Analyze
              vulnerabilities, visualize impact zones, and test urban improvement scenarios powered by AI.
            </p>
          </div>

          {/* Step 1: Location Selection */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nasa-blue text-sm font-bold text-white">
                  1
                </div>
                <div>
                  <CardTitle>Choose Location</CardTitle>
                  <CardDescription>Select your country, state, and city</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Country</label>
                  <Select
                    value={country}
                    onValueChange={(value) => {
                      setCountry(value)
                      setState("")
                      setCity("")
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">State / Province</label>
                  <Select
                    value={state}
                    onValueChange={(value) => {
                      setState(value)
                      setCity("")
                    }}
                    disabled={!country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">City</label>
                  <Select value={city} onValueChange={setCity} disabled={!state}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Vulnerability Selection */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nasa-blue text-sm font-bold text-white">
                  2
                </div>
                <div>
                  <CardTitle>Select Vulnerabilities</CardTitle>
                  <CardDescription>Choose environmental factors to analyze</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 cursor-pointer">
                {vulnerabilityTypes.map((type) => (
                  <VulnerabilityCheckbox
                    key={type}
                    type={type}
                    checked={selectedVulnerabilities.has(type)}
                    onCheckedChange={(checked) => handleVulnerabilityToggle(type, checked)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Analyze Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className="bg-chart-6 hover:bg-chart-6 cursor-pointer"
            >
              <Globe className="mr-2 h-5 w-5" />
              Analyze Region
            </Button>
          </div>

          {/* Info Cards */}
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Satellite className="mb-2 h-8 w-8 text-nasa-blue" />
                <CardTitle className="text-lg">NASA Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real environmental data from NASA satellites and open datasets for accurate analysis.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="mb-2 h-8 w-8 text-eco-green" />
                <CardTitle className="text-lg">Interactive Maps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Visualize vulnerabilities on interactive maps with detailed markers and severity indicators.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <TrendingUp className="mb-2 h-8 w-8 text-warm-yellow" />
                <CardTitle className="text-lg">AI Simulations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Test urban improvements with AI-powered simulations and see projected environmental impact.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
