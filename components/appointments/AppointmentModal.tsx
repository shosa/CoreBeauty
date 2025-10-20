'use client'

import { useState, useEffect, useRef } from 'react'
import { format } from 'date-fns'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface Client {
  id_cliente: number
  nome_cliente: string
  numero_telefono: string | null
}

interface Service {
  id_servizio: number
  nome_servizio: string
  tempo_medio: number
  costo: number
  categoria: string
}

interface AppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  appointment?: any // Can be a new slot or an existing appointment
}

const CATEGORY_COLORS = {
  VISO: '#FF6B6B',
  MANI: '#4ECDC4',
  PIEDI: '#45B7D1',
  CORPO: '#96CEB4',
  CERETTA: '#FFEAA7',
  ALTRO: '#A29BFE',
}

export default function AppointmentModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentModalProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedServices, setSelectedServices] = useState<number[]>([])
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [notes, setNotes] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewClientForm, setShowNewClientForm] = useState(false)
  const [newClientName, setNewClientName] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  const isEditing = appointment && appointment.id_appuntamento

  useEffect(() => {
    if (isOpen) {
      loadClients()
      loadServices()

      if (isEditing) {
        // Editing existing appointment
        const aptDate = new Date(appointment.data_appuntamento)
        setSelectedClient(appointment.clienti)
        setSearchTerm(appointment.clienti.nome_cliente)
        setSelectedServices([appointment.id_servizio])
        setAppointmentDate(format(aptDate, 'yyyy-MM-dd'))
        setAppointmentTime(format(aptDate, 'HH:mm'))
        setNotes(appointment.note || '')
      } else if (appointment && appointment.start) {
        // Creating new appointment from slot
        const aptDate = new Date(appointment.start)
        setAppointmentDate(format(aptDate, 'yyyy-MM-dd'))
        setAppointmentTime(format(aptDate, 'HH:mm'))
      } else {
        // Creating new appointment from FAB
        setAppointmentDate(format(new Date(), 'yyyy-MM-dd'))
        setAppointmentTime(getNextAvailableSlot())
      }
    }
  }, [isOpen, appointment, isEditing])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadClients = async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()
      if (data.success) {
        setClients(data.data || [])
      }
    } catch (error) {
      console.error('Error loading clients:', error)
    }
  }

  const loadServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (data.success) {
        setServices(data.data || [])
      }
    } catch (error) {
      console.error('Error loading services:', error)
    }
  }

  const filteredClients = clients.filter((client) =>
    client.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleClientSearch = (value: string) => {
    setSearchTerm(value)
    setShowSuggestions(value.length >= 2)
    if (value.length === 0) {
      setSelectedClient(null)
    }
  }

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setSearchTerm(client.nome_cliente)
    setShowSuggestions(false)
  }

  const handleServiceToggle = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    )
  }

  const handleCreateClient = async () => {
    if (!newClientName.trim()) {
      toast.error('Inserisci il nome del cliente')
      return
    }

    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome_cliente: newClientName,
          numero_telefono: newClientPhone || null,
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success('Cliente creato!')
        await loadClients()
        setSelectedClient(data.data)
        setSearchTerm(data.data.nome_cliente)
        setShowNewClientForm(false)
        setNewClientName('')
        setNewClientPhone('')
      } else {
        toast.error('Errore nella creazione del cliente')
      }
    } catch (error) {
      toast.error('Errore nella creazione del cliente')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedClient) {
      toast.error('Seleziona un cliente')
      return
    }

    if (selectedServices.length === 0) {
      toast.error('Seleziona almeno un servizio')
      return
    }

    setIsLoading(true)

    const method = isEditing ? 'PUT' : 'POST'
    const url = '/api/appointments'

    try {
      const service = services.find((s) => s.id_servizio === selectedServices[0])
      const dateTime = `${appointmentDate} ${appointmentTime}:00`

      const body = {
        id_cliente: selectedClient.id_cliente,
        id_servizio: selectedServices[0],
        data_appuntamento: dateTime,
        tempo_servizio: service?.tempo_medio || 60,
        note: notes || null,
        completato: isEditing ? appointment.completato : false,
      }

      if (isEditing) {
        (body as any).id_appuntamento = appointment.id_appuntamento
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(
          `Appuntamento ${isEditing ? 'aggiornato' : 'creato'}!`
        )
        handleClose()
      } else {
        toast.error('Errore durante il salvataggio dell\'appuntamento')
      }
    } catch (error) {
      toast.error('Errore durante il salvataggio dell\'appuntamento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSearchTerm('')
    setSelectedClient(null)
    setSelectedServices([])
    setAppointmentDate('')
    setAppointmentTime('')
    setNotes('')
    setShowSuggestions(false)
    setShowNewClientForm(false)
    setNewClientName('')
    setNewClientPhone('')
    onClose()
  }

  const getTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id_servizio === serviceId)
      return total + (service?.tempo_medio || 0)
    }, 0)
  }

  const getTotalCost = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id_servizio === serviceId)
      return total + (service?.costo || 0)
    }, 0)
  }

  const servicesByCategory = services.reduce((groups, service) => {
    const category = service.categoria || 'ALTRO'
    if (!groups[category]) groups[category] = []
    groups[category].push(service)
    return groups
  }, {} as Record<string, Service[]>)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={isEditing ? 'Modifica Appuntamento' : 'Nuovo Appuntamento'} icon="event">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Search */}
        <div className="relative">
          <Input
            label="Cliente"
            icon="person"
            value={searchTerm}
            onChange={(e) => handleClientSearch(e.target.value)}
            placeholder="Cerca cliente..."
            required
            fullWidth
          />

          {/* Suggestions */}
          {showSuggestions && filteredClients.length > 0 && (
            <div
              ref={suggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredClients.map((client) => (
                <button
                  key={client.id_cliente}
                  type="button"
                  onClick={() => handleClientSelect(client)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="font-semibold text-gray-900">{client.nome_cliente}</div>
                  {client.numero_telefono && (
                    <div className="text-sm text-gray-500">{client.numero_telefono}</div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showSuggestions && searchTerm.length >= 2 && filteredClients.length === 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
              <p className="text-gray-500 text-sm mb-3">Nessun cliente trovato</p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                icon="person_add"
                onClick={() => {
                  setShowNewClientForm(true)
                  setNewClientName(searchTerm)
                }}
                fullWidth
              >
                Crea nuovo cliente
              </Button>
            </div>
          )}
        </div>

        {/* New Client Form */}
        {showNewClientForm && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <span className="material-icons text-primary">person_add</span>
              Nuovo Cliente
            </h3>
            <Input
              label="Nome"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Nome completo"
              fullWidth
            />
            <Input
              label="Telefono (opzionale)"
              type="tel"
              value={newClientPhone}
              onChange={(e) => setNewClientPhone(e.target.value)}
              placeholder="+39 123 456 7890"
              fullWidth
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleCreateClient}
                fullWidth
              >
                Crea
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowNewClientForm(false)}
                fullWidth
              >
                Annulla
              </Button>
            </div>
          </div>
        )}

        {/* Services */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <span className="material-icons text-lg">spa</span>
            Servizi
          </label>
          <div className="space-y-4 max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4">
            {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
              <div key={category}>
                <h4
                  className="font-semibold text-sm mb-2"
                  style={{ color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] }}
                >
                  {category}
                </h4>
                <div className="space-y-2">
                  {categoryServices.map((service) => (
                    <label
                      key={service.id_servizio}
                      className={`
                        flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                        ${
                          selectedServices.includes(service.id_servizio)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                      style={{
                        borderLeftColor: selectedServices.includes(service.id_servizio)
                          ? CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                          : undefined,
                        borderLeftWidth: '4px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id_servizio)}
                        onChange={() => handleServiceToggle(service.id_servizio)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {service.nome_servizio}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.tempo_medio}min • €{service.costo}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {selectedServices.length > 0 && (
            <div className="mt-3 bg-primary/5 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {selectedServices.length} serviz{selectedServices.length > 1 ? 'i' : 'io'}{' '}
                  selezionat{selectedServices.length > 1 ? 'i' : 'o'}
                </span>
                <span className="font-semibold text-gray-900">
                  {getTotalDuration()}min • €{getTotalCost().toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Data"
            icon="calendar_today"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            fullWidth
          />
          <Input
            label="Ora"
            icon="schedule"
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            fullWidth
          />
        </div>

        {/* Notes */}
        <Textarea
          label="Note (opzionale)"
          icon="note"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Aggiungi note..."
          rows={3}
          fullWidth
        />

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleClose} fullWidth>
            Annulla
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon="save"
            isLoading={isLoading}
            fullWidth
          >
            Salva
          </Button>
        </div>
      </form>
    </Modal>
  )
}

function getNextAvailableSlot(): string {
  const now = new Date()
  let hour = now.getHours()
  let minute = Math.ceil(now.getMinutes() / 15) * 15

  if (minute >= 60) {
    hour += 1
    minute = 0
  }

  if (hour < 9) {
    hour = 9
    minute = 0
  } else if (hour >= 19) {
    hour = 9
    minute = 0
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}
