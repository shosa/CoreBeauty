import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'PIN deve essere di 4 cifre' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get current session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Sessione non valida' },
        { status: 401 }
      )
    }

    // Get user profile with PIN hash
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Utente non trovato' },
        { status: 404 }
      )
    }

    // Verify PIN
    const isValid = await bcrypt.compare(pin, user.pin_hash)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'PIN errato' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('Verify PIN error:', error)
    return NextResponse.json(
      { success: false, error: 'Errore del server' },
      { status: 500 }
    )
  }
}
