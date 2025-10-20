import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSession } from '@/lib/session'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'today'

    let startDate: Date
    const now = new Date()

    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0))
        break
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - now.getDay()))
        startDate.setHours(0, 0, 0, 0)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0))
    }

    const { data: appointments, error } = await supabase
      .from('appuntamenti')
      .select(`
        *,
        servizi:id_servizio (costo)
      `)
      .gte('data_appuntamento', startDate.toISOString())

    if (error) throw error

    const appointmentsCount = appointments?.length || 0
    const completedCount = appointments?.filter((a) => a.completato).length || 0
    const pendingCount = appointmentsCount - completedCount
    const revenue = appointments
      ?.filter((a) => a.completato)
      .reduce((sum, a) => sum + (parseFloat(a.servizi?.costo || '0')), 0) || 0
    const uniqueClients = new Set(appointments?.map((a) => a.id_cliente)).size

    return NextResponse.json({
      success: true,
      data: {
        appointments_count: appointmentsCount,
        completed_count: completedCount,
        pending_count: pendingCount,
        clients_count: uniqueClients,
        revenue: revenue.toFixed(2),
      },
    })
  } catch (error) {
    console.error('GET stats error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
