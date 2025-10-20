-- CoreBeauty Database Schema for Supabase
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    pin_hash TEXT NOT NULL,
    nome TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clienti table
CREATE TABLE IF NOT EXISTS public.clienti (
    id_cliente SERIAL PRIMARY KEY,
    nome_cliente TEXT NOT NULL,
    numero_telefono TEXT,
    email TEXT,
    data_creazione TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Servizi table
CREATE TABLE IF NOT EXISTS public.servizi (
    id_servizio SERIAL PRIMARY KEY,
    nome_servizio TEXT NOT NULL,
    tempo_medio INTEGER NOT NULL DEFAULT 60,
    costo DECIMAL(10,2) NOT NULL DEFAULT 0,
    categoria TEXT CHECK (categoria IN ('VISO', 'MANI', 'PIEDI', 'CORPO', 'CERETTA', 'ALTRO')) DEFAULT 'ALTRO',
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Appuntamenti table
CREATE TABLE IF NOT EXISTS public.appuntamenti (
    id_appuntamento SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL REFERENCES public.clienti(id_cliente) ON DELETE CASCADE,
    id_servizio INTEGER NOT NULL REFERENCES public.servizi(id_servizio) ON DELETE RESTRICT,
    data_appuntamento TIMESTAMPTZ NOT NULL,
    tempo_servizio INTEGER DEFAULT 60,
    note TEXT,
    completato BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Annotazioni table
CREATE TABLE IF NOT EXISTS public.annotazioni (
    id_annotazione SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    note TEXT NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Impostazioni table
CREATE TABLE IF NOT EXISTS public.impostazioni (
    id SERIAL PRIMARY KEY,
    chiave TEXT NOT NULL,
    valore TEXT,
    tipo TEXT CHECK (tipo IN ('string', 'number', 'boolean', 'color', 'json')) DEFAULT 'string',
    categoria TEXT DEFAULT 'generale',
    descrizione TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    data_creazione TIMESTAMPTZ DEFAULT NOW(),
    data_modifica TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(chiave, user_id)
);

-- Indexes for performance
CREATE INDEX idx_clienti_user ON public.clienti(user_id);
CREATE INDEX idx_clienti_nome ON public.clienti(nome_cliente);
CREATE INDEX idx_servizi_user ON public.servizi(user_id);
CREATE INDEX idx_appuntamenti_user ON public.appuntamenti(user_id);
CREATE INDEX idx_appuntamenti_data ON public.appuntamenti(data_appuntamento);
CREATE INDEX idx_appuntamenti_cliente ON public.appuntamenti(id_cliente);
CREATE INDEX idx_annotazioni_user ON public.annotazioni(user_id);
CREATE INDEX idx_annotazioni_data ON public.annotazioni(data);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clienti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servizi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appuntamenti ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annotazioni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impostazioni ENABLE ROW LEVEL SECURITY;

-- Users policies (users can only see/edit their own profile)
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Clienti policies
CREATE POLICY "Users can view own clients" ON public.clienti
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients" ON public.clienti
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients" ON public.clienti
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients" ON public.clienti
    FOR DELETE USING (auth.uid() = user_id);

-- Servizi policies
CREATE POLICY "Users can view own services" ON public.servizi
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own services" ON public.servizi
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own services" ON public.servizi
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own services" ON public.servizi
    FOR DELETE USING (auth.uid() = user_id);

-- Appuntamenti policies
CREATE POLICY "Users can view own appointments" ON public.appuntamenti
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments" ON public.appuntamenti
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments" ON public.appuntamenti
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments" ON public.appuntamenti
    FOR DELETE USING (auth.uid() = user_id);

-- Annotazioni policies
CREATE POLICY "Users can view own notes" ON public.annotazioni
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.annotazioni
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.annotazioni
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes" ON public.annotazioni
    FOR DELETE USING (auth.uid() = user_id);

-- Impostazioni policies
CREATE POLICY "Users can view own settings" ON public.impostazioni
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON public.impostazioni
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON public.impostazioni
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settings" ON public.impostazioni
    FOR DELETE USING (auth.uid() = user_id);

-- Functions

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Insert default settings (optional)
INSERT INTO public.impostazioni (chiave, valore, tipo, categoria, descrizione, user_id) VALUES
('theme_primary', '#e91e63', 'color', 'tema', 'Colore primario dell''applicazione', NULL),
('theme_primary_dark', '#c2185b', 'color', 'tema', 'Colore primario scuro', NULL),
('theme_primary_light', '#f8bbd0', 'color', 'tema', 'Colore primario chiaro', NULL),
('theme_secondary', '#9c27b0', 'color', 'tema', 'Colore secondario', NULL),
('theme_accent', '#ff4081', 'color', 'tema', 'Colore accent', NULL),
('app_name', 'CoreBeauty', 'string', 'generale', 'Nome dell''applicazione', NULL),
('business_hours_start', '09:00', 'string', 'generale', 'Orario apertura', NULL),
('business_hours_end', '19:00', 'string', 'generale', 'Orario chiusura', NULL),
('default_appointment_duration', '60', 'number', 'generale', 'Durata predefinita appuntamenti (minuti)', NULL)
ON CONFLICT (chiave, user_id) DO NOTHING;
