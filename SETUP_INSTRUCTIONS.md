# 🚀 Istruzioni Setup CoreBeauty

## Parte 1: Tu (Supabase + Vercel)

### 🗄️ Setup Supabase

1. **Crea Progetto**
   - Vai su https://supabase.com
   - Click "New Project"
   - Nome: `corebeauty`
   - Password: (scegli una forte)
   - Region: `Europe West (eu-west-1)` o più vicina
   - Click "Create new project" (attendi 2 minuti)

2. **Ottieni le Credenziali**
   - Vai su **Settings** (icona ingranaggio)
   - Click su **API**
   - Copia questi valori:
     ```
     Project URL: https://xxxxx.supabase.co
     anon public key: eyJhbGc...
     ```

3. **Crea il Database**
   - Vai su **SQL Editor** (icona </> nel menu laterale)
   - Click "New Query"
   - Apri il file `supabase/migrations/001_initial_schema.sql` del progetto
   - Copia TUTTO il contenuto
   - Incolla nell'editor SQL
   - Click "RUN" (o Ctrl+Enter)
   - Dovresti vedere "Success. No rows returned"

4. **Verifica Tabelle Create**
   - Vai su **Table Editor**
   - Dovresti vedere queste tabelle:
     - users
     - clienti
     - servizi
     - appuntamenti
     - annotazioni
     - impostazioni

### ☁️ Setup Vercel

1. **Prepara GitHub** (se non l'hai già fatto)
   - Vai su https://github.com
   - Click "New repository"
   - Nome: `corebeauty`
   - Privacy: Private
   - Non aggiungere README, .gitignore, etc
   - Click "Create repository"

2. **Push Codice su GitHub** (io lo faccio dopo)
   ```bash
   # Già nel progetto corebeauty
   git init
   git add .
   git commit -m "Initial CoreBeauty setup"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/corebeauty.git
   git push -u origin main
   ```

3. **Deploy su Vercel**
   - Vai su https://vercel.com
   - Login con GitHub
   - Click "Add New Project"
   - Seleziona il repo `corebeauty`
   - Click "Import"

4. **Configura Environment Variables**
   - Nella schermata "Configure Project"
   - Espandi "Environment Variables"
   - Aggiungi queste due variabili:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: (incolla il Project URL di Supabase)

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: (incolla la anon public key di Supabase)
   ```

5. **Deploy**
   - Click "Deploy"
   - Attendi 2-3 minuti
   - 🎉 Fatto!

### ✅ Verifica Setup

1. **Apri l'app** (Vercel ti darà un URL tipo `corebeauty.vercel.app`)
2. Dovresti vedere la schermata "Crea un PIN"
3. Crea un PIN di 4 cifre
4. Conferma il PIN
5. Se vedi "Dashboard" → tutto funziona! ✅

---

## Parte 2: Io (Completamento App)

Mentre tu fai il setup, io continuo a sviluppare:

### ✅ Già Fatto
- [x] Progetto Next.js 14 + TypeScript
- [x] Database schema Supabase con RLS
- [x] Autenticazione PIN stile iPhone
- [x] API routes per auth

### 🚧 In Corso (mentre tu fai setup)
- [ ] Dashboard con statistiche
- [ ] Gestione Appuntamenti
- [ ] Gestione Clienti
- [ ] Gestione Servizi
- [ ] Vista Calendario
- [ ] Sistema Note
- [ ] Impostazioni
- [ ] PWA setup

---

## 🆘 Problemi Comuni

### Supabase

**"Database connection failed"**
- Controlla che il progetto sia completamente inizializzato (verde, non giallo)
- Riprova dopo 1-2 minuti

**"Success. No rows returned" dopo SQL**
- È normale! Significa che le tabelle sono state create correttamente

**"relation public.xxx already exists"**
- Le tabelle esistono già, tutto ok! Puoi ignorare l'errore

### Vercel

**"Build failed"**
- Controlla che le env variables siano configurate
- Verifica che i nomi siano ESATTAMENTE come scritti (case-sensitive)

**"Cannot find module bcryptjs"**
- Normale, sto ancora sviluppando
- L'app sarà pronta tra poco

---

## 📞 Quando Sei Pronto

Quando hai finito il setup:

1. ✅ Supabase progetto creato
2. ✅ Database tabelle create
3. ✅ Vercel deploy fatto
4. ✅ App accessibile via URL

**Fammi sapere l'URL di Vercel** e io continuo lo sviluppo pushando aggiornamenti!

Ogni volta che pusho codice su GitHub, Vercel farà auto-deploy in ~30 secondi. 🚀
