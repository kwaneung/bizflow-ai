-- Create rate_limit_configs table
CREATE TABLE IF NOT EXISTS rate_limit_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL,
    limit_value INTEGER NOT NULL CHECK (limit_value > 0),
    window_seconds INTEGER NOT NULL CHECK (window_seconds > 0),
    strategy TEXT NOT NULL CHECK (strategy IN ('fixed', 'token-bucket', 'sliding-window')),
    queue_enabled BOOLEAN NOT NULL DEFAULT false,
    queue_max_size INTEGER CHECK (queue_max_size IS NULL OR queue_max_size > 0),
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique partial index for active providers
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limit_configs_active_provider 
ON rate_limit_configs(provider) 
WHERE is_active = true;

-- Create index for active config lookup
CREATE INDEX IF NOT EXISTS idx_rate_limit_configs_active 
ON rate_limit_configs(provider) 
WHERE is_active = true;

-- Add updated_at trigger
CREATE TRIGGER update_rate_limit_configs_updated_at 
BEFORE UPDATE ON rate_limit_configs 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

