# NutriMind AI

**Indian nutrition tracking that actually understands your plate.**

An AI-powered nutrition assistant built for Indian food habits. NutriMind tracks meals using verified IFCT 2017 scientific data, generates budget-constrained meal plans, recognizes food from photographs, answers nutrition questions with ICMR/WHO evidence citations, and screens every suggestion against your clinical safety profile.

Every calorie, protein gram, and iron milligram is a deterministic calculation from the database — the AI generates plans and explanations, never the nutrition numbers.

**Total cost: ₹0** — runs entirely on free-tier services.

---

## What It Does

### Nutrition Tracking
- **Food logging** from a database of 40+ verified Indian foods with IFCT 2017 nutritional data
- **AI plate recognition** — photograph your thali and Gemini Vision identifies each dish with portions
- **Live dashboard** with circular macro rings (calories, protein, carbs, fat) updated from real Supabase food logs
- **Tamil and Hindi food names** alongside English for every item

### AI Meal Planning
- **Budget-constrained plans** — generates 4-meal daily plans within your daily rupee limit (e.g. ₹200/day)
- **Smart remaining meals** — if you already ate breakfast, it only plans lunch, snack, and dinner using your remaining calorie budget
- **Constraint-aware food swaps** — click Swap on any meal to get 3 alternatives matched by protein, cost, and diet compatibility
- **NutriRescue** — ate biryani instead of dal rice? The AI recalculates remaining targets and suggests a compensating dinner
- **Clinical reasoning** — every meal has a "why" explanation grounded in the user's profile and ICMR guidelines

### AI Chat (RAG)
- **Evidence-backed answers** — ask "Why is iron important?" and get answers with inline citations from 8 embedded ICMR/WHO articles
- **Intent routing** — orchestrator classifies queries as nutrition knowledge, personal data, action requests, or general chat
- **Personal queries** — "How much did I eat today?" checks your actual food logs and gives a real answer
- **Multilingual** — responds in 6 Indian languages (Tamil, Hindi, Telugu, Kannada, Bengali, English)
- **Voice input** — microphone button using browser SpeechRecognition API

### Clinical Safety
- **Allergen conflict detection** — flags peanuts, dairy, gluten against your registered allergies
- **Drug-nutrient interactions** — Warfarin + Vitamin K greens, Metformin + alcohol, Levothyroxine + soy
- **Medical condition screening** — diabetes + high-GI foods, hypertension + high-sodium foods
- **Food reaction log** — simple "I ate X, felt Y after Z minutes" tracking that builds your sensitivity record over time

### Analytics & Insights
- **Weekly nutrition analytics** — daily calorie/protein/iron trends from real food log data
- **What-If simulator** — "Replace rice with ragi for 30 days" shows projected nutrition delta from the IFCT database
- **Deficiency risk insights** — computed from your actual weekly intake vs ICMR targets
- **Progress tracking** — weight, waist, body fat, energy measurements over time
- **Grocery intelligence** — auto-generates shopping list from meal plan, grouped by aisle with cost estimates

### Profile & Onboarding
- **3-step onboarding** — biometrics → diet & region → budget & activity
- **Automatic ICMR targets** — BMR (Mifflin-St Jeor with gender), TDEE, and macro targets calculated on profile creation
- **Gender-aware calculations** — male (+5) and female (-161) Mifflin-St Jeor constants

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts, Lucide icons |
| Backend | Python 3.11+, FastAPI, Pydantic, fully async (httpx, AsyncGroq) |
| Database & Auth | Supabase (PostgreSQL + pgvector + Auth + RLS) |
| Primary LLM | Groq — Qwen 3.8 27B (free tier, 30 RPM) |
| Vision & Embeddings | Google AI Studio — Gemini Flash + gemini-embedding-001 (free tier) |
| RAG | pgvector cosine similarity search, 768-dimension embeddings |

---

## Project Structure

```
Nutrumind_AI/
├── frontend/                        # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/                   # 16 page components
│   │   ├── components/              # UI, layout, chat, food components
│   │   ├── hooks/                   # useAuth, useProfile, useFood, useChat, useMealPlan, etc.
│   │   ├── contexts/                # AuthContext (Supabase auth)
│   │   ├── lib/                     # supabase.ts, api.ts, nutrition.ts
│   │   └── types/                   # TypeScript interfaces
│   └── index.html
│
├── backend/                         # Python FastAPI (fully async)
│   ├── app/
│   │   ├── api/                     # Route handlers (food, meals, chat, grocery, analytics, users)
│   │   ├── agents/                  # AI agents (orchestrator, meal_plan, swap, rescue, grocery, knowledge, feedback, food_recognition)
│   │   ├── ai/                      # LLM provider abstraction (Groq async, Google async, rate limiter)
│   │   ├── rag/                     # RAG pipeline (ingest, retriever, context_builder, seed_knowledge)
│   │   ├── services/                # Business logic (nutrition_engine, food_service)
│   │   ├── middleware/              # Auth (Supabase token verify), safety filters
│   │   └── db/                      # Async Supabase REST client
│   └── requirements.txt
│
├── supabase/                        # Database setup
│   ├── setup_all.sql                # Main schema + seed data
│   ├── migrations/                  # 11 migration files
│   └── seed.sql                     # Indian food composition data
│
├── docs/                            # Architecture diagrams
│   ├── architecture-simple.md       # One-slide overview diagram
│   ├── architecture-full.md         # Complete system design
│   ├── architecture-simple.mermaid  # Mermaid diagram (simple)
│   └── architecture-full.mermaid    # Mermaid diagram (full)
│
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **Python 3.11+** — [python.org](https://python.org/)
- **A Supabase account** — Free at [supabase.com](https://supabase.com)
- **A Groq API key** — Free at [console.groq.com](https://console.groq.com)
- **A Google AI Studio API key** — Free at [aistudio.google.com](https://aistudio.google.com)

---

## Setup Guide

### 1. Clone the repository

```bash
git clone https://github.com/SELVAx1/Nutrumind_AI.git
cd Nutrumind_AI
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up → **New project**
2. Name it `nutrimind-ai`, pick a region, set a database password
3. Wait for the project to provision (~1 minute)

### 3. Get your API keys

**Supabase** (Dashboard → Settings → API):
- Copy the **Project URL** (e.g. `https://xxxxx.supabase.co`)
- Copy the **anon/public key** (starts with `eyJ`)
- Copy the **service_role key** (starts with `eyJ`)

**Groq:**
1. Go to [console.groq.com](https://console.groq.com) → Sign up → **API Keys** → Create → Copy (starts with `gsk_`)

**Google AI Studio:**
1. Go to [aistudio.google.com](https://aistudio.google.com) → Sign in → **Get API Key** → Create → Copy

### 4. Configure environment variables

```bash
cp .env.example .env
```

Fill in your keys in `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
GROQ_API_KEY=gsk_your-key
GOOGLE_AI_API_KEY=your-google-key
```

Create the frontend `.env`:

```bash
cp .env.example frontend/.env
```

Edit `frontend/.env` to keep only these three:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

### 5. Set up the database

1. Open Supabase Dashboard → **SQL Editor**
2. Copy and run `supabase/setup_all.sql` — creates 17 tables with RLS and seeds 40 Indian foods
3. Then run these migrations in order:
   - `supabase/migrations/00006_create_document_chunks.sql`
   - `supabase/migrations/00007_match_documents_function.sql`
   - `supabase/migrations/00008_fix_vector_dimension.sql`
   - `supabase/migrations/00009_add_gender_column.sql`
   - `supabase/migrations/00010_create_clinical_safety_tables.sql`
   - `supabase/migrations/00011_create_nutritionist_tables.sql`

**Verify:** Table Editor should show tables like `user_profiles`, `food_items` (40 rows), `document_chunks`, `clinical_profiles`, etc.

### 6. Disable email confirmation (for development)

Supabase Dashboard → **Authentication** → **Providers** → **Email** → Toggle OFF **"Confirm email"** → Save.

### 7. Install dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd ../backend
pip install -r requirements.txt
```

### 8. Seed the RAG knowledge base

This embeds 8 ICMR/WHO nutrition articles into pgvector:

```bash
cd backend
python -m app.rag.seed_knowledge
```

You should see:

```
Seeding RAG knowledge base...
  OK: Iron Requirements and Sources (ICMR-NIN)
  OK: Protein Requirements (ICMR-NIN)
  ...
Done!
```

### 9. Start the application

**Terminal 1 — Backend:**

```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Frontend:**

```bash
cd frontend
npm run dev
```

### 10. Open the app

Go to **http://localhost:5173**

1. Click **"Get started free"** → Register with any email and password
2. Complete the 3-step onboarding (name, gender, age, height, weight → diet, region → budget, activity)
3. You're on the dashboard — start logging food, chatting with the AI, or generating meal plans

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/food/search?q=idli` | Search food database |
| GET | `/api/food/:id` | Get food by ID |
| POST | `/api/food/log` | Log a food entry |
| POST | `/api/food/analyze` | Analyze food image (Gemini Vision) |
| GET | `/api/users/profile` | Get user profile + targets |
| POST | `/api/users/profile` | Create/update profile (triggers BMR/TDEE calc) |
| POST | `/api/chat/message` | Send chat message (routed through orchestrator, saved) |
| POST | `/api/chat/analyze` | Quick AI analysis (not saved to chat history) |
| GET | `/api/chat/conversations` | List conversations |
| GET | `/api/chat/history/:id` | Get conversation messages |
| POST | `/api/meals/plan` | Generate AI meal plan (skips eaten meals) |
| POST | `/api/meals/swap` | Find food alternatives |
| POST | `/api/meals/rescue` | NutriRescue meal recovery |
| GET | `/api/meals/plans` | List meal plans |
| GET | `/api/meals/plans/:id` | Get plan items |
| POST | `/api/grocery/generate` | Generate grocery list from plan |
| GET | `/api/grocery/lists` | List grocery lists |
| POST | `/api/feedback/` | Submit meal feedback |
| GET | `/api/analytics/weekly` | Weekly nutrition summary |
| POST | `/api/analytics/what-if` | What-if diet simulation |

All endpoints except `/api/health` require a Supabase JWT in `Authorization: Bearer <token>`.

---

## Data Sources

- **Indian Food Composition Tables (IFCT 2017)** — National Institute of Nutrition, Hyderabad. Nutritional data for all food items.
- **ICMR-NIN Dietary Guidelines 2020** — Recommended Dietary Allowances for the Indian population. BMR, protein, iron, calcium targets.
- **WHO Nutrition Guidelines** — Global nutrition standards referenced in the RAG knowledge base.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend 401 on all requests | Check `VITE_SUPABASE_ANON_KEY` in root `.env`. The backend uses it to verify tokens with Supabase. |
| "Supabase credentials missing" | Make sure `frontend/.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Chat gives "Could not reach AI service" | Backend not running. Start it with `cd backend && python -m uvicorn app.main:app --reload --port 8000` |
| Meal plan returns empty | Make sure you completed onboarding (profile + targets must exist) and the backend is running |
| RAG chatbot gives generic answers | Run `python -m app.rag.seed_knowledge` to seed the knowledge base |
| Food search returns empty | Run `supabase/setup_all.sql` which seeds 40 Indian foods |
| Database pauses after inactivity | Supabase free tier pauses after 7 days. Open the dashboard to wake it up (~1 min) |
| Port 8000 already in use | Kill: `taskkill /F /IM uvicorn.exe` (Windows) or `kill $(lsof -t -i:8000)` (Mac/Linux) |
