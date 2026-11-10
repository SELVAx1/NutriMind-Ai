-- User profiles linked to Supabase Auth
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

-- Auto-update updated_at
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
