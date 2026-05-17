'use client'

import { Box, Play, HelpCircle, Users } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModelViewer } from './ModelViewer'
import { VideoPlayer } from './VideoPlayer'
import { PYQSection } from './PYQSection'
import { UGCSection } from './UGCSection'
import type { ChapterData } from '@/lib/content/ncert-data'

interface ChapterTabsProps {
  chapter: ChapterData
}

export function ChapterTabs({ chapter }: ChapterTabsProps) {
  const defaultTab = chapter.models.length > 0 ? '3d' : 'video'

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="3d" className="gap-1.5 text-xs sm:text-sm">
          <Box className="h-4 w-4" />
          <span className="hidden sm:inline">3D Model</span>
          <span className="sm:hidden">3D</span>
        </TabsTrigger>
        <TabsTrigger value="video" className="gap-1.5 text-xs sm:text-sm">
          <Play className="h-4 w-4" />
          <span className="hidden sm:inline">Video</span>
          <span className="sm:hidden">Video</span>
        </TabsTrigger>
        <TabsTrigger value="pyq" className="gap-1.5 text-xs sm:text-sm">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">PYQ</span>
          <span className="sm:hidden">PYQ</span>
        </TabsTrigger>
        <TabsTrigger value="ugc" className="gap-1.5 text-xs sm:text-sm">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Community</span>
          <span className="sm:hidden">UGC</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="3d" className="mt-6">
        {chapter.models.length > 0 ? (
          <div className="space-y-6">
            {chapter.models.map((model, idx) => (
              <ModelViewer key={idx} model={model} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
            <Box className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">3D Model Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We&apos;re working on creating an interactive 3D model for this chapter.
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="video" className="mt-6">
        {chapter.videos.length > 0 ? (
          <div className="space-y-6">
            {chapter.videos.map((video, idx) => (
              <VideoPlayer key={idx} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
            <Play className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Videos Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Video explanations for this chapter will be added soon.
            </p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="pyq" className="mt-6">
        <PYQSection questions={chapter.pyQuestions} />
      </TabsContent>

      <TabsContent value="ugc" className="mt-6">
        <UGCSection />
      </TabsContent>
    </Tabs>
  )
}
