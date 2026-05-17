'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Box, Play, Sparkles, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-background to-purple-50 dark:from-brand-950 dark:via-background dark:to-purple-950">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-1.5 text-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-brand-500" />
              <span>NCERT Class 6-8 in Interactive 3D</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            See Your Textbook{' '}
            <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
              Come Alive
            </span>{' '}
            in 3D
          </motion.h1>

          <motion.p
            className="mt-6 text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore NCERT diagrams as interactive 3D models. Rotate, zoom, and understand every concept visually.
            Watch video explanations and practice previous year questions.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/subjects">
              <Button variant="brand" size="xl" className="gap-2">
                <Box className="h-5 w-5" />
                Explore 3D Models
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/subjects/science/class-6-science-ch8">
              <Button variant="outline" size="xl" className="gap-2">
                <Play className="h-5 w-5" />
                Watch Demo
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {[
              { label: '3D Models', value: '50+', icon: Box },
              { label: 'Video Lessons', value: '100+', icon: Play },
              { label: 'NCERT Chapters', value: '40+', icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-brand-500" />
                <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
