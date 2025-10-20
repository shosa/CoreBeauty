import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ServicesContent from './ServicesContent'

export default async function ServicesPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <ServicesContent />
    </DashboardLayout>
  )
}
