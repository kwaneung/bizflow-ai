-- Create input_schemas table
CREATE TABLE IF NOT EXISTS input_schemas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL,
    version TEXT NOT NULL,
    schema JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT false,
    UNIQUE(module_id, version)
);

-- Create index for active schema lookup
CREATE INDEX IF NOT EXISTS idx_input_schemas_active 
ON input_schemas(module_id) 
WHERE is_active = true;

-- Create index for module lookup
CREATE INDEX IF NOT EXISTS idx_input_schemas_module 
ON input_schemas(module_id);

