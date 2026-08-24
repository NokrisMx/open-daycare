create table public.daycares (
  id uuid primary key default gen_random_uuid(),
  name text not null
    constraint daycares_name_not_blank check (btrim(name) <> ''),
  created_at timestamptz not null default now()
);

alter table public.daycares enable row level security;

revoke all privileges
on table public.daycares
from anon, authenticated;

insert into public.daycares (id, name)
values (
  '00000000-0000-0000-0000-000000000001',
  'Guardería Sala Soles'
);
