# Feature requests — what shipped, what is partial, what is not there

This is the honest answer to the feature wishlist that came with the 0.9.0 design round
(FastClient-style screens plus a long list of PvP, performance and utility features).

Legend:

| Status | Meaning |
| --- | --- |
| **Done** | Works in this build, verifiable from the UI or a log. |
| **Partial** | Part of it exists; the missing part is named. |
| **Planned** | Not built. Tracked here so it is not quietly dropped. |
| **Not planned** | Deliberately not built, with the reason. |

Nothing in this file is a promise of a date. If a feature is not in **Done**, it does not exist yet.

---

## Screens from the reference images

| Request | Status | Where |
| --- | --- | --- |
| Servers as a hero-card grid (search, partner artwork, name + "N online") | **Done** | `src/pages/ServersPage.tsx` — 3-column grid, server's own favicon as key art, live player count, latency, MOTD; search box and *Become a Partner* / *Recommended* controls |
| Profiles page with Play / Mods / Resource Packs / "…" per card | **Done** | `src/pages/ProfilesPage.tsx` — card grid, selected ring + check badge, version loader line, mod/pack counts, dashed *Create profile* tile |
| "Manually modified" marker | **Done** | Derived from the instance folder (`mods/*.jar`, `*.jar.disabled`, `resourcepacks/*`) on every render — not a stored flag |
| Launch splash: flat grey, logo + wordmark, one progress bar | **Done** | `src/components/LaunchOverlay.tsx` — real percentage while files download, indeterminate sweep while Java starts, auto-closes when the game reports running |

---

## Performance

| Request | Status | Notes |
| --- | --- | --- |
| Sodium / Embeddium / FerriteCore / ModernFix stack | **Partial** | The Mod Manager installs any of them from Modrinth in two clicks (search → install, matching loader + game version, SHA-1 verified). The launcher does **not** bundle third-party jars, and there is no one-click "optimization pack" that silently installs four mods — that would make the launcher responsible for mods it did not write. |
| Resource-pack cache | **Planned** | Not implemented. Packs are read from the instance folder; there is no cache, no dedupe and no download pipeline for packs. |
| Fast quit | **Planned** | Not implemented. "Stop" asks the JVM to shut down normally rather than killing it. |

## PvP HUD (client-side, no cheats)

The HUD renders through the optional bridge mod; the menu opens on **Right Shift** (rebindable).
Everything below is drawn from the game's own values — no extra packets, no server-side advantage.

| Request | Status | Notes |
| --- | --- | --- |
| CPS counter | **Done** | `cps` module, left/right/both |
| Keystrokes | **Done** | `keystrokes` module with mouse buttons |
| Armor status | **Done** | `armor` module with durability |
| Sprint indicator | **Done** | `sprint` module |
| Crosshair customiser | **Done** | style (cross / dot / circle / t-shape), colour, scale, gap, thickness |
| Reach display | **Done (information only)** | `reach` module shows your own last hit distance. It does not extend reach — modifying reach is a cheat and is not in this launcher. |
| Hitbox display | **Not planned** | Would need a second mixin that changes rendering of other entities; the build allows exactly one mixin (the click counter) so that what ships is auditable. |
| Freelook | **Not planned** | Same mixin constraint: a camera detached from the body is a gameplay change, not an overlay. |

## Utility

| Request | Status | Notes |
| --- | --- | --- |
| Modular mod menu with a keybind | **Done** | In-game menu on Right Shift (`src/pages/HudPage.tsx` + bridge). Modules can be moved, scaled, recoloured, disabled. |
| Server quick slots | **Done** | Pin any partner server (pin icon on its card). Pinned servers appear as one-click join buttons above the grid and survive restarts (`settings.pinnedServers`). |
| Minimap / waypoints | **Planned** | Not built. A minimap needs a real mod with world access; the launcher does not ship one. |
| Discord Rich Presence | **Planned** | Not built. Doing it honestly means asking you for your own Discord application id (borrowing someone else's would put their name on your status) and speaking the local Discord IPC socket. Neither is wired yet — there is deliberately no half-working toggle in Settings. |
| Chat customisation | **Planned** | Not built. |
| Resource-pack cache | **Planned** | See above. |

## Aesthetics

| Request | Status | Notes |
| --- | --- | --- |
| Cosmetics (hats, wings, capes, …) | **Done (local)** | Studio with presets; applied by the bridge mod for you. Vanilla servers and other players cannot see them — the launcher never claims otherwise. Shared cosmetics only through an explicitly compatible server. |
| Fullbright | **Planned** | Not built. |
| Motion blur / saturation | **Planned** | Not built. |

## Other

| Request | Status | Notes |
| --- | --- | --- |
| Replay Mod integration | **Planned** | Not built. Replay Mod can be installed like any other Fabric mod from the Mod Manager; there is no dedicated export/import UI. |
| More languages, including Arabic (RTL) | **Planned** | The interface is single-language (English) with no i18n layer yet. RTL is a layout change, not a string table, so it is tracked as its own project. |

---

## Why the "not planned" items stay out

The launcher may install mods that change gameplay — that is the player's choice and the mod is
separately auditable. It must not *itself* ship camera or hitbox modifications, because then the
launcher becomes the thing that changes what the game does, and every "no cheats" statement in this
repository would become false. One mixin (click counting, no game state touched) is the entire
in-process code this launcher contributes.

## Requesting something

Open an issue with what you want, what it would look like on screen, and whether it changes
gameplay or only shows information. Requests that need a mixin have their reason written here
before any code is written.
