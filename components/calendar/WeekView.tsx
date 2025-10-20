'use client'

import { useState, useEffect } from 'react'
import { format, startOfWeek, addDays, isSameDay, parseISO, getHours, getMinutes, setHours, setMinutes } from 'date-fns'
import { it } from 'date-fns/locale'

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => i) // 0-23 hours

export default function WeekView({ appointments }: { appointments: any[] }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 })) // Monday

  const daysOfWeek = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const goToPreviousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7))
  }

  const goToNextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7))
  }

  const goToToday = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
  }

  const getAppointmentsForSlot = (day: Date, hour: number) => {
    return appointments.filter(apt => {
      const aptDate = parseISO(apt.data_appuntamento)
      return isSameDay(aptDate, day) && getHours(aptDate) === hour
    }).sort((a, b) => getMinutes(parseISO(a.data_appuntamento)) - getMinutes(parseISO(b.data_appuntamento)))
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <button onClick={goToPreviousWeek} className="p-2 rounded-lg hover:bg-gray-100"><span className="material-icons">chevron_left</span></button>
        <h2 className="text-xl font-bold">
          {format(currentWeekStart, 'dd MMM', { locale: it })} - {format(addDays(currentWeekStart, 6), 'dd MMM yyyy', { locale: it })}
        </h2>
        <button onClick={goToNextWeek} className="p-2 rounded-lg hover:bg-gray-100"><span className="material-icons">chevron_right</span></button>
        <button onClick={goToToday} className="p-2 rounded-lg hover:bg-gray-100">Oggi</button>
      </div>

      <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-lg overflow-hidden shadow">
        {/* Corner Header */}
        <div className="h-16 bg-gray-100"></div>

        {/* Day Headers */}
        {daysOfWeek.map(day => (
          <div key={day.toISOString()} className="h-16 flex flex-col items-center justify-center bg-gray-100 text-sm font-medium">
            <span>{format(day, 'EEE', { locale: it })}</span>
            <span className="text-lg font-bold">{format(day, 'dd')}</span>
          </div>
        ))}

        {/* Time Slots and Appointments */}
        {TIME_SLOTS.map(hour => (
          <>
            {/* Time Label */}
            <div className="h-16 flex items-center justify-center bg-gray-100 text-xs font-medium border-t border-gray-200">
              {format(setMinutes(setHours(currentWeekStart, hour), 0), 'HH:mm')}
            </div>
            {/* Day Cells */}
            {daysOfWeek.map(day => (
              <div key={`${day.toISOString()}-${hour}`} className="h-16 border-t border-gray-200 bg-white relative group">
                {getAppointmentsForSlot(day, hour).map(apt => (
                  <div
                    key={apt.id_appuntamento}
                    className="absolute w-[calc(100%-4px)] bg-blue-200 text-blue-800 rounded-lg p-1 text-xs overflow-hidden whitespace-nowrap truncate"
                    style={{
                      top: `${getMinutes(parseISO(apt.data_appuntamento)) / 60 * 100}%`,
                      height: `${apt.tempo_servizio / 60 * 100}%`,
                    }}
                  >
                    {apt.clienti.nome_cliente} - {apt.servizi.nome_servizio}
                  </div>
                ))}
              </div>
            ))}
          </>
        ))}
      </div>
    </div>
  )
}