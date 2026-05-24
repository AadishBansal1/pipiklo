import { redirect } from 'next/navigation'

// This route is no longer public — redirect to 404
export default function OldAdminLogin() {
  redirect('/404')
}
