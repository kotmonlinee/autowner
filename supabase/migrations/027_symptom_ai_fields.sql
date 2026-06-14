-- Add AI-generated content columns to symptoms table
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS diagnosis_steps TEXT;
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS driving_advice TEXT;
ALTER TABLE symptoms ADD COLUMN IF NOT EXISTS faq_items TEXT;
