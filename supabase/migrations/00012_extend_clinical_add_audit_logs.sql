-- Extend clinical_profiles with missing fields
ALTER TABLE clinical_profiles
  ADD COLUMN IF NOT EXISTS clinician_name text DEFAULT '',
  ADD COLUMN IF NOT EXISTS emergency_contact text DEFAULT '',
  ADD COLUMN IF NOT EXISTS safety_notes text DEFAULT '',
  ADD COLUMN IF NOT EXISTS pregnancy_status text DEFAULT 'Not applicable',
  ADD COLUMN IF NOT EXISTS consent_acknowledged boolean DEFAULT false;

-- Audit trail table for food safety verdicts
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food text NOT NULL,
  meal text NOT NULL,
  calories numeric DEFAULT 0,
  protein numeric DEFAULT 0,
  safety text CHECK (safety IN ('SAFE','CAUTION','FLAGGED')) DEFAULT 'SAFE',
  safety_reason text,
  database_source text DEFAULT 'IFCT 2017',
  confidence_score numeric DEFAULT 98,
  logged_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, logged_at DESC);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own audit logs" ON audit_logs;
CREATE POLICY "Users manage own audit logs" ON audit_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Pantry tracking
CREATE TABLE IF NOT EXISTS pantry_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  quantity text DEFAULT '',
  category text DEFAULT 'General',
  days_left int DEFAULT 7,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pantry_user ON pantry_items(user_id);

ALTER TABLE pantry_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own pantry" ON pantry_items;
CREATE POLICY "Users manage own pantry" ON pantry_items
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
