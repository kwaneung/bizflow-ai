-- Create prompt_templates table
CREATE TABLE IF NOT EXISTS prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL,
    version TEXT NOT NULL,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    variables JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(module_id, name, version)
);

-- Create index for active templates lookup
CREATE INDEX IF NOT EXISTS idx_prompt_templates_active 
ON prompt_templates(module_id, name) 
WHERE is_active = true;

-- Create index for module lookup
CREATE INDEX IF NOT EXISTS idx_prompt_templates_module 
ON prompt_templates(module_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_prompt_templates_updated_at 
BEFORE UPDATE ON prompt_templates 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

