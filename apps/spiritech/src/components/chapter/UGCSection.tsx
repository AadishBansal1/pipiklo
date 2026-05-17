'use client'

import { useState } from 'react'
import { Upload, Link as LinkIcon, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function UGCSection() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [title, setTitle] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <Upload className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Video Submitted!</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Your video is under review. It will appear here once approved.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSubmitted(false)
              setYoutubeUrl('')
              setTitle('')
            }}
          >
            Submit Another
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-brand-500" />
            <h3 className="font-semibold">Share Your Explanation</h3>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Upload your YouTube video explaining this chapter. Help fellow students learn better!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Video Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Body Movements explained simply"
                required
                className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium">YouTube URL</label>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  pattern="https?://(www\.)?(youtube\.com|youtu\.be)/.+"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <Button type="submit" variant="brand" className="w-full gap-2">
              <Send className="h-4 w-4" />
              Submit Video for Review
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center rounded-xl border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          No community videos yet for this chapter. Be the first to contribute!
        </p>
      </div>
    </div>
  )
}
