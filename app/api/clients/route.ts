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
    const search = searchParams.get('search')
    const id = searchParams.get('id')

    if (id) {
      // Single client
      const { data, error } = await supabase
        .from('clienti')
        .select('*')
        .eq('id_cliente', id)
        .eq('user_id', session.user.id)
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    let query = supabase
      .from('clienti')
      .select('*')
      .eq('user_id', session.user.id)

    if (search) {
      query = query.or(`nome_cliente.ilike.%${search}%,numero_telefono.ilike.%${search}%`)
    }

    const { data, error } = await query.order('nome_cliente', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET clients error:', error)
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 })
    }

    const body = await request.json()

    const { data, error } = await supabase
      .from('clienti')
      .insert({
        ...body,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST client error:', error)
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 })
    }

    const body = await request.json()
    const { id_cliente, ...updateData } = body

    const { error } = await supabase
      .from('clienti')
      .update(updateData)
      .eq('id_cliente', id_cliente)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT client error:', error)
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID richiesto' }, { status: 400 })
    }

    const { error } = await supabase
      .from('clienti')
      .delete()
      .eq('id_cliente', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE client error:', error)
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}
