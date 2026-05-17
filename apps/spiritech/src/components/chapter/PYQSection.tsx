'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { PYQuestion } from '@/lib/content/ncert-data'

interface PYQSectionProps {
  questions: PYQuestion[]
}

export function PYQSection({ questions }: PYQSectionProps) {
  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border py-16 text-center">
        <p className="text-lg font-semibold">No Previous Year Questions Yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Questions for this chapter will be added soon.
        </p>
      </div>
    )
  }

  const groupedByYear = questions.reduce<Record<number, PYQuestion[]>>((acc, q) => {
    ;(acc[q.year] ||= []).push(q)
    return acc
  }, {})

  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year}>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Badge variant="outline">{year}</Badge>
            Previous Year Questions
          </h3>

          <Accordion type="single" collapsible className="rounded-xl border">
            {groupedByYear[year].map((q, idx) => (
              <AccordionItem key={idx} value={`${year}-${idx}`} className="px-4">
                <AccordionTrigger className="text-left text-sm">
                  <div className="flex items-start gap-3 pr-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      Q{idx + 1}
                    </span>
                    <span>{q.question}</span>
                    {q.marks && (
                      <Badge variant="secondary" className="ml-auto shrink-0">
                        {q.marks}M
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pl-9">
                  {q.answer ? (
                    <div className="rounded-lg bg-green-50 p-4 text-sm dark:bg-green-950">
                      <p className="mb-1 text-xs font-semibold text-green-700 dark:text-green-300">Answer:</p>
                      <p>{q.answer}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Answer not available yet.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}
