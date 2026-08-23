create table public.connection_test (
  id bigint generated always as identity primary key,
  test_value text
);

alter table public.connection_test enable row level security;;
