-- 004 - Create formatted_outputs table for storing parsed and formatted LLM outputs
-- This table stores the processed output data after parsing LLM responses

create table if not exists public.formatted_outputs (
  id bigserial primary key,
  request_id uuid not null references public.llm_requests(id) on delete cascade,
  module_id text not null,
  output_data jsonb not null,
  format text not null,                     -- Output format (e.g., 'json')
  processing_time_ms integer not null default 0,
  model text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_formatted_outputs_request
  on public.formatted_outputs (request_id);

create index if not exists idx_formatted_outputs_module
  on public.formatted_outputs (module_id);


