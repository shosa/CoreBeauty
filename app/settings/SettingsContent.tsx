'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

const PRESET_THEMES = [
  { name: 'Rosa (Default)', primary: '#e91e63', secondary: '#9c27b0' },
  { name: 'Viola', primary: '#9c27b0', secondary: '#673ab7' },
  { name: 'Blu', primary: '#2196f3', secondary: '#1976d2' },
  { name: 'Verde', primary: '#4caf50', secondary: '#388e3c' },
  { name: 'Arancione', primary: '#ff9800', secondary: '#f57c00' },
  { name: 'Teal', primary: '#009688', secondary: '#00796b' },
]

export default function SettingsContent() {
  const [selectedTheme, setSelectedTheme] = useState(PRESET_THEMES[0])
  const [isChangePinModalOpen, setIsChangePinModalOpen] = useState(false)
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()
  const router = useRouter()

  const handleThemeChange = (theme: typeof PRESET_THEMES[0]) => {
    setSelectedTheme(theme)
    // Update CSS variables
    document.documentElement.style.setProperty('--primary', theme.primary)
    document.documentElement.style.setProperty('--secondary', theme.secondary)
    toast.success('Tema aggiornato!')
  }

  const handleChangePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPin.length !== 4 || confirmPin.length !== 4) {
      toast.error('Il PIN deve essere di 4 cifre')
      return
    }

    if (newPin !== confirmPin) {
      toast.error('I PIN non corrispondono')
      return
    }

    setIsSaving(true)

    try {
      // First verify current PIN
      const verifyRes = await fetch('/api/auth/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: currentPin }),
      })

      if (!verifyRes.ok) {
        toast.error('PIN attuale errato')
        setIsSaving(false)
        return
      }

      // TODO: Add API endpoint to change PIN
      toast.warning('Funzionalità in sviluppo')
      setIsChangePinModalOpen(false)
      setCurrentPin('')
      setNewPin('')
      setConfirmPin('')
    } catch (error) {
      toast.error('Errore nell\'aggiornamento del PIN')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    if (!confirm('Vuoi davvero uscire?')) return

    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/auth/login')
    } catch (error) {
      toast.error('Errore nel logout')
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Impostazioni</h1>
        <p className="text-gray-600 mt-1">Personalizza la tua esperienza CoreBeauty</p>
      </div>

      {/* Theme Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons text-primary text-2xl">palette</span>
          <h2 className="text-xl font-bold text-gray-900">Tema Colori</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Scegli il tema che preferisci per personalizzare l'interfaccia
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PRESET_THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme)}
              className={`
                p-4 rounded-xl border-2 transition-all
                ${
                  selectedTheme.name === theme.name
                    ? 'border-primary shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full shadow-md"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-8 h-8 rounded-full shadow-md"
                  style={{ backgroundColor: theme.secondary }}
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">{theme.name}</div>
                {selectedTheme.name === theme.name && (
                  <div className="text-sm text-primary mt-1 flex items-center gap-1">
                    <span className="material-icons text-sm">check_circle</span>
                    Attivo
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons text-primary text-2xl">account_circle</span>
          <h2 className="text-xl font-bold text-gray-900">Account</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="font-semibold text-gray-900">PIN di Sicurezza</div>
              <div className="text-sm text-gray-600">Modifica il tuo PIN di accesso</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon="lock"
              onClick={() => setIsChangePinModalOpen(true)}
            >
              Modifica
            </Button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-semibold text-gray-900">Logout</div>
              <div className="text-sm text-gray-600">Esci dall'applicazione</div>
            </div>
            <Button variant="danger" size="sm" icon="logout" onClick={handleLogout}>
              Esci
            </Button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons text-primary text-2xl">info</span>
          <h2 className="text-xl font-bold text-gray-900">Informazioni App</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Nome</span>
            <span className="font-semibold text-gray-900">CoreBeauty</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Versione</span>
            <span className="font-semibold text-gray-900">1.0.0</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Piattaforma</span>
            <span className="font-semibold text-gray-900">Next.js + Supabase</span>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-icons text-primary text-2xl">storage</span>
          <h2 className="text-xl font-bold text-gray-900">Gestione Dati</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              I tuoi dati sono salvati in modo sicuro su Supabase e protetti con Row Level
              Security. Solo tu puoi accedere ai tuoi dati.
            </p>
          </div>

          <Button variant="outline" icon="download" fullWidth>
            Esporta Dati (Prossimamente)
          </Button>
        </div>
      </div>

      {/* Change PIN Modal */}
      <Modal
        isOpen={isChangePinModalOpen}
        onClose={() => setIsChangePinModalOpen(false)}
        title="Modifica PIN"
        icon="lock"
        size="sm"
      >
        <form onSubmit={handleChangePinSubmit} className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Assicurati di ricordare il nuovo PIN. Non sarà possibile recuperarlo se dimenticato.
            </p>
          </div>

          <Input
            label="PIN Attuale"
            type="password"
            maxLength={4}
            value={currentPin}
            onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            required
            fullWidth
          />

          <Input
            label="Nuovo PIN"
            type="password"
            maxLength={4}
            value={newPin}
            onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            required
            fullWidth
          />

          <Input
            label="Conferma Nuovo PIN"
            type="password"
            maxLength={4}
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            placeholder="••••"
            required
            fullWidth
          />

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsChangePinModalOpen(false)}
              fullWidth
            >
              Annulla
            </Button>
            <Button type="submit" variant="primary" icon="save" isLoading={isSaving} fullWidth>
              Aggiorna PIN
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
