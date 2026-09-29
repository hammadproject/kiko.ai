create table if not exists public.consultation_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone_number text not null,
  business_type text,
  help_request text,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'closed')),
  source text not null default 'website',
  created_at timestamptz not null default now()
);
