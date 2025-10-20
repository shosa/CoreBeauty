import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { getSession } from '@/lib/session'

export async function POST(request: Request) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'PIN must be 4 digits' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Get the stored PIN hash from the config table
    const { data: pinConfig, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'pin_hash')
      .single()

    if (error || !pinConfig) {
      return NextResponse.json(
        { success: false, error: 'PIN not set up. Please set up a PIN first.' },
        { status: 404 } // Not Found, since the PIN isn't configured
      )
    }

    // Verify PIN
    const isValid = await bcrypt.compare(pin, pinConfig.value)

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid PIN' },
        { status: 401 }
      )
    }

    // If PIN is valid, create a session
    const session = await getSession()
    session.isAuthenticated = true
    await session.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Verify PIN error:', error)
    return NextResponse.json(
      { success: false, error: 'Server Error' },
      { status: 500 }
    )
  }
}
