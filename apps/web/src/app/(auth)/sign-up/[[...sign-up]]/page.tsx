import { redirect } from 'next/navigation'

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    redirect('/')
  }

  // Dynamically import so the module isn't evaluated without ClerkProvider
  const { SignUp } = require('@clerk/nextjs')
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignUp />
    </div>
  )
}
