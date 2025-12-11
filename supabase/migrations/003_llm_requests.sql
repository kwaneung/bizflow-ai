-- Create llm_requests table
CREATE TABLE IF NOT EXISTS llm_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id TEXT NOT NULL,
    input_data JSONB NOT NULL,
    prompt_template_id TEXT NOT NULL,
    prompt_template_version TEXT,
    context JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    priority INTEGER DEFAULT 0
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_llm_requests_module 
ON llm_requests(module_id);

CREATE INDEX IF NOT EXISTS idx_llm_requests_status 
ON llm_requests(status);

CREATE INDEX IF NOT EXISTS idx_llm_requests_created_at 
ON llm_requests(created_at);

-- Create composite index for status queries
CREATE INDEX IF NOT EXISTS idx_llm_requests_status_created 
ON llm_requests(status, created_at);

