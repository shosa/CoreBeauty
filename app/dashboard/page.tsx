import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardLayout from '@/components/layout/DashboardLayout'
import DashboardContent from './DashboardContent'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  )
}
