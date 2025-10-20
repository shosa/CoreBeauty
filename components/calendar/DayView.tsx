import { useState } from 'react'
import { format, startOfDay, endOfDay, setHours, setMinutes, getHours, getMinutes, startOfWeek, addDays } from 'date-fns'
import { it } from 'date-fns/locale'

export default function DayView({ appointments, onSelectEvent, onSelectSlot }: { appointments: any[], onSelectEvent: (event: any) => void, onSelectSlot: (start: Date, end: Date) => void }) {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
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

  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.data_appuntamento), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, any[]>)

  const handleSlotClick = (date: string, hour: number, minute: number) => {
    const start = setMinutes(setHours(new Date(date), hour), minute)
    const end = setMinutes(setHours(new Date(date), hour), minute + 30) // Default 30 min slot
    onSelectSlot(start, end)
  }

  return (
    <div className="space-y-6">
      {/* Week navigation header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button onClick={goToPreviousWeek} className="p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-gray-600">chevron_left</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {format(currentWeekStart, 'dd MMM', { locale: it })} - {format(addDays(currentWeekStart, 6), 'dd MMM yyyy', { locale: it })}
          </h2>
          <button onClick={goToNextWeek} className="p-3 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="material-icons text-gray-600">chevron_right</span>
          </button>
        </div>
        <button onClick={goToToday} className="px-4 py-2 bg-primary text-white shadow-sm hover:shadow-md transition-colors">
          Questa settimana
        </button>
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {daysOfWeek.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayAppointments = groupedAppointments[dateKey] || []

          return (
            <div key={day.toISOString()} className="bg-white border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
              {/* Day header */}
              <div className="bg-primary text-white p-4">
                <h3 className="font-bold text-lg">{format(day, 'EEEE', { locale: it })}</h3>
                <p className="text-primary-100">{format(day, 'd MMMM', { locale: it })}</p>
              </div>

              {/* Appointments list */}
              <div className={`p-3 space-y-2 ${dayAppointments.length === 0 ? 'min-h-[80px]' : 'min-h-[160px]'}`}>
                {/* Group appointments by time */}
                {Object.entries(
                  dayAppointments.reduce((groups: Record<string, any[]>, appointment: any) => {
                    const timeKey = format(new Date(appointment.data_appuntamento), 'HH:mm')
                    if (!groups[timeKey]) groups[timeKey] = []
                    groups[timeKey].push(appointment)
                    return groups
                  }, {} as Record<string, any[]>)
                ).map(([time, timeAppointments]) => (
                  <div key={time} className="flex gap-2">
                    {/* Time badge */}
                    <div className="bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-sm min-w-[50px] text-center">
                      {time}
                    </div>

                    {/* Appointments for this time */}
                    <div className="flex-1 space-y-1">
                      {(timeAppointments as any[]).map((appointment: any) => (
                        <div
                          key={appointment.id_appuntamento}
                          className="bg-gray-50 border-l-4 border-l-blue-500 shadow-sm hover:shadow-md cursor-pointer p-2 transition-all"
                          onClick={() => onSelectEvent(appointment)}
                        >
                          <p className="font-semibold text-gray-800 text-sm">{appointment.clienti.nome_cliente}</p>
                          <p className="text-xs text-gray-600">{appointment.servizi.nome_servizio}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.tempo_servizio} min
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {dayAppointments.length === 0 && (
                  <div className="flex items-center justify-center h-8 text-gray-400">
                    <span className="text-xs">Nessun appuntamento</span>
                  </div>
                )}

                {/* Add appointment slot */}
                <div
                  className="border-2 border-dashed border-gray-300 text-gray-500 text-center cursor-pointer hover:bg-gray-50 hover:border-primary transition-all p-2"
                  onClick={() => handleSlotClick(dateKey, getHours(new Date()), getMinutes(new Date()))}
                >
                  <span className="text-xs font-medium">+ Aggiungi</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
