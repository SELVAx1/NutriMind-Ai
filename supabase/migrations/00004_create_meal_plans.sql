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
