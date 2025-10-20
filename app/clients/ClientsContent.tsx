'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Client {
  id_cliente: number
  nome_cliente: string
  numero_telefono: string | null
  email: string | null
  data_creazione: string
  total_appointments?: number
  last_visit?: string | null
}

export default function ClientsContent() {
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState({
    nome_cliente: '',
    numero_telefono: '',
    email: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const res = await fetch('/api/clients')
      const data = await res.json()

      if (data.success) {
        setClients(data.data || [])
      }
    } catch (error) {
      toast.error('Errore nel caricamento dei clienti')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (client?: Client) => {
    if (client) {
      setEditingClient(client)
      setFormData({
        nome_cliente: client.nome_cliente,
        numero_telefono: client.numero_telefono || '',
        email: client.email || '',
      })
    } else {
      setEditingClient(null)
      setFormData({
        nome_cliente: '',
        numero_telefono: '',
        email: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingClient(null)
    setFormData({
      nome_cliente: '',
      numero_telefono: '',
      email: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nome_cliente.trim()) {
      toast.error('Inserisci il nome del cliente')
      return
    }

    setIsSaving(true)

    try {
      const url = '/api/clients'
      const method = editingClient ? 'PUT' : 'POST'
      const body = editingClient
        ? { ...formData, id_cliente: editingClient.id_cliente }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(
          editingClient ? 'Cliente aggiornato!' : 'Cliente creato!'
        )
        handleCloseModal()
        loadClients()
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
    if (!confirm(`Eliminare il cliente "${nome}"?\n\nQuesta azione eliminerà anche tutti i suoi appuntamenti.`)) {
      return
    }

    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: 'DELETE' })

      if (res.ok) {
        toast.success('Cliente eliminato')
        loadClients()
      } else {
        toast.error('Errore nell\'eliminazione')
      }
    } catch (error) {
      toast.error('Errore nell\'eliminazione')
    }
  }

  const filteredClients = clients.filter((client) =>
    client.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.numero_telefono && client.numero_telefono.includes(searchTerm)) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-icons text-5xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-gray-600">Caricamento clienti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clienti</h1>
          <p className="text-gray-600 mt-1">{clients.length} clienti totali</p>
        </div>
        <Button variant="primary" icon="person_add" onClick={() => handleOpenModal()}>
          Nuovo Cliente
        </Button>
      </div>

      {/* Search */}
      <Input
        icon="search"
        placeholder="Cerca per nome, telefono o email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="material-icons text-6xl text-gray-300">people_outline</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            {searchTerm ? 'Nessun cliente trovato' : 'Nessun cliente'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? 'Prova con un altro termine di ricerca'
              : 'Inizia aggiungendo il tuo primo cliente'}
          </p>
          {!searchTerm && (
            <Button
              variant="primary"
              icon="person_add"
              onClick={() => handleOpenModal()}
              className="mt-4"
            >
              Aggiungi Cliente
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id_cliente}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {client.nome_cliente}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cliente dal{' '}
                    {format(new Date(client.data_creazione), 'd MMM yyyy', { locale: it })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="material-icons text-primary text-2xl">person</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                {client.numero_telefono && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="material-icons text-sm">phone</span>
                    <a
                      href={`tel:${client.numero_telefono}`}
                      className="hover:text-primary"
                    >
                      {client.numero_telefono}
                    </a>
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="material-icons text-sm">email</span>
                    <a
                      href={`mailto:${client.email}`}
                      className="hover:text-primary truncate"
                    >
                      {client.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              {client.total_appointments !== undefined && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="text-sm text-gray-600">Appuntamenti totali</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {client.total_appointments || 0}
                  </div>
                  {client.last_visit && (
                    <div className="text-xs text-gray-500 mt-1">
                      Ultima visita:{' '}
                      {format(new Date(client.last_visit), 'd MMM yyyy', { locale: it })}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                {client.numero_telefono && (
                  <button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${client.numero_telefono.replace(/[\s\-\(\)]/g, '')}`,
                        '_blank'
                      )
                    }
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                    title="Contatta su WhatsApp"
                  >
                    <span className="material-icons text-sm">chat</span>
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                )}
                <button
                  onClick={() => handleOpenModal(client)}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Modifica"
                >
                  <span className="material-icons text-sm">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(client.id_cliente, client.nome_cliente)}
                  className="px-3 py-2 bg-danger/10 text-danger rounded-lg hover:bg-danger/20 transition-colors"
                  title="Elimina"
                >
                  <span className="material-icons text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? 'Modifica Cliente' : 'Nuovo Cliente'}
        icon="person"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome completo"
            icon="person"
            value={formData.nome_cliente}
            onChange={(e) =>
              setFormData({ ...formData, nome_cliente: e.target.value })
            }
            placeholder="Mario Rossi"
            required
            fullWidth
          />

          <Input
            label="Telefono"
            icon="phone"
            type="tel"
            value={formData.numero_telefono}
            onChange={(e) =>
              setFormData({ ...formData, numero_telefono: e.target.value })
            }
            placeholder="+39 123 456 7890"
            fullWidth
          />

          <Input
            label="Email"
            icon="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="mario.rossi@email.com"
            fullWidth
          />

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
