import type { Vulnerability, SimulationResult } from "./types"

export function simulateImprovement(prompt: string, vulnerabilities: Vulnerability[]): SimulationResult {
  const lowerPrompt = prompt.toLowerCase()

  let improvement = ""
  let airQualityImprovement = 0
  let heatReduction = 0
  let greenSpaceIncrease = 0

  // Detect improvement type from prompt
  if (lowerPrompt.includes("tree") || lowerPrompt.includes("green") || lowerPrompt.includes("park")) {
    improvement = "Added green spaces and tree coverage"
    airQualityImprovement = 15
    heatReduction = 20
    greenSpaceIncrease = 35
  } else if (lowerPrompt.includes("transport") || lowerPrompt.includes("transit") || lowerPrompt.includes("bus")) {
    improvement = "Improved public transportation infrastructure"
    airQualityImprovement = 25
    heatReduction = 5
    greenSpaceIncrease = 0
  } else if (lowerPrompt.includes("traffic") || lowerPrompt.includes("car") || lowerPrompt.includes("vehicle")) {
    improvement = "Reduced vehicle traffic and emissions"
    airQualityImprovement = 30
    heatReduction = 10
    greenSpaceIncrease = 0
  } else if (lowerPrompt.includes("water") || lowerPrompt.includes("pollution")) {
    improvement = "Enhanced water treatment and pollution control"
    airQualityImprovement = 10
    heatReduction = 0
    greenSpaceIncrease = 5
  } else {
    improvement = "General environmental improvements"
    airQualityImprovement = 10
    heatReduction = 10
    greenSpaceIncrease = 10
  }

  // Apply improvements to vulnerabilities
  const improvedVulnerabilities = vulnerabilities.map((v) => {
    let newSeverity = v.severity

    if (v.type === "Air Pollution") {
      newSeverity = Math.max(0, v.severity - airQualityImprovement / 100)
    } else if (v.type === "Heat Island") {
      newSeverity = Math.max(0, v.severity - heatReduction / 100)
    } else if (v.type === "Lack of Green Areas") {
      newSeverity = Math.max(0, v.severity - greenSpaceIncrease / 100)
    } else if (v.type === "Poor Transport Access") {
      newSeverity = Math.max(0, v.severity - (lowerPrompt.includes("transport") ? 0.25 : 0))
    }

    return {
      ...v,
      severity: newSeverity,
    }
  })

  const overallScore =
    100 - (improvedVulnerabilities.reduce((sum, v) => sum + v.severity, 0) / improvedVulnerabilities.length) * 100

  return {
    improvement,
    vulnerabilities: improvedVulnerabilities,
    metrics: {
      airQualityImprovement,
      heatReduction,
      greenSpaceIncrease,
      overallScore: Math.round(overallScore),
    },
  }
}
