'use client'

import { useEffect, useState } from 'react'
import { format, addDays, subDays, isToday } from 'date-fns'
import { it } from 'date-fns/locale'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import AppointmentModal from '@/components/appointments/AppointmentModal'

interface Stats {
  appointments_count: number
  completed_count: number
  pending_count: number
  clients_count: number
  revenue: string
}

interface Appointment {
  id_appuntamento: number
  data_appuntamento: string
  note: string
  completato: boolean
  clienti: {
    nome_cliente: string
    numero_telefono: string
  }
  servizi: {
    nome_servizio: string
    tempo_medio: number
    costo: number
    categoria: string
  }
}

export default function DashboardContent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [todayStats, setTodayStats] = useState<Stats | null>(null)
  const [weekStats, setWeekStats] = useState<Stats | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadData()

    // Listen for goToToday event
    const handleGoToToday = () => {
      setCurrentDate(new Date())
    }

    window.addEventListener('goToToday', handleGoToToday)
    return () => window.removeEventListener('goToToday', handleGoToToday)
  }, [])

  useEffect(() => {
    loadAppointments()
  }, [currentDate])

  const loadData = async () => {
    try {
      // Load stats
      const [todayRes, weekRes] = await Promise.all([
        fetch('/api/stats?period=today'),
        fetch('/api/stats?period=week'),
      ])

      const todayData = await todayRes.json()
      const weekData = await weekRes.json()

      if (todayData.success) setTodayStats(todayData.data)
      if (weekData.success) setWeekStats(weekData.data)

      await loadAppointments()
    } catch (error) {
      toast.error('Errore nel caricamento dei dati')
    } finally {
      setIsLoading(false)
    }
  }

  const loadAppointments = async () => {
    try {
      const dateStr = format(currentDate, 'yyyy-MM-dd')
      const res = await fetch(`/api/appointments?date=${dateStr}`)
      const data = await res.json()

      if (data.success) {
        setAppointments(data.data || [])
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  const markCompleted = async (id: number) => {
    try {
      const res = await fetch('/api/appointments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_appuntamento: id, completato: true }),
      })

      if (res.ok) {
        toast.success('Appuntamento completato!')
        loadData()
      }
    } catch (error) {
      toast.error('Errore nell\'aggiornamento')
    }
  }

  const sendWhatsApp = (phone: string, date: string, time: string) => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
    const message = encodeURIComponent(
      `Ciao! Ti ricordo l'appuntamento per ${date} alle ore ${time}. A presto!`
    )
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
  }

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'pending') return !apt.completato
    if (filter === 'completed') return apt.completato
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-icons text-5xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-l-4 border-l-green-500 shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="material-icons text-primary text-2xl">today</span>
            </div>
            <span className="text-gray-600 font-medium">Oggi</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {todayStats?.appointments_count || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {todayStats?.pending_count || 0} in attesa • {todayStats?.completed_count || 0} completati
          </div>
        </div>

        <div className="bg-white border-l-4 border-l-blue-500 shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
              <span className="material-icons text-secondary text-2xl">date_range</span>
            </div>
            <span className="text-gray-600 font-medium">Settimana</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {weekStats?.appointments_count || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {weekStats?.clients_count || 0} clienti • €{weekStats?.revenue || '0.00'}
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="bg-white border-l-4 border-l-gray-500 shadow-md p-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          icon="chevron_left"
          onClick={() => setCurrentDate(subDays(currentDate, 1))}
        />

        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">
            {isToday(currentDate) ? 'Oggi' : format(currentDate, 'EEEE d MMMM', { locale: it })}
          </div>
          <div className="text-sm text-gray-500">
            {format(currentDate, 'yyyy', { locale: it })}
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon="chevron_right"
          onClick={() => setCurrentDate(addDays(currentDate, 1))}
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
              ${
                filter === f
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {f === 'all' && 'Tutti'}
            {f === 'pending' && 'In Attesa'}
            {f === 'completed' && 'Completati'}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border-l-4 border-l-gray-300 shadow-md p-12 text-center">
            <span className="material-icons text-6xl text-gray-300">event_available</span>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">Nessun appuntamento</h3>
            <p className="text-gray-500 mt-2">Non ci sono appuntamenti per questa data</p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id_appuntamento}
              className={`
                bg-white shadow-md p-4 border-l-4 transition-all hover:shadow-lg
                ${apt.completato ? 'border-success' : 'border-primary'}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-gray-400">schedule</span>
                    <span className="font-semibold text-gray-900">
                      {format(new Date(apt.data_appuntamento), 'HH:mm')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {apt.clienti.nome_cliente}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <span className="material-icons text-sm">spa</span>
                    <span>{apt.servizi.nome_servizio}</span>
                    <span>•</span>
                    <span>{apt.servizi.tempo_medio}min</span>
                    <span>•</span>
                    <span className="font-semibold">€{apt.servizi.costo}</span>
                  </div>

                  {apt.note && (
                    <div className="flex items-start gap-2 text-sm text-gray-500 mt-2">
                      <span className="material-icons text-sm">note</span>
                      <span>{apt.note}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {apt.clienti.numero_telefono && (
                    <button
                      onClick={() =>
                        sendWhatsApp(
                          apt.clienti.numero_telefono,
                          format(new Date(apt.data_appuntamento), 'd MMMM', { locale: it }),
                          format(new Date(apt.data_appuntamento), 'HH:mm')
                        )
                      }
                      className="p-2 bg-green-500 text-white shadow-md hover:bg-green-600 transition-colors"
                      title="Invia promemoria WhatsApp"
                    >
                      <span className="material-icons">chat</span>
                    </button>
                  )}

                  {!apt.completato && (
                    <button
                      onClick={() => markCompleted(apt.id_appuntamento)}
                      className="p-2 bg-success text-white shadow-md hover:bg-success/90 transition-colors"
                      title="Segna come completato"
                    >
                      <span className="material-icons">check</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAppointmentModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all z-30 flex items-center justify-center"
        title="Nuovo appuntamento"
      >
        <span className="material-icons text-2xl">add</span>
      </button>

      {/* Appointment Modal */}
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSuccess={loadData}
        date={currentDate}
      />
    </>
  )
}
