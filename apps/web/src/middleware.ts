import { NextRequest, NextResponse } from 'next/server'

// When NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set, swap in the real Clerk middleware.
// Without it (local dev without keys) we skip auth so the UI is fully explorable.
async function getMiddleware() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null

  try {
    const { clerkMiddleware, createRouteMatcher } = await import('@clerk/nextjs/server')
    const isProtected = createRouteMatcher(['/dashboard(.*)', '/api/download(.*)'])
    return clerkMiddleware(async (auth, req) => {
      if (isProtected(req)) {
        await (await auth()).protect()
      }
    })
  } catch {
    return null
  }
}

type MiddlewareFn = (req: NextRequest) => Response | NextResponse | Promise<Response | NextResponse>
let _middleware: MiddlewareFn | null | undefined

export async function middleware(req: NextRequest) {
  if (_middleware === undefined) {
    _middleware = (await getMiddleware()) as MiddlewareFn | null
  }
  if (_middleware) return _middleware(req)
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
