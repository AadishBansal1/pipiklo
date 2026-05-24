import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('items')
      .select('*,users(name,avatar_url)')
      .eq('id', id)
      .eq('status', 'approved')
      .single()

    if (error || !data) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

    // Increment views (fire-and-forget)
    supabase.rpc('increment_views', { item_id: id }).then(() => {})

    return NextResponse.json({ item: data }, {
      headers: { 'Cache-Control': 's-maxage=600, stale-while-revalidate=120' },
    })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const body = await req.json()
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('items')
      .update(body)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return NextResponse.json({ item: data })
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
