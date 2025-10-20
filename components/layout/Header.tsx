'use client'

import { usePathname } from 'next/navigation'

interface HeaderProps {
  onMenuToggle: () => void
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const pathname = usePathname()

  const getPageTitle = () => {
    if (pathname?.includes('dashboard')) return 'Dashboard'
    if (pathname?.includes('calendar')) return 'Calendario'
    if (pathname?.includes('clients')) return 'Clienti'
    if (pathname?.includes('services')) return 'Servizi'
    if (pathname?.includes('notes')) return 'Note'
    if (pathname?.includes('settings')) return 'Impostazioni'
    return 'CoreBeauty'
  }

  const handleTodayClick = () => {
    // Trigger event to go to today's date
    window.dispatchEvent(new CustomEvent('goToToday'))
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left: Logo + Menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <span className="material-icons text-gray-700">menu</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-md">
              <span className="material-icons text-white text-xl">spa</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {(pathname?.includes('dashboard') || pathname?.includes('calendar')) && (
            <button
              onClick={handleTodayClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Vai a oggi"
            >
              <span className="material-icons text-gray-700">today</span>
            </button>
          )}

          {/* Mobile title */}
          <div className="sm:hidden">
            <span className="text-sm font-semibold text-gray-700">{getPageTitle()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
