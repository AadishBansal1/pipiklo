'use client'

import { useState } from 'react'
import { SignOutSection } from '@/components/auth/SignOutSection'

export default function CreatorSettingsPage() {
  const [saved, setSaved] = useState(false)

  const save = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Creator Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your creator profile and payout details</p>
      </div>

      {/* Public profile */}
      <section className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Public Profile</h2>
        {[
          { label: 'Display Name', placeholder: 'Studio name or your name', type: 'text' },
          { label: 'Portfolio URL', placeholder: 'https://yourportfolio.com', type: 'url' },
          { label: 'Twitter / X', placeholder: '@handle', type: 'text' },
          { label: 'Behance', placeholder: 'behance.net/yourname', type: 'text' },
          { label: 'Dribbble', placeholder: 'dribbble.com/yourname', type: 'text' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-foreground mb-1">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
          <textarea
            rows={3}
            placeholder="Describe your work and specialisations…"
            className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
      </section>

      {/* Payout info */}
      <section className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Payout Details</h2>
        <p className="text-xs text-muted-foreground">
          Earnings are paid out monthly via UPI or bank transfer once your balance exceeds ₹1,000.
        </p>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Preferred Method</label>
          <select className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer (NEFT/IMPS)</option>
          </select>
        </div>
        {[
          { label: 'UPI ID', placeholder: 'yourname@upi', type: 'text' },
          { label: 'PAN Number', placeholder: 'ABCDE1234F', type: 'text' },
          { label: 'GST Number (optional)', placeholder: '22AAAAA0000A1Z5', type: 'text' },
        ].map((field) => (
          <div key={field.label}>
            <label className="block text-sm font-medium text-foreground mb-1">{field.label}</label>
            <input
              type={field.type}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 rounded-lg border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        ))}
      </section>

      {/* Notification prefs */}
      <section className="bg-card rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Notifications</h2>
        {[
          { label: 'New download alerts', default: true },
          { label: 'Review & rating notifications', default: true },
          { label: 'Payout confirmations', default: true },
          { label: 'Item approval / rejection updates', default: true },
          { label: 'Platform creator newsletters', default: false },
        ].map((n) => (
          <label key={n.label} className="flex items-center justify-between cursor-pointer">
            <span className="text-sm text-foreground">{n.label}</span>
            <input type="checkbox" defaultChecked={n.default} className="w-4 h-4 accent-brand-500" />
          </label>
        ))}
      </section>

      {/* Sign out */}
      <SignOutSection />

      <button
        onClick={save}
        className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors"
      >
        {saved ? 'Saved!' : 'Save Changes'}
      </button>
    </div>
  )
}
