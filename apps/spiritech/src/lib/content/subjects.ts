export interface Subject {
  name: string
  slug: string
  icon: string
  color: string
  bgColor: string
  description: string
  totalChapters: number
  classRange: string
}

export const SUBJECTS: Subject[] = [
  {
    name: 'Science',
    slug: 'science',
    icon: '🔬',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    description: 'Explore biology, physics, and chemistry concepts in 3D',
    totalChapters: 8,
    classRange: '6-8',
  },
  {
    name: 'Mathematics',
    slug: 'mathematics',
    icon: '📐',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    description: 'Visualize geometric shapes, graphs, and number systems',
    totalChapters: 8,
    classRange: '6-8',
  },
  {
    name: 'Social Science',
    slug: 'social-science',
    icon: '🌍',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950',
    description: 'Explore historical monuments, maps, and geography in 3D',
    totalChapters: 8,
    classRange: '6-8',
  },
  {
    name: 'English',
    slug: 'english',
    icon: '📖',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    description: 'Interactive scenes from stories and poems',
    totalChapters: 8,
    classRange: '6-8',
  },
  {
    name: 'A.I.',
    slug: 'ai',
    icon: '🤖',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-950',
    description: 'Learn artificial intelligence concepts with 3D visualizations',
    totalChapters: 6,
    classRange: '8',
  },
]

export function getSubjectBySlug(slug: string): Subject | undefined {
  return SUBJECTS.find((s) => s.slug === slug)
}
