'use client'

import { useState } from 'react'

import WeekView from './WeekView'

import DayView from './DayView'



export default function Calendar({ appointments, onSelectEvent, onSelectSlot }: { appointments: any[], onSelectEvent: (event: any) => void, onSelectSlot: (start: Date, end: Date) => void }) {

  const [view, setView] = useState('week') // 'week' or 'day'



  return (

    <div>

      <div className="flex justify-end mb-4">

        <button onClick={() => setView('week')} className={`px-4 py-2 rounded-l-lg ${view === 'week' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Settimana</button>

        <button onClick={() => setView('day')} className={`px-4 py-2 rounded-r-lg ${view === 'day' ? 'bg-primary text-white' : 'bg-gray-200'}`}>Giorno</button>

      </div>

      {view === 'week' ? <WeekView appointments={appointments} onSelectEvent={onSelectEvent} onSelectSlot={onSelectSlot} /> : <DayView appointments={appointments} onSelectEvent={onSelectEvent} onSelectSlot={onSelectSlot} />}

    </div>

  )

}
