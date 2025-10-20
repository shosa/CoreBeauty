'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PinAuthProps {
  mode: 'login' | 'create' | 'verify'
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PinAuth({ mode, onSuccess, onCancel }: PinAuthProps) {
  const [pin, setPin] = useState<string[]>([])
  const [confirmPin, setConfirmPin] = useState<string[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const PIN_LENGTH = 4

  useEffect(() => {
    // Vibrate on error
    if (error && 'vibrate' in navigator) {
      navigator.vibrate([50, 50, 50])
    }
  }, [error])

  const handleNumberClick = async (num: number) => {
    if (isLoading) return

    const currentPin = isConfirming ? confirmPin : pin
    const setCurrentPin = isConfirming ? setConfirmPin : setPin

    if (currentPin.length < PIN_LENGTH) {
      const newPin = [...currentPin, num.toString()]
      setCurrentPin(newPin)
      setError('')

      // Vibrate on tap
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }

      // Auto-submit when PIN is complete
      if (newPin.length === PIN_LENGTH) {
        await handlePinComplete(newPin)
      }
    }
  }

  const handlePinComplete = async (completedPin: string[]) => {
    const pinString = completedPin.join('')

    if (mode === 'create') {
      if (!isConfirming) {
        // First entry, ask for confirmation
        setIsConfirming(true)
      } else {
        // Confirmation entry
        if (pin.join('') === pinString) {
          // PINs match, create account
          await handleCreatePin(pinString)
        } else {
          setError('I PIN non corrispondono')
          setConfirmPin([])
          setIsConfirming(false)
          setPin([])
        }
      }
    } else if (mode === 'login') {
      await handleLogin(pinString)
    }
  }

  const handleCreatePin = async (pinString: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/create-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinString })
      })

      const data = await response.json()

      if (data.success) {
        onSuccess?.()
        router.push('/dashboard')
      } else {
        setError(data.error || 'Errore nella creazione del PIN')
        setPin([])
        setConfirmPin([])
        setIsConfirming(false)
      }
    } catch (err) {
      setError('Errore di connessione')
      setPin([])
      setConfirmPin([])
      setIsConfirming(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (pinString: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinString })
      })

      const data = await response.json()

      if (data.success) {
        onSuccess?.()
        router.push('/dashboard')
      } else {
        setError('PIN errato')
        setPin([])
      }
    } catch (err) {
      setError('Errore di connessione')
      setPin([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    if (isLoading) return

    const currentPin = isConfirming ? confirmPin : pin
    const setCurrentPin = isConfirming ? setConfirmPin : setPin

    if (currentPin.length > 0) {
      setCurrentPin(currentPin.slice(0, -1))
      setError('')

      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }
  }

  const currentPin = isConfirming ? confirmPin : pin

  const getTitle = () => {
    if (mode === 'create') {
      return isConfirming ? 'Conferma il tuo PIN' : 'Crea un PIN'
    }
    return 'Inserisci PIN'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 shadow-lg">
            <span className="material-icons text-5xl text-primary">spa</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">CoreBeauty</h1>
          <p className="text-white/80">Gestione Professionale</p>
        </div>

        {/* PIN Input */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white text-center mb-2">
            {getTitle()}
          </h2>

          {mode === 'create' && !isConfirming && (
            <p className="text-white/70 text-sm text-center mb-6">
              Crea un PIN di 4 cifre per proteggere i tuoi dati
            </p>
          )}

          {/* PIN Dots */}
          <div className="flex justify-center gap-4 mb-8">
            {[...Array(PIN_LENGTH)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  i < currentPin.length
                    ? 'bg-white scale-110'
                    : 'bg-white/30 scale-100'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-danger/20 border border-danger/50 rounded-lg p-3 mb-4 animate-shake">
              <p className="text-white text-sm text-center">{error}</p>
            </div>
          )}

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={isLoading}
                className="aspect-square bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white text-2xl font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                {num}
              </button>
            ))}

            {/* Empty space */}
            <div />

            {/* Zero */}
            <button
              onClick={() => handleNumberClick(0)}
              disabled={isLoading}
              className="aspect-square bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white text-2xl font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              0
            </button>

            {/* Delete */}
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="aspect-square bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full text-white flex items-center justify-center transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <span className="material-icons">backspace</span>
            </button>
          </div>

          {/* Cancel Button (only in create mode) */}
          {mode === 'create' && onCancel && (
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="w-full py-3 text-white/80 hover:text-white transition-colors disabled:opacity-50"
            >
              Annulla
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/60 text-sm">
            {mode === 'login' ? 'Hai dimenticato il PIN?' : 'Scegli un PIN facile da ricordare'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  )
}
