'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SUBJECTS } from '@/lib/content/subjects'

const badgeVariantMap: Record<string, 'science' | 'math' | 'social' | 'english' | 'ai'> = {
  science: 'science',
  mathematics: 'math',
  'social-science': 'social',
  english: 'english',
  ai: 'ai',
}

export function SubjectGrid() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Choose Your Subject</h2>
        <p className="mt-2 text-muted-foreground">
          Select a subject to explore interactive 3D models and video explanations
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SUBJECTS.map((subject, i) => (
          <motion.div
            key={subject.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link href={`/subjects/${subject.slug}`}>
              <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl ${subject.bgColor}`}>
                      {subject.icon}
                    </div>
                    <Badge variant={badgeVariantMap[subject.slug] || 'default'}>
                      Class {subject.classRange}
                    </Badge>
                  </div>

                  <h3 className={`mt-4 text-xl font-semibold ${subject.color}`}>
                    {subject.name}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {subject.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {subject.totalChapters} Chapters
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
