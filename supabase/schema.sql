-- Akhbaar Rush weekly leaderboard.
-- Run once in Supabase → SQL Editor → New query → paste → Run.
--
-- Security model (no player accounts needed):
--   * Browsers never touch the players table directly (RLS on, no policies).
--   * They READ through the public `leaderboard` view (no secrets in it).
--   * They WRITE only through submit_score(), which updates a row only when the caller
--     knows that row's secret. Each browser creates its own random id + secret.

create table if not exists public.players (
  id          uuid primary key,
  secret      uuid not null,
  name        text not null check (name ~ '^[A-Z0-9_.]{3,12}$'),
  cap         smallint not null default 0 check (cap between 0 and 7),
  city        text not null check (city in ('delhi','mumbai','pune','bengaluru','gurugram','noida')),
  week        text not null check (week ~ '^[0-9]{4}-W[0-9]{2}$'),
  week_papers integer not null default 0 check (week_papers between 0 and 5000),
  total       integer not null default 0 check (total >= 0),
  best        integer not null default 0 check (best >= 0),
  updated_at  timestamptz not null default now()
);

create index if not exists players_week_idx on public.players (week, week_papers desc);

alter table public.players enable row level security;
revoke all on public.players from anon, authenticated;

create or replace view public.leaderboard as
  select id, name, cap, city, week, week_papers, best, updated_at
  from public.players;

grant select on public.leaderboard to anon, authenticated;

create or replace function public.submit_score(
  p_id uuid, p_secret uuid, p_name text, p_cap integer, p_city text,
  p_week text, p_week_papers integer, p_total integer, p_best integer
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.players as p (id, secret, name, cap, city, week, week_papers, total, best, updated_at)
  values (p_id, p_secret, upper(p_name), p_cap, p_city, p_week, least(greatest(p_week_papers, 0), 5000),
          greatest(p_total, 0), greatest(p_best, 0), now())
  on conflict (id) do update
    set name        = excluded.name,
        cap         = excluded.cap,
        city        = excluded.city,
        week        = excluded.week,
        week_papers = excluded.week_papers,
        total       = greatest(p.total, excluded.total),
        best        = greatest(p.best, excluded.best),
        updated_at  = now()
    where p.secret = p_secret;
end;
$$;

revoke all on function public.submit_score(uuid, uuid, text, integer, text, text, integer, integer, integer) from public;
grant execute on function public.submit_score(uuid, uuid, text, integer, text, text, integer, integer, integer) to anon, authenticated;

-- Optional housekeeping: delete riders inactive for 60 days (run manually or schedule with pg_cron).
-- delete from public.players where updated_at < now() - interval '60 days';
