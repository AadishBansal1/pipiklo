import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getSubjectBySlug } from '@/lib/content/subjects'
import { getChaptersBySubject, getAvailableClasses } from '@/lib/content/ncert-data'
import { ChapterList } from '@/components/subjects/ChapterList'

interface Props {
  params: Promise<{ subjectSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) return { title: 'Subject Not Found' }
  return {
    title: `${subject.name} — NCERT 3D`,
    description: subject.description,
  }
}

export default async function SubjectPage({ params }: Props) {
  const { subjectSlug } = await params
  const subject = getSubjectBySlug(subjectSlug)
  if (!subject) notFound()

  const chapters = getChaptersBySubject(subjectSlug)
  const availableClasses = getAvailableClasses(subjectSlug)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${subject.bgColor}`}>
            {subject.icon}
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${subject.color}`}>{subject.name}</h1>
            <p className="text-muted-foreground">{subject.description}</p>
          </div>
        </div>
      </div>

      <ChapterList
        chapters={chapters}
        availableClasses={availableClasses}
        subjectSlug={subjectSlug}
      />
    </div>
  )
}
