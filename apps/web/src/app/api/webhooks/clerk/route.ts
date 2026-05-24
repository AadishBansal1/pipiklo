/**
 * Clerk → Supabase sync webhook.
 * Keeps public.users in sync when Clerk users are created/updated/deleted.
 */
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'edge'

type ClerkEvent =
  | { type: 'user.created' | 'user.updated'; data: ClerkUser }
  | { type: 'user.deleted'; data: { id: string } }

interface ClerkUser {
  id: string
  first_name: string | null
  last_name: string | null
  image_url: string | null
  email_addresses: { email_address: string; id: string }[]
  primary_email_address_id: string | null
  public_metadata: Record<string, unknown>
}

function getPrimaryEmail(user: ClerkUser): string {
  const primary = user.email_addresses.find(
    (e) => e.id === user.primary_email_address_id
  )
  return primary?.email_address ?? user.email_addresses[0]?.email_address ?? ''
}

export async function POST(req: NextRequest) {
  const headersList = await headers()

  // Basic header validation (add Svix verification in production with CLERK_WEBHOOK_SECRET)
  const svixId = headersList.get('svix-id')
  if (!svixId) {
    return NextResponse.json({ error: 'Missing svix-id header' }, { status: 400 })
  }

  let event: ClerkEvent
  try {
    event = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const supabase = await createClient()

  try {
    switch (event.type) {
      case 'user.created':
      case 'user.updated': {
        const u = event.data
        const name = [u.first_name, u.last_name].filter(Boolean).join(' ') || 'User'
        const role = (u.public_metadata?.role as string) ?? 'customer'

        await supabase.from('users').upsert(
          {
            id: u.id,
            email: getPrimaryEmail(u),
            name,
            avatar_url: u.image_url,
            role,
          },
          { onConflict: 'id' }
        )
        break
      }

      case 'user.deleted': {
        await supabase.from('users').delete().eq('id', event.data.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[clerk-webhook]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
