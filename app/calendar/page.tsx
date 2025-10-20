import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardLayout from '@/components/layout/DashboardLayout'
import CalendarContent from './CalendarContent'

export default async function CalendarPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <CalendarContent />
    </DashboardLayout>
  )
}
