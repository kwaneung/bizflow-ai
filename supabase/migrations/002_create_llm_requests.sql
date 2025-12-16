-- 002 - Create llm_requests table for logging LLM API requests
-- This table stores all LLM processing requests from domain modules

create table if not exists public.llm_requests (
  id uuid primary key,                      -- Request ID (generated with randomUUID())
  module_id text not null,                  -- Domain module
  input_data jsonb not null,                -- Module input data
  prompt_template_id text not null references public.prompt_templates(id),
  status text not null check (status in ('pending','processing','completed','failed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_llm_requests_module
  on public.llm_requests (module_id);

create index if not exists idx_llm_requests_status
  on public.llm_requests (status);

create index if not exists idx_llm_requests_created_at
  on public.llm_requests (created_at desc);


