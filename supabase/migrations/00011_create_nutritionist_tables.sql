-- Nutritionist client assignment and plan approval tables
CREATE TABLE IF NOT EXISTS client_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nutritionist_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(nutritionist_id, client_id)
);

CREATE TABLE IF NOT EXISTS recommendation_approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  nutritionist_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('approved', 'rejected', 'pending')) DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Nutritionists manage own assignments" ON client_assignments
  FOR ALL USING (auth.uid() = nutritionist_id) WITH CHECK (auth.uid() = nutritionist_id);

CREATE POLICY "Nutritionists manage own approvals" ON recommendation_approvals
  FOR ALL USING (auth.uid() = nutritionist_id) WITH CHECK (auth.uid() = nutritionist_id);
