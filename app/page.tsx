import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Check if there are any users
    const { data: users } = await supabase.from('users').select('id').limit(1)

    if (!users || users.length === 0) {
      // First time setup
      redirect('/auth/setup')
    }

    // User exists, go to login
    redirect('/auth/login')
  }

  // User is logged in, go to dashboard
  redirect('/dashboard')
}
