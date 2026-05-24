/**
 * Upload API — stores files in Supabase Storage (free: 1GB).
 * Accepts multipart/form-data with fields:
 *   - file: File
 *   - bucket: 'avatars' | 'items' | 'thumbnails'
 *   - path: string (optional, auto-generated if omitted)
 */
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
export const runtime = 'edge'

const ALLOWED_BUCKETS = ['avatars', 'items', 'thumbnails'] as const
const MAX_SIZE_MB = 50

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file   = form.get('file') as File | null
    const bucket = (form.get('bucket') as string) ?? 'items'
    const customPath = form.get('path') as string | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED_BUCKETS.includes(bucket as any)) {
      return NextResponse.json({ error: `Invalid bucket. Use: ${ALLOWED_BUCKETS.join(', ')}` }, { status: 400 })
    }

    const sizeMB = file.size / (1024 * 1024)
    if (sizeMB > MAX_SIZE_MB) {
      return NextResponse.json({ error: `File too large. Max ${MAX_SIZE_MB}MB` }, { status: 413 })
    }

    const ext  = file.name.split('.').pop()?.toLowerCase() ?? 'bin'
    const path = customPath ?? `${crypto.randomUUID()}.${ext}`

    const supabase = await createClient()
    const arrayBuffer = await file.arrayBuffer()

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: true,
        cacheControl: '3600',
      })

    if (error) throw error

    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      path: data.path,
      url: publicUrl,
      bucket,
      size_mb: Math.round(sizeMB * 100) / 100,
    })
  } catch (err: any) {
    console.error('[upload]', err)
    return NextResponse.json({ error: err?.message ?? 'Upload failed' }, { status: 500 })
  }
}
