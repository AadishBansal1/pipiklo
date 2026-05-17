'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ModelData } from '@/lib/content/ncert-data'

interface ModelViewerProps {
  model: ModelData
}

export function ModelViewer({ model }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    import('@google/model-viewer')
    setLoaded(true)
  }, [])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative rounded-xl border bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>

      {loaded ? (
        <model-viewer
          src={model.modelUrl}
          poster={model.posterUrl}
          alt={model.title}
          camera-controls=""
          auto-rotate=""
          shadow-intensity="1"
          environment-image="neutral"
          loading="lazy"
          style={{ width: '100%', height: isFullscreen ? '100vh' : '400px', borderRadius: '0.75rem' }}
        />
      ) : (
        <div className="flex h-[400px] items-center justify-center">
          <RotateCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="px-4 py-3">
        <h3 className="font-semibold">{model.title}</h3>
        {model.attribution && (
          <p className="text-xs text-muted-foreground">Source: {model.attribution}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Drag to rotate &middot; Pinch/scroll to zoom
        </p>
      </div>
    </div>
  )
}
