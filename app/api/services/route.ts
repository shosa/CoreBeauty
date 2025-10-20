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
    const id = searchParams.get('id')

    if (id) {
      const { data, error } = await supabase
        .from('servizi')
        .select('*')
        .eq('id_servizio', id)
        .eq('user_id', session.user.id)
        .single()

      if (error) throw error
      return NextResponse.json({ success: true, data })
    }

    const { data, error } = await supabase
      .from('servizi')
      .select('*')
      .eq('user_id', session.user.id)
      .order('categoria', { ascending: true })
      .order('nome_servizio', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET services error:', error)
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
      .from('servizi')
      .insert({
        ...body,
        user_id: session.user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST service error:', error)
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
    const { id_servizio, ...updateData } = body

    const { error } = await supabase
      .from('servizi')
      .update(updateData)
      .eq('id_servizio', id_servizio)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT service error:', error)
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
      .from('servizi')
      .delete()
      .eq('id_servizio', id)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE service error:', error)
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 })
  }
}
