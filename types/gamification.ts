export type GrowthStage = number
export type Season = 'spring' | 'summer' | 'fall' | 'winter'

export interface TreeState {
  growthStage: GrowthStage
  totalDoses: number
  currentStreak: number
  healthPoints: number
}

export interface GrowthStageInfo {
  stage: GrowthStage
  name: string
  minDoses: number
  maxDoses: number
  description: string
  trunkThickness: 'thin' | 'medium' | 'thick' | 'massive'
  height: 'short' | 'medium' | 'tall' | 'towering'
  branchCount: number
  specialEffects?: string[]
}
