-- Create formatted_outputs table
CREATE TABLE IF NOT EXISTS formatted_outputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES llm_responses(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL,
    output_data JSONB NOT NULL,
    format TEXT NOT NULL CHECK (format IN ('json', 'text', 'markdown', 'html')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version TEXT NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_formatted_outputs_response 
ON formatted_outputs(response_id);

CREATE INDEX IF NOT EXISTS idx_formatted_outputs_module 
ON formatted_outputs(module_id);

-- Add foreign key constraint
ALTER TABLE formatted_outputs 
ADD CONSTRAINT fk_formatted_outputs_response 
FOREIGN KEY (response_id) 
REFERENCES llm_responses(id) 
ON DELETE CASCADE;

