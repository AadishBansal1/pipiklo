'use client'

import { useState } from 'react'
import { AuthButtons } from '@/components/auth/AuthButtons'
import { SignOutSection } from '@/components/auth/SignOutSection'

export default function CustomerSettingsPage() {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 dark:text-white">Profile</h2>
          <AuthButtons />
        </div>
        {[
          { label: 'Display Name', placeholder: 'Your name', type: 'text' },
          { label: 'Email', placeholder: 'you@example.com', type: 'email' },
          { label: 'Website', placeholder: 'https://yoursite.com', type: 'url' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
          <textarea
            rows={3}
            placeholder="Tell us a little about yourself…"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900 dark:text-white">Notifications</h2>
        {[
          { label: 'New asset releases in my saved categories', default: true },
          { label: 'Download receipt emails', default: true },
          { label: 'Subscription renewal reminders', default: true },
          { label: 'Promotional offers', default: false },
          { label: 'Platform news and updates', default: false },
        ].map((n) => (
          <label key={n.label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-gray-700 dark:text-gray-300">{n.label}</span>
            <input type="checkbox" defaultChecked={n.default} className="w-4 h-4 accent-brand-500" />
          </label>
        ))}
      </section>

      {/* Sign out */}
      <SignOutSection />

      {/* Danger zone */}
      <section className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 p-6 space-y-3">
        <h2 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Deleting your account is permanent and cannot be undone. All downloads and licenses will be lost.
        </p>
        <button className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
          Delete Account
        </button>
      </section>

      <button
        onClick={save}
        className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
