'use client'

import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { it } from 'date-fns/locale'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

interface Note {
  id_annotazione: number
  data: string
  note: string
  created_at: string
}

export default function NotesContent() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    data: format(new Date(), 'yyyy-MM-dd'),
    note: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()

      if (data.success) {
        setNotes(data.data || [])
      }
    } catch (error) {
      toast.error('Errore nel caricamento delle note')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenModal = (note?: Note) => {
    if (note) {
      setEditingNote(note)
      setFormData({
        data: note.data,
        note: note.note,
      })
    } else {
      setEditingNote(null)
      setFormData({
        data: format(new Date(), 'yyyy-MM-dd'),
        note: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingNote(null)
    setFormData({
      data: format(new Date(), 'yyyy-MM-dd'),
      note: '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.note.trim()) {
      toast.error('Inserisci il testo della nota')
      return
    }

    setIsSaving(true)

    try {
      const url = '/api/notes'
      const method = editingNote ? 'PUT' : 'POST'
      const body = editingNote
        ? { ...formData, id_annotazione: editingNote.id_annotazione }
        : formData

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        toast.success(editingNote ? 'Nota aggiornata!' : 'Nota creata!')
        handleCloseModal()
        loadNotes()
      } else {
        toast.error('Errore nel salvataggio')
      }
    } catch (error) {
      toast.error('Errore nel salvataggio')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Eliminare questa nota?')) {
      return
    }

    try {
      const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })

      if (res.ok) {
        toast.success('Nota eliminata')
        loadNotes()
      } else {
        toast.error('Errore nell\'eliminazione')
      }
    } catch (error) {
      toast.error('Errore nell\'eliminazione')
    }
  }

  const filteredNotes = notes.filter((note) =>
    note.note.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Group notes by date
  const notesByDate = filteredNotes.reduce((groups, note) => {
    const date = note.data
    if (!groups[date]) groups[date] = []
    groups[date].push(note)
    return groups
  }, {} as Record<string, Note[]>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <span className="material-icons text-5xl text-primary animate-spin">refresh</span>
          <p className="mt-4 text-gray-600">Caricamento note...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Note</h1>
          <p className="text-gray-600 mt-1">{notes.length} note totali</p>
        </div>
        <Button variant="primary" icon="add" onClick={() => handleOpenModal()}>
          Nuova Nota
        </Button>
      </div>

      {/* Search */}
      <Input
        icon="search"
        placeholder="Cerca nelle note..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />

      {/* Notes List */}
      {Object.keys(notesByDate).length === 0 ? (
        <div className="bg-white border-l-4 border-l-gray-300 shadow-md p-12 text-center">
          <span className="material-icons text-6xl text-gray-300">note</span>
          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            {searchTerm ? 'Nessuna nota trovata' : 'Nessuna nota'}
          </h3>
          <p className="text-gray-500 mt-2">
            {searchTerm
              ? 'Prova con un altro termine'
              : 'Inizia aggiungendo la tua prima nota'}
          </p>
          {!searchTerm && (
            <Button variant="primary" icon="add" onClick={() => handleOpenModal()} className="mt-4">
              Aggiungi Nota
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(notesByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, dateNotes]) => (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3 sticky top-0 bg-gray-50 py-2 z-10">
                  <span className="material-icons text-primary">calendar_today</span>
                  <h2 className="text-lg font-bold text-gray-900">
                    {format(parseISO(date), 'EEEE d MMMM yyyy', { locale: it })}
                  </h2>
                  <span className="text-gray-500 text-sm">({dateNotes.length})</span>
                </div>

                <div className="space-y-3">
                  {dateNotes.map((note) => (
                    <div
                      key={note.id_annotazione}
                      className="bg-white shadow-md p-6 border-l-4 border-primary hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-gray-900 whitespace-pre-wrap">{note.note}</p>
                          <p className="text-sm text-gray-500 mt-3">
                            Creata il{' '}
                            {format(parseISO(note.created_at), "d MMM yyyy 'alle' HH:mm", {
                              locale: it,
                            })}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleOpenModal(note)}
                            className="p-2 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition-colors"
                            title="Modifica"
                          >
                            <span className="material-icons text-sm">edit</span>
                          </button>
                          <button
                            onClick={() => handleDelete(note.id_annotazione)}
                            className="p-2 bg-danger/10 text-danger shadow-sm hover:bg-danger/20 transition-colors"
                            title="Elimina"
                          >
                            <span className="material-icons text-sm">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingNote ? 'Modifica Nota' : 'Nuova Nota'}
        icon="note"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Data"
            icon="calendar_today"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
            fullWidth
          />

          <Textarea
            label="Nota"
            icon="note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Scrivi la tua nota..."
            rows={6}
            required
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
