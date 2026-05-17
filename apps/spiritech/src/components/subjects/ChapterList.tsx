'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Box, Play, HelpCircle, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ChapterData } from '@/lib/content/ncert-data'
import { cn } from '@/lib/utils'

interface ChapterListProps {
  chapters: ChapterData[]
  availableClasses: number[]
  subjectSlug: string
}

export function ChapterList({ chapters, availableClasses, subjectSlug }: ChapterListProps) {
  const [selectedClass, setSelectedClass] = useState(availableClasses[0] || 6)

  const filteredChapters = chapters.filter((ch) => ch.classNumber === selectedClass)

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Class:</span>
        {availableClasses.map((cls) => (
          <Button
            key={cls}
            variant={selectedClass === cls ? 'brand' : 'outline'}
            size="sm"
            onClick={() => setSelectedClass(cls)}
          >
            Class {cls}
          </Button>
        ))}
      </div>

      {filteredChapters.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Box className="mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Chapters for Class {selectedClass} are being added. Check back soon!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredChapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/subjects/${subjectSlug}/${chapter.slug}`}
            >
              <Card className="group cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      CH {chapter.chapterNumber}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>

                  <h3 className="mt-3 font-semibold leading-tight">
                    {chapter.title}
                  </h3>

                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                    {chapter.description}
                  </p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    {chapter.models.length > 0 && (
                      <span className={cn('flex items-center gap-1', 'text-brand-500')}>
                        <Box className="h-3.5 w-3.5" />
                        {chapter.models.length} 3D {chapter.models.length === 1 ? 'Model' : 'Models'}
                      </span>
                    )}
                    {chapter.videos.length > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <Play className="h-3.5 w-3.5" />
                        {chapter.videos.length} {chapter.videos.length === 1 ? 'Video' : 'Videos'}
                      </span>
                    )}
                    {chapter.pyQuestions.length > 0 && (
                      <span className="flex items-center gap-1 text-amber-500">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {chapter.pyQuestions.length} PYQs
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
