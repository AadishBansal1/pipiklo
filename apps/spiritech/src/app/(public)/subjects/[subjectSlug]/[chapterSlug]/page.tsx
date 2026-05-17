import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Box, Play, HelpCircle } from 'lucide-react'
import { getSubjectBySlug } from '@/lib/content/subjects'
import { getChapterBySlug } from '@/lib/content/ncert-data'
import { Badge } from '@/components/ui/badge'
import { ChapterTabs } from '@/components/chapter/ChapterTabs'

interface Props {
  params: Promise<{ subjectSlug: string; chapterSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterSlug } = await params
  const chapter = getChapterBySlug(chapterSlug)
  if (!chapter) return { title: 'Chapter Not Found' }
  return {
    title: `${chapter.title} — Class ${chapter.classNumber}`,
    description: chapter.description,
  }
}

export default async function ChapterPage({ params }: Props) {
  const { subjectSlug, chapterSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  const chapter = getChapterBySlug(chapterSlug)

  if (!subject || !chapter) notFound()

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/subjects/${subjectSlug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to {subject.name}
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">Class {chapter.classNumber}</Badge>
          <Badge variant="outline">Chapter {chapter.chapterNumber}</Badge>
          {chapter.models.length > 0 && (
            <Badge variant="default" className="gap-1">
              <Box className="h-3 w-3" />
              {chapter.models.length} 3D
            </Badge>
          )}
          {chapter.videos.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Play className="h-3 w-3" />
              {chapter.videos.length} Video
            </Badge>
          )}
          {chapter.pyQuestions.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              <HelpCircle className="h-3 w-3" />
              {chapter.pyQuestions.length} PYQ
            </Badge>
          )}
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {chapter.title}
        </h1>

        <p className="mt-2 text-muted-foreground">
          {chapter.description}
        </p>
      </div>

      <ChapterTabs chapter={chapter} />
    </div>
  )
}
