-- ============================================================
-- NutriMind AI — Complete Database Setup
-- ============================================================
-- Run this ONCE in your Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → Paste this → Run
-- ============================================================

-- Enable pgvector for RAG embeddings
create extension if not exists vector;

-- ============================================================
-- 1. USER PROFILES
-- ============================================================

create table if not exists user_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  full_name text,
  age int,
  height_cm numeric,
  weight_kg numeric,
  activity_level text check (activity_level in ('sedentary','light','moderate','active','very_active')),
  diet_type text check (diet_type in ('veg','non-veg','vegan','jain','eggetarian')),
  region text,
  budget_daily numeric,
  max_cooking_min int,
  language_preference text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists dietary_preferences (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references user_profiles(id) on delete cascade not null,
  cuisine_type text,
  preference_key text not null,
  preference_value text,
  created_at timestamptz default now()
);

create table if not exists allergies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references user_profiles(id) on delete cascade not null,
  allergen text not null,
  severity text check (severity in ('mild','moderate','severe')) default 'moderate',
  created_at timestamptz default now()
);

create table if not exists user_nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references user_profiles(id) on delete cascade unique not null,
  calories_kcal numeric,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fibre_g numeric,
  iron_mg numeric,
  calcium_mg numeric,
  vitamin_b12_mcg numeric,
  vitamin_c_mg numeric,
  vitamin_d_mcg numeric,
  potassium_mg numeric,
  created_at timestamptz default now()
);

-- Auto-update updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger user_profiles_updated_at
  before update on user_profiles
  for each row execute function update_updated_at();

-- ============================================================
-- 2. FOOD ITEMS & NUTRITIONAL VALUES
-- ============================================================

create table if not exists food_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_tamil text,
  name_hindi text,
  category text,
  region text,
  source text check (source in ('IFCT','USDA','manual')) default 'IFCT',
  is_common boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_food_items_name on food_items(name);
create index if not exists idx_food_items_category on food_items(category);

create table if not exists nutritional_values (
  id uuid primary key default gen_random_uuid(),
  food_item_id uuid references food_items(id) on delete cascade unique not null,
  calories_per_100g numeric,
  protein_per_100g numeric,
  carbs_per_100g numeric,
  fat_per_100g numeric,
  fibre_per_100g numeric,
  sugar_per_100g numeric,
  sodium_mg numeric,
  calcium_mg numeric,
  iron_mg numeric,
  vitamin_a_mcg numeric,
  vitamin_b12_mcg numeric,
  vitamin_c_mg numeric,
  vitamin_d_mcg numeric,
  potassium_mg numeric
);

create table if not exists regional_variants (
  id uuid primary key default gen_random_uuid(),
  food_item_id uuid references food_items(id) on delete cascade not null,
  variant_name text not null,
  region text,
  attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- ============================================================
-- 3. FOOD LOGS
-- ============================================================

create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null default current_date,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')) not null,
  created_at timestamptz default now()
);

create index if not exists idx_food_logs_user_date on food_logs(user_id, log_date);

create table if not exists food_log_items (
  id uuid primary key default gen_random_uuid(),
  food_log_id uuid references food_logs(id) on delete cascade not null,
  food_item_id uuid references food_items(id) not null,
  quantity_g numeric not null,
  confidence numeric default 1.0,
  source text check (source in ('manual','image','voice')) default 'manual',
  created_at timestamptz default now()
);

create table if not exists image_analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  food_log_item_id uuid references food_log_items(id),
  image_path text,
  detected_items jsonb default '[]'::jsonb,
  overall_confidence numeric,
  user_confirmed boolean default false,
  created_at timestamptz default now()
);

-- ============================================================
-- 4. MEAL PLANS, GROCERY, FEEDBACK, CHAT
-- ============================================================

create table if not exists meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  status text check (status in ('active','completed','cancelled')) default 'active',
  constraints jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid references meal_plans(id) on delete cascade not null,
  food_item_id uuid references food_items(id) not null,
  plan_date date not null,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')) not null,
  quantity_g numeric,
  estimated_cost numeric,
  prep_time_min int,
  explanation text,
  created_at timestamptz default now()
);

create table if not exists grocery_lists (
  id uuid primary key default gen_random_uuid(),
  meal_plan_id uuid references meal_plans(id),
  user_id uuid references auth.users(id) on delete cascade not null,
  total_estimated_cost numeric,
  status text check (status in ('pending','purchased')) default 'pending',
  created_at timestamptz default now()
);

create table if not exists grocery_items (
  id uuid primary key default gen_random_uuid(),
  grocery_list_id uuid references grocery_lists(id) on delete cascade not null,
  ingredient_name text not null,
  quantity numeric,
  unit text,
  estimated_cost numeric,
  in_pantry boolean default false
);

create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  target_type text not null,
  target_id uuid,
  feedback_text text,
  feedback_category text check (feedback_category in ('taste','time','budget','health','general')),
  created_at timestamptz default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text,
  created_at timestamptz default now()
);

create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade not null,
  role text check (role in ('user','assistant')) not null,
  content text not null,
  citations jsonb default '[]'::jsonb,
  route_type text check (route_type in ('rag','personal','general','action')),
  created_at timestamptz default now()
);

-- ============================================================
-- 5. ROW-LEVEL SECURITY
-- ============================================================

alter table user_profiles enable row level security;
alter table dietary_preferences enable row level security;
alter table allergies enable row level security;
alter table user_nutrition_targets enable row level security;
alter table food_items enable row level security;
alter table nutritional_values enable row level security;
alter table regional_variants enable row level security;
alter table food_logs enable row level security;
alter table food_log_items enable row level security;
alter table image_analyses enable row level security;
alter table meal_plans enable row level security;
alter table meal_plan_items enable row level security;
alter table grocery_lists enable row level security;
alter table grocery_items enable row level security;
alter table user_feedback enable row level security;
alter table conversations enable row level security;
alter table chat_messages enable row level security;

-- Users see only their own profile
create policy "Users manage own profile" on user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own preferences" on dietary_preferences
  for all using (exists (select 1 from user_profiles where id = dietary_preferences.profile_id and user_id = auth.uid()));

create policy "Users manage own allergies" on allergies
  for all using (exists (select 1 from user_profiles where id = allergies.profile_id and user_id = auth.uid()));

create policy "Users manage own targets" on user_nutrition_targets
  for all using (exists (select 1 from user_profiles where id = user_nutrition_targets.profile_id and user_id = auth.uid()));

-- Food items: public read for all authenticated users
create policy "Anyone can read food items" on food_items
  for select using (auth.role() = 'authenticated');

create policy "Anyone can read nutritional values" on nutritional_values
  for select using (auth.role() = 'authenticated');

create policy "Anyone can read regional variants" on regional_variants
  for select using (auth.role() = 'authenticated');

-- Food logs: user owns their logs
create policy "Users manage own food logs" on food_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own food log items" on food_log_items
  for all using (exists (select 1 from food_logs where id = food_log_items.food_log_id and user_id = auth.uid()));

create policy "Users manage own image analyses" on image_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Meal plans
create policy "Users manage own meal plans" on meal_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own meal plan items" on meal_plan_items
  for all using (exists (select 1 from meal_plans where id = meal_plan_items.meal_plan_id and user_id = auth.uid()));

-- Grocery
create policy "Users manage own grocery lists" on grocery_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own grocery items" on grocery_items
  for all using (exists (select 1 from grocery_lists where id = grocery_items.grocery_list_id and user_id = auth.uid()));

-- Feedback
create policy "Users manage own feedback" on user_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Chat
create policy "Users manage own conversations" on conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own messages" on chat_messages
  for all using (exists (select 1 from conversations where id = chat_messages.conversation_id and user_id = auth.uid()));

-- ============================================================
-- 6. SEED DATA — 40 Common Indian Foods
-- ============================================================

insert into food_items (name, name_tamil, name_hindi, category, region, source, is_common) values
  ('Idli', 'இட்லி', 'इडली', 'breakfast', 'South Indian', 'IFCT', true),
  ('Dosa (plain)', 'தோசை', 'डोसा', 'breakfast', 'South Indian', 'IFCT', true),
  ('Sambar', 'சாம்பார்', 'सांभर', 'curry', 'South Indian', 'IFCT', true),
  ('Rasam', 'ரசம்', 'रसम', 'soup', 'South Indian', 'IFCT', true),
  ('Pongal (ven)', 'வெண் பொங்கல்', 'पोंगल', 'breakfast', 'South Indian', 'IFCT', true),
  ('Cooked rice', 'சாதம்', 'चावल', 'staple', 'All India', 'IFCT', true),
  ('Chapati', 'சப்பாத்தி', 'चपाती', 'staple', 'All India', 'IFCT', true),
  ('Dal (toor)', 'பருப்பு', 'दाल', 'curry', 'All India', 'IFCT', true),
  ('Curd (plain)', 'தயிர்', 'दही', 'dairy', 'All India', 'IFCT', true),
  ('Poriyal (beans)', 'பொரியல்', 'सब्जी', 'side', 'South Indian', 'IFCT', true),
  ('Sundal (chickpea)', 'சுண்டல்', 'सुंदल', 'snack', 'South Indian', 'IFCT', true),
  ('Kootu', 'கூட்டு', 'कूटू', 'curry', 'South Indian', 'IFCT', true),
  ('Upma', 'உப்புமா', 'उपमा', 'breakfast', 'South Indian', 'IFCT', true),
  ('Poha', 'அவல்', 'पोहा', 'breakfast', 'West Indian', 'IFCT', true),
  ('Ragi porridge', 'ராகி கஞ்சி', 'रागी दलिया', 'breakfast', 'South Indian', 'IFCT', true),
  ('Lemon rice', 'எலுமிச்சை சாதம்', 'नींबू चावल', 'rice', 'South Indian', 'IFCT', true),
  ('Curd rice', 'தயிர் சாதம்', 'दही चावल', 'rice', 'South Indian', 'IFCT', true),
  ('Sambar rice', 'சாம்பார் சாதம்', 'सांभर चावल', 'rice', 'South Indian', 'IFCT', true),
  ('Biryani (veg)', 'பிரியாணி', 'बिरयानी', 'rice', 'All India', 'IFCT', true),
  ('Roti', 'ரோட்டி', 'रोटी', 'staple', 'North Indian', 'IFCT', true),
  ('Paneer butter masala', 'பன்னீர்', 'पनीर बटर मसाला', 'curry', 'North Indian', 'IFCT', true),
  ('Rajma', 'ராஜ்மா', 'राजमा', 'curry', 'North Indian', 'IFCT', true),
  ('Aloo gobi', 'உருளை கோபி', 'आलू गोभी', 'curry', 'North Indian', 'IFCT', true),
  ('Palak paneer', 'கீரை பன்னீர்', 'पालक पनीर', 'curry', 'North Indian', 'IFCT', true),
  ('Egg (boiled)', 'முட்டை', 'अंडा', 'protein', 'All India', 'IFCT', true),
  ('Banana', 'வாழைப்பழம்', 'केला', 'fruit', 'All India', 'IFCT', true),
  ('Buttermilk', 'மோர்', 'छाछ', 'dairy', 'All India', 'IFCT', true),
  ('Groundnut', 'வேர்க்கடலை', 'मूंगफली', 'snack', 'All India', 'IFCT', true),
  ('Sprouted moong', 'முளை பயறு', 'अंकुरित मूंग', 'snack', 'All India', 'IFCT', true),
  ('Soy chunks', 'சோயா', 'सोया चंक्स', 'protein', 'All India', 'manual', true),
  ('Paratha (plain)', 'பராத்தா', 'पराठा', 'staple', 'North Indian', 'IFCT', true),
  ('Poori', 'பூரி', 'पूरी', 'staple', 'All India', 'IFCT', true),
  ('Vada', 'வடை', 'वड़ा', 'snack', 'South Indian', 'IFCT', true),
  ('Coconut chutney', 'தேங்காய் சட்னி', 'नारियल चटनी', 'condiment', 'South Indian', 'IFCT', true),
  ('Pickle (mango)', 'ஊறுகாய்', 'अचार', 'condiment', 'All India', 'IFCT', true),
  ('Milk (whole)', 'பால்', 'दूध', 'dairy', 'All India', 'IFCT', true),
  ('Tea with milk', 'டீ', 'चाय', 'beverage', 'All India', 'manual', true),
  ('Puttu', 'புட்டு', 'पुट्टू', 'breakfast', 'South Indian', 'IFCT', true),
  ('Appam', 'ஆப்பம்', 'अप्पम', 'breakfast', 'South Indian', 'IFCT', true),
  ('Kambu koozh', 'கம்பு கூழ்', 'बाजरा कूज', 'beverage', 'South Indian', 'IFCT', true);

-- Nutritional values per 100g (IFCT 2017 approximate)
insert into nutritional_values (food_item_id, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g, fibre_per_100g, sugar_per_100g, sodium_mg, calcium_mg, iron_mg, vitamin_a_mcg, vitamin_b12_mcg, vitamin_c_mg, vitamin_d_mcg, potassium_mg)
select fi.id, v.cal, v.prot, v.carb, v.fat, v.fib, v.sug, v.sod, v.calc, v.iron, v.va, v.vb12, v.vc, v.vd, v.pot
from (values
  ('Idli',              130, 3.9, 24.0, 1.5, 1.0, 0.5, 180, 15, 0.8, 2, 0, 0, 0, 60),
  ('Dosa (plain)',      168, 3.5, 25.0, 5.8, 0.8, 0.3, 200, 20, 0.6, 3, 0, 0, 0, 55),
  ('Sambar',            65,  2.8, 8.0,  2.5, 2.0, 1.5, 420, 30, 1.2, 15, 0, 5, 0, 180),
  ('Rasam',             28,  0.8, 4.5,  0.5, 0.5, 0.8, 350, 12, 0.5, 8, 0, 8, 0, 120),
  ('Pongal (ven)',      150, 3.5, 22.0, 5.0, 0.6, 0.2, 150, 18, 0.7, 5, 0, 0, 0, 70),
  ('Cooked rice',       130, 2.7, 28.0, 0.3, 0.4, 0.1, 5,   10, 0.2, 0, 0, 0, 0, 35),
  ('Chapati',           240, 7.5, 42.0, 5.0, 3.0, 1.5, 180, 30, 2.0, 8, 0, 0, 0, 120),
  ('Dal (toor)',        120, 7.0, 16.0, 2.5, 3.5, 1.0, 250, 40, 1.8, 10, 0, 2, 0, 250),
  ('Curd (plain)',      60,  3.5, 4.5,  3.0, 0,   4.5, 40,  120, 0.1, 25, 0.5, 1, 0, 150),
  ('Poriyal (beans)',   80,  2.5, 8.0,  4.0, 3.0, 1.5, 200, 45, 1.5, 20, 0, 10, 0, 190),
  ('Sundal (chickpea)', 164, 8.9, 27.0, 2.6, 7.6, 2.0, 240, 50, 2.1, 3, 0, 4, 0, 290),
  ('Kootu',             90,  3.5, 10.0, 3.5, 2.5, 1.0, 180, 55, 1.3, 12, 0, 6, 0, 170),
  ('Upma',              150, 3.2, 22.0, 5.5, 1.2, 0.5, 280, 15, 0.8, 5, 0, 0, 0, 50),
  ('Poha',              160, 2.8, 28.0, 4.5, 0.8, 0.3, 200, 12, 1.0, 3, 0, 2, 0, 55),
  ('Ragi porridge',     110, 3.5, 22.0, 1.3, 3.6, 1.0, 50,  344, 3.9, 5, 0, 0, 0, 280),
  ('Lemon rice',        170, 2.5, 30.0, 4.5, 0.5, 0.3, 180, 12, 0.5, 2, 0, 5, 0, 40),
  ('Curd rice',         120, 3.0, 18.0, 3.5, 0.3, 2.0, 100, 80, 0.3, 15, 0.3, 1, 0, 100),
  ('Sambar rice',       140, 3.5, 22.0, 3.5, 1.5, 1.0, 350, 25, 1.0, 10, 0, 3, 0, 150),
  ('Biryani (veg)',     180, 4.0, 28.0, 6.0, 1.0, 0.5, 350, 20, 0.8, 8, 0, 2, 0, 100),
  ('Roti',              260, 8.0, 45.0, 5.5, 3.5, 1.5, 200, 35, 2.2, 10, 0, 0, 0, 130),
  ('Paneer butter masala', 220, 10.0, 8.0, 18.0, 0.5, 3.0, 400, 180, 0.5, 120, 0.2, 2, 0, 80),
  ('Rajma',             125, 7.5, 18.0, 2.0, 5.0, 1.5, 300, 60, 2.5, 5, 0, 3, 0, 350),
  ('Aloo gobi',         100, 2.5, 12.0, 5.0, 2.0, 1.5, 250, 25, 0.8, 15, 0, 30, 0, 250),
  ('Palak paneer',      170, 9.0, 6.0,  13.0, 2.0, 1.0, 350, 200, 2.5, 350, 0.2, 15, 0, 300),
  ('Egg (boiled)',      155, 13.0, 1.1,  11.0, 0,   1.1, 124, 50, 1.2, 150, 1.1, 0, 2, 126),
  ('Banana',            89,  1.1, 22.8, 0.3, 2.6, 12.2, 1,   5,  0.3, 3, 0, 9, 0, 358),
  ('Buttermilk',        40,  3.3, 4.8,  0.9, 0,   4.8, 105, 116, 0.1, 20, 0.2, 1, 0, 150),
  ('Groundnut',         567, 25.8, 16.1, 49.2, 8.5, 4.7, 18,  92, 4.6, 0, 0, 0, 0, 705),
  ('Sprouted moong',    105, 7.5, 14.0, 1.2, 4.0, 1.0, 10,  35, 1.8, 5, 0, 10, 0, 200),
  ('Soy chunks',        345, 52.0, 33.0, 0.5, 13.0, 0, 50,  350, 10.0, 0, 0, 0, 0, 1800),
  ('Paratha (plain)',   290, 6.5, 40.0, 12.0, 2.5, 1.0, 250, 25, 1.5, 8, 0, 0, 0, 100),
  ('Poori',             350, 6.0, 38.0, 20.0, 1.5, 0.5, 200, 20, 1.2, 5, 0, 0, 0, 80),
  ('Vada',              290, 8.5, 25.0, 18.0, 3.0, 1.0, 300, 30, 2.0, 5, 0, 2, 0, 200),
  ('Coconut chutney',   140, 2.0, 8.0,  12.0, 3.0, 2.0, 150, 10, 0.5, 0, 0, 2, 0, 180),
  ('Pickle (mango)',    150, 1.0, 10.0, 12.0, 1.5, 5.0, 5000, 20, 1.0, 30, 0, 5, 0, 100),
  ('Milk (whole)',      62,  3.2, 4.8,  3.3, 0,   4.8, 44,  120, 0.1, 46, 0.5, 1, 1.2, 150),
  ('Tea with milk',     38,  1.5, 4.0,  1.5, 0,   3.5, 25,  50, 0.1, 15, 0.1, 0, 0, 60),
  ('Puttu',             190, 3.0, 35.0, 4.5, 1.0, 0.5, 100, 15, 0.5, 2, 0, 0, 0, 50),
  ('Appam',             170, 2.5, 30.0, 4.0, 0.5, 0.3, 120, 10, 0.4, 1, 0, 0, 0, 40),
  ('Kambu koozh',       95,  2.5, 18.0, 1.5, 2.0, 1.0, 30,  42, 2.5, 3, 0, 0, 0, 200)
) as v(name, cal, prot, carb, fat, fib, sug, sod, calc, iron, va, vb12, vc, vd, pot)
join food_items fi on fi.name = v.name;

-- ============================================================
-- DONE! You should see:
--   17 tables created
--   17 RLS policies enabled
--   40 food items with nutritional values seeded
-- ============================================================
