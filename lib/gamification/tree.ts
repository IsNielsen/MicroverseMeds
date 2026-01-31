import type { GrowthStage } from '@/types/gamification'

export function getGrowthStageNumber(totalDoses: number): GrowthStage {
  const safeTotal = Number.isFinite(totalDoses) ? Math.max(0, totalDoses) : 0
  return Math.max(1, Math.floor(safeTotal))
}

export function getDosesToNextStage(totalDoses: number): number {
  return 1
}

export function shouldTreeGrow(
  currentStage: GrowthStage,
  totalDoses: number
): boolean {
  const calculatedStage = getGrowthStageNumber(totalDoses)
  return calculatedStage > currentStage
}
