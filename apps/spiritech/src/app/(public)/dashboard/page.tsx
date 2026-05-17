import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, Box, Play, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SUBJECTS } from '@/lib/content/subjects'
import { NCERT_CHAPTERS } from '@/lib/content/ncert-data'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Your NCERT learning dashboard',
}

export default function DashboardPage() {
  const totalModels = NCERT_CHAPTERS.reduce((acc, ch) => acc + ch.models.length, 0)
  const totalVideos = NCERT_CHAPTERS.reduce((acc, ch) => acc + ch.videos.length, 0)
  const totalPYQ = NCERT_CHAPTERS.reduce((acc, ch) => acc + ch.pyQuestions.length, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">NCERT Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Your learning overview</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950">
              <BookOpen className="h-6 w-6 text-brand-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{NCERT_CHAPTERS.length}</p>
              <p className="text-sm text-muted-foreground">Chapters</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950">
              <Box className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalModels}</p>
              <p className="text-sm text-muted-foreground">3D Models</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 dark:bg-red-950">
              <Play className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalVideos}</p>
              <p className="text-sm text-muted-foreground">Videos</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950">
              <HelpCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalPYQ}</p>
              <p className="text-sm text-muted-foreground">PY Questions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-12 text-xl font-semibold">Subjects</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((subject) => {
          const subjectChapters = NCERT_CHAPTERS.filter((ch) => ch.subjectSlug === subject.slug)
          return (
            <Link key={subject.slug} href={`/subjects/${subject.slug}`}>
              <Card className="cursor-pointer transition-all hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{subject.icon} {subject.name}</CardTitle>
                    <Badge variant="outline">Class {subject.classRange}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {subjectChapters.length} chapters available
                  </p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
