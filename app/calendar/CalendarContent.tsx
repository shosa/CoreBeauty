'use client'

import { useState, useEffect } from 'react'
import Calendar from '@/components/calendar/Calendar'
import AppointmentModal from '@/components/appointments/AppointmentModal'
import { Fab } from '@/components/ui/Fab'

export default function CalendarContent() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/appointments')
      const result = await response.json()
      if (result.success) {
        setAppointments(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  const handleSelectEvent = (event: any) => {
    setSelectedAppointment(event)
    setIsModalOpen(true)
  }

  const handleSelectSlot = (start: Date, end: Date) => {
    setSelectedAppointment({ data_appuntamento: start.toISOString(), tempo_servizio: (end.getTime() - start.getTime()) / 60000 })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAppointment(null)
    fetchAppointments() // Refetch appointments after modal closes
  }

  return (
    <div>
      {loading ? <div>Loading...</div> : <Calendar appointments={appointments} onSelectEvent={handleSelectEvent} onSelectSlot={handleSelectSlot} />}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        appointment={selectedAppointment}
      />
      <Fab onClick={() => setIsModalOpen(true)} />
    </div>
  )
}
