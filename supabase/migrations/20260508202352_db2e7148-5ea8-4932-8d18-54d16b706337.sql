
-- Tables
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null default '',
  image_url text,
  status text not null default 'draft' check (status in ('published','draft')),
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);

create table public.audios (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  audio_url text not null,
  published_at timestamptz default now(),
  created_at timestamptz not null default now()
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  image_url text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  filename text not null,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.articles enable row level security;
alter table public.audios enable row level security;
alter table public.sponsors enable row level security;
alter table public.images enable row level security;

-- Public read
create policy "public read articles" on public.articles for select using (true);
create policy "public read audios" on public.audios for select using (true);
create policy "public read sponsors" on public.sponsors for select using (true);
create policy "public read images" on public.images for select using (true);

-- Authenticated write
create policy "auth write articles" on public.articles for all to authenticated using (true) with check (true);
create policy "auth write audios"   on public.audios   for all to authenticated using (true) with check (true);
create policy "auth write sponsors" on public.sponsors for all to authenticated using (true) with check (true);
create policy "auth write images"   on public.images   for all to authenticated using (true) with check (true);

-- Storage buckets
insert into storage.buckets (id, name, public) values
  ('audios','audios',true),
  ('images','images',true),
  ('sponsors','sponsors',true)
on conflict (id) do nothing;

-- Storage policies
create policy "public read storage audios"   on storage.objects for select using (bucket_id = 'audios');
create policy "public read storage images"   on storage.objects for select using (bucket_id = 'images');
create policy "public read storage sponsors" on storage.objects for select using (bucket_id = 'sponsors');

create policy "auth upload audios"   on storage.objects for insert to authenticated with check (bucket_id = 'audios');
create policy "auth upload images"   on storage.objects for insert to authenticated with check (bucket_id = 'images');
create policy "auth upload sponsors" on storage.objects for insert to authenticated with check (bucket_id = 'sponsors');

create policy "auth delete audios"   on storage.objects for delete to authenticated using (bucket_id = 'audios');
create policy "auth delete images"   on storage.objects for delete to authenticated using (bucket_id = 'images');
create policy "auth delete sponsors" on storage.objects for delete to authenticated using (bucket_id = 'sponsors');
