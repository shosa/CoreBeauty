import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 })
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

    // Get appointments for period
    const { data: appointments, error } = await supabase
      .from('appuntamenti')
      .select(`
        *,
        servizi:id_servizio (costo)
      `)
      .eq('user_id', session.user.id)
      .gte('data_appuntamento', startDate.toISOString())

    if (error) throw error

    // Calculate stats
    const appointmentsCount = appointments?.length || 0
    const completedCount = appointments?.filter((a) => a.completato).length || 0
    const pendingCount = appointmentsCount - completedCount

    // Calculate revenue (only completed)
    const revenue = appointments
      ?.filter((a) => a.completato)
      .reduce((sum, a) => sum + (parseFloat(a.servizi?.costo || '0')), 0) || 0

    // Unique clients
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
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}
