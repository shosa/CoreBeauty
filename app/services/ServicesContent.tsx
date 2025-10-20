'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Service {
  id_servizio: number
  nome_servizio: string
  tempo_medio: number
  costo: number
  categoria: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
}

const CATEGORIES = ['VISO', 'MANI', 'PIEDI', 'CORPO', 'CERETTA', 'ALTRO'] as const

const CATEGORY_COLORS = {
  VISO: '#FF6B6B',
  MANI: '#4ECDC4',
  PIEDI: '#45B7D1',
  CORPO: '#96CEB4',
  CERETTA: '#FFEAA7',
  ALTRO: '#A29BFE',
}

const CATEGORY_ICONS = {
  VISO: 'face',
  MANI: 'back_hand',
  PIEDI: 'self_improvement',
  CORPO: 'accessibility_new',
  CERETTA: 'content_cut',
  ALTRO: 'spa',
}

export default function ServicesContent() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    nome_servizio: '',
    tempo_medio: '60',
    costo: '',
    categoria: 'ALTRO' as const,
  })
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()

      if (data.success) {
        setServices(data.data || [])
      }
    } catch (error) {
      toast.error('Errore nel caricamento dei servizi')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData({
        nome_servizio: service.nome_servizio,
        tempo_medio: service.tempo_medio.toString(),
        costo: service.costo.toString(),
        categoria: service.categoria,
      })
    } else {
      setEditingService(null)
      setFormData({
        nome_servizio: '',
        tempo_medio: '60',
        costo: '',
        categoria: 'ALTRO',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingService(null)
    setFormData({
      nome_servizio: '',
      tempo_medio: '60',
      costo: '',
      categoria: 'ALTRO',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome_servizio.trim() || !formData.costo) {
      toast.error('Compila tutti i campi obbligatori')
      return
    }

    setIsSaving(true)

    try {
      const url = '/api/services'
      const method = editingService ? 'PUT' : 'POST'
      const body = editingService
        ? {
            ...formData,
            id_servizio: editingService.id_servizio,
            tempo_medio: parseInt(formData.tempo_medio),
            costo: parseFloat(formData.costo),
          }
        : {
            ...formData,
            tempo_medio: parseInt(formData.tempo_medio),
            costo: parseFloat(formData.costo),
          }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(editingService ? 'Servizio aggiornato!' : 'Servizio creato!')
        handleCloseModal()
        loadServices()
      } else {
        toast.error('Errore nel salvataggio')
      }
    } catch (error) {
      toast.error('Errore nel salvataggio')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number, nome: string) => {
    if (!confirm(`Eliminare il servizio "${nome}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' })

      if (res.ok) {
        toast.success('Servizio eliminato')
        loadServices()
      } else {
        toast.error('Errore nell\'eliminazione')
      }
    } catch (error) {
      toast.error('Errore nell\'eliminazione')
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.nome_servizio
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || service.categoria === selectedCategory
    return matchesSearch && matchesCategory
  })

  const servicesByCategory = filteredServices.reduce((groups, service) => {
    const category = service.categoria || 'ALTRO'
    if (!groups[category]) groups[category] = []
    groups[category].push(service)
    return groups
  }, {} as Record<string, Service[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-icons text-5xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-gray-600">Caricamento servizi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servizi</h1>
          <p className="text-gray-600 mt-1">{services.length} servizi totali</p>
        </div>
        <Button variant="primary" icon="add" onClick={() => handleOpenModal()}>
          Nuovo Servizio
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <Input
          icon="search"
          placeholder="Cerca servizio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
              ${
                !selectedCategory
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            Tutti
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap
                ${
                  selectedCategory === cat
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              style={{
                backgroundColor:
                  selectedCategory === cat ? CATEGORY_COLORS[cat] : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services by Category */}
      {Object.keys(servicesByCategory).length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="material-icons text-6xl text-gray-300">spa</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            {searchTerm || selectedCategory ? 'Nessun servizio trovato' : 'Nessun servizio'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm || selectedCategory
              ? 'Prova con un altro filtro'
              : 'Inizia aggiungendo il tuo primo servizio'}
          </p>
          {!searchTerm && !selectedCategory && (
            <Button
              variant="primary"
              icon="add"
              onClick={() => handleOpenModal()}
              className="mt-4"
            >
              Aggiungi Servizio
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {CATEGORIES.map((category) => {
            const categoryServices = servicesByCategory[category]
            if (!categoryServices || categoryServices.length === 0) return null

            return (
              <div key={category}>
                <div
                  className="flex items-center gap-3 mb-4 pb-2 border-b-2"
                  style={{ borderColor: CATEGORY_COLORS[category] }}
                >
                  <span
                    className="material-icons text-3xl"
                    style={{ color: CATEGORY_COLORS[category] }}
                  >
                    {CATEGORY_ICONS[category]}
                  </span>
                  <h2 className="text-xl font-bold" style={{ color: CATEGORY_COLORS[category] }}>
                    {category}
                  </h2>
                  <span className="text-gray-500 text-sm">
                    ({categoryServices.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryServices.map((service) => (
                    <div
                      key={service.id_servizio}
                      className="bg-white rounded-xl shadow-sm p-6 border-l-4 hover:shadow-md transition-shadow"
                      style={{ borderColor: CATEGORY_COLORS[category] }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 flex-1">
                          {service.nome_servizio}
                        </h3>
                        <span
                          className="material-icons text-2xl"
                          style={{ color: CATEGORY_COLORS[category] }}
                        >
                          {CATEGORY_ICONS[category]}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="material-icons text-sm">schedule</span>
                            <span className="text-sm">Durata</span>
                          </div>
                          <span className="font-semibold text-gray-900">
                            {service.tempo_medio} min
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="material-icons text-sm">euro</span>
                            <span className="text-sm">Prezzo</span>
                          </div>
                          <span className="font-bold text-lg text-primary">
                            €{service.costo.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleOpenModal(service)}
                          className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="material-icons text-sm">edit</span>
                          <span className="text-sm font-medium">Modifica</span>
                        </button>
                        <button
                          onClick={() =>
                            handleDelete(service.id_servizio, service.nome_servizio)
                          }
                          className="px-3 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"
                          title="Elimina"
                        >
                          <span className="material-icons text-sm">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingService ? 'Modifica Servizio' : 'Nuovo Servizio'}
        icon="spa"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome servizio"
            icon="spa"
            value={formData.nome_servizio}
            onChange={(e) => setFormData({ ...formData, nome_servizio: e.target.value })}
            placeholder="Es: Manicure completa"
            required
            fullWidth
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Durata (minuti)"
              icon="schedule"
              type="number"
              min="5"
              step="5"
              value={formData.tempo_medio}
              onChange={(e) => setFormData({ ...formData, tempo_medio: e.target.value })}
              required
              fullWidth
            />

            <Input
              label="Prezzo (€)"
              icon="euro"
              type="number"
              min="0"
              step="0.01"
              value={formData.costo}
              onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
              required
              fullWidth
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span className="material-icons text-lg">category</span>
              Categoria
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, categoria: cat })}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all border-2
                    ${
                      formData.categoria === cat
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }
                  `}
                  style={{
                    backgroundColor:
                      formData.categoria === cat ? CATEGORY_COLORS[cat] : undefined,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={handleCloseModal} fullWidth>
              Annulla
            </Button>
            <Button
              type="submit"
              variant="primary"
              icon="save"
              isLoading={isSaving}
              fullWidth
            >
              Salva
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
