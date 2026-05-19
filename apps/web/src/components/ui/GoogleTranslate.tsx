'use client'

import { useEffect, useRef, useState } from 'react'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'zh-CN', label: 'Chinese', native: '中文' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'it', label: 'Italian', native: 'Italiano' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
]

function setCookie(lang: string) {
  // Google Translate reads the googtrans cookie to apply language
  const val = lang === 'en' ? '' : `/en/${lang}`
  document.cookie = `googtrans=${val};path=/`
  document.cookie = `googtrans=${val};domain=${window.location.hostname};path=/`
}

export function GoogleTranslate() {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('en')
  const ref = useRef<HTMLDivElement>(null)

  // Inject Google Translate script (hidden widget still needed to apply translations)
  useEffect(() => {
    if (document.getElementById('gt-script')) return
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'gt-hidden-element'
        )
      }
    }
    const s = document.createElement('script')
    s.id = 'gt-script'
    s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    s.async = true
    document.head.appendChild(s)
  }, [])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function selectLang(code: string) {
    setCurrent(code)
    setOpen(false)
    setCookie(code)
    // Trigger Google Translate to re-apply
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo')
    if (select) {
      select.value = code
      select.dispatchEvent(new Event('change'))
    } else {
      // Fallback: reload with cookie set
      window.location.reload()
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0]

  return (
    <>
      {/* Hidden Google Translate element (required for translation to work) */}
      <div id="gt-hidden-element" className="hidden" />

      {/* Custom trigger button */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium border transition-colors',
            open
              ? 'bg-accent border-border text-foreground'
              : 'border-transparent hover:bg-accent text-muted-foreground hover:text-foreground'
          )}
          aria-label="Change language"
        >
          <Globe className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">{currentLang.native}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', open && 'rotate-180')} />
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-full mt-1.5 z-50 bg-background border rounded-xl shadow-xl w-52 py-1 overflow-hidden">
            <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Select Language
            </p>
            <div className="max-h-64 overflow-y-auto">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => selectLang(lang.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-accent',
                    current === lang.code && 'text-brand-600 font-medium'
                  )}
                >
                  <span>
                    <span className="font-medium">{lang.native}</span>
                    <span className="ml-1.5 text-xs text-muted-foreground">{lang.label}</span>
                  </span>
                  {current === lang.code && <Check className="h-3.5 w-3.5 text-brand-500" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// Required global type
declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: { translate: { TranslateElement: new (opts: object, el: string) => void } }
  }
}
