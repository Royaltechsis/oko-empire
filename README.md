# Oko Empire: Farm to Table (+ Code Lab)

**Play it:** https://oko-empire.sites.tab.bot/

A Naija farm-to-table time-management game made for Bunmi. Plant and harvest crops, keep hens and goats, run machines (garri mill, pepper grinder, palm oil press, bakery), cook and serve customers at Bunmi's Kitchen before their patience runs out, then spend your coins building an empire from the Village Farm to the Town Buka to a restaurant in Lekki, Lagos.

Version 2 adds the **Code Lab**: you write real JavaScript to solve problems from your DSA roadmap, and solving them unlocks building upgrades and automation scripts that actually run inside the levels.

## How to play

- **Levels:** 24 timed levels across 3 areas (Village Farm, Town Buka, City Restaurant). Hit the goals before the clock runs out; finish faster for 2 or 3 stars.
- **Farm:** tap a plot to plant, tap again to harvest. Chase the crows. Feed the hens, milk the goats.
- **Machines and stations:** drop ingredients into a machine, collect the output, cook dishes at the stations.
- **Serve:** tap a dish in a customer's speech bubble to serve it. Happy customers tip.
- **My Empire:** spend your bank on buildings. Every upgrade makes the levels easier. Upgrades past level 1 are locked behind a Code Lab challenge.
- Touch, pen, mouse and keyboard all work. Every button is at least 48 px.

## The Code Lab

Open it from the title screen, the level map ("Code mastery" strip) or the Empire screen.

- A real code editor: monospace, line numbers, Tab / Shift+Tab to indent, auto-indent on Enter, and an on-screen symbol bar (`{ } ( ) [ ] ; = => ...`) for tablet mode.
- **Run** checks your code against example tests, hidden tests and one big speed test. Your code runs in a Web Worker with a time limit, so an infinite loop is stopped after 3 seconds and the game never freezes.
- **Hint** gives up to 3 hints per challenge: a concept nudge, then the approach, then a plain-English structure. Hints never give you the code.
- **Stars:** 1 for passing, 1 for passing the big speed test in time (efficiency), 1 for solving with no hints.
- First solve pays coins into your bank. Logic puzzles (no code) pay too.
- **Code mastery badges** per topic: Bronze, Silver, Gold, and a crown for all stars.

### Curriculum (same order as the DSA roadmap)

| # | Topic | In the game | Coding challenges | Logic puzzles |
|---|-------|-------------|-------------------|---------------|
| 1 | Queues | the customer line | 6 | 4 |
| 2 | Hash maps | the Barn Store | 6 | 4 |
| 3 | Heaps | VIP orders | 5 | 4 |
| 4 | Sliding window | busiest minutes, best harvest stretch | 5 | 4 |
| 5 | Sort + binary search | market stall price lists | 5 | 4 |
| 6 | Graphs | delivery bike routes across Lagos (BFS, then weighted with Dijkstra) | 6 | 4 |

33 coding challenges and 24 logic puzzles, graded Easy to Boss. Inside a topic, each challenge unlocks the next.

### Upgrades unlocked by code

| Building | Lv 2 | Lv 3 | Lv 4 | Lv 5 |
|----------|------|------|------|------|
| Farm Plots | Best harvest stretch | Longest good run | Stretch the budget | No repeat customers |
| Chicken Coop | Double delivery | Exact change at the till | | |
| Goat Pen | Group the orders | Busiest 5 minutes | | |
| Barn Store | Count the barn | What is missing? | Top regulars | |
| Mill House | Build the customer line | Kitchen ticket rail | | |
| Buka | Fix the serving order | Patience don finish | | |
| Kitchen Gear | VIPs first | Restaurant VIP rush | | |
| Market Stall | Sort the price list | What can I afford? | | |
| Delivery Bike | Shortest route (BFS) | | | |
| Restaurant | Build a MinHeap | Merge delivery lists | | |
| Family Compound | Separate islands | Fastest route with traffic | | |

### Automation scripts

- **Auto-serve** (solve "Auto-serve script", queues): your `pickNext(line, ready)` runs during levels and serves customers on its own.
- **Bike GPS** (solve "Shortest route (BFS)", graphs): your `shortestRoute(roads, from, to)` routes each delivery across a Lagos road map. A correct shortest route earns a +25% bonus.

Switch them on in Code Lab > My automation scripts. They run the exact code that passed the tests, in a worker, with a time limit.

## Run it locally

No build step and no dependencies.

```
git clone https://github.com/Royaltechsis/oko-empire.git
cd oko-empire
python -m http.server 8000      # or: npx serve .
```

Then open http://localhost:8000. Serving over http enables the offline service worker and the "Install app" option in Edge or Chrome. You can also double-click `index.html`, but the service worker only runs over http(s).

Run the checks with Node 18+:

```
node --test
```

## Files

```
index.html            screens and modals
styles.css            all styles
game.js               the game: farm, machines, cooking, customers, empire, saves
challenges.js         Code Lab challenges, hidden tests, puzzles' topics (expected answers only, no solutions)
codelab.js            Code Lab: editor, test runner (Web Worker), hints, puzzles, gates, automation
sw.js                 service worker for offline play
manifest.webmanifest  PWA manifest
icon-192.png, icon-512.png
test/site.test.mjs    checks run with node --test
```

Progress is saved in your browser's localStorage under `okoEmpire.v1`. Saves from version 1 load fine; the Code Lab progress is added beside them.

No real brand logos are used. All art is drawn in code and all sounds are synthesised with WebAudio.
