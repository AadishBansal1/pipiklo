import type { Metadata } from 'next'
import { SubjectGrid } from '@/components/home/SubjectGrid'

export const metadata: Metadata = {
  title: 'All Subjects',
  description: 'Browse all NCERT subjects — Science, Mathematics, Social Science, English, and A.I.',
}

export default function SubjectsPage() {
  return (
    <div className="py-8">
      <SubjectGrid />
    </div>
  )
}
