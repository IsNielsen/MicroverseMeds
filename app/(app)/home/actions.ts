'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  getGrowthStageNumber,
  shouldTreeGrow,
} from '@/lib/gamification/tree'
import type { GrowthStage } from '@/types/gamification'

export async function logDose(medicationId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    // 1. Insert dose record
    const { data: dose, error: doseError } = await supabase
      .from('doses')
      .insert({
        medication_id: medicationId,
        user_id: user.id,
        logged_at: new Date().toISOString(),
        hp_earned: 10, // Base HP
        was_on_time: true, // TODO: Calculate based on time window
      })
      .select()
      .single()

    if (doseError) throw doseError

    // 2. Get current profile state
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) throw new Error('Profile not found')

    // 3. Calculate new values
    const newTotalDoses = (profile.total_doses_logged ?? 0) + 1
    const newHP = (profile.health_points ?? 0) + 10
    const newGrowthStage = getGrowthStageNumber(newTotalDoses)

    // 4. Update profile stats
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        health_points: newHP,
        total_doses_logged: newTotalDoses,
        tree_growth_stage: newGrowthStage,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (updateError) throw updateError

    // 5. Check for tree growth (trigger notification)
    if (newGrowthStage > (profile.tree_growth_stage ?? 1)) {
      // Tree grew! Record the achievement
      const { data: action } = await supabase
        .from('actions')
        .select('id')
        .eq('title', `REACH_TIER_${newGrowthStage}`)
        .single()

      if (action?.id) {
        await supabase.from('events').insert({
          user_id: user.id,
          action_id: action.id,
          hp_earned: 25,
          metadata: { new_stage: newGrowthStage },
        })
      }
    }

    // 6. Update streak (simplified - just increment for now)
    // TODO: Add proper streak calculation based on consecutive days
    const newStreak = (profile.current_streak ?? 0) + 1
    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: Math.max(newStreak, profile.longest_streak ?? 0),
      })
      .eq('id', user.id)

    // 7. Record action event
    const { data: logDoseAction } = await supabase
      .from('actions')
      .select('id')
      .eq('title', 'LOG_DOSE')
      .single()

    if (logDoseAction) {
      await supabase.from('events').insert({
        user_id: user.id,
        action_id: logDoseAction.id,
        hp_earned: 10,
        metadata: { dose_id: dose.id, medication_id: medicationId },
      })
    }

    // 9. Revalidate the page
    revalidatePath('/home')

    return {
      success: true,
      hpEarned: 10,
      newHP,
      treeGrew: newGrowthStage > (profile.tree_growth_stage ?? 1),
    }
  } catch (error: any) {
    console.error('Error logging dose:', error)
    return { error: error.message }
  }
}
