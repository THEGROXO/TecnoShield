-- Ejecutar en Supabase > SQL Editor.
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  need text,
  source text,
  status text not null default 'nuevo',
  consent boolean not null default false
);

-- El navegador no debe acceder directamente a esta tabla.
alter table public.leads enable row level security;
-- No crear políticas públicas. La API de Vercel utiliza la Service Role Key
-- exclusivamente desde el servidor, nunca desde el JavaScript del navegador.
