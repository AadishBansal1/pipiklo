'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BookMarked, ArrowRight } from 'lucide-react'

const COLLECTIONS = [
  { name: 'Dreamshift: Surreal Design Essentials', slug: 'dreamshift', seed: 10, count: '240 assets' },
  { name: 'Thiccography: Bold Type Collection', slug: 'thiccography', seed: 20, count: '85 assets' },
  { name: 'Motion is Collective', slug: 'motion-collective', seed: 30, count: '320 assets' },
  { name: "Gothic Aesthetic in Film", slug: 'gothic-film', seed: 40, count: '175 assets' },
  { name: 'Rough Never Looked So Good', slug: 'rough-good', seed: 50, count: '130 assets' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const cardVariant = {
  hidden: { opacity: 0, scale: 0.94, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function CuratedCollections() {
  return (
    <section className="py-20 bg-muted/30 dark:bg-white/[0.02] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12 gap-4"
        >
          <div>
            <div className="flex items-center gap-2 text-brand-500 font-semibold text-sm uppercase tracking-widest mb-2">
              <BookMarked className="h-4 w-4" />
              Hand-picked
            </div>
            <h2 className="text-4xl font-black text-foreground">Curated Collections</h2>
            <p className="text-muted-foreground text-sm mt-2">Themed sets for your next project</p>
          </div>
          <Link
            href="/search?collection=all"
            className="hidden md:flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-brand-600 border border-brand-500/30 hover:border-brand-500/60 px-5 py-2.5 rounded-xl transition-all duration-200 hover:bg-brand-500/5 shrink-0"
          >
            Browse all <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {COLLECTIONS.map((col) => (
            <motion.div key={col.slug} variants={cardVariant}>
              <Link
                href={`/search?collection=${col.slug}`}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/8 transition-all duration-400"
              >
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  {/* Image grid */}
                  <div className="grid grid-cols-2 grid-rows-3 h-full gap-[2px]">
                    <div className="col-span-2 row-span-2 relative">
                      <Image
                        src={`https://picsum.photos/seed/${col.seed}/400/260`}
                        alt={col.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="20vw"
                      />
                    </div>
                    <div className="relative overflow-hidden">
                      <Image
                        src={`https://picsum.photos/seed/${col.seed + 1}/200/130`}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 delay-75"
                        sizes="10vw"
                      />
                    </div>
                    <div className="relative overflow-hidden">
                      <Image
                        src={`https://picsum.photos/seed/${col.seed + 2}/200/130`}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 delay-100"
                        sizes="10vw"
                      />
                    </div>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-snug mb-1.5">{col.name}</p>
                    <span className="inline-block text-[10px] bg-white/20 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5 text-white/80">
                      {col.count}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/0 group-hover:bg-white/20 backdrop-blur-sm border border-white/0 group-hover:border-white/10 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                    <ArrowRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
