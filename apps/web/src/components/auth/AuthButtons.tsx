'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

function ClerkAuthButtons() {
  const { UserButton, SignInButton, useUser } = require('@clerk/nextjs')
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return (
      <>
        <Link
          href="/dashboard/customer"
          className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors"
        >
          My Downloads
        </Link>
        <UserButton afterSignOutUrl="/" />
      </>
    )
  }

  return (
    <>
      <SignInButton mode="modal">
        <button className="hidden md:inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors">
          Log in
        </button>
      </SignInButton>
      <SignInButton mode="modal">
        <button className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors">
          Get started free
        </button>
      </SignInButton>
    </>
  )
}

function GuestButtons() {
  return (
    <>
      <Link
        href="/dashboard/customer"
        className="hidden md:flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg hover:bg-accent transition-colors"
      >
        My Downloads
      </Link>
      <Link
        href="/pricing"
        className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors"
      >
        Get started free
      </Link>
    </>
  )
}

export function AuthButtons() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  return hasClerk ? <ClerkAuthButtons /> : <GuestButtons />
}
