import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { user_id, item_id, project_name } = await req.json()

    if (!user_id || !item_id) {
      return NextResponse.json({ error: 'user_id and item_id are required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Upsert download record (idempotent — same user can re-download)
    const { data: download, error: dlError } = await supabase
      .from('downloads')
      .upsert(
        { user_id, item_id, project_name: project_name ?? null },
        { onConflict: 'user_id,item_id', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (dlError) throw dlError

    // Increment item download counter
    await supabase.rpc('increment_downloads', { item_id })

    return NextResponse.json({
      success: true,
      license_key: download.license_key,
      downloaded_at: download.downloaded_at,
    })
  } catch (err) {
    console.error('[download]', err)
    return NextResponse.json({ error: 'Download tracking failed' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const user_id = req.nextUrl.searchParams.get('user_id')
  if (!user_id) return NextResponse.json({ error: 'user_id required' }, { status: 400 })

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('downloads')
      .select('*,items(id,title,thumbnail_url,category)')
      .eq('user_id', user_id)
      .order('downloaded_at', { ascending: false })
    if (error) throw error
    return NextResponse.json({ downloads: data ?? [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch downloads' }, { status: 500 })
  }
}
