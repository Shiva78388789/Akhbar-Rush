# Akhbaar Rush — game design

**Pitch:** a morning paper round through India's galis. Ride, dodge, jump, deliver. 16-bit pixel art in the spirit of classic arcade side-scrollers, built for a phone held sideways.

## Controls

| Action | Swipe mode (default) | Buttons mode | Keyboard |
|---|---|---|---|
| Move to the top lane | Swipe up | ↑ button | ↑ / W |
| Move to the bottom lane | Swipe down | ↓ button | ↓ / S |
| Jump | Tap | JUMP button | Space / → |
| Pause | Pause button | Pause button | Esc / P |

Papers are thrown **automatically** when the rider is in the top lane (the house side) and passes a subscriber house (marked with a floating paper sign).

## Rules

- **Lanes:** top lane = house side, has parked cars, cows, potholes and dogs. Bottom lane = traffic, has oncoming autos, cows and potholes.
- **Tall hazards** (car, cow, auto) must be dodged by changing lane. **Low hazards** (pothole, dog) can be jumped.
- **Lives:** 3 hearts. A bump costs one heart, gives 1.6 s of invulnerability, slows the cycle briefly and breaks the combo. At 0 hearts the run ends (one "Continue" for 100 coins).
- **Papers:** limited. A paper bundle pickup gives +8. Running out means you can't finish deliveries.
- **Level end:** ride to the finish flag. Complete = delivered ≥ target. Otherwise "Route incomplete".

## Scoring

| Event | Points |
|---|---|
| Delivery | 10 × combo multiplier (x1–x5, +1 every 3 deliveries in a row) |
| Delivery while jumping ("AIR MAIL") | +25 bonus |
| Coin | +5 (and +1 coin) |
| Distance | +1 per 10 px ridden |
| Level complete | +100 + 50 per heart left |

**Stars:** ★ target met · ★★ also ≥85% of subscribers served · ★★★ also no crashes.

## Levels

Each city has 10 levels, generated from a fixed seed (same layout every time). Length grows ~240 px per level; speed and obstacle density rise.

| Level | New element |
|---|---|
| 1 | Potholes and a few cows |
| 2 | Parked cars |
| 3 | Oncoming autos |
| 4 | Barking dogs |
| 5 | **City event** |
| 6–9 | Denser mix, faster |
| 10 | **City finale** (everything, faster) |

## Cities

| City (stars to unlock) | Route | Landmarks in the backdrop | Level 5 event |
|---|---|---|---|
| Delhi (0) | Gali No. 4 · Karol Bagh | Hanuman statue, Blue Line metro, India Gate | Wedding season traffic (extra autos) |
| Mumbai (8) | Gali No. 10 · Colaba | Gateway of India, Bandra–Worli Sea Link, chawls | Monsoon (rain, extra waterlogged potholes) |
| Pune (24) | Gali No. 7 · Shaniwar Peth | Shaniwar Wada, Parvati hill | Street dogs at every gate |
| Bengaluru (40) | Cross No. 3 · Malleshwaram | Vidhana Soudha, Namma Metro, tech parks | Silk Board jam (extra autos) |
| Gurugram (60) | Gali No. 5 · Cyber City | Cyber City towers, Rapid Metro, cranes | Office cab rush (extra autos) |
| Noida (80) | Gali No. 8 · Sector 18 | DND Flyway, Aqua Line metro, Sector 18 mall | Winter fog (hazards appear late) |

## Economy

- **Coins:** from coins on the road, level rewards (20 + 10 per star) and the daily bonus.
- **Daily bonus:** 7-day streak — 50, 75, 100, 150, 200, 300, 500. Missing a day resets to day 1.
- **Cycles** (Speed / Handling / Jump / Basket, 1–5):
  Old Faithful (free, 3/3/2/3), Gali Racer (1,500, 5/3/3/2), Monsoon Rider (2,500, 3/5/3/3), Tiffin Tanker (3,000, 2/3/2/5), Rocket Roadster (4,000, unlocks after 12 levels, 5/4/5/4).
  Speed = +5%/point, Handling = faster lane change, Jump = higher/longer jump, Basket = +2 starting papers/point.
- **Caps:** 8 colours (0–800 coins). Recolours the rider and the leaderboard avatar.

## Leaderboard

Weekly (ISO week, resets Monday), ranked by papers delivered. Tabs: home city and all of India. Players choose a nickname (3–12 letters/numbers), a cap and a home city on first launch.

## Screen flow

First launch: Shiva Games splash → Loading → Title → Player name → How to play → Get ready → Level 1.
Returning: Title → Daily bonus (once a day) → Main menu → Start delivery → Get ready → Ride → Pause / Route complete / Out of lives.
Menu also opens Missions (city + level select), Garage, Ranks, Settings (music, sound, vibration, English/हिंदी, swipe/buttons).

## Art specs

- Style: 16-bit arcade pixel art, dark brown outlines `#241610`, flat shading, no anti-aliasing.
- Game resolution 380×176; UI stage 844×390. City strips 960×160.
- Rider frames 60×66, anchor (18,60). Animations: ride 4, lane up 6, lane down 6, jump 8, throw 4.
- All previews are in `docs/design/`.

## Audio

All synthesised at runtime: 3 music loops (menu 104 bpm, ride 138 bpm with dholak pattern, event/finale 152 bpm) plus effects (bell on delivery, horn, bark, bump, coin, jingles).
