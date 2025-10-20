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
    const date = searchParams.get('date')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')
    const clientId = searchParams.get('client_id')

    let query = supabase
      .from('appuntamenti')
      .select(`
        *,
        clienti:id_cliente (nome_cliente, numero_telefono, email),
        servizi:id_servizio (nome_servizio, tempo_medio, costo, categoria)
      `)

    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      query = query.gte('data_appuntamento', startOfDay.toISOString()).lte('data_appuntamento', endOfDay.toISOString())
    } else if (startDate && endDate) {
      query = query.gte('data_appuntamento', startDate).lte('data_appuntamento', endDate)
    } else if (clientId) {
      query = query.eq('id_cliente', clientId).order('data_appuntamento', { ascending: false }).limit(50)
    } else {
      query = query.gte('data_appuntamento', new Date().toISOString()).order('data_appuntamento', { ascending: true }).limit(100)
    }

    const { data, error } = await query.order('data_appuntamento', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET appointments error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { error } = await supabase.from('appuntamenti').insert({ ...body })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('POST appointment error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const body = await request.json()
    const { id_appuntamento, ...updateData } = body
    const { error } = await supabase.from('appuntamenti').update(updateData).eq('id_appuntamento', id_appuntamento)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT appointment error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session.isAuthenticated) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 })
    }

    const { error } = await supabase.from('appuntamenti').delete().eq('id_appuntamento', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE appointment error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
