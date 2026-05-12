'use client'

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

interface SafeUser {
  fullName?: string | null
  emailAddresses?: { emailAddress: string }[]
}

export function useSafeUser(): { user: SafeUser | null; isSignedIn: boolean } {
  if (!hasClerk) return { user: null, isSignedIn: false }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { useUser } = require('@clerk/nextjs')
  // Safe to call — we are inside ClerkProvider when hasClerk is true
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useUser()
}
