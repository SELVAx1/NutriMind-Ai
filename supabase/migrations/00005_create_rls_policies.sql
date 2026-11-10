-- Enable RLS on all tables
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

-- User profiles: users see only their own
create policy "Users manage own profile" on user_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Preferences/allergies/targets: via profile ownership
create policy "Users manage own preferences" on dietary_preferences
  for all using (exists (
    select 1 from user_profiles where id = dietary_preferences.profile_id and user_id = auth.uid()
  ));

create policy "Users manage own allergies" on allergies
  for all using (exists (
    select 1 from user_profiles where id = allergies.profile_id and user_id = auth.uid()
  ));

create policy "Users manage own targets" on user_nutrition_targets
  for all using (exists (
    select 1 from user_profiles where id = user_nutrition_targets.profile_id and user_id = auth.uid()
  ));

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
  for all using (exists (
    select 1 from food_logs where id = food_log_items.food_log_id and user_id = auth.uid()
  ));

create policy "Users manage own image analyses" on image_analyses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Meal plans
create policy "Users manage own meal plans" on meal_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own meal plan items" on meal_plan_items
  for all using (exists (
    select 1 from meal_plans where id = meal_plan_items.meal_plan_id and user_id = auth.uid()
  ));

-- Grocery
create policy "Users manage own grocery lists" on grocery_lists
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own grocery items" on grocery_items
  for all using (exists (
    select 1 from grocery_lists where id = grocery_items.grocery_list_id and user_id = auth.uid()
  ));

-- Feedback
create policy "Users manage own feedback" on user_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Chat
create policy "Users manage own conversations" on conversations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own messages" on chat_messages
  for all using (exists (
    select 1 from conversations where id = chat_messages.conversation_id and user_id = auth.uid()
  ));
