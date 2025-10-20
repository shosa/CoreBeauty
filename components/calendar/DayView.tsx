import { format, startOfDay, endOfDay, setHours, setMinutes } from 'date-fns'
import { it } from 'date-fns/locale'

export default function DayView({ appointments, onSelectEvent, onSelectSlot }: { appointments: any[], onSelectEvent: (event: any) => void, onSelectSlot: (start: Date, end: Date) => void }) {
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const date = format(new Date(appointment.data_appuntamento), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(appointment)
    return acc
  }, {} as Record<string, any[]>)

  const sortedDays = Object.keys(groupedAppointments).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  )

  const handleSlotClick = (date: string, hour: number, minute: number) => {
    const start = setMinutes(setHours(new Date(date), hour), minute)
    const end = setMinutes(setHours(new Date(date), hour), minute + 30) // Default 30 min slot
    onSelectSlot(start, end)
  }

  return (
    <div className="space-y-4">
      {sortedDays.map((date) => (
        <div key={date} className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg text-primary mb-2">
            {format(new Date(date), "EEEE d MMMM yyyy", { locale: it })}
          </h2>
          <div className="space-y-2">
            {groupedAppointments[date].map((appointment) => (
              <div
                key={appointment.id_appuntamento}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer"
                onClick={() => onSelectEvent(appointment)}
              >
                <p className="font-semibold">{appointment.clienti.nome_cliente}</p>
                <p>{appointment.servizi.nome_servizio}</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(appointment.data_appuntamento), 'HH:mm')} - {appointment.tempo_servizio} min
                </p>
              </div>
            ))}
            {/* Add a clickable slot for new appointments */}
            <div
              className="p-2 rounded-lg border-2 border-dashed border-gray-300 text-gray-500 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleSlotClick(date, getHours(new Date()), getMinutes(new Date()))}
            >
              + Aggiungi Appuntamento
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
