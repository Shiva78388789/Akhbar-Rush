# Akhbaar Rush — guide for Claude Code

A 16-bit side-scrolling **mobile browser game** by Shiva Games. A paperboy cycles through Indian galis,
switching lanes and jumping to dodge cows, parked cars, autos, dogs and potholes while throwing newspapers
to subscriber houses. Six cities × 10 levels, garage upgrades, daily bonus, weekly leaderboard.

**Target:** phones in landscape, in the browser (installable as a PWA). Desktop works with the keyboard but is not the focus.
**Principle:** plain static files, no framework, no build step. Deploying = `git push`. Keep it that way unless the owner asks otherwise.

## Commands

```bash
npm run dev      # local server on :8080 and prints a Wi-Fi URL to open on a phone
npm test         # headless smoke test (needs `npm install` + `npx playwright install chromium` once)
```

Always run `npm test` after gameplay or UI changes and look at `tests/screens/*.png`.
If Chromium is already installed elsewhere, point the test at it: `CHROMIUM_PATH=/path/to/chrome npm test`.

**Every fix must work on both iPhone and Android.** The owner plays on an iPhone (Chrome, which is WebKit
underneath) and players are also on Android Chrome. Never ship a platform-specific fix without checking the
other platform. The smoke test replays the game with touch taps as an iPhone and as an Android phone;
extend `touchRun()` in `tests/smoke.mjs` when you fix a touch/UI bug so it stays fixed on both.
- In-game buttons use `tap()` in `main.js` (acts on finger-up), because iPhones can drop `click` while the game animates.
- Screens shown over the ride (`show(id, true)`) must sit above `#hud` (DOM order or `z-index`), or the HUD eats their taps.
- Sound unlocks in `unlockAudio()` on tap-end/click; page full screen exists only on Android (iPhone: Add to Home Screen).

## Map of the code

| File | What lives there |
|---|---|
| `index.html` | All screen markup (splash, loading, title, name, howto, daily, menu, missions, garage, ranks, settings, hud, countdown, pause, end, toast). Screens are `.screen` divs toggled with the `hidden` attribute. |
| `style.css` | UI styles. `#stage` is a fixed **844×390** box scaled to the phone by `fit()`. Pixel buttons `.pbtn`, panels `.panel`. |
| `src/main.js` | Everything runtime: asset loading + recolouring, the canvas engine (`G` state, `update`, `render`, `drawBoy`), input, level generation (`genLevel`), HUD, countdown/pause/end, every screen renderer (`rMenu`, `rMissions`, `rGarage`, `rRanks`, …) and `boot()`. |
| `src/data.js` | Content: `CITIES`, `HOUSES` (house gate x-positions per city strip), `BIKES`, `CAPS`, `DAILY`, `NAMES`, Hindi strings `T.hi`, and world constants. |
| `src/profile.js` | The single player profile object `P` (localStorage key `akhbaar-rush`) + `save()`, star counts, translation helpers `t()`/`applyLang()`. Mutate `P`, never reassign it. |
| `src/audio.js` | Web Audio synth: sound effects (`sfx(name)`), vibration (`buzz`), and the chiptune `TRACKS` (menu / ride / event) with a lookahead sequencer. No audio files. |
| `src/leaderboard.js` | Supabase REST client (no SDK): `submit()`, `fetchWeek()`, per-browser id + secret. |
| `src/pwa.js` | Service worker registration, "new version" toast, install button, `shareGame()`. |
| `src/config.js` | Supabase URL + anon key, share URL. Empty = offline mode. |
| `sw.js` | Service worker. Code network-first, images cache-first. **Bump `VERSION` every release.** |
| `supabase/schema.sql` | Leaderboard table, public view, `submit_score()` RPC. |
| `assets/` | All sprites and city backdrops (PNG, pixel art at 1×). |
| `tools/art/` | Node/Python scripts that generated every sprite and backdrop. |
| `docs/GAME_DESIGN.md` | Rules, scoring, levels, economy — read before changing balance. |

## World coordinates (important)

- Canvas is **380×176 game pixels** (`VW`,`VH`), drawn with `imageSmoothingEnabled=false` and scaled by CSS. Never draw at fractional positions — `Math.round` everything.
- City backdrop strip is 960×160, drawn at `SY=16`, tiled horizontally. Houses are at `HOUSES[city]` x-offsets within each 960 tile.
- Lanes: `LANE_Y=[144,173]` = ground line of upper (house side) and lower lane. Boy's rear wheel sits at `BOY_X=70`.
- Boy sprite frames are 60×66 with the **rear-wheel ground contact at (18,60)**. Tilt/rotation is baked into the frames — never rotate in code.
- Obstacles store a world x `wx`; screen x = `wx - G.d` for static objects. Movers (autos, dogs) use `screenX()` so they meet the boy exactly at `wx`.
- Object sprite sizes: cow 31×21, dog 21×13, car 40×22, auto 34×30, pothole 22×11, paper 9×9. See `render()` for draw offsets.

## Game rules in code

- Deliveries are automatic when the boy is in the **top lane** and a subscriber gate passes 6–48 px ahead (`update()`, the `G.subs` loop). Mid-air throws score AIR MAIL.
- Tall obstacles (`car`, `cow`, `auto`) must be dodged by lane; low ones (`pothole`, `dog`) can be jumped (`jumpY() >= 6`).
- `genLevel(ci, lv)` is deterministic (seeded) so a level is the same every time. It guarantees no tall obstacles in both lanes within 120 px.
- Stars: 1 finish with target met, +1 for ≥85% of subscribers, +1 for no crashes. City unlocks by total stars (`CITIES[i].need`).

## How to …

- **Add a city:** draw its strip (see `tools/art/city.js` + `citygame.js`, which prints the new `HOUSES` entry), add the PNG to `assets/city_<id>.png`, add an entry to `CITIES` and `HOUSES` in `data.js`, add the id to the `city` check in `supabase/schema.sql`.
- **Add an obstacle type:** weight + lane rules in `genLevel`, hit width in the `w` map, drawing in `render()`, sprite in `assets/` and `LIST` in `main.js`.
- **Add a cycle or cap:** append to `BIKES`/`CAPS` in `data.js`. Bike colours recolour the red frame pixels `#d8322a` at runtime (`tint()`), caps recolour `#2d6fd1` and its shades.
- **Change music:** edit `TRACKS` in `audio.js` (token format documented there). Keep `lead` and `bass` the same number of steps.
- **Translate text:** add `data-t="key"` to markup and `T.hi.key` in `data.js`. Dynamic strings check `P.settings.lang`.

## Release checklist

1. `npm test` passes; skim `tests/screens/`.
2. Bump `VERSION` in `sw.js` (e.g. `akhbaar-rush-v1.0.1`), the `version` in `package.json`, and the `v1.0` label on the title screen in `index.html`.
3. Commit and push to `main`. The host redeploys in about a minute; players see "New version ready – tap to update".

## Gotchas

- `[hidden]{display:none!important}` is required because screens also set `display:flex` by id.
- Audio only starts after a user gesture; `audio()` + `resumeAudio()` run on the first pointerdown.
- `touch-action:none` on body stops the browser from scrolling or zooming during swipes. Keep it.
- Service worker: code is network-first, so a normal deploy shows up on the next launch even without the toast. If you change an image in place, bump `VERSION` so cached images refresh.
- `P.progress[city]` is an array of 10 star counts (0–3). Keep old saves loading: add new fields with defaults in `freshProfile()` — the loader merges.
- Only the Supabase **anon** key belongs in `config.js`. Never commit the service-role key.
- Player names are nicknames shown publicly; the name screen asks players not to use full real names. Keep that guidance if the screen changes.
