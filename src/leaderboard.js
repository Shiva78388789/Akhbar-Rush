// Weekly leaderboard backed by Supabase (plain REST, no SDK).
// Each browser gets a random player id + secret; the secret proves ownership of the row,
// so nobody can overwrite another rider's score. See supabase/schema.sql.
import {SUPABASE_URL, SUPABASE_ANON_KEY} from './config.js';

const ID_KEY = 'akhbaar-rush-id';
let me = null;

function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
  const h = [...b].map(x => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

function ident() {
  if (me) return me;
  try { me = JSON.parse(localStorage.getItem(ID_KEY) || 'null'); } catch (e) { me = null; }
  if (!me || !me.id || !me.secret) {
    me = {id: uuid(), secret: uuid()};
    try { localStorage.setItem(ID_KEY, JSON.stringify(me)); } catch (e) {}
  }
  return me;
}

const headers = () => ({
  apikey: SUPABASE_ANON_KEY,
  Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
  'Content-Type': 'application/json',
});

/** True when config.js has Supabase keys. */
export const enabled = () => !!(SUPABASE_URL && SUPABASE_ANON_KEY);

/** This browser's public player id (used to highlight "you" in the list). */
export const playerId = () => ident().id;

let pending = null, timer = 0;

/** Queue a score update; sends at most one request per 800 ms. Fails silently when offline. */
export function submit(row) {
  if (!enabled()) return;
  pending = row;
  clearTimeout(timer);
  timer = setTimeout(flush, 800);
}

async function flush() {
  const r = pending; pending = null;
  if (!r) return;
  const id = ident();
  try {
    await fetch(SUPABASE_URL + '/rest/v1/rpc/submit_score', {
      method: 'POST', headers: headers(),
      body: JSON.stringify({
        p_id: id.id, p_secret: id.secret, p_name: r.name, p_cap: r.cap, p_city: r.city,
        p_week: r.week, p_week_papers: r.weekPapers, p_total: r.total, p_best: r.best,
      }),
    });
  } catch (e) { /* offline – the next submit will carry the latest totals */ }
}

/** This week's riders, most papers first. Returns null when the leaderboard can't be reached. */
export async function fetchWeek(week) {
  if (!enabled()) return null;
  try {
    const url = SUPABASE_URL + '/rest/v1/leaderboard?select=id,name,cap,city,week_papers,best'
      + '&week=eq.' + encodeURIComponent(week) + '&order=week_papers.desc&limit=200';
    const res = await fetch(url, {headers: headers()});
    if (!res.ok) return null;
    const rows = await res.json();
    return rows.map(r => ({id: r.id, name: r.name, cap: r.cap, city: r.city, weekPapers: r.week_papers, best: r.best}));
  } catch (e) { return null; }
}
