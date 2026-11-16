-- Add gender column for accurate BMR calculation (Mifflin-St Jeor)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female'));
