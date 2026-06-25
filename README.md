# Sajja Command Center

Personal tracker for EB-1A visa portfolio + Digital Marketing Mastery (SeoulandGlow.com).

## Stack
- React + Vite
- Supabase (persistent storage across devices)
- Vercel (hosting)

## Setup

### 1. Supabase — Create the table
Go to your Supabase project → SQL Editor → run:

```sql
CREATE TABLE command_center (
  id TEXT PRIMARY KEY DEFAULT 'sajja_singleton',
  eb1a_tasks JSONB DEFAULT '{}'::jsonb,
  eb1a_evidence JSONB DEFAULT '[]'::jsonb,
  dm_tasks JSONB DEFAULT '{}'::jsonb,
  dm_mod_prog JSONB DEFAULT '{}'::jsonb,
  dm_metrics JSONB DEFAULT '[]'::jsonb,
  streak INTEGER DEFAULT 0,
  last_visit TEXT,
  workspace TEXT DEFAULT 'eb1a',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO command_center (id)
VALUES ('sajja_singleton')
ON CONFLICT (id) DO NOTHING;
```

### 2. Environment variables
```bash
cp .env.example .env
# Fill in your values from Supabase → Settings → API
```

### 3. Local development
```bash
npm install
npm run dev
```

### 4. Deploy to Vercel
```bash
# Push to GitHub first, then:
# vercel.com → New Project → Import → select this repo
# Add env vars: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

## Features
- **EB-1A Tracker**: 5 criteria progress, task board, evidence log
- **DM Mastery**: 6 modules, weekly plan, task board, concepts, metrics history, return protocol
- **Supabase sync**: Progress saved across all devices in real-time
- **localStorage fallback**: Works offline, syncs when connection restored
- **Streak tracker**: Daily visit streak with return-after-break protocol

## Link from autoshiftops.com
Add a subtle hidden link in your footer or nav:
```html
<a href="https://your-vercel-url.vercel.app" style="opacity:0.3">tracker</a>
```

## Updated Supabase SQL (includes 365-day plan tracking)

```sql
CREATE TABLE command_center (
  id TEXT PRIMARY KEY DEFAULT 'sajja_singleton',
  eb1a_tasks JSONB DEFAULT '{}'::jsonb,
  eb1a_evidence JSONB DEFAULT '[]'::jsonb,
  dm_tasks JSONB DEFAULT '{}'::jsonb,
  dm_mod_prog JSONB DEFAULT '{}'::jsonb,
  dm_metrics JSONB DEFAULT '[]'::jsonb,
  plan_done_days JSONB DEFAULT '{}'::jsonb,
  streak INTEGER DEFAULT 0,
  last_visit TEXT,
  workspace TEXT DEFAULT 'eb1a',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO command_center (id)
VALUES ('sajja_singleton')
ON CONFLICT (id) DO NOTHING;
```

If you already created the table without plan_done_days, just run:
```sql
ALTER TABLE command_center ADD COLUMN plan_done_days JSONB DEFAULT '{}'::jsonb;
```
