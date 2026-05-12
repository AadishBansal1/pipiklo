import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  // Clerk webhook handler — sync users to DB via NestJS API
  // Next.js 15: headers() is async
  const headersList = await headers()
  const svixId = headersList.get('svix-id')
  const svixTimestamp = headersList.get('svix-timestamp')
  const svixSignature = headersList.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const payload = await req.json()

  // Forward to NestJS API
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/webhooks/clerk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': svixSignature,
      },
      body: JSON.stringify(payload),
    })
  } catch (err) {
    console.error('Failed to forward clerk webhook:', err)
  }

  return NextResponse.json({ received: true })
}
