-- Simplified Schema for CoreBeauty (PIN-only auth)

-- Drop existing tables and policies to start fresh
-- Note: This is destructive. Use with caution in production.
DROP POLICY IF EXISTS "Users can delete own settings" ON public.impostazioni;
DROP POLICY IF EXISTS "Users can update own settings" ON public.impostazioni;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.impostazioni;
DROP POLICY IF EXISTS "Users can view own settings" ON public.impostazioni;
DROP POLICY IF EXISTS "Users can delete own notes" ON public.annotazioni;
DROP POLICY IF EXISTS "Users can update own notes" ON public.annotazioni;
DROP POLICY IF EXISTS "Users can insert own notes" ON public.annotazioni;
DROP POLICY IF EXISTS "Users can view own notes" ON public.annotazioni;
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appuntamenti;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appuntamenti;
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appuntamenti;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appuntamenti;
DROP POLICY IF EXISTS "Users can delete own services" ON public.servizi;
DROP POLICY IF EXISTS "Users can update own services" ON public.servizi;
DROP POLICY IF EXISTS "Users can insert own services" ON public.servizi;
DROP POLICY IF EXISTS "Users can view own services" ON public.servizi;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clienti;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clienti;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clienti;
DROP POLICY IF EXISTS "Users can view own clients" ON public.clienti;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;

ALTER TABLE IF EXISTS public.impostazioni DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.annotazioni DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appuntamenti DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.servizi DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clienti DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;

DROP TABLE IF EXISTS public.impostazioni;
DROP TABLE IF EXISTS public.annotazioni;
DROP TABLE IF EXISTS public.appuntamenti;
DROP TABLE IF EXISTS public.servizi;
DROP TABLE IF EXISTS public.clienti;
DROP TABLE IF EXISTS public.users;

-- Configuration table for PIN
CREATE TABLE IF NOT EXISTS public.config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Clienti table (no user_id)
CREATE TABLE IF NOT EXISTS public.clienti (
    id_cliente SERIAL PRIMARY KEY,
    nome_cliente TEXT NOT NULL,
    numero_telefono TEXT,
    email TEXT,
    data_creazione TIMESTAMPTZ DEFAULT NOW()
);

-- Servizi table (no user_id)
CREATE TABLE IF NOT EXISTS public.servizi (
    id_servizio SERIAL PRIMARY KEY,
    nome_servizio TEXT NOT NULL,
    tempo_medio INTEGER NOT NULL DEFAULT 60,
    costo DECIMAL(10,2) NOT NULL DEFAULT 0,
    categoria TEXT CHECK (categoria IN ('VISO', 'MANI', 'PIEDI', 'CORPO', 'CERETTA', 'ALTRO')) DEFAULT 'ALTRO'
);

-- Appuntamenti table (no user_id)
CREATE TABLE IF NOT EXISTS public.appuntamenti (
    id_appuntamento SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL REFERENCES public.clienti(id_cliente) ON DELETE CASCADE,
    id_servizio INTEGER NOT NULL REFERENCES public.servizi(id_servizio) ON DELETE RESTRICT,
    data_appuntamento TIMESTAMPTZ NOT NULL,
    tempo_servizio INTEGER DEFAULT 60,
    note TEXT,
    completato BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annotazioni table (no user_id)
CREATE TABLE IF NOT EXISTS public.annotazioni (
    id_annotazione SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impostazioni table (no user_id)
CREATE TABLE IF NOT EXISTS public.impostazioni (
    id SERIAL PRIMARY KEY,
    chiave TEXT NOT NULL UNIQUE,
    valore TEXT,
    tipo TEXT CHECK (tipo IN ('string', 'number', 'boolean', 'color', 'json')) DEFAULT 'string',
    categoria TEXT DEFAULT 'generale',
    descrizione TEXT,
    data_creazione TIMESTAMPTZ DEFAULT NOW(),
    data_modifica TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance (removed user_id indexes)
CREATE INDEX idx_clienti_nome ON public.clienti(nome_cliente);
CREATE INDEX idx_appuntamenti_data ON public.appuntamenti(data_appuntamento);
CREATE INDEX idx_appuntamenti_cliente ON public.appuntamenti(id_cliente);
CREATE INDEX idx_annotazioni_data ON public.annotazioni(data);

-- Functions and Triggers (no changes needed for these)

-- Function to update data_modifica for impostazioni
CREATE OR REPLACE FUNCTION update_impostazioni_data_modifica()
RETURNS TRIGGER AS $$
BEGIN
    NEW.data_modifica = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for impostazioni table
CREATE TRIGGER update_impostazioni_data_modifica
    BEFORE UPDATE ON public.impostazioni
    FOR EACH ROW
    EXECUTE FUNCTION update_impostazioni_data_modifica();

-- Insert default settings (removed user_id)
INSERT INTO public.impostazioni (chiave, valore, tipo, categoria, descrizione) VALUES
('theme_primary', '#e91e63', 'color', 'tema', 'Colore primario dell''applicazione'),
('theme_primary_dark', '#c2185b', 'color', 'tema', 'Colore primario scuro'),
('theme_primary_light', '#f8bbd0', 'color', 'tema', 'Colore primario chiaro'),
('theme_secondary', '#9c27b0', 'color', 'tema', 'Colore secondario'),
('theme_accent', '#ff4081', 'color', 'tema', 'Colore accent'),
('app_name', 'CoreBeauty', 'string', 'generale', 'Nome dell''applicazione'),
('business_hours_start', '09:00', 'string', 'generale', 'Orario apertura'),
('business_hours_end', '19:00', 'string', 'generale', 'Orario chiusura'),
('default_appointment_duration', '60', 'number', 'generale', 'Durata predefinita appuntamenti (minuti)')
ON CONFLICT (chiave) DO NOTHING;
