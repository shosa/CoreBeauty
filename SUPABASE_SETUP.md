# 📊 Setup Supabase - Guida Completa

## Passo 1: Crea Progetto

1. Vai su https://supabase.com
2. Login o Sign up (gratis)
3. Click **New Project**
4. Compila:
   - **Name:** corebeauty
   - **Database Password:** Scegli una password forte (salvala!)
   - **Region:** Europe West (Frankfurt) o più vicina
   - **Pricing Plan:** Free (va benissimo)
5. Click **Create new project**
6. ⏳ Attendi 2 minuti (il progetto si sta inizializzando)

---

## Passo 2: Configura Email Authentication

**⚠️ IMPORTANTE: Questi step sono FONDAMENTALI!**

1. Nel tuo progetto, click su **Authentication** (icona lucchetto 🔒)
2. Click su **Settings** in alto (o **Configuration** nel menu laterale)
3. Scroll fino a trovare **Email Auth** o **Auth Providers**

### A. Abilita Email Provider
4. Assicurati che **Email** sia **ABILITATO**:
   ```
   [✓] Enable Email provider
   ```

### B. Disabilita Email Confirmation
5. **DISABILITA** la conferma email:
   ```
   [ ] Enable email confirmations
   ```
   (Togli la spunta se presente)

### C. Disabilita Email OTP (Opzionale ma consigliato)
6. Se presente, **DISABILITA**:
   ```
   [ ] Enable email OTP
   ```

7. Scroll in fondo e click **Save**

✅ Fatto! Ora gli utenti possono registrarsi senza conferma email.

---

## Passo 3: Esegui SQL Migrations

1. Click su **SQL Editor** nel menu laterale (icona </>)
2. Click **New Query**
3. Apri il file `supabase/migrations/001_initial_schema.sql` dal progetto
4. Copia **TUTTO** il contenuto (dalle prime righe fino alla fine)
5. Incolla nell'editor SQL di Supabase
6. Click **RUN** (o premi Ctrl+Enter)
7. Dovresti vedere:
   ```
   Success. No rows returned
   ```

✅ Le tabelle sono state create!

---

## Passo 4: Verifica Tabelle Create

1. Click su **Table Editor** nel menu laterale (icona tabella)
2. Dovresti vedere queste 6 tabelle nella sidebar:
   - ✅ users
   - ✅ clienti
   - ✅ servizi
   - ✅ appuntamenti
   - ✅ annotazioni
   - ✅ impostazioni

3. Click su ogni tabella per verificare le colonne

---

## Passo 5: Verifica RLS Policies

1. Click su una tabella (es: `clienti`)
2. Click su **Policies** in alto
3. Dovresti vedere 4 policies:
   - ✅ Users can view own clients
   - ✅ Users can insert own clients
   - ✅ Users can update own clients
   - ✅ Users can delete own clients

Se non le vedi, riesegui lo script SQL del Passo 3.

---

## Passo 6: Ottieni le Credenziali

1. Click su **Settings** (icona ingranaggio ⚙️) in basso nel menu
2. Click su **API** nella sidebar
3. Trovi 2 valori importanti:

### Project URL
```
https://abcdefghijklmno.supabase.co
```
Copia questo valore ☝️

### Project API keys
Sotto "anon public":
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi...
```
Copia questo valore ☝️ (è LUNGO, assicurati di copiare tutto!)

---

## Passo 7: Configura Variabili d'Ambiente

### Nel progetto locale:

1. Apri il progetto `corebeauty`
2. Crea un file `.env.local` nella root
3. Incolla:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
4. **Sostituisci** i valori con quelli copiati prima
5. Salva il file

### Su Vercel (dopo):

1. Vai su Vercel Dashboard
2. Seleziona il progetto
3. **Settings** > **Environment Variables**
4. Aggiungi le stesse 2 variabili
5. Save

---

## ✅ Test Setup

Ora testa che tutto funzioni:

```bash
cd corebeauty
npm install
npm run dev
```

Apri http://localhost:3000

Dovresti vedere la schermata "Crea un PIN".

### Crea il primo utente:

1. Inserisci PIN: **1234**
2. Conferma PIN: **1234**
3. Click "Crea"

Se vedi la **Dashboard** = ✅ **TUTTO OK!**

Se vedi un errore, vai su [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## 📊 Verifica Database

Dopo aver creato l'utente, verifica nel database:

1. Supabase > **Table Editor**
2. Click su tabella **users**
3. Dovresti vedere 1 riga con:
   - ✅ `id` (UUID)
   - ✅ `pin_hash` (stringa lunga hashata)
   - ✅ `nome` ("Operatore")
   - ✅ `created_at` (data/ora)

---

## 🔐 Sicurezza

### RLS (Row Level Security)

Ogni tabella ha RLS attivo, il che significa:
- ✅ Ogni utente vede **solo** i propri dati
- ✅ Non può vedere/modificare dati di altri utenti
- ✅ Sicurezza garantita a livello database

### Test RLS:

1. Crea 2 utenti diversi (PIN diversi)
2. Aggiungi clienti con utente 1
3. Logout e login con utente 2
4. Non dovresti vedere i clienti dell'utente 1 ✅

---

## 📈 Monitoring

### Controlla l'utilizzo:

1. Supabase > **Settings** > **Billing**
2. Vedi:
   - Database size
   - API requests
   - Storage used

### Limiti Free Tier:

- ✅ 500 MB database (OK per ~50k appuntamenti)
- ✅ 1 GB file storage
- ✅ 2 GB bandwidth/mese
- ✅ 50k auth users

Per un centro estetico medio, il free tier è **più che sufficiente**.

---

## 🚀 Deploy Vercel

Dopo che il setup locale funziona:

1. Push su GitHub
2. Connetti Vercel al repo
3. Aggiungi le env variables
4. Deploy!

Guida dettagliata: [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md)

---

## 📞 Problemi?

Consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md) per soluzioni ai problemi comuni.

---

## ✅ Checklist Completa

- [ ] Progetto Supabase creato
- [ ] Email confirmation **disabilitata**
- [ ] SQL migrations eseguite
- [ ] 6 tabelle create
- [ ] RLS policies attive
- [ ] Credenziali copiate (URL + Key)
- [ ] File `.env.local` creato
- [ ] `npm install` eseguito
- [ ] `npm run dev` funziona
- [ ] Primo utente creato con PIN
- [ ] Dashboard visibile

Se hai spuntato tutto = **SEI PRONTO! 🎉**
