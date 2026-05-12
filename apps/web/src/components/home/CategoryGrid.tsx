'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { CATEGORY_GROUPS } from '@/lib/categories'

const CAT_IMAGES: Record<string, string> = {
  'gen-ai': 'https://picsum.photos/seed/genai1/400/280',
  'video-templates': 'https://picsum.photos/seed/videotempl/400/280',
  'stock-video': 'https://picsum.photos/seed/stockvid/400/280',
  'audio': 'https://picsum.photos/seed/audiox/400/280',
  'graphics': 'https://picsum.photos/seed/graphx/400/280',
  'design-templates': 'https://picsum.photos/seed/designt/400/280',
  'photos': 'https://picsum.photos/seed/photox/400/280',
  '3d': 'https://picsum.photos/seed/threedx/400/280',
  'fonts': 'https://picsum.photos/seed/fontsx/400/280',
  'web': 'https://picsum.photos/seed/webx/400/280',
}

const CAT_COUNTS: Record<string, string> = {
  'gen-ai': '8 AI tools',
  'video-templates': '150,000+',
  'stock-video': '80,000+',
  'audio': '340,000+',
  'graphics': '280,000+',
  'design-templates': '410,000+',
  'photos': '15.7M+',
  '3d': '380,000+',
  'fonts': '77,000+',
  'web': '50,000+',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function CategoryGrid() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <p className="text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="text-4xl font-black text-foreground leading-tight">
              Every type of asset,<br className="hidden md:block" /> for any project
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
            Explore our complete collection of creative assets spanning 10 major categories.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {CATEGORY_GROUPS.map((cat) => (
            <motion.div key={cat.slug} variants={item}>
              <Link
                href={`/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card hover:border-brand-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={CAT_IMAGES[cat.slug] ?? 'https://picsum.photos/400/280'}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* Icon badge */}
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-base">
                    {cat.icon}
                  </div>

                  {/* Arrow on hover */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="p-3.5 flex-1">
                  <h3 className="font-bold text-sm text-foreground group-hover:text-brand-500 transition-colors duration-200 leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{CAT_COUNTS[cat.slug]}</p>
                </div>

                {/* Bottom accent line */}
                <div className="h-0.5 bg-gradient-to-r from-brand-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
