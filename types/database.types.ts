export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clienti: {
        Row: {
          id_cliente: number
          nome_cliente: string
          numero_telefono: string | null
          email: string | null
          data_creazione: string
          user_id: string | null
        }
        Insert: {
          id_cliente?: number
          nome_cliente: string
          numero_telefono?: string | null
          email?: string | null
          data_creazione?: string
          user_id?: string | null
        }
        Update: {
          id_cliente?: number
          nome_cliente?: string
          numero_telefono?: string | null
          email?: string | null
          data_creazione?: string
          user_id?: string | null
        }
      }
      servizi: {
        Row: {
          id_servizio: number
          nome_servizio: string
          tempo_medio: number
          costo: number
          categoria: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
          user_id: string | null
        }
        Insert: {
          id_servizio?: number
          nome_servizio: string
          tempo_medio: number
          costo: number
          categoria?: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
          user_id?: string | null
        }
        Update: {
          id_servizio?: number
          nome_servizio?: string
          tempo_medio?: number
          costo?: number
          categoria?: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
          user_id?: string | null
        }
      }
      appuntamenti: {
        Row: {
          id_appuntamento: number
          id_cliente: number
          id_servizio: number
          data_appuntamento: string
          tempo_servizio: number
          note: string | null
          completato: boolean
          user_id: string | null
        }
        Insert: {
          id_appuntamento?: number
          id_cliente: number
          id_servizio: number
          data_appuntamento: string
          tempo_servizio?: number
          note?: string | null
          completato?: boolean
          user_id?: string | null
        }
        Update: {
          id_appuntamento?: number
          id_cliente?: number
          id_servizio?: number
          data_appuntamento?: string
          tempo_servizio?: number
          note?: string | null
          completato?: boolean
          user_id?: string | null
        }
      }
      annotazioni: {
        Row: {
          id_annotazione: number
          data: string
          note: string
          user_id: string | null
        }
        Insert: {
          id_annotazione?: number
          data: string
          note: string
          user_id?: string | null
        }
        Update: {
          id_annotazione?: number
          data?: string
          note?: string
          user_id?: string | null
        }
      }
      impostazioni: {
        Row: {
          id: number
          chiave: string
          valore: string
          tipo: 'string' | 'number' | 'boolean' | 'color' | 'json'
          categoria: string
          descrizione: string | null
          user_id: string | null
          data_creazione: string
          data_modifica: string
        }
        Insert: {
          id?: number
          chiave: string
          valore: string
          tipo?: 'string' | 'number' | 'boolean' | 'color' | 'json'
          categoria?: string
          descrizione?: string | null
          user_id?: string | null
          data_creazione?: string
          data_modifica?: string
        }
        Update: {
          id?: number
          chiave?: string
          valore?: string
          tipo?: 'string' | 'number' | 'boolean' | 'color' | 'json'
          categoria?: string
          descrizione?: string | null
          user_id?: string | null
          data_creazione?: string
          data_modifica?: string
        }
      }
      users: {
        Row: {
          id: string
          pin_hash: string
          nome: string
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          pin_hash: string
          nome: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pin_hash?: string
          nome?: string
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
