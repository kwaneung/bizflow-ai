-- 001 - Create prompt_templates table for LLM prompt template management
-- This table stores prompt templates used by domain modules (ecommerce, realestate, etc.)

create table if not exists public.prompt_templates (
  id text primary key,                      -- Template ID (e.g., ecommerce-product-content-v1)
  module_id text not null,                  -- Domain module (ecommerce, realestate, etc.)
  version text not null,                    -- Version (e.g., 1.0.0)
  name text not null,                       -- Template name
  template text not null,                   -- Prompt text
  variables jsonb not null default '[]',    -- Variable definitions array
  description text,
  is_active boolean not null default true,  -- Active status
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_prompt_templates_module
  on public.prompt_templates (module_id);

create index if not exists idx_prompt_templates_active
  on public.prompt_templates (is_active);


