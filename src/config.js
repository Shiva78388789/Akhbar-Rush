// Deployment settings. This is the only file you need to edit to turn on the online leaderboard.
//
// 1. Create a free project at https://supabase.com
// 2. Open SQL Editor, paste supabase/schema.sql, press Run.
// 3. Project Settings → API: copy the Project URL and the "anon public" key below.
//
// The anon key is meant to be public (it ships in the browser). The database only lets it
// read the leaderboard view and call submit_score(), so it cannot edit other players.
// Leave both empty to run fully offline: the game still works, Ranks shows only your own score.

export const SUPABASE_URL = '';
export const SUPABASE_ANON_KEY = '';

// Shown when a player taps "Invite friends". Leave empty to share the current page address.
export const SHARE_URL = '';
