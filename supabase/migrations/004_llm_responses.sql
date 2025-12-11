-- Create llm_responses table
CREATE TABLE IF NOT EXISTS llm_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES llm_requests(id) ON DELETE CASCADE,
    raw_content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    parsed BOOLEAN NOT NULL DEFAULT false,
    formatted BOOLEAN NOT NULL DEFAULT false
);

-- Create index for request lookup
CREATE INDEX IF NOT EXISTS idx_llm_responses_request 
ON llm_responses(request_id);

-- Add foreign key constraint
ALTER TABLE llm_responses 
ADD CONSTRAINT fk_llm_responses_request 
FOREIGN KEY (request_id) 
REFERENCES llm_requests(id) 
ON DELETE CASCADE;

