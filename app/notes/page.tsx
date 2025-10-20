import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardLayout from '@/components/layout/DashboardLayout'
import NotesContent from './NotesContent'

export default async function NotesPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <NotesContent />
    </DashboardLayout>
  )
}
