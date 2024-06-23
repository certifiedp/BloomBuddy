create table
  public.plant (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    moisture integer null,
    ph integer null,
    light integer null,
    description text null,
    constraint plant_pkey primary key (id)
  ) tablespace pg_default;