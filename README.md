# NutriMind AI

**Eat well, within your budget.**

An AI-powered intelligent nutrition assistant built for Indian food habits. NutriMind recognizes food from photographs, calculates accurate nutrition from verified databases, generates personalized meal plans within budget constraints, and answers nutrition questions with evidence-backed citations from ICMR/WHO guidelines.

---

## Features

| Module | Description |
|--------|-------------|
| **Nutrition Profiling** | 3-step onboarding: basic info, diet preferences, goals. Auto-calculates BMR/TDEE/macro targets using ICMR guidelines. |
| **Food Recognition** | Upload a food photo → Gemini Flash identifies items → nutrition calculated from the database. |
| **Nutrition Engine** | Deterministic calculations: `quantity × nutrients_per_100g / 100`. Never LLM-generated. 40+ Indian foods with IFCT data. |
| **Meal Planner** | AI generates daily plans within budget, diet type, allergy, and cooking time constraints. Each meal has a "why" explanation. |
| **Food Swap** | Click "Swap" on any meal → get 3 constraint-aware alternatives with nutrition comparison and trade-off explanations. |
| **RAG Chatbot** | Ask nutrition questions → retrieves evidence from ICMR/WHO knowledge base via pgvector → generates cited answers. |
| **NutriRescue** | Ate something different from the plan? The agentic workflow recalculates remaining targets and suggests a revised dinner. |
| **Grocery Intelligence** | Auto-generates grocery lists from meal plans. Aggregates quantities, estimates cost, groups by category. |
| **NutriTwin** | Analytics dashboard with pattern detection (low protein, skipped breakfast) and What-If simulator ("Replace rice with ragi for 30 days"). |
| **Feedback Adaptation** | Rate meals → system classifies feedback (taste/time/budget) → updates preferences for future recommendations. |
| **Nutritionist Dashboard** | Role-based view for nutritionists to review client profiles, meal plans, and approve recommendations. |
| **Explainable AI** | Every recommendation has a "why" — uses actual nutritional data and user profile, not generic advice. |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide icons |
| **Backend** | Python 3.11+, FastAPI, Pydantic |
| **Database & Auth** | Supabase (PostgreSQL + pgvector + Auth + Storage + RLS) |
| **Primary LLM** | Groq — Qwen 3.8 27B (free tier, 30 RPM) |
| **Vision & Embeddings** | Google AI Studio — Gemini 3.8 Flash + gemini-embedding-001 (free tier) |
| **Design System** | Bricolage Grotesque (headings), Figtree (body), Anek Tamil/Devanagari (multilingual) |

**Total cost: $0** — all services are free tier, no credit card required.

---

## Prerequisites

Before you start, make sure you have:

- **Node.js 18+** — [Download](https://nodejs.org/)
- **Python 3.11+** — [Download](https://python.org/)
- **A Supabase account** — Free at [supabase.com](https://supabase.com)
- **A Groq API key** — Free at [console.groq.com](https://console.groq.com)
- **A Google AI Studio API key** — Free at [aistudio.google.com](https://aistudio.google.com)

---

## Setup Guide (Step by Step)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Nutrumind_AI
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up → **New project**
2. Name it `nutrimind-ai`, pick a region, set a database password
3. Wait for the project to provision (~1 minute)

### 3. Get your API keys

**Supabase keys** (from Dashboard → Settings → API Keys):
- Copy the **Project URL** (e.g., `https://xxxxx.supabase.co`)
- Copy the **Publishable key** (starts with `sb_publishable_`)
- Copy the **Secret key** (starts with `sb_secret_`)
- Go to **Settings → API Keys → JWT Keys** → Copy the **Legacy JWT Secret**

**Groq key:**
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up with Google or GitHub (free)
3. Click **API Keys** → **Create API Key** → Copy it (starts with `gsk_`)

**Google AI Studio key:**
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google
3. Click **Get API Key** → **Create API key** → Copy it (starts with `AQ.` or `AIza`)

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_your_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here

# Groq
GROQ_API_KEY=gsk_your_key_here

# Google AI Studio
GOOGLE_AI_API_KEY=your_google_key_here
```

Also create the frontend `.env`:

```bash
cp .env.example frontend/.env
```

The frontend only needs these three (copy from your root `.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_your_key_here
VITE_API_URL=http://localhost:8000
```

### 5. Set up the database

1. Open your Supabase Dashboard → **SQL Editor**
2. Open the file `supabase/setup_all.sql` from this project
3. Copy the entire contents → Paste into the SQL Editor → Click **Run**
4. This creates 17 tables, RLS policies, and seeds 40 Indian foods

Then run the additional migrations (in order):

5. Paste `supabase/migrations/00006_create_document_chunks.sql` → Run
6. Paste `supabase/migrations/00007_match_documents_function.sql` → Run
7. Paste `supabase/migrations/00008_fix_vector_dimension.sql` → Run

**Verify:** Go to Table Editor — you should see tables like `user_profiles`, `food_items` (40 rows), `document_chunks`, etc.

### 6. Disable email confirmation (for development)

In Supabase Dashboard → **Authentication** → **Providers** → **Email** → Toggle OFF **"Confirm email"** → Save.

This lets you register and login immediately without clicking a confirmation link.

### 7. Install frontend dependencies

```bash
cd frontend
npm install
```

### 8. Install backend dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

### 9. Seed the RAG knowledge base

This embeds 8 ICMR/WHO nutrition articles into pgvector for the chatbot:

```bash
cd backend
python -m app.rag.seed_knowledge
```

You should see:
```
Seeding RAG knowledge base...
  OK: Iron Requirements and Sources (ICMR-NIN)
  OK: Protein Requirements (ICMR-NIN)
  OK: Dietary Fibre Recommendations
  ...
Done!
```

### 10. Start the application

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

### 11. Open the app

Go to **[http://localhost:5173](http://localhost:5173)**

1. Click **"Get started"** → Register with any email and password
2. Complete the 3-step onboarding (name, diet, goals)
3. You're on the dashboard — start logging food, chatting, or generating meal plans!

---

## Project Structure

```
Nutrumind_AI/
├── frontend/                        # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Button, Card, Badge, Input
│   │   │   ├── layout/             # AppShell, Sidebar, MobileNav, Header
│   │   │   ├── dashboard/          # PlateRing, MealCard, StatCard, GapInsight
│   │   │   ├── chat/               # ChatMessage, ChatInput
│   │   │   └── food/               # FoodSearch, NutritionPreview
│   │   ├── pages/                   # 13 page components
│   │   ├── hooks/                   # useAuth, useProfile, useFood, useChat, useMealPlan, etc.
│   │   ├── contexts/                # AuthContext (Supabase auth)
│   │   ├── lib/                     # supabase.ts, api.ts, nutrition.ts
│   │   ├── types/                   # TypeScript interfaces
│   │   └── data/                    # Placeholder data
│   └── index.html
│
├── backend/                         # Python FastAPI
│   ├── app/
│   │   ├── api/                     # Route handlers (food, meals, chat, grocery, analytics, etc.)
│   │   ├── agents/                  # AI agents (orchestrator, meal_plan, swap, rescue, feedback, grocery)
│   │   ├── ai/                      # LLM provider abstraction (Groq, Google, rate limiter)
│   │   ├── rag/                     # RAG pipeline (ingest, retriever, context_builder, seed_knowledge)
│   │   ├── services/                # Business logic (nutrition_engine, food_service)
│   │   ├── middleware/              # Auth (Supabase JWT), safety filters
│   │   └── db/                      # Supabase REST client
│   └── requirements.txt
│
├── supabase/                        # Database setup
│   ├── setup_all.sql                # Main schema + seed data (run first)
│   ├── migrations/                  # Additional migrations (run after setup_all)
│   └── seed.sql                     # Food composition data
│
├── docs/                            # Architecture documentation
├── .env.example                     # Environment variable template
├── .gitignore
└── README.md
```

---

## Demo Flow (for presentations)

The best way to demo the project in 2-3 minutes:

1. **Landing page** → Show NutriMind branding and features
2. **Register** → Create an account (instant, no email confirmation)
3. **Onboarding** → Fill name, age, height, weight → Select vegetarian + South Indian → Set budget ₹200/day → Complete
4. **Dashboard** → Show empty state with calculated targets (protein ring, calorie target)
5. **Log food** → Search "idli" → Set 200g → See live nutrition preview → Log it
6. **Dashboard updates** → Protein ring shows real intake, stats update
7. **AI Chatbot** → Ask "Why is iron important?" → Get RAG answer with ICMR citations
8. **Meal Planner** → Generate plan → Show 4 meals with Tamil names, costs, explanations
9. **Swap** → Click Swap on a meal → See 3 alternatives with nutrition comparison
10. **Grocery** → Generate from plan → Show categorized checklist with costs

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/food/search?q=idli` | Search food database |
| POST | `/api/food/log` | Log a food entry |
| POST | `/api/food/analyze` | Analyze food image (Gemini vision) |
| GET | `/api/users/profile` | Get user profile + targets |
| POST | `/api/users/profile` | Create/update profile |
| POST | `/api/chat/message` | Send chat message (routes through orchestrator) |
| GET | `/api/chat/conversations` | List conversations |
| POST | `/api/meals/plan` | Generate AI meal plan |
| POST | `/api/meals/swap` | Find food alternatives |
| POST | `/api/meals/rescue` | NutriRescue meal recovery |
| POST | `/api/feedback/` | Submit meal feedback |
| POST | `/api/grocery/generate` | Generate grocery list from plan |
| GET | `/api/analytics/weekly` | Weekly nutrition summary |
| POST | `/api/analytics/what-if` | What-if diet simulation |

All endpoints (except `/api/health`) require a Supabase JWT in the `Authorization: Bearer <token>` header.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Supabase credentials missing" warning | Make sure `frontend/.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Backend 401 on all requests | Check `SUPABASE_SERVICE_ROLE_KEY` and `VITE_SUPABASE_ANON_KEY` in root `.env` |
| "Model not found" error from Groq | Run `pip install --upgrade groq` and check model names in `.env` match available models |
| "Model no longer available" from Google | Update `GOOGLE_MODEL_DEFAULT` in `.env` (check [aistudio.google.com](https://aistudio.google.com) for current model names) |
| RAG chatbot gives generic answers | Make sure you ran `python -m app.rag.seed_knowledge` to seed the knowledge base |
| Food search returns empty | Check that you ran `supabase/setup_all.sql` which seeds 40 Indian foods |
| Database pauses after inactivity | Supabase free tier pauses after 7 days of inactivity. Open the dashboard to wake it up (~1 min). |
| Port 8000 already in use | Kill existing process: `taskkill /F /IM uvicorn.exe` (Windows) or `kill $(lsof -t -i:8000)` (Mac/Linux) |

---

## Credits

- **Indian Food Composition Tables (IFCT 2017)** — Nutritional data source
- **ICMR-NIN Dietary Guidelines** — Nutrition recommendations and RDA values
- **WHO Nutrition Guidelines** — Global nutrition standards
- **Groq** — LLM inference (Qwen 3.8 27B)
- **Google AI Studio** — Vision (Gemini Flash) and embeddings
- **Supabase** — Database, authentication, and storage
