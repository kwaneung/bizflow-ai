-- Create error_contexts table
CREATE TABLE IF NOT EXISTS error_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES llm_requests(id) ON DELETE SET NULL,
    type TEXT NOT NULL CHECK (type IN ('validation', 'network', 'api', 'parsing', 'formatting', 'rate-limit')),
    code TEXT NOT NULL,
    message TEXT NOT NULL,
    technical_details JSONB,
    recovery_suggestions JSONB NOT NULL DEFAULT '[]'::jsonb,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved BOOLEAN NOT NULL DEFAULT false
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_error_contexts_request 
ON error_contexts(request_id);

CREATE INDEX IF NOT EXISTS idx_error_contexts_type 
ON error_contexts(type);

CREATE INDEX IF NOT EXISTS idx_error_contexts_resolved 
ON error_contexts(resolved);

-- Add foreign key constraint
ALTER TABLE error_contexts 
ADD CONSTRAINT fk_error_contexts_request 
FOREIGN KEY (request_id) 
REFERENCES llm_requests(id) 
ON DELETE SET NULL;

