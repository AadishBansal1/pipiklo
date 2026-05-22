'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Instagram, Star, Zap, Gift, TrendingUp, Users, CheckCircle,
  ArrowRight, Sparkles, Crown, Heart, Camera, Palette, Globe,
  ChevronDown, Upload, Send, AlertCircle
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
type ReachBracket =
  | '1k-5k' | '5k-10k' | '10k-50k' | '50k-100k'
  | '100k-500k' | '500k-1m' | '1m+'

type AITool =
  | 'Midjourney' | 'DALL-E' | 'Stable Diffusion' | 'Adobe Firefly'
  | 'Runway' | 'Pika Labs' | 'ElevenLabs' | 'Kling AI'
  | 'Leonardo AI' | 'Canva AI' | 'ChatGPT' | 'Other'

type FormStep = 'profile' | 'reach' | 'collab' | 'submit'

interface FormData {
  // Step 1 — Profile
  fullName: string
  email: string
  instagramHandle: string
  otherPlatforms: string
  niche: string
  // Step 2 — Reach
  reachBracket: ReachBracket | ''
  avgLikes: string
  avgComments: string
  postFrequency: string
  // Step 3 — AI Collab
  aiTools: AITool[]
  recentCollabBrand: string
  recentCollabUrl: string
  recentCollabDescription: string
  portfolioUrl: string
  whyJoin: string
  // Step 4
  agreeToTerms: boolean
}

const REACH_OPTIONS: { value: ReachBracket; label: string; credits: number }[] = [
  { value: '1k-5k',     label: '1K – 5K followers',    credits: 50  },
  { value: '5k-10k',    label: '5K – 10K followers',   credits: 100 },
  { value: '10k-50k',   label: '10K – 50K followers',  credits: 200 },
  { value: '50k-100k',  label: '50K – 100K followers', credits: 350 },
  { value: '100k-500k', label: '100K – 500K followers',credits: 600 },
  { value: '500k-1m',   label: '500K – 1M followers',  credits: 1000},
  { value: '1m+',       label: '1M+ followers',         credits: 2000},
]

const AI_TOOLS: AITool[] = [
  'Midjourney', 'DALL-E', 'Stable Diffusion', 'Adobe Firefly',
  'Runway', 'Pika Labs', 'ElevenLabs', 'Kling AI',
  'Leonardo AI', 'Canva AI', 'ChatGPT', 'Other',
]

const NICHE_OPTIONS = [
  'Graphic Design', 'Web Design', 'UI/UX', '3D & Motion',
  'Photography', 'Video Editing', 'Digital Art', 'Fashion & Lifestyle',
  'Tech & Gaming', 'Business & Finance', 'Education', 'Other',
]

const STEPS: { id: FormStep; label: string }[] = [
  { id: 'profile', label: 'Profile'    },
  { id: 'reach',   label: 'Reach'      },
  { id: 'collab',  label: 'AI Collabs' },
  { id: 'submit',  label: 'Submit'     },
]

const PERKS = [
  {
    icon: <Zap className="h-6 w-6" />,
    color: 'text-yellow-500',
    bg: 'bg-yellow-500/10',
    title: 'Free Credits Monthly',
    desc: 'Earn up to 2,000 credits/month based on your reach — download any asset, free.',
  },
  {
    icon: <Crown className="h-6 w-6" />,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    title: 'Creator Badge',
    desc: 'Verified Creator badge on your profile. Exclusive early access to new drops.',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'text-brand-500',
    bg: 'bg-brand-500/10',
    title: 'Revenue Share',
    desc: 'Upload your own templates and earn ₹X per download from our 500K+ user base.',
  },
  {
    icon: <Gift className="h-6 w-6" />,
    color: 'text-pink-500',
    bg: 'bg-pink-500/10',
    title: 'Exclusive Asset Drops',
    desc: 'Get unreleased premium packs before they go public. First-mover advantage.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    title: 'Feature on Homepage',
    desc: 'Top creators get featured on the Pipiklo homepage and newsletter (50K+ subs).',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    color: 'text-red-500',
    bg: 'bg-red-500/10',
    title: 'Community Access',
    desc: 'Join our private Discord with 1,000+ creators, designers & AI artists.',
  },
]

const CREDIT_TABLE = [
  { range: '1K – 5K',     credits: '50 credits/mo',   downloads: '~10 assets' },
  { range: '5K – 10K',    credits: '100 credits/mo',  downloads: '~20 assets' },
  { range: '10K – 50K',   credits: '200 credits/mo',  downloads: '~40 assets' },
  { range: '50K – 100K',  credits: '350 credits/mo',  downloads: '~70 assets' },
  { range: '100K – 500K', credits: '600 credits/mo',  downloads: '~120 assets'},
  { range: '500K – 1M',   credits: '1,000 credits/mo',downloads: '~200 assets'},
  { range: '1M+',         credits: '2,000 credits/mo',downloads: 'Unlimited*' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function InfluencerPage() {
  const [step, setStep]             = useState<FormStep>('profile')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [error, setError]           = useState('')

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', instagramHandle: '', otherPlatforms: '', niche: '',
    reachBracket: '', avgLikes: '', avgComments: '', postFrequency: '',
    aiTools: [], recentCollabBrand: '', recentCollabUrl: '',
    recentCollabDescription: '', portfolioUrl: '', whyJoin: '',
    agreeToTerms: false,
  })

  const set = (field: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }))

  const toggleAI = (tool: AITool) =>
    set('aiTools', form.aiTools.includes(tool)
      ? form.aiTools.filter((t) => t !== tool)
      : [...form.aiTools, tool])

  const stepIndex  = STEPS.findIndex((s) => s.id === step)
  const creditsForReach = REACH_OPTIONS.find((r) => r.value === form.reachBracket)?.credits ?? 0

  // Validation per step
  function canProceed() {
    if (step === 'profile') return form.fullName && form.email && form.instagramHandle && form.niche
    if (step === 'reach')   return form.reachBracket && form.avgLikes
    if (step === 'collab')  return form.aiTools.length > 0 && form.whyJoin.length >= 30
    if (step === 'submit')  return form.agreeToTerms
    return false
  }

  function nextStep() {
    const order: FormStep[] = ['profile', 'reach', 'collab', 'submit']
    const i = order.indexOf(step)
    if (i < order.length - 1) setStep(order[i + 1])
  }
  function prevStep() {
    const order: FormStep[] = ['profile', 'reach', 'collab', 'submit']
    const i = order.indexOf(step)
    if (i > 0) setStep(order[i - 1])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canProceed()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/influencer/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Submission failed')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black mb-2">Application Received! 🎉</h1>
            <p className="text-muted-foreground">
              We'll review <strong>@{form.instagramHandle}</strong> and get back to{' '}
              <strong>{form.email}</strong> within 48 hours.
            </p>
          </div>
          {creditsForReach > 0 && (
            <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                If approved, you'll receive <span className="text-xl font-black">{creditsForReach}</span> credits/month
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Link href="/" className="px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors">
              Explore Assets
            </Link>
            <Link href="/sign-up" className="px-6 py-3 rounded-xl border hover:bg-muted font-semibold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-brand-500/5 pt-20 pb-24">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-6">
              <Instagram className="h-4 w-4" />
              Pipiklo Creator & Influencer Program
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-none">
              Turn Your{' '}
              <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
                Audience
              </span>{' '}
              into{' '}
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                Assets
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Join 500+ creators who get{' '}
              <strong className="text-foreground">free monthly credits</strong>,{' '}
              exclusive drops, and revenue sharing — just for sharing what you already do.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12">
              <a
                href="#apply"
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105"
              >
                Apply Now — It's Free
              </a>
              <a href="#how-it-works" className="px-8 py-4 rounded-2xl border font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                See How It Works
              </a>
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-500" />
                <span><strong className="text-foreground">500+</strong> Active creators</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span><strong className="text-foreground">4.9/5</strong> Creator rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-green-500" />
                <span><strong className="text-foreground">48hr</strong> Review time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PERKS GRID ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30" id="how-it-works">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">What You Get</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The Pipiklo Creator Program isn't just a collab — it's a full creative partnership.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PERKS.map((perk, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-background border hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${perk.bg} ${perk.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {perk.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{perk.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIT TABLE ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-3">Credit Scale by Reach</h2>
              <p className="text-muted-foreground">
                Bigger audience = more free credits. Every month, auto-renewed.
              </p>
            </div>
            <div className="rounded-2xl border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="text-left px-6 py-4 text-sm font-semibold">Follower Range</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Monthly Credits</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold">Est. Downloads</th>
                  </tr>
                </thead>
                <tbody>
                  {CREDIT_TABLE.map((row, i) => (
                    <tr key={i} className={`border-b last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'} hover:bg-brand-500/5 transition-colors`}>
                      <td className="px-6 py-4 font-medium">{row.range}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 text-sm font-bold">
                          {row.credits}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">{row.downloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              * 1M+ creators are reviewed individually for custom plans including monetary revenue share.
            </p>
          </div>
        </div>
      </section>

      {/* ── MULTI-STEP FORM ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30" id="apply">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">

            {/* Section header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-4">
                <Send className="h-3.5 w-3.5" />
                Apply for Creator Access
              </div>
              <h2 className="text-4xl font-black mb-3">Let's Get You In</h2>
              <p className="text-muted-foreground">Takes 3 minutes. No fees, no strings.</p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={s.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                      i < stepIndex ? 'bg-green-500 text-white' :
                      i === stepIndex ? 'bg-brand-500 text-white ring-4 ring-brand-500/20' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {i < stepIndex ? <CheckCircle className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={`text-xs mt-1.5 font-medium ${i === stepIndex ? 'text-brand-500' : 'text-muted-foreground'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-2 mb-5 rounded-full transition-all duration-500 ${i < stepIndex ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Form card */}
            <form onSubmit={handleSubmit} className="bg-background border rounded-3xl p-8 shadow-xl shadow-black/5">

              {/* ── STEP 1: Profile ── */}
              {step === 'profile' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                      <Camera className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Your Profile</h3>
                      <p className="text-sm text-muted-foreground">Tell us who you are</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) => set('fullName', e.target.value)}
                        placeholder="Arjun Sharma"
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="you@gmail.com"
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Instagram Username *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold text-sm">@</span>
                      <input
                        type="text"
                        value={form.instagramHandle}
                        onChange={(e) => set('instagramHandle', e.target.value.replace('@', ''))}
                        placeholder="your.handle"
                        className="w-full pl-8 pr-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Other Platforms <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <input
                      type="text"
                      value={form.otherPlatforms}
                      onChange={(e) => set('otherPlatforms', e.target.value)}
                      placeholder="YouTube @handle, TikTok @handle, Twitter @handle..."
                      className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Your Niche / Content Type *</label>
                    <div className="relative">
                      <select
                        value={form.niche}
                        onChange={(e) => set('niche', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                      >
                        <option value="">Select your niche...</option>
                        {NICHE_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: Reach ── */}
              {step === 'reach' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Your Reach</h3>
                      <p className="text-sm text-muted-foreground">Help us calibrate your credit tier</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Instagram Follower Count *</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {REACH_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => set('reachBracket', opt.value)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                            form.reachBracket === opt.value
                              ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400'
                              : 'border-border hover:border-brand-500/40 hover:bg-muted/50'
                          }`}
                        >
                          <span>{opt.label}</span>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            form.reachBracket === opt.value ? 'bg-brand-500 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {opt.credits} cr
                          </span>
                        </button>
                      ))}
                    </div>

                    {form.reachBracket && (
                      <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                        <Zap className="h-5 w-5 text-green-500 shrink-0" />
                        <p className="text-sm text-green-700 dark:text-green-400">
                          You'll receive <strong>{creditsForReach} free credits/month</strong> if approved.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Avg. Likes per Post *</label>
                      <input
                        type="number"
                        value={form.avgLikes}
                        onChange={(e) => set('avgLikes', e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Avg. Comments per Post</label>
                      <input
                        type="number"
                        value={form.avgComments}
                        onChange={(e) => set('avgComments', e.target.value)}
                        placeholder="e.g. 80"
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Posting Frequency</label>
                    <div className="relative">
                      <select
                        value={form.postFrequency}
                        onChange={(e) => set('postFrequency', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm appearance-none"
                      >
                        <option value="">How often do you post?</option>
                        <option>Daily</option>
                        <option>4-6 times a week</option>
                        <option>2-3 times a week</option>
                        <option>Weekly</option>
                        <option>2-3 times a month</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: AI Collab ── */}
              {step === 'collab' && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">AI Tools & Collabs</h3>
                      <p className="text-sm text-muted-foreground">Show us your creative tech stack</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      AI Tools You Use Actively *{' '}
                      <span className="text-muted-foreground font-normal">(select all that apply)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {AI_TOOLS.map((tool) => (
                        <button
                          key={tool}
                          type="button"
                          onClick={() => toggleAI(tool)}
                          className={`px-3.5 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                            form.aiTools.includes(tool)
                              ? 'bg-brand-500 border-brand-500 text-white'
                              : 'border-border hover:border-brand-500/40 hover:bg-muted/50'
                          }`}
                        >
                          {tool}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-5">
                    <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-brand-500" />
                      Most Recent AI Collaboration
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Brand / Client Name</label>
                        <input
                          type="text"
                          value={form.recentCollabBrand}
                          onChange={(e) => set('recentCollabBrand', e.target.value)}
                          placeholder="e.g. Nike, Myntra, Personal..."
                          className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-muted-foreground">Post / Reel URL</label>
                        <input
                          type="url"
                          value={form.recentCollabUrl}
                          onChange={(e) => set('recentCollabUrl', e.target.value)}
                          placeholder="https://instagram.com/p/..."
                          className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">Describe the AI-powered work you did</label>
                      <textarea
                        value={form.recentCollabDescription}
                        onChange={(e) => set('recentCollabDescription', e.target.value)}
                        placeholder="e.g. Created product mockups using Midjourney + edited with Photoshop AI for a fashion brand campaign..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Portfolio / Website URL <span className="text-muted-foreground font-normal">(optional)</span></label>
                    <input
                      type="url"
                      value={form.portfolioUrl}
                      onChange={(e) => set('portfolioUrl', e.target.value)}
                      placeholder="https://yourportfolio.com"
                      className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Why do you want to join Pipiklo? *
                    </label>
                    <textarea
                      value={form.whyJoin}
                      onChange={(e) => set('whyJoin', e.target.value)}
                      placeholder="Tell us about your creative work and how Pipiklo fits into your workflow... (minimum 30 characters)"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border bg-muted/30 focus:bg-background focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all text-sm resize-none"
                    />
                    <p className={`text-xs mt-1.5 ${form.whyJoin.length < 30 ? 'text-muted-foreground' : 'text-green-500'}`}>
                      {form.whyJoin.length}/30 minimum characters
                    </p>
                  </div>
                </div>
              )}

              {/* ── STEP 4: Submit ── */}
              {step === 'submit' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Review & Submit</h3>
                      <p className="text-sm text-muted-foreground">Almost there!</p>
                    </div>
                  </div>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-muted/50 border space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Application Summary</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Name</span>
                        <p className="font-semibold">{form.fullName || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Email</span>
                        <p className="font-semibold truncate">{form.email || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Instagram</span>
                        <p className="font-semibold">@{form.instagramHandle || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Niche</span>
                        <p className="font-semibold">{form.niche || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Reach</span>
                        <p className="font-semibold">{REACH_OPTIONS.find(r => r.value === form.reachBracket)?.label || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">AI Tools</span>
                        <p className="font-semibold">{form.aiTools.slice(0, 3).join(', ')}{form.aiTools.length > 3 ? ` +${form.aiTools.length - 3}` : ''}</p>
                      </div>
                    </div>
                    {creditsForReach > 0 && (
                      <div className="mt-3 pt-3 border-t flex items-center justify-between">
                        <span className="text-sm font-semibold">If approved, monthly credits:</span>
                        <span className="text-xl font-black text-brand-500">{creditsForReach} cr/mo</span>
                      </div>
                    )}
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div
                      onClick={() => set('agreeToTerms', !form.agreeToTerms)}
                      className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                        form.agreeToTerms ? 'bg-brand-500 border-brand-500' : 'border-muted-foreground group-hover:border-brand-500'
                      }`}
                    >
                      {form.agreeToTerms && <CheckCircle className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      I agree to the{' '}
                      <Link href="/terms" className="text-brand-500 hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/license" className="text-brand-500 hover:underline">Creator License Agreement</Link>.
                      I confirm that my follower counts are accurate and my Instagram account is genuine.
                    </span>
                  </label>

                  {error && (
                    <div className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}
                </div>
              )}

              {/* ── Nav buttons ── */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t gap-3">
                {stepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl border font-semibold text-sm hover:bg-muted transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div />
                )}

                {step !== 'submit' ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors flex items-center gap-2"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!canProceed() || submitting}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center gap-2 shadow-lg shadow-brand-500/25"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Application
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-4">
              We review all applications within 48 hours and notify via email.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl font-black text-center mb-10">Common Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Do I need to pay anything?',
                a: 'Absolutely not. The Pipiklo Creator Program is 100% free. You apply, we review, and if approved you get free credits every month.',
              },
              {
                q: 'What do I need to post about Pipiklo?',
                a: 'No mandatory posts! We ask that creators organically share Pipiklo when relevant to their content. There\'s no quota or forced promotional content.',
              },
              {
                q: 'Can I apply with a new account?',
                a: 'Yes, but we prioritize accounts with at least 1K followers and some posting history. New accounts are reviewed case-by-case.',
              },
              {
                q: 'Can creators from platforms other than Instagram apply?',
                a: 'Yes! While we ask for Instagram username for primary verification, we also accept YouTube, TikTok, and Twitter creators. Note it in "Other Platforms".',
              },
              {
                q: 'How are credits calculated for downloads?',
                a: 'Standard templates cost 5 credits, Web/3D files cost 10-15 credits, and premium items cost 25 credits. Credits refresh on the 1st of every month.',
              },
            ].map((faq, i) => (
              <details key={i} className="group bg-background border rounded-2xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-sm select-none list-none">
                  {faq.q}
                  <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0 ml-4" />
                </summary>
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <h2 className="text-4xl font-black mb-4">Ready to create with us?</h2>
            <p className="text-muted-foreground mb-8">
              Join 500+ creators already earning free assets every month.
            </p>
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-500 to-purple-500 hover:from-brand-600 hover:to-purple-600 text-white font-bold text-lg transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-105"
            >
              <Instagram className="h-5 w-5" />
              Apply as Creator
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}
