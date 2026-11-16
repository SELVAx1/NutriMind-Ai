-- Food items with multilingual names
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

create index idx_food_items_name on food_items(name);
create index idx_food_items_category on food_items(category);

-- Nutritional values per 100g
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

-- Regional recipe variations
create table if not exists regional_variants (
  id uuid primary key default gen_random_uuid(),
  food_item_id uuid references food_items(id) on delete cascade not null,
  variant_name text not null,
  region text,
  attributes jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
