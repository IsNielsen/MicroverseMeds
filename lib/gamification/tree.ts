import { GROWTH_STAGES } from '@/types/gamification'
import type { GrowthStage, GrowthStageInfo } from '@/types/gamification'

export function getGrowthStage(totalDoses: number): GrowthStageInfo {
  if (totalDoses >= 300) return GROWTH_STAGES[4]
  if (totalDoses >= 100) return GROWTH_STAGES[3]
  if (totalDoses >= 30) return GROWTH_STAGES[2]
  return GROWTH_STAGES[1]
}

export function getGrowthStageNumber(totalDoses: number): GrowthStage {
  return getGrowthStage(totalDoses).stage
}

export function getDosesToNextStage(totalDoses: number): number {
  const currentStage = getGrowthStage(totalDoses)

  if (currentStage.stage === 4) {
    return 0 // Max stage reached
  }

  const nextStage = GROWTH_STAGES[(currentStage.stage + 1) as GrowthStage]
  return nextStage.minDoses - totalDoses
}

export function shouldTreeGrow(
  currentStage: GrowthStage,
  totalDoses: number
): boolean {
  const calculatedStage = getGrowthStageNumber(totalDoses)
  return calculatedStage > currentStage
}
