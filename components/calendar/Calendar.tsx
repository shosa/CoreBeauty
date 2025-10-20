'use client'

import { useState } from 'react'

import WeekView from './WeekView'

import DayView from './DayView'



export default function Calendar({ appointments, onSelectEvent, onSelectSlot }: { appointments: any[], onSelectEvent: (event: any) => void, onSelectSlot: (start: Date, end: Date) => void }) {

  const [view, setView] = useState('giorno') // 'settimana' or 'giorno'



  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex border border-gray-200 shadow-sm">
          <button
            onClick={() => setView('settimana')}
            className={`px-4 py-2 font-medium transition-colors ${
              view === 'settimana'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Settimana
          </button>
          <button
            onClick={() => setView('giorno')}
            className={`px-4 py-2 font-medium transition-colors ${
              view === 'giorno'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Giorno
          </button>
        </div>
      </div>

      {view === 'settimana' ? (
        <DayView appointments={appointments} onSelectEvent={onSelectEvent} onSelectSlot={onSelectSlot} />
      ) : (
        <WeekView appointments={appointments} onSelectEvent={onSelectEvent} onSelectSlot={onSelectSlot} />
      )}
    </div>
  )

}
