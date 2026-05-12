'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { AI_TOOLS } from '@/lib/categories'
import { ArrowRight, Sparkles } from 'lucide-react'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const card = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function AIToolsShowcase() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#030712]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-64 -right-64 w-[600px] h-[600px] rounded-full border border-brand-500/5"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-64 -left-64 w-[500px] h-[500px] rounded-full border border-purple-500/5"
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm font-medium text-brand-400 mb-5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Powered by AI
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Create anything with AI
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
            Generate images, videos, music, voiceovers, graphics, and more.
            No experience needed — just describe what you want.
          </p>
        </motion.div>

        {/* Tool cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-12"
        >
          {AI_TOOLS.map((tool) => (
            <motion.div key={tool.slug} variants={card}>
              <Link
                href={`/gen-ai/${tool.slug}`}
                className="group relative flex flex-col h-full overflow-hidden rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm p-5 hover:border-brand-500/40 hover:bg-white/8 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/10"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-purple-500/5 rounded-2xl" />
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
                >
                  {tool.icon}
                </motion.div>

                <h3 className="font-bold text-white mb-1.5 text-sm">{tool.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1">{tool.description}</p>

                <div className="mt-4 flex items-center gap-1 text-xs text-brand-400 font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  Try now <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/gen-ai"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-brand-500/20"
          >
            Explore All AI Tools
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
