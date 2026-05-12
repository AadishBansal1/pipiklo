import { redirect } from 'next/navigation'

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    redirect('/')
  }

  const { SignIn } = require('@clerk/nextjs')
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <SignIn />
    </div>
  )
}
