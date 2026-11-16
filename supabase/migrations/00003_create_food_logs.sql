create table if not exists food_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  log_date date not null default current_date,
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')) not null,
  created_at timestamptz default now()
);

create index idx_food_logs_user_date on food_logs(user_id, log_date);

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
