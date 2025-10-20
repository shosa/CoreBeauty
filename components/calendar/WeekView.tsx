'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, getHours, getMinutes, setHours, setMinutes } from 'date-fns'
import { it } from 'date-fns/locale'


const TIME_SLOTS = Array.from({ length: 17 }, (_, i) => i + 7) // 07-23 hours

// Zoom levels for different views
const ZOOM_LEVELS = {
  week: { slotHeight: 60, showMinutes: false },
  day: { slotHeight: 120, showMinutes: true }
}

export default function WeekView({ appointments, onSelectEvent, onSelectSlot }: { appointments: any[], onSelectEvent: (event: any) => void, onSelectSlot: (start: Date, end: Date) => void }) {
  const [currentDay, setCurrentDay] = useState(new Date())
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const goToPreviousDay = () => {
    setCurrentDay(addDays(currentDay, -1))
  }

  const goToNextDay = () => {
    setCurrentDay(addDays(currentDay, 1))
  }

  const goToToday = () => {
    setCurrentDay(new Date())
  }

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    return appointments.filter(apt => {
      const aptDate = new Date(apt.data_appuntamento)
      return isSameDay(aptDate, day) && getHours(aptDate) === hour
    }).sort((a, b) => getMinutes(new Date(a.data_appuntamento)) - getMinutes(new Date(b.data_appuntamento)))
  }

  const handleSlotClick = (day: Date, hour: number) => {
    const start = setMinutes(setHours(day, hour), 0)
    const end = setMinutes(setHours(day, hour), 30) // Default 30 min slot
    onSelectSlot(start, end)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={goToPreviousDay} className="p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-gray-600">chevron_left</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {format(currentDay, 'EEEE d MMMM yyyy', { locale: it })}
          </h2>
          <button onClick={goToNextDay} className="p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-gray-600">chevron_right</span>
          </button>
        </div>
        <button onClick={goToToday} className="px-4 py-2 bg-primary text-white shadow-sm hover:shadow-md transition-colors">
          Oggi
        </button>
      </div>

      {/* Time slots */}
      <div className="space-y-2">
        {TIME_SLOTS.map(hour => {
          const hourAppointments = getAppointmentsForSlot(currentDay, hour)
          return (
            <div key={hour} className="flex items-start gap-3">
              {/* Time label */}
              <div className="flex items-center justify-center w-16 h-16 bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                {format(setMinutes(setHours(currentDay, hour), 0), 'HH:mm')}
              </div>

              {/* Hour slot */}
              <div
                className={`flex-1 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-primary hover:bg-primary/5 cursor-pointer transition-all duration-200 p-2 ${
                  hourAppointments.length === 0 ? 'min-h-[50px]' : 'min-h-[70px]'
                }`}
                onClick={() => handleSlotClick(currentDay, hour)}
              >
                {hourAppointments.map(apt => (
                  <div
                    key={apt.id_appuntamento}
                    className="bg-white border-l-4 border-l-primary shadow-sm hover:shadow-md cursor-pointer p-2 transition-shadow"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectEvent(apt)
                    }}
                  >
                    <div className="font-medium text-gray-900 text-sm truncate">{apt.clienti.nome_cliente}</div>
                    <div className="text-xs text-gray-600 truncate">{apt.servizi.nome_servizio}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {format(new Date(apt.data_appuntamento), 'HH:mm')} - {apt.tempo_servizio}min
                    </div>
                  </div>
                ))}
                {hourAppointments.length === 0 && (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <span className="text-xs">Libero</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}