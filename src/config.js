// Deployment settings. This is the only file you need to edit to turn on the online leaderboard.
//
// 1. Create a free project at https://supabase.com
// 2. Open SQL Editor, paste supabase/schema.sql, press Run.
// 3. Project Settings → API: copy the Project URL and the "anon public" key below.
//
// The anon key is meant to be public (it ships in the browser). The database only lets it
// read the leaderboard view and call submit_score(), so it cannot edit other players.
// Leave both empty to run fully offline: the game still works, Ranks shows only your own score.

export const SUPABASE_URL = 'https://yuntumzyxetfasbrkiil.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1bnR1bXp5eGV0ZmFzYnJraWlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA0MjM0MTIsImV4cCI6MjEwNTk5OTQxMn0.QNFZxnSatK20XVjXe8n57JU9_ukFMsejzo6PfuB3UxE';

// Shown when a player taps "Invite friends". Leave empty to share the current page address.
export const SHARE_URL = 'https://shiva78388789.github.io/Akhbar-Rush/';
