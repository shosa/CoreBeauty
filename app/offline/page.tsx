'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
          <span className="material-icons text-6xl">cloud_off</span>
        </div>
        <h1 className="text-3xl font-bold mb-4">Sei Offline</h1>
        <p className="text-white/80 mb-8 max-w-md">
          Non c'è connessione a internet. Alcune funzionalità potrebbero non essere disponibili.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-white/90 transition-colors"
        >
          Riprova
        </button>
      </div>
    </div>
  )
}
