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

    let query = supabase.from('annotazioni').select('*')

    if (date) {
      query = query.eq('data', date)
    } else {
      query = query.gte('data', new Date().toISOString().split('T')[0])
    }

    const { data, error } = await query.order('data', { ascending: true })

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('GET notes error:', error)
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
    const { data, error } = await supabase.from('annotazioni').insert({ ...body }).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('POST note error:', error)
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
    const { id_annotazione, ...updateData } = body
    const { error } = await supabase.from('annotazioni').update(updateData).eq('id_annotazione', id_annotazione)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('PUT note error:', error)
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

    const { error } = await supabase.from('annotazioni').delete().eq('id_annotazione', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE note error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
