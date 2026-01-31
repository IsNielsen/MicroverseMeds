'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { encryptText } from '@/lib/encryption'

export interface AddMedicationInput {
  medicationName: string
  nickname: string
  frequency: string
  color: string
}

export async function addMedication(input: AddMedicationInput) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    // Encrypt the medication name (PHI)
    const { encrypted, iv, authTag } = encryptText(input.medicationName)

    // Insert medication with encrypted PHI
    const { data, error } = await supabase
      .from('medications')
      .insert({
        user_id: user.id,
        medication_name: encrypted,
        medication_name_iv: iv,
        medication_name_tag: authTag,
        nickname: input.nickname,
        frequency: input.frequency,
        color: input.color,
        is_active: true,
      })
      .select()
      .single()

    if (error) throw error

    // Revalidate settings page to show new medication
    revalidatePath('/settings')
    revalidatePath('/home')

    return { success: true, medication: data }
  } catch (error: any) {
    console.error('Error adding medication:', error)
    return { error: error.message || 'Failed to add medication' }
  }
}
