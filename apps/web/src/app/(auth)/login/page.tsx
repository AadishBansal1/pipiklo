import { redirect } from 'next/navigation'

// Old /login route — redirect to Clerk sign-in page
export default function OldLoginPage() {
  redirect('/sign-in')
}
