export interface Vulnerability {
  id: number
  city: string
  state: string
  country: string
  type: VulnerabilityType
  latitude: number
  longitude: number
  severity: number
  population_affected: number
  description: string
}

export type VulnerabilityType =
  | "Air Pollution"
  | "Water Pollution"
  | "Heat Island"
  | "Lack of Green Areas"
  | "Poor Transport Access"
  | "Health Infrastructure Deficiency"
  | "Education Deficiency"

export interface LocationData {
  country: string
  state: string
  city: string
}

export interface SimulationResult {
  improvement: string
  vulnerabilities: Vulnerability[]
  metrics: {
    airQualityImprovement: number
    heatReduction: number
    greenSpaceIncrease: number
    overallScore: number
  }
}
