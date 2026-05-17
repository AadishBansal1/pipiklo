'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { VideoData } from '@/lib/content/ncert-data'

interface VideoPlayerProps {
  video: VideoData
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false)

  const thumbnailUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <img
              src={thumbnailUrl}
              alt={video.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
              <Play className="h-7 w-7 fill-current pl-1" />
            </div>
          </button>
        )}
      </div>

      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-semibold">{video.title}</h3>
          {video.duration && (
            <p className="text-sm text-muted-foreground">Duration: {video.duration}</p>
          )}
        </div>
        <Badge variant={video.language === 'hi' ? 'secondary' : 'outline'}>
          {video.language === 'hi' ? 'Hindi' : 'English'}
        </Badge>
      </div>
    </div>
  )
}
