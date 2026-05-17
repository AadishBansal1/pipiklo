'use client'
import { useEffect } from 'react'
import { Globe } from 'lucide-react'

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: { translate: { TranslateElement: new (opts: object, el: string) => void } }
  }
}

export function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById('gt-script')) return
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
        )
      }
    }
    const script = document.createElement('script')
    script.id = 'gt-script'
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return (
    <div className="flex items-center gap-1" title="Translate">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <div id="google_translate_element" className="[&_.goog-te-gadget]:!text-xs [&_.goog-te-gadget-simple]:!border-0 [&_.goog-te-gadget-simple]:!bg-transparent [&_.goog-te-gadget-simple]:!p-0" />
    </div>
  )
}
