# 🎉 CoreBeauty - Guida Setup Finale

## 📋 Checklist Pre-Setup

Prima di iniziare, assicurati di avere:
- [ ] Account Supabase (gratuito)
- [ ] Node.js installato (v18+)
- [ ] Git installato (opzionale, per deploy Vercel)
- [ ] Un browser moderno (Chrome, Firefox, Safari, Edge)

---

## 🚀 Setup Completo in 10 Minuti

### Step 1: Setup Supabase (5 minuti)

#### A. Crea Progetto
1. Vai su https://supabase.com
2. Sign up / Login
3. **New Project**
4. Nome: `corebeauty`
5. Password forte (salvala!)
6. Region: Europe West
7. **Create** → Attendi 2 min

#### B. Configura Authentication ⚠️ IMPORTANTE!
1. **Authentication** → **Settings** (o **Configuration**)
2. Trova **Email Auth** o **Auth Providers**
3. Assicurati che:
   - ✅ **Enable Email provider** = **ON**
   - ❌ **Enable email confirmations** = **OFF** (DISABILITA!)
   - ❌ **Enable email OTP** = **OFF** (se presente)
4. **Save**

#### C. Crea Database
1. **SQL Editor** → **New Query**
2. Apri `supabase/migrations/001_initial_schema.sql`
3. Copia TUTTO
4. Incolla e **RUN**
5. Vedi "Success. No rows returned" = ✅

#### D. Ottieni Credenziali
1. **Settings** → **API**
2. Copia:
   - `Project URL`: `https://xxx.supabase.co`
   - `anon public key`: `eyJhbGc...` (è lunga!)

---

### Step 2: Setup Locale (3 minuti)

```bash
# 1. Entra nella cartella
cd corebeauty

# 2. Installa dipendenze
npm install

# 3. Crea file .env.local
```

Crea il file `.env.local` nella root del progetto:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```
*Incolla i tuoi valori reali da Supabase!*

```bash
# 4. Avvia app
npm run dev

# 5. Apri browser
# http://localhost:3000
```

---

### Step 3: Primo Accesso (2 minuti)

#### A. Crea Utente
1. Si apre schermata "Crea un PIN"
2. Inserisci 4 cifre (es: **1234**)
3. Conferma: **1234**
4. **Crea**

✅ Se vedi la Dashboard = FUNZIONA!

#### B. Aggiungi Dati di Esempio (Opzionale)

Per testare l'app con dati già pronti:

1. Vai su Supabase → **Table Editor** → **users**
2. Copia il tuo **UUID** (es: `123e4567-e89b-12d3-a456-426614174000`)
3. Apri `supabase/seed_data.sql`
4. Sostituisci `'YOUR_USER_ID'` con il tuo UUID
5. Copia TUTTO il file
6. Supabase → **SQL Editor** → Incolla → **RUN**

✅ Ora hai:
- 10 clienti di esempio
- 25 servizi (5 per categoria)
- 8 appuntamenti (alcuni oggi!)
- 4 note

---

## ✨ Test Funzionalità

### Dashboard
- [ ] Vedi stats (oggi/settimana)
- [ ] Naviga tra le date (frecce)
- [ ] Vedi appuntamenti (se hai usato seed_data.sql)
- [ ] Click su FAB (+) in basso a destra
- [ ] Si apre modal nuovo appuntamento

### Clienti
- [ ] Vai su `/clients` (menu laterale)
- [ ] Vedi lista clienti
- [ ] Click **Nuovo Cliente**
- [ ] Compila form (nome obbligatorio)
- [ ] **Salva**
- [ ] Cliente appare nella lista
- [ ] Click **WhatsApp** → Si apre WhatsApp Web
- [ ] Click **Modifica** → Form si pre-compila
- [ ] Click **Elimina** → Conferma richiesta

### Servizi
- [ ] Vai su `/services`
- [ ] Vedi servizi divisi per categoria
- [ ] Colori diversi per categoria
- [ ] Click **Nuovo Servizio**
- [ ] Compila: nome, durata, prezzo, categoria
- [ ] **Salva**
- [ ] Servizio appare nella categoria giusta

### Note
- [ ] Vai su `/notes`
- [ ] Click **Nuova Nota**
- [ ] Scegli data e scrivi nota
- [ ] **Salva**
- [ ] Nota appare raggruppata per data

### Impostazioni
- [ ] Vai su `/settings`
- [ ] Cambia tema colori
- [ ] Colori app cambiano immediatamente
- [ ] **Logout** → Torna a login

---

## 🐛 Problemi Comuni

### Errore: "Email signups are disabled"
**Soluzione:** Vai su Supabase > Authentication > Settings > **Abilita "Enable Email provider"**

### Errore: "Table 'users' does not exist"
**Soluzione:** Esegui lo script SQL (`001_initial_schema.sql`)

### Errore: "Invalid API credentials"
**Soluzione:**
1. Controlla `.env.local` esista
2. Verifica URL e KEY siano corretti
3. Restart server: `Ctrl+C` → `npm run dev`

### Appuntamenti non si creano
**Problema:** Mancano i servizi!
**Soluzione:** Vai su `/services` e crea almeno 1 servizio

### Pin dimenticato
**Soluzione:**
1. Supabase → Authentication → Users
2. Trova tuo user → Delete
3. Ricrea da `/auth/setup`

---

## 📱 PWA (App Installabile)

L'app è una Progressive Web App! Puoi installarla come app nativa:

### Su Desktop (Chrome/Edge)
1. Icona **Installa** nella barra indirizzi
2. Click → **Installa**
3. App si apre in finestra dedicata

### Su Mobile (iOS/Android)
1. **Safari** (iOS): Share → Aggiungi a Home
2. **Chrome** (Android): Menu → Installa app
3. Icona appare nella home

✅ **Funziona anche offline!**

---

## 🚀 Deploy su Vercel (Bonus)

### Setup Rapido
```bash
# 1. Push su GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Vai su vercel.com
# 3. Import repository
# 4. Aggiungi env variables:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
# 5. Deploy!
```

✅ URL produzione: `https://corebeauty.vercel.app`

---

## 📚 Documentazione Completa

- **[README.md](README.md)** - Overview generale
- **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Setup dettagliato Supabase
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Soluzioni problemi
- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Status sviluppo
- **[STATUS_UPDATE.md](STATUS_UPDATE.md)** - Ultimo aggiornamento

---

## ✅ Checklist Finale

Setup completato quando:
- [ ] Supabase progetto creato
- [ ] Email provider abilitato
- [ ] Email confirmation disabilitata
- [ ] SQL migrations eseguite
- [ ] 6 tabelle create (users, clienti, servizi, appuntamenti, annotazioni, impostazioni)
- [ ] `.env.local` configurato
- [ ] `npm install` eseguito
- [ ] App avviata (`npm run dev`)
- [ ] Primo utente creato con PIN
- [ ] Dashboard visibile
- [ ] Tutte le pagine accessibili (/clients, /services, /notes, /settings)
- [ ] (Opzionale) Dati di esempio caricati
- [ ] (Opzionale) Deploy Vercel fatto

---

## 🎯 Prossimi Passi

1. **Personalizza i colori** in `/settings`
2. **Aggiungi i tuoi servizi** in `/services`
3. **Importa i tuoi clienti** in `/clients`
4. **Inizia a creare appuntamenti** dalla dashboard
5. **Usa le note** per promemoria
6. **Installa come PWA** per accesso rapido

---

## 💡 Tips & Tricks

### Shortcuts
- **F** nel FAB → Nuovo appuntamento veloce
- **Cmd/Ctrl + K** → Ricerca globale (futuro)
- **Swipe left** su card → Azioni rapide (mobile)

### Best Practices
- Crea i servizi PRIMA degli appuntamenti
- Usa le note per promemoria importanti
- Personalizza i colori per identificare categorie
- Backup periodico (Supabase fa backup automatici)

### Performance
- L'app funziona anche offline (PWA)
- Dati cached per velocità
- Auto-sync quando torni online

---

## 🎉 Fatto!

**CoreBeauty è pronta!**

Se hai problemi, consulta [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

Buon lavoro! 💅✨
