-- 005 - Create error_contexts table for storing error information
-- This table stores error details when LLM processing fails

create table if not exists public.error_contexts (
  id bigserial primary key,
  request_id uuid not null references public.llm_requests(id) on delete cascade,
  error_type text not null,                 -- Error type (validation, api, network, etc.)
  error_code text not null,
  error_message text not null,
  technical_details jsonb,
  recovery_suggestions text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_error_contexts_request
  on public.error_contexts (request_id);


