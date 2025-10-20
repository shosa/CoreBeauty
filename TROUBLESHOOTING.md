# 🔧 CoreBeauty - Troubleshooting

## ❌ Errore: "POST /api/auth/create-pin 500"

### Causa
Supabase richiede che l'email confirmation sia disabilitata per permettere signup senza verifica email.

### Soluzione

#### 1. **Disabilita Email Confirmation in Supabase**

Vai su Supabase Dashboard:

1. Apri il tuo progetto
2. Vai su **Authentication** (icona lucchetto nel menu laterale)
3. Click su **Settings** (in alto)
4. Scroll fino a **Email Auth**
5. **DISABILITA** questa opzione:
   - [ ] **Enable email confirmations**

6. Scroll fino in fondo e click **Save**

#### 2. **Test di nuovo**

```bash
npm run dev
```

Vai su http://localhost:3000 e prova a creare il PIN.

---

## ❌ Errore: "Table 'users' does not exist"

### Causa
Le migrations SQL non sono state eseguite correttamente.

### Soluzione

1. Vai su Supabase Dashboard
2. Click su **SQL Editor**
3. Apri il file `supabase/migrations/001_initial_schema.sql`
4. Copia **TUTTO** il contenuto
5. Incolla nell'editor SQL di Supabase
6. Click **RUN** (o Ctrl+Enter)
7. Dovresti vedere "Success. No rows returned"

Verifica che le tabelle esistano:
- Vai su **Table Editor**
- Dovresti vedere: users, clienti, servizi, appuntamenti, annotazioni, impostazioni

---

## ❌ Errore: "Invalid API credentials"

### Causa
Le variabili d'ambiente non sono configurate correttamente.

### Soluzione

1. Verifica che esista il file `.env.local` nella root del progetto
2. Controlla che contenga:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```
3. Controlla che i valori siano **esattamente** quelli da Supabase > Settings > API
4. Restart del server:
   ```bash
   # Ctrl+C per stoppare
   npm run dev
   ```

---

## ❌ Errore: "User already registered"

### Causa
Hai già creato un utente ma vuoi ricrearne uno nuovo.

### Soluzione

#### Opzione 1: Usa un'altra email
Nel setup, inserisci un'email diversa (opzionale nel form).

#### Opzione 2: Cancella l'utente esistente
1. Vai su Supabase > Authentication > Users
2. Trova l'utente creato
3. Click sui 3 puntini > Delete user
4. Riprova il setup

---

## ❌ Errore: "RLS policy violation"

### Causa
Le Row Level Security policies non permettono l'operazione.

### Soluzione

Assicurati di aver eseguito TUTTE le migrations SQL, incluse le policies:

```sql
-- Verifica che le policies esistano
SELECT * FROM pg_policies WHERE tablename = 'users';
```

Se non ci sono risultati, riesegui lo script completo `001_initial_schema.sql`.

---

## ❌ Errore: "Module not found: bcryptjs"

### Causa
Dipendenze non installate.

### Soluzione

```bash
npm install
```

---

## ❌ Errore: Build failed su Vercel

### Causa
Variabili d'ambiente non configurate su Vercel.

### Soluzione

1. Vai su Vercel Dashboard
2. Seleziona il progetto `corebeauty`
3. Vai su **Settings** > **Environment Variables**
4. Aggiungi:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
   ```
5. **Redeploy**:
   - Vai su **Deployments**
   - Click sui 3 puntini dell'ultimo deploy
   - Click **Redeploy**

---

## ❌ Errore: "Cannot read properties of null"

### Causa
Dati non caricati dal database.

### Possibili Soluzioni

1. **Verifica autenticazione:**
   - Sei loggato?
   - Il PIN è corretto?

2. **Verifica database:**
   - Le tabelle esistono?
   - Le RLS policies sono attive?

3. **Controlla console browser:**
   - Apri DevTools (F12)
   - Vai su Console
   - Cerca errori rossi
   - Mandami lo screenshot

---

## 🔍 Debug Avanzato

### Controlla i log del server

```bash
# Nel terminal dove gira npm run dev
# Vedrai gli errori stampati qui
```

### Controlla i log Supabase

1. Vai su Supabase Dashboard
2. Click su **Logs** nel menu laterale
3. Filtra per "Errors"
4. Cerca l'errore relativo alla tua operazione

### Controlla i log Vercel (se deployato)

1. Vai su Vercel Dashboard
2. Seleziona progetto
3. Click su **Logs** in alto
4. Filtra per errori (rossi)

---

## 📞 Ancora Problemi?

### Informazioni da fornirmi:

1. **Errore esatto:**
   - Copia/incolla l'errore completo dalla console

2. **Cosa stavi facendo:**
   - Setup iniziale?
   - Login?
   - Creazione appuntamento?

3. **Screenshot:**
   - Console del browser (F12)
   - Errore visibile

4. **Environment:**
   - Locale (npm run dev) o Vercel?
   - Browser usato?

---

## ✅ Quick Checks

Prima di chiedere aiuto, verifica:

- [ ] Ho eseguito `npm install`?
- [ ] Il file `.env.local` esiste ed è corretto?
- [ ] Ho eseguito le SQL migrations in Supabase?
- [ ] Ho **disabilitato** email confirmation in Supabase?
- [ ] Ho riavviato il dev server dopo le modifiche?
- [ ] Sto usando l'ultima versione del codice?

---

## 🚀 Test Veloce

Per testare che tutto funzioni:

```bash
# 1. Installa
npm install

# 2. Avvia
npm run dev

# 3. Apri browser
# http://localhost:3000

# 4. Crea PIN
# Inserisci 4 cifre (es: 1234)
# Conferma
# Dovresti vedere la dashboard

# ✅ Se vedi la dashboard = tutto OK!
```
