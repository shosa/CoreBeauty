import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardLayout from '@/components/layout/DashboardLayout'
import SettingsContent from './SettingsContent'

export default async function SettingsPage() {
  const session = await getSession()

  if (!session.isAuthenticated) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  )
}
