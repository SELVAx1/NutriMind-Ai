# NutriMind AI

**Indian nutrition tracking that actually understands your plate.**

An AI-powered nutrition intelligence platform built from the ground up for Indian food habits. NutriMind tracks meals using verified IFCT 2017 scientific data, generates budget-constrained meal plans, recognizes food from photographs, answers nutrition questions with ICMR/WHO evidence citations, and screens every suggestion against your clinical safety profile.

Every calorie, protein gram, and iron milligram is a deterministic calculation from the database — the AI generates plans and explanations, never the nutrition numbers.

**Total cost: ₹0** — runs entirely on free-tier services.

---

## What It Does

### Nutrition Tracking
- **200+ verified Indian foods** with IFCT 2017 nutritional data — idli to biryani, samosa to ragi porridge
- **AI plate recognition** — photograph your thali and Gemini Vision identifies each dish with portions
- **Live dashboard** with circular macro rings (calories, protein, carbs, fat) updated from real Supabase food logs
- **Tamil and Hindi food names** alongside English for every item
- **Custom food creation** — add any food not in the database with manual nutrition entry
- **Frequent foods** — your most-logged foods appear first for quick one-tap logging
- **Streak tracking** — consecutive logging day counter on the dashboard

### AI Meal Planning
- **Budget-constrained plans** — generates 4-meal daily plans within your daily rupee limit
- **Multi-day planning** — generate plans for today, 3 days, or a full week
- **Smart remaining meals** — if you already ate breakfast, it only plans lunch, snack, and dinner using your remaining calorie budget
- **Constraint-aware food swaps** — click Swap on any meal to get 3 alternatives matched by protein, cost, and diet compatibility, with full nutrition recalculation
- **NutriRescue** — ate biryani instead of dal rice? The AI recalculates remaining targets and suggests a compensating dinner
- **Clinical reasoning** — every meal has a "why" explanation grounded in the user's profile and ICMR guidelines
- **Structured JSON mode** — meal plans use Groq's JSON mode for guaranteed valid responses

### AI Coach (RAG Chat)
- **Evidence-backed answers** — ask "Why is iron important?" and get answers with inline citations from 25 embedded ICMR/WHO articles
- **Streaming responses** — Server-Sent Events (SSE) stream AI responses token by token with a live typing cursor
- **Conversation memory** — the AI remembers the last 6 messages for context-aware follow-ups
- **Intent routing** — orchestrator classifies queries as nutrition knowledge, personal data, action requests, or general chat
- **Personal queries** — "How much did I eat today?" checks your actual food logs and gives a real answer with numbers
- **Multilingual** — responds in 6 Indian languages (Tamil, Hindi, Telugu, Kannada, Bengali, English) with proper language instructions to the LLM
- **Voice input** — microphone button using browser SpeechRecognition API with error handling and language support
- **Read aloud (TTS)** — speaker button on every AI message, with language-appropriate voice selection
- **Markdown rendering** — AI responses render bold, italic, lists, and code properly

### Clinical Safety
- **Allergen conflict detection** — flags peanuts, dairy, gluten, soy, and more against registered allergies
- **Hidden allergen detection** — naan contains dairy, gulab jamun contains milk solids, Maggi contains soy (30+ hidden allergen mappings)
- **Allergen cross-reactivity** — peanut allergy flags chickpeas and lentils, shellfish flags dust mites (15 cross-reaction entries)
- **23 drug-nutrient interactions** — Warfarin + Vitamin K, Metformin + alcohol, Statins + grapefruit, Levothyroxine + soy/calcium, ACE inhibitors + potassium, Insulin + alcohol, Antibiotics + dairy, and more
- **Medical condition screening** — diabetes + high-GI foods, hypertension + sodium, CKD + potassium, gout + purines, cholesterol + saturated fat
- **Food reaction log** — "I ate X, felt Y after Z minutes" tracking synced to Supabase
- **Audit trail** — every food entry gets a SAFE/CAUTION/FLAGGED verdict with reasoning, stored in Supabase

### Analytics & Insights
- **Weekly nutrition analytics** — daily calorie/protein/iron trends from real food log data
- **What-If simulator** — "Replace rice with ragi for 30 days" shows projected nutrition delta from the IFCT database
- **Deficiency risk insights** — computed from actual weekly intake vs ICMR targets
- **Progress tracking** — weight, waist, body fat, energy measurements over time with trend charts
- **Grocery intelligence** — auto-generates shopping list from meal plan, grouped by aisle with cost estimates
- **Pantry tracker** — track stored ingredients with expiry dates, synced to Supabase
- **Fridge-to-Meal** — select ingredients you have and the AI generates a zero-waste recipe
- **Seasonal food awareness** — 30 seasonal food entries with peak months and regional availability

### Profile & Onboarding
- **3-step onboarding** — biometrics → diet & region → budget & activity, with validation
- **Automatic ICMR targets** — BMR (Mifflin-St Jeor with gender), TDEE, and macro targets calculated on profile creation
- **Gender-aware calculations** — male (+5) and female (-161) Mifflin-St Jeor constants
- **Dark mode** — Light, Dark, and System theme with CSS custom properties
- **Food synonyms** — search "Thayir Sadam" to find "Curd Rice", "Chawal" for "Cooked Rice"

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts, Lucide icons |
| Backend | Python 3.11+, FastAPI, Pydantic, fully async (httpx, AsyncGroq) |
| Database & Auth | Supabase (PostgreSQL + pgvector + Auth + RLS) |
| Primary LLM | Groq — Qwen 3.8 27B (free tier, 28 RPM, streaming + JSON mode) |
| Vision & Embeddings | Google AI Studio — Gemini Flash + gemini-embedding-001 (free tier) |
| RAG | pgvector cosine similarity, 768-dim embeddings, 25 ICMR/WHO articles |

---

## Project Structure

```
Nutrumind_AI/
├── frontend/                        # React 19 + TypeScript + Vite 8
│   ├── src/
│   │   ├── pages/                   # 19 page components + auth pages
│   │   ├── components/              # UI, layout, chat, food components
│   │   │   ├── auth/                # ProtectedRoute
│   │   │   ├── chat/                # ChatInput (voice), ChatMessage (TTS, markdown)
│   │   │   ├── food/                # FoodSearch (autocomplete), NutritionPreview
│   │   │   ├── layout/              # AppShell, Sidebar, Header, MobileNav, SearchCommandDialog
│   │   │   └── ui/                  # Button, Card, Input, Badge, Skeleton, ErrorBoundary
│   │   ├── hooks/                   # 8 custom hooks
│   │   │   ├── useProfile, useFood, useFoodLog
│   │   │   ├── useChat (SSE streaming), useMealPlan
│   │   │   ├── useClinicalSafety, useDashboard, useStreak
│   │   ├── contexts/                # AuthContext (useAuth), ThemeContext (dark mode)
│   │   ├── lib/                     # supabase.ts, api.ts, nutrition.ts
│   │   └── types/                   # 15+ TypeScript interfaces
│   └── index.html
│
├── backend/                         # Python FastAPI (fully async)
│   ├── app/
│   │   ├── api/                     # 9 route modules (food, meals, chat, users, analytics, grocery, feedback, nutritionist, health)
│   │   ├── agents/                  # 7 AI agents + orchestrator
│   │   │   ├── orchestrator.py      # Intent classifier + language extraction
│   │   │   ├── knowledge_agent.py   # RAG retrieval + cited responses
│   │   │   ├── meal_plan_agent.py   # Budget-constrained plan generation
│   │   │   ├── swap_agent.py        # Protein-parity food alternatives
│   │   │   ├── rescue_agent.py      # NutriRescue meal recovery
│   │   │   ├── grocery_agent.py     # Shopping list aggregation
│   │   │   ├── feedback_agent.py    # Preference learning
│   │   │   └── food_recognition_agent.py  # Gemini Vision plate analysis
│   │   ├── ai/                      # LLM provider abstraction
│   │   │   ├── groq_provider.py     # Streaming + JSON mode
│   │   │   ├── google_provider.py   # Vision + embeddings
│   │   │   ├── factory.py           # generate_text, generate_text_stream, analyze_image, embed
│   │   │   └── rate_limiter.py      # Per-provider rate tracking + auto-failover
│   │   ├── rag/                     # RAG pipeline
│   │   │   ├── seed_knowledge.py    # 25 ICMR/WHO articles
│   │   │   ├── ingest.py            # Chunking + embedding
│   │   │   ├── retriever.py         # pgvector cosine search
│   │   │   └── context_builder.py   # Evidence + profile → prompt
│   │   ├── services/                # Business logic
│   │   │   ├── nutrition_engine.py  # BMR, TDEE, macros, food nutrition (deterministic)
│   │   │   └── food_service.py      # Search (with synonyms), log, seasonal
│   │   ├── middleware/              # Auth + safety
│   │   │   ├── supabase_auth.py     # JWT verification via Supabase API
│   │   │   └── safety.py            # Emergency/diagnosis/unsafe diet filters
│   │   └── db/
│   │       └── supabase_client.py   # Async Supabase REST client
│   └── requirements.txt
│
├── supabase/                        # Database setup
│   ├── setup_all.sql                # Main schema + seed data (40 base foods)
│   ├── seed.sql                     # Indian food composition data
│   └── migrations/                  # 15 migration files
│       ├── 00001-00011              # Core schema migrations
│       ├── 00012_extend_clinical_add_audit_logs.sql
│       ├── 00013_expand_food_database.sql     # 160+ new foods
│       ├── 00014_db_views_and_indexes.sql     # Views, synonyms, allergens, drugs, seasonal tables
│       └── 00015_seed_safety_and_seasonal_data.sql  # Safety + seasonal seed data
│
├── docs/                            # Architecture diagrams
│   ├── architecture-ppt.mermaid     # Simple overview for presentations
│   └── system-design-full.mermaid   # Complete technical system design
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
git clone https://github.com/SELVAx1/NutriMind-Ai.git
cd NutriMind-Ai
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
2. Copy and run `supabase/setup_all.sql` — creates core tables with RLS and seeds 40 base foods
3. Run these migrations **in order** (select "Run and enable RLS" when prompted):
   - `supabase/migrations/00006_create_document_chunks.sql`
   - `supabase/migrations/00007_match_documents_function.sql`
   - `supabase/migrations/00008_fix_vector_dimension.sql`
   - `supabase/migrations/00009_add_gender_column.sql`
   - `supabase/migrations/00010_create_clinical_safety_tables.sql`
   - `supabase/migrations/00011_create_nutritionist_tables.sql`
   - `supabase/migrations/00012_extend_clinical_add_audit_logs.sql`
   - `supabase/migrations/00013_expand_food_database.sql` — adds 160+ new foods
   - `supabase/migrations/00014_db_views_and_indexes.sql` — views, synonyms, allergens, drugs, seasonal tables
   - `supabase/migrations/00015_seed_safety_and_seasonal_data.sql` — seed safety + seasonal data

4. After running 00014, run this to add read policies for reference tables:

```sql
CREATE POLICY "Authenticated read food_synonyms" ON food_synonyms FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read allergen_cross_reactions" ON allergen_cross_reactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read food_allergen_map" ON food_allergen_map FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read drug_nutrient_interactions" ON drug_nutrient_interactions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated read seasonal_foods" ON seasonal_foods FOR SELECT USING (auth.role() = 'authenticated');
```

**Verify:** Table Editor should show `food_items` (200+ rows), `document_chunks`, `clinical_profiles`, `audit_logs`, `pantry_items`, `food_synonyms`, `allergen_cross_reactions`, `drug_nutrient_interactions`, `seasonal_foods`.

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

This embeds 25 ICMR/WHO nutrition articles into pgvector:

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
  OK: Potassium — The Forgotten Mineral
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
| GET | `/api/food/search?q=idli` | Search food database (name, tamil, hindi, synonyms) |
| GET | `/api/food/:id` | Get food by ID |
| POST | `/api/food/log` | Log a food entry |
| POST | `/api/food/analyze` | Analyze food image (Gemini Vision) |
| GET | `/api/users/profile` | Get user profile + ICMR targets |
| POST | `/api/users/profile` | Create/update profile (triggers BMR/TDEE/macro calc) |
| POST | `/api/chat/message` | Send chat message (routed through orchestrator, saved) |
| POST | `/api/chat/stream` | SSE streaming chat with conversation memory |
| POST | `/api/chat/analyze` | Quick AI analysis (not saved to history) |
| GET | `/api/chat/conversations` | List conversations |
| GET | `/api/chat/history/:id` | Get conversation messages |
| POST | `/api/meals/plan` | Generate AI meal plan (JSON mode, skips eaten meals) |
| POST | `/api/meals/swap` | Find food alternatives (JSON mode) |
| POST | `/api/meals/rescue` | NutriRescue meal recovery |
| GET | `/api/meals/plans` | List meal plans |
| GET | `/api/meals/plans/:id` | Get plan items |
| POST | `/api/grocery/generate` | Generate grocery list from plan |
| GET | `/api/grocery/lists` | List grocery lists |
| POST | `/api/feedback/` | Submit meal feedback (auto-classifies, adjusts preferences) |
| GET | `/api/analytics/weekly` | Weekly nutrition summary with patterns |
| POST | `/api/analytics/what-if` | What-if diet simulation |
| GET | `/api/nutritionist/clients` | List assigned clients |
| GET | `/api/nutritionist/clients/:id/summary` | Client nutrition summary |
| POST | `/api/nutritionist/approve/:plan_id` | Approve a meal plan |

All endpoints except `/api/health` require a Supabase JWT in `Authorization: Bearer <token>`.

---

## Data Sources

- **Indian Food Composition Tables (IFCT 2017)** — National Institute of Nutrition, Hyderabad. Nutritional data for all 200+ food items.
- **ICMR-NIN Dietary Guidelines 2020** — Recommended Dietary Allowances for the Indian population. BMR, protein, iron, calcium, B12, Vitamin D targets.
- **WHO Nutrition Guidelines** — Global nutrition standards referenced in the RAG knowledge base.

### RAG Knowledge Base (25 articles)

| Topic | Source |
|-------|--------|
| Iron requirements & sources | ICMR-NIN 2020 |
| Protein requirements | ICMR-NIN 2020 |
| Dietary fibre | ICMR-NIN 2020 |
| Vitamin B12 for vegetarians | ICMR-NIN 2020 |
| Calcium & bone health | ICMR-NIN 2020 |
| Budget-friendly nutrition | IFCT 2017 |
| South Indian food nutrition | IFCT 2017 |
| Daily calorie requirements | ICMR-NIN 2020 |
| Diabetes management through diet | ICMR 2018 |
| PCOS & nutrition | Endocrine Society |
| Pregnancy nutrition (trimester guide) | ICMR-NIN 2020 |
| Child nutrition (6mo–12yr) | ICMR-NIN |
| Sports nutrition for Indian athletes | SAI Guidelines |
| North Indian food nutrition | IFCT 2017 |
| Vitamin D deficiency | Indian J. Endocrinology |
| Antinutrients in Indian foods | J. Food Science |
| Hypertension & sodium | ICMR-NIN / WHO |
| Gut health & probiotics | Indian J. Medical Research |
| Weight management | ICMR-NIN 2020 |
| Anaemia in Indian women | NFHS-5 / ICMR |
| Cooking oils guide | ICMR-NIN / FSSAI |
| Seasonal eating in India | IFCT 2017 |
| Thyroid diet | Indian J. Endocrinology |
| Cholesterol & heart health | Indian Heart Association |
| Food safety & hygiene | FSSAI / WHO |
| Zinc deficiency | ICMR-NIN 2020 |
| Potassium — the forgotten mineral | ICMR-NIN / WHO |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend 401 on all requests | Check `VITE_SUPABASE_ANON_KEY` in root `.env`. The backend uses it to verify tokens with Supabase. |
| "Supabase credentials missing" | Make sure `frontend/.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` |
| Chat gives "Could not reach AI service" | Backend not running. Start it with `cd backend && python -m uvicorn app.main:app --reload --port 8000` |
| Meal plan returns empty | Make sure you completed onboarding (profile + targets must exist) and the backend is running |
| RAG chatbot gives generic answers | Run `python -m app.rag.seed_knowledge` to seed the 25-article knowledge base |
| Food search returns empty | Run all migrations including `00013_expand_food_database.sql` |
| Database pauses after inactivity | Supabase free tier pauses after 7 days. Open the dashboard to wake it up (~1 min) |
| Port 8000 already in use | Kill: `taskkill /F /IM uvicorn.exe` (Windows) or `kill $(lsof -t -i:8000)` (Mac/Linux) |
| Migration policy error | Use "Run and enable RLS" when Supabase prompts. Policies use `DROP IF EXISTS` for safe re-runs. |
| Dark mode not working | Check Settings page → Appearance toggle. System mode follows your OS preference. |
