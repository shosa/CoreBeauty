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
      config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
      }
      clienti: {
        Row: {
          id_cliente: number
          nome_cliente: string
          numero_telefono: string | null
          email: string | null
          data_creazione: string
        }
        Insert: {
          id_cliente?: number
          nome_cliente: string
          numero_telefono?: string | null
          email?: string | null
          data_creazione?: string
        }
        Update: {
          id_cliente?: number
          nome_cliente?: string
          numero_telefono?: string | null
          email?: string | null
          data_creazione?: string
        }
      }
      servizi: {
        Row: {
          id_servizio: number
          nome_servizio: string
          tempo_medio: number
          costo: number
          categoria: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
        }
        Insert: {
          id_servizio?: number
          nome_servizio: string
          tempo_medio: number
          costo: number
          categoria?: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
        }
        Update: {
          id_servizio?: number
          nome_servizio?: string
          tempo_medio?: number
          costo?: number
          categoria?: 'VISO' | 'MANI' | 'PIEDI' | 'CORPO' | 'CERETTA' | 'ALTRO'
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
        }
        Insert: {
          id_appuntamento?: number
          id_cliente: number
          id_servizio: number
          data_appuntamento: string
          tempo_servizio?: number
          note?: string | null
          completato?: boolean
        }
        Update: {
          id_appuntamento?: number
          id_cliente?: number
          id_servizio?: number
          data_appuntamento?: string
          tempo_servizio?: number
          note?: string | null
          completato?: boolean
        }
      }
      annotazioni: {
        Row: {
          id_annotazione: number
          data: string
          note: string
        }
        Insert: {
          id_annotazione?: number
          data: string
          note: string
        }
        Update: {
          id_annotazione?: number
          data?: string
          note?: string
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
          data_creazione?: string
          data_modifica?: string
        }
      }
    }
  }
}

