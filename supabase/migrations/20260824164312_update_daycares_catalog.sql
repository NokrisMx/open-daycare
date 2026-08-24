begin;

alter table public.daycares
  add column address text,
  add column updated_at timestamptz not null default now();

alter table public.daycares
  drop constraint daycares_name_not_blank;

alter table public.daycares enable row level security;

revoke all privileges
on table public.daycares
from anon, authenticated;

create policy daycares_read
on public.daycares
for select
using (true);

create policy daycares_insert
on public.daycares
for insert
with check (false);

create policy daycares_update
on public.daycares
for update
using (false);

create policy daycares_delete
on public.daycares
for delete
using (false);

delete from public.daycares;

insert into public.daycares (name, address)
values
  ('Guardería Sala Soles', 'Av. Principal 123, Centro'),
  ('Guardería Arcoíris', 'Calle Luna 456, Zona Norte'),
  ('Guardería Semillitas', 'Blvd. del Sol 789, Col. Jardines'),
  ('Guardería Estrellitas', 'Paseo de los Niños 321, Residencial');

commit;
