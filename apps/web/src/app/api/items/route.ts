import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const category    = searchParams.get('category') ?? undefined
  const subcategory = searchParams.get('subcategory') ?? undefined
  const sortBy      = (searchParams.get('sortBy') ?? 'downloads') as string
  const limit       = Math.min(Number(searchParams.get('limit') ?? 24), 100)
  const offset      = Number(searchParams.get('offset') ?? 0)
  const search      = searchParams.get('q') ?? undefined

  try {
    const supabase = await createClient()
    let query = supabase
      .from('items')
      .select('id,title,category,subcategory,thumbnail_url,is_free,price,downloads,rating,rating_count,tags,creator_id,created_at,users(name,avatar_url)', { count: 'exact' })
      .eq('status', 'approved')

    if (category)    query = query.eq('category', category)
    if (subcategory) query = query.eq('subcategory', subcategory)
    if (search)      query = query.ilike('title', `%${search}%`)

    switch (sortBy) {
      case 'rating':  query = query.order('rating',     { ascending: false }); break
      case 'newest':  query = query.order('created_at', { ascending: false }); break
      default:        query = query.order('downloads',  { ascending: false }); break
    }

    const { data, error, count } = await query.range(offset, offset + limit - 1)
    if (error) throw error

    return NextResponse.json(
      { items: data, total: count ?? 0, limit, offset },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=60',
          'X-Total-Count': String(count ?? 0),
        },
      }
    )
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, category, subcategory, tags, thumbnail_url, is_free, price, creator_id } = body

    if (!title || !category || !creator_id) {
      return NextResponse.json({ error: 'Missing required fields: title, category, creator_id' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('items')
      .insert({ title, description, category, subcategory, tags: tags ?? [], thumbnail_url, is_free: is_free ?? true, price: price ?? 0, creator_id, status: 'pending' })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ item: data }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
  }
}
