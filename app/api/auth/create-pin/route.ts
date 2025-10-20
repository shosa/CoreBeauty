import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { pin, nome, email } = await request.json()

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'PIN deve essere di 4 cifre' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Hash the PIN
    const pin_hash = await bcrypt.hash(pin, 10)

    // Create anonymous user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email || `user_${Date.now()}@corebeauty.local`,
      password: crypto.randomUUID(), // Random password, we'll use PIN
    })

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: 'Errore nella creazione utente' },
        { status: 500 }
      )
    }

    // Create user profile with PIN
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        pin_hash,
        nome: nome || 'Operatore',
        email: email || null,
      })

    if (profileError) {
      return NextResponse.json(
        { success: false, error: 'Errore nel salvataggio profilo' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        nome: nome || 'Operatore',
      },
    })
  } catch (error) {
    console.error('Create PIN error:', error)
    return NextResponse.json(
      { success: false, error: 'Errore del server' },
      { status: 500 }
    )
  }
}
