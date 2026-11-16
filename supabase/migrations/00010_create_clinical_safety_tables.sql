-- Clinical safety profiles for allergen/medication tracking
CREATE TABLE IF NOT EXISTS clinical_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  allergies text[] DEFAULT '{}',
  allergy_severity text CHECK (allergy_severity IN ('mild','moderate','severe')) DEFAULT 'moderate',
  intolerances text[] DEFAULT '{}',
  dietary_restrictions text[] DEFAULT '{}',
  medications text[] DEFAULT '{}',
  supplements text[] DEFAULT '{}',
  conditions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER clinical_profiles_updated_at
  BEFORE UPDATE ON clinical_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Symptom logs
CREATE TABLE IF NOT EXISTS symptom_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  food_trigger text NOT NULL,
  symptoms text[] DEFAULT '{}',
  severity text CHECK (severity IN ('mild','moderate','severe')) DEFAULT 'moderate',
  timing text,
  notes text,
  logged_at timestamptz DEFAULT now()
);

CREATE INDEX idx_symptom_logs_user ON symptom_logs(user_id, logged_at DESC);

-- Progress measurements
CREATE TABLE IF NOT EXISTS progress_measurements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight_kg numeric,
  waist_cm numeric,
  body_fat_pct numeric,
  energy_level int CHECK (energy_level BETWEEN 1 AND 10),
  measured_at timestamptz DEFAULT now()
);

CREATE INDEX idx_progress_user ON progress_measurements(user_id, measured_at DESC);

-- RLS
ALTER TABLE clinical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own clinical profile" ON clinical_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own symptom logs" ON symptom_logs
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own progress" ON progress_measurements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
