'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { addMedication } from '../actions'

const COLOR_OPTIONS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Orange
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
]

export default function AddMedicationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [medicationName, setMedicationName] = useState('')
  const [nickname, setNickname] = useState('')
  const [frequency, setFrequency] = useState('daily')
  const [color, setColor] = useState('#3B82F6')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await addMedication({
        medicationName,
        nickname,
        frequency,
        color,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success(`${nickname} added successfully! 🎉`)
      router.push('/settings')
      router.refresh()
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Failed to add medication')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <Link href="/settings" className="text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add Medication</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-2xl mx-auto">
        {/* Medical Info (Encrypted PHI) */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🔒</span>
            <h2 className="text-lg font-semibold text-gray-800">
              Medical Information
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This information is encrypted and stored securely
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name *
            </label>
            <input
              type="text"
              value={medicationName}
              onChange={(e) => setMedicationName(e.target.value)}
              required
              placeholder="e.g., Metformin"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Display Info (Not Encrypted) */}
        <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Display Settings
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            This is how your medication will appear in the app
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nickname * (What you&apos;ll see in the app)
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              placeholder="e.g., Blue Pill, Morning Vitamin"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use a friendly name you&apos;ll remember
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  onClick={() => setColor(colorOption)}
                  className={`w-12 h-12 rounded-xl border-2 transition ${
                    color === colorOption
                      ? 'border-gray-800 scale-110'
                      : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: colorOption }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="daily">Daily (once per day)</option>
              <option value="twice_daily">Twice Daily</option>
              <option value="three_times_daily">Three Times Daily</option>
              <option value="weekly">Weekly</option>
              <option value="as_needed">As Needed</option>
            </select>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview</h3>
          <div
            className="p-4 border border-gray-200 rounded-xl"
            style={{ borderLeft: `4px solid ${color}` }}
          >
            <p className="font-semibold text-gray-800">
              {nickname || 'Medication Nickname'}
            </p>
            <p className="text-sm text-gray-600 capitalize">
              {frequency.replace('_', ' ')}
            </p>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Medication'}
        </button>
      </form>
    </div>
  )
}
