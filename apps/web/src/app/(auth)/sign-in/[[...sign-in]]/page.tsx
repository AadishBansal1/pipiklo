import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-500/15 blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px]" />
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-2xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
            socialButtonsBlockButtonText: 'text-white',
            dividerLine: 'bg-white/10',
            dividerText: 'text-slate-500',
            formFieldLabel: 'text-slate-400',
            formFieldInput: 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-violet-500/50',
            formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white',
            footerActionText: 'text-slate-500',
            footerActionLink: 'text-violet-400 hover:text-violet-300',
            identityPreviewText: 'text-white',
            identityPreviewEditButton: 'text-violet-400',
          },
        }}
        fallbackRedirectUrl="/dashboard/customer"
        signUpUrl="/sign-up"
      />
    </div>
  )
}
