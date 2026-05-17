import { Box, Play, HelpCircle, Upload } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const FEATURES = [
  {
    icon: Box,
    title: 'Interactive 3D Models',
    description: 'Rotate, zoom, and explore NCERT diagrams in full 3D. Touch-friendly on mobile.',
    color: 'text-brand-500 bg-brand-50 dark:bg-brand-950',
  },
  {
    icon: Play,
    title: 'Video Explanations',
    description: 'Watch concept-wise video tutorials in Hindi and English for every chapter.',
    color: 'text-red-500 bg-red-50 dark:bg-red-950',
  },
  {
    icon: HelpCircle,
    title: 'Previous Year Questions',
    description: 'Practice PYQs with answers. Sorted by year and marks for smart revision.',
    color: 'text-amber-500 bg-amber-50 dark:bg-amber-950',
  },
  {
    icon: Upload,
    title: 'Community Videos',
    description: 'Upload your own explanation videos and learn from peers across India.',
    color: 'text-purple-500 bg-purple-50 dark:bg-purple-950',
  },
]

export function FeatureHighlights() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Everything You Need to Learn</h2>
          <p className="mt-2 text-muted-foreground">
            Four powerful tools in every chapter
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="border-0 shadow-none bg-transparent">
              <CardContent className="p-6 text-center">
                <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
