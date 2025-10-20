# CoreBeauty 💅

App professionale per la gestione di centri estetici con Next.js 14 + Supabase.

## 🚀 Setup Rapido

### 1. Installa Dipendenze

```bash
npm install
```

### 2. Configura Supabase

1. Vai su [Supabase](https://supabase.com) e crea un nuovo progetto
2. Copia le credenziali da **Project Settings > API**
3. Crea il file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Crea il Database

1. Vai su **SQL Editor** in Supabase
2. Copia e incolla il contenuto di `supabase/migrations/001_initial_schema.sql`
3. Esegui la query (Run)

### 4. Avvia il Server

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000)

## 📱 Setup su Vercel

### Deploy Automatico

1. Push il codice su GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. Vai su [Vercel](https://vercel.com)
3. Click su "New Project"
4. Importa il tuo repository
5. Aggiungi le variabili d'ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy!

## 🎯 Funzionalità

### ✅ Implementate

- [x] Autenticazione PIN (stile iPhone)
- [x] Database Schema con RLS
- [x] Setup iniziale

### 🚧 In Sviluppo

- [ ] Dashboard con statistiche
- [ ] Gestione Appuntamenti
- [ ] Gestione Clienti con autocomplete
- [ ] Gestione Servizi con categorie
- [ ] Vista Calendario
- [ ] Sistema Note
- [ ] Impostazioni e temi
- [ ] PWA (offline support)
- [ ] Integrazione WhatsApp

## 📂 Struttura Progetto

```
corebeauty/
├── app/
│   ├── api/              # API Routes (serverless)
│   │   └── auth/         # Autenticazione PIN
│   ├── auth/             # Pagine auth
│   ├── dashboard/        # Dashboard principale
│   ├── calendar/         # Vista calendario
│   ├── clients/          # Gestione clienti
│   ├── services/         # Gestione servizi
│   ├── notes/            # Note
│   └── settings/         # Impostazioni
├── components/
│   ├── auth/             # Componenti autenticazione
│   ├── ui/               # Componenti UI riutilizzabili
│   └── layout/           # Layout components
├── lib/
│   ├── supabase/         # Client Supabase
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   └── stores/           # Zustand stores
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🔐 Sicurezza

- ✅ Row Level Security (RLS) attiva
- ✅ PIN hashed con bcrypt
- ✅ Prepared statements automatici
- ✅ CORS configurato
- ✅ Rate limiting Supabase
- ✅ Autenticazione multi-utente

## 🎨 Temi e Personalizzazione

I colori possono essere personalizzati in:
- `tailwind.config.ts` - Temi Tailwind
- `app/globals.css` - Variabili CSS
- Database `impostazioni` - Temi dinamici per utente

## 📝 Migration da XAMPP

Per migrare i dati dalla vecchia app:

1. Esporta i dati da MySQL:
```bash
mysqldump -u root my_mica > old_data.sql
```

2. Converti e importa in Supabase (script da creare)

## 🐛 Debug

### Errori comuni:

**"Invalid API credentials"**
- Controlla `.env.local`
- Verifica che le chiavi siano corrette in Supabase

**"Table does not exist"**
- Esegui le migrations SQL in Supabase
- Controlla che RLS sia abilitato

**"PIN not working"**
- Cancella i cookies del browser
- Ricrea l'utente da `/auth/setup`

## 📚 Documentazione

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Supporto

Per problemi o domande, apri una issue su GitHub.

## 📄 Licenza

Proprietario - Tutti i diritti riservati
