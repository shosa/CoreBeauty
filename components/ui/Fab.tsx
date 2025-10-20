'use client'

import React from 'react'

interface FabProps {
  onClick: () => void
}

export const Fab: React.FC<FabProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-transform transform hover:scale-110 active:scale-100"
      aria-label="Aggiungi Appuntamento"
    >
      <span className="material-icons text-3xl">add</span>
    </button>
  )
}
