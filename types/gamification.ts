export type GrowthStage = 1 | 2 | 3 | 4
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

export const GROWTH_STAGES: Record<GrowthStage, GrowthStageInfo> = {
  1: {
    stage: 1,
    name: 'Sapling',
    minDoses: 0,
    maxDoses: 29,
    description: 'A tiny sapling just beginning its journey',
    trunkThickness: 'thin',
    height: 'short',
    branchCount: 2,
  },
  2: {
    stage: 2,
    name: 'Young Tree',
    minDoses: 30,
    maxDoses: 99,
    description: 'Growing strong with healthy branches',
    trunkThickness: 'medium',
    height: 'medium',
    branchCount: 5,
  },
  3: {
    stage: 3,
    name: 'Mature Tree',
    minDoses: 100,
    maxDoses: 299,
    description: 'A flourishing tree full of life',
    trunkThickness: 'thick',
    height: 'tall',
    branchCount: 8,
  },
  4: {
    stage: 4,
    name: 'Ancient Tree',
    minDoses: 300,
    maxDoses: Infinity,
    description: 'A majestic ancient tree, wise and enduring',
    trunkThickness: 'massive',
    height: 'towering',
    branchCount: 12,
    specialEffects: ['glowing_roots', 'mystical_aura'],
  },
}
