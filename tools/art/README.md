# Art generation scripts

Every sprite, city backdrop, icon and logo in this game was drawn by these scripts, pixel by pixel.
Edit a script and re-run it to change the art. Requires Node 18+ and Python 3 with Pillow and NumPy
(`pip install pillow numpy`). Run from this folder, in this order:

| Step | Command | Makes |
|---|---|---|
| 1 | `node level.js` | Original Delhi street + drawing helpers used by every other script |
| 2 | `node sprites.js && python3 pack.py` | Cows, dogs, cars, autos, bubbles, pothole, paper → `sprites/` |
| 3 | `node moves.js && python3 moves_pack.py` | Rider ride / lane / jump frames (rotated pixel-safe) → `moves/` |
| 4 | `node city.js` | Six city backdrops with landmarks → `cities/` |
| 5 | `node citygame.js` | Game versions of the backdrops → `../../assets/`, prints `HOUSES` for `src/data.js` |
| 6 | `node assets.js` | Game logo and UI icons → `ui/` |
| 7 | `node brand.js && python3 icon.py` | Shiva Games logo, avatars, bike colours, app icons → `brand/` |

After regenerating, copy the PNGs you changed into `../../assets/` (same file names) and bump `VERSION` in `sw.js`.
