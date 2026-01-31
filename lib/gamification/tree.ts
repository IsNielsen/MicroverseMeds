import type { GrowthStage } from '@/types/gamification'

export function getGrowthStageNumber(totalDoses: number): GrowthStage {
  const safeTotal = Number.isFinite(totalDoses) ? Math.max(0, totalDoses) : 0
  
  // Initial growth stages 1-5
  if (safeTotal < 6) {
    return Math.max(1, Math.floor(safeTotal))
  }
  
  // Cycle between stages 6-19 (14 stages total)
  // Once we reach stage 19, cycle back to 6
  return ((Math.floor(safeTotal) - 6) % 14) + 6
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
