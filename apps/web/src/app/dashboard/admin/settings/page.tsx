'use client'

import { useState } from 'react'
import { SignOutSection } from '@/components/auth/SignOutSection'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Platform Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Global configuration for the Pipiklo platform</p>
      </div>

      {/* General */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">General</h2>
        {[
          { label: 'Platform Name', defaultValue: 'Pipiklo' },
          { label: 'Support Email', defaultValue: 'support@pipiklo.com' },
          { label: 'Max Upload Size (MB)', defaultValue: '500' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
            <input
              defaultValue={field.defaultValue}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ))}
      </section>

      {/* Creator revenue split */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Revenue Split</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Creator Share (%)</label>
            <input
              type="number"
              defaultValue="30"
              min="10"
              max="90"
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Platform Share (%)</label>
            <input
              type="number"
              defaultValue="70"
              disabled
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-sm text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400">Minimum payout threshold: ₹1,000</p>
      </section>

      {/* Feature flags */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Feature Flags</h2>
        {[
          { label: 'Creator Applications Open', defaultChecked: true },
          { label: 'AI Tools Enabled', defaultChecked: true },
          { label: 'Subscription Gates Active', defaultChecked: false },
          { label: 'Maintenance Mode', defaultChecked: false },
        ].map((flag) => (
          <label key={flag.label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">{flag.label}</span>
            <input type="checkbox" defaultChecked={flag.defaultChecked} className="w-4 h-4 accent-brand-500" />
          </label>
        ))}
      </section>

      <SignOutSection />

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
        >
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
