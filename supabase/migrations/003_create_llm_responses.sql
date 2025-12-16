-- 003 - Create llm_responses table for storing raw LLM API responses
-- This table stores the raw response content from LLM APIs

create table if not exists public.llm_responses (
  id bigserial primary key,
  request_id uuid not null references public.llm_requests(id) on delete cascade,
  raw_content text not null,
  model text not null,
  tokens_used integer not null default 0,
  latency_ms integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_llm_responses_request
  on public.llm_responses (request_id);


