import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      fullName, email, instagramHandle, otherPlatforms, niche,
      reachBracket, avgLikes, avgComments, postFrequency,
      aiTools, recentCollabBrand, recentCollabUrl,
      recentCollabDescription, portfolioUrl, whyJoin,
    } = body

    // Basic validation
    if (!fullName || !email || !instagramHandle || !niche || !reachBracket || !aiTools?.length || !whyJoin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check duplicate application (same Instagram handle)
    const { data: existing } = await supabase
      .from('influencer_applications')
      .select('id, status')
      .eq('instagram_handle', instagramHandle.toLowerCase())
      .single()

    if (existing) {
      const msg = existing.status === 'approved'
        ? 'This Instagram account is already an approved creator.'
        : 'An application for this Instagram account is already under review.'
      return NextResponse.json({ error: msg }, { status: 409 })
    }

    // Credit mapping
    const CREDIT_MAP: Record<string, number> = {
      '1k-5k': 50, '5k-10k': 100, '10k-50k': 200,
      '50k-100k': 350, '100k-500k': 600, '500k-1m': 1000, '1m+': 2000,
    }

    const { data, error } = await supabase
      .from('influencer_applications')
      .insert({
        full_name:               fullName,
        email:                   email.toLowerCase(),
        instagram_handle:        instagramHandle.toLowerCase(),
        other_platforms:         otherPlatforms || null,
        niche,
        reach_bracket:           reachBracket,
        avg_likes:               parseInt(avgLikes) || 0,
        avg_comments:            parseInt(avgComments) || 0,
        post_frequency:          postFrequency || null,
        ai_tools:                aiTools,
        recent_collab_brand:     recentCollabBrand || null,
        recent_collab_url:       recentCollabUrl || null,
        recent_collab_description: recentCollabDescription || null,
        portfolio_url:           portfolioUrl || null,
        why_join:                whyJoin,
        credits_if_approved:     CREDIT_MAP[reachBracket] ?? 50,
        status:                  'pending',
        applied_at:              new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      applicationId: data.id,
      message: 'Application submitted successfully. We\'ll review within 48 hours.',
    })

  } catch (err: any) {
    console.error('[influencer/apply]', err)
    return NextResponse.json(
      { error: err.message || 'Failed to submit application' },
      { status: 500 }
    )
  }
}

// Admin: GET all applications (requires admin auth)
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get('status') || 'pending'

  const { data, error } = await supabase
    .from('influencer_applications')
    .select('*')
    .eq('status', status)
    .order('applied_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ applications: data })
}
