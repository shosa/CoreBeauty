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

    // Check if a PIN already exists
    const { data: existingPin, error: selectError } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'pin_hash')
      .single()

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = 'Not a single row' (i.e., not found)
      console.error('Error checking for existing PIN:', selectError)
      return NextResponse.json(
        { success: false, error: 'Error checking for PIN' },
        { status: 500 }
      )
    }

    if (existingPin) {
      return NextResponse.json(
        { success: false, error: 'A PIN has already been set up.' },
        { status: 409 } // 409 Conflict
      )
    }

    // Hash the new PIN
    const pin_hash = await bcrypt.hash(pin, 10)

    // Store the hashed PIN in the config table
    const { error: insertError } = await supabase
      .from('config')
      .insert({ key: 'pin_hash', value: pin_hash })

    if (insertError) {
      console.error('Error saving new PIN:', insertError)
      return NextResponse.json(
        { success: false, error: 'Failed to save PIN' },
        { status: 500 }
      )
    }
    
    // Log the user in immediately
    const session = await getSession()
    session.isAuthenticated = true
    await session.save()

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Create PIN error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Server Error' },
      { status: 500 }
    )
  }
}
