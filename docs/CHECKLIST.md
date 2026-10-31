# Feature checklist

Status legend: **✅ done & tested** · **🟡 implemented, needs your environment to verify** ·
**🔵 source/spec included** · **⬜ planned**

Nothing here claims a feature is complete unless it exists in this repository.

## Phase 1 — Working foundation
| Feature | Status | Notes |
| --- | --- | --- |
| Electron app shell with custom title bar | ✅ | Security hardening in `main/index.ts` |
| Settings, logs, data layout | ✅ | Atomic JSON, schema sanitising (unit tested) |
| Offline profiles (create/rename/select/delete, vanilla UUIDs) | ✅ | UUIDs verified against reference values |
| Microsoft device-code auth + XBL/XSTS/Minecraft chain | 🟡 | Needs your Azure client ID; error codes mapped |
| Encrypted token storage | ✅ | safeStorage → AES-256-GCM fallback (tested) |
| Java detection + recommendation per version | ✅ | Real `java -version` probes (tested) |
| Managed JDK download (Adoptium/Temurin, SHA-256) | ✅ | Verified live: Java 21 installed |
| Real Minecraft install (manifest → libs → natives → assets) | ✅ | Verified live: 1.20.1, 54 files hash-checked |
| Real Minecraft launch | ✅ | Verified live up to GLFW (headless container) |
| Java 25 for year-based versions (26.x) | ✅ | Version json's `javaVersion` is authoritative; Temurin 25 provisioned live, 3 new unit tests |
| Refused launch resets the launch phase | ✅ | `start()` wrapper; the splash can no longer spin forever |
| Pre-launch library self-heal (size + SHA-1) | ✅ | `ensureHealthy()` before every launch; 5 unit tests + one end-to-end repair against Mojang's CDN |
| Auto repair-and-relaunch after a library crash | 🟡 | Logic in place (`LaunchService` exit handler); needs a Windows run with a deliberately broken jar |
| Verify & Repair re-downloads corrupt (not just absent) files | ✅ | Checksum-aware filter, unit tested |
| Diagnostics only checks this OS's libraries | ✅ | Rules-filtered, zero-byte jars flagged |
| Loaders: Fabric, Quilt, Forge, NeoForge | 🟡 | Fabric/Quilt via meta (no code exec); Forge/NeoForge via official installer |

## Phase 2 — Real performance
| Feature | Status | Notes |
| --- | --- | --- |
| Performance presets writing options.txt | ✅ | Backup + only owned keys (tested) |
| Render/simulation distance, particles, clouds, shadows, vsync, fps cap | ✅ | 5 presets |
| Version-aware JVM args, obsolete-flag stripping | ✅ | Tested |
| Safe RAM allocation with warnings | ✅ | Bounds + explanation (tested) |
| Java runtime provisioning from the UI | ✅ | Progress streamed over IPC |
| Process CPU/RAM monitoring of the game | ✅ | /proc, PowerShell, ps implementations |
| Real FPS / frame time / 1% low | 🟡 | Requires AG Bridge (source included, logic tested) |
| Repeatable benchmark mode + saved runs + comparison | ✅ | Refuses runs without measured data |
| Renderer mods (Sodium/Iris/Embeddium) one-click | ✅ | Via Mod Manager, hash-verified |
| Bundled optimisation stack (Sodium+FerriteCore+ModernFix) | ⬜ | Deliberately not bundled — see `docs/FEATURE-REQUESTS.md` |

## Phase 3 — Customization

**_0.9.0 additions_**

| Feature | Status | Notes |
| --- | --- | --- |
| Profiles page (cards, Play / Mods / Packs, "…" menu) | ✅ | `ProfilesPage.tsx`; 5 UI tests |
| "Manually modified" profile marker | ✅ | Derived from `mods/` + `resourcepacks/` via `app.instanceContents` |
| Resource-pack listing per instance | ✅ | Names + count, with an *Open folder* shortcut; the launcher does not rewrite `options.txt` |
| Partner server card grid with real favicon + live counts | ✅ | 3-column grid, honest "Offline" state |
| Pinned server quick slots | ✅ | `settings.pinnedServers`, survives restart |
| Launch splash (flat grey, logo, one bar) | ✅ | Real % while downloading, indeterminate while starting, auto-closes |
| Crosshair customiser | ✅ | Style, colour, scale, gap, thickness |
| CPS / keystrokes / armour / sprint / reach display | ✅ | HUD modules via the bridge mod |
| Freelook / hitbox display | ⬜ | Not planned — needs a second mixin (see `docs/FEATURE-REQUESTS.md`) |
| Discord Rich Presence | ⬜ | Planned; no half-working toggle ships |
| Minimap / waypoints / chat customisation | ⬜ | Planned |
| More languages + Arabic RTL | ⬜ | Planned; no i18n layer yet |

| Feature | Status | Notes |
| --- | --- | --- |
| Skin import (64×64 / 64×32), classic + slim | ✅ | PNG validation tested |
| 3D character preview | ✅ | skinview3d/three.js, WebGL |
| Per-profile skin storage + switching + reset | ✅ | |
| Cape Studio: imports, 10 built-in AG designs, designer, favourites | ✅ | Designs rasterised locally (tested) |
| Wings, emotes, effects, presets | ✅ | Stored per profile, written to manifest |
| Offline cosmetics without an online account | ✅ | No account required anywhere in the flow |
| In-game application of local cosmetics | ✅ | AG Bridge (per-version builds: 1.20.1, 1.21.11; Fabric + Fabric API) applies the manifest's skin/cape to the local player; field shapes verified against the real game jars |
| Shared cosmetics via server relay | 🔵 | Paper plugin + protocol documented, disabled by default |

## Phase 4 — Competitive
| Feature | Status | Notes |
| --- | --- | --- |
| HUD editor: drag, scale, opacity, colours, per-module toggles | ✅ | Clamping + merge tested |
| FPS, ping, keystrokes, CPS, coords, armour, potions, direction, timer, scoreboard, zoom | ✅ | Layout for all modules |
| Crosshair editor (4 styles, colour, gap, thickness) | ✅ | |
| Mod Manager: Modrinth search, install, enable/disable, remove | ✅ | Hash-verified downloads |
| Loader/version compatibility + dependency + duplicate detection | ✅ | jarmetadata parsing tested |
| Mod backups/restore, conflict report | ✅ | ZIP writer/reader tested |
| In-game HUD rendering | 🟡 | Bridge renders telemetry today; HUD drawing needs the full mod build |
| Cheats (kill aura etc.) | ⛔ | Deliberately not implemented |

## Phase 5 — Reliability
| Feature | Status | Notes |
| --- | --- | --- |
| Verify & repair of installed files | ✅ | Re-hashes and re-downloads only broken files |
| Crash signature detection (14 rules) | ✅ | Tested against real-world log lines |
| Diagnostics report + export | ✅ | Java, memory, mods, log tail |
| Config backups before preset changes | ✅ | |
| Automated tests | ✅ | 60 Vitest (logic + UI render smoke) + 4 backend + live e2e |
| Rollback of mod sets | ✅ | ZIP snapshots |

## Phase 6 — Online (optional)
| Feature | Status | Notes |
| --- | --- | --- |
| Backend service (announcements, catalog, mod collections, sessions) | ✅ | Fastify + zod, tests pass, in-memory store |
| PostgreSQL persistence | ⬜ | Interface ready; wire `DATABASE_URL` |
| Friends/presence, cloud saves, chat | ⬜ | Not implemented |
| Server plugin for shared cosmetics | 🔵 | Reference source, disabled by default |
| Servers page with partner servers | ✅ | LightingMC (`lightingmc.net:40382`) ships built in. Status comes from a real Minecraft Server List Ping (TCP varint protocol) — verified live: online, Paper 26.2, 0/50 players. Join uses `--quickPlayMultiplayer` on 1.20+ and `--server/--port` on older versions. Custom servers stored in `servers.json`. |

## Phase 7 — Release
| Feature | Status | Notes |
| --- | --- | --- |
| Windows x64 packaging | ✅ | Verified: `electron-builder --win` produced `Lighting Launcher.exe` + `app.asar` + `resources/ag-bridge` (293 MB unpacked). |
| Windows installer (.exe) | ✅ | `scripts/installer.nsi` compiled with makensis on Linux (no Wine) → `Lighting-Launcher-Setup-0.8.2-win-x64.exe`, 113.5 MB, per-user install, shortcuts, Apps & features entry, uninstaller, bundled Lighting Bridge jar, branded welcome/finish sidebar + header on every page, crest embedded as 7 icon sizes. SHA-256 `72230bd7…1097c73` in `release/SHA256SUMS.txt`. Installer itself still not run on a real Windows machine. |
| Logo in app (title bar, boot screen, About) | ✅ | `src/components/Logo.tsx` + boot SVG, vector, no raster assets |
| Logo on exe, shortcuts and taskbar | ✅ | `resources/icon.ico` (16–256) stamped into the built exe by `scripts/stamp-exe-icon.mjs`; verified by extracting `RT_ICON` back out |
| Logo on setup screens | ✅ | `MUI_WELCOMEFINISHPAGE_BITMAP` + `MUI_HEADERIMAGE` + `Icon`/`UninstallIcon`; compiled cleanly, not clicked through on Windows |
| Marketing site | ✅ | `website/index.html`, single file, built by `npm run site`; screenshots from the real app (`npm run site:capture`); version/size/SHA read from the installer |
| Startup survives a bad IPC registration | ✅ | `tests/ipc.test.ts` (4 tests) + idempotent `handle()` wrapper + `whenReady().catch()` dialog + 4 s force-show fallback. Packaged asar boot verified. |
| Live biome backdrop (weather + day/night, parallax) | ✅ | 4 biomes × 4 phases, canvas particles, clock-driven "Auto", pauses when hidden, disabled by Reduce motion. |
| Glassmorphic panels + loader neon edges | ✅ | `backdrop-filter: blur(22px)` with `@supports` solid fallback; cyan Fabric / orange Forge edges; breathing launch glow. |
| Wardrobe 3D inspector (zoom, light, stage, apply) | ✅ | Real `skinview3d` viewer on the profile's stored assets; applies skins/capes/presets through the existing services. |
| Jukebox + UI click sounds | ✅ | Web Audio synthesis only. **No recorded soundtrack** — C418/Lena Raine music is copyrighted; the pad is generated and labelled as such. |
| Game-mode pill (FPS / PvP / Cinematic) | ✅ | Maps to real presets `max-fps`/`competitive`/`quality`, applies via the verified `options.txt` writer with backup. Cinematic states shaders need Iris. |
| Installer executed on Windows | ⬜ | The sandbox is Linux; the installer compiles and unpacks as a valid NSIS PE32 but was not run on a Windows machine here. Run it once on Windows to confirm end-to-end. |
| Build workflow (GitHub Actions, Windows) | ✅ | `.github/workflows/build-windows.yml` |
| CI: typecheck, tests, build, bridge self-test | ✅ | `.github/workflows/ci.yml` |
| Auto-update | 🟡 | `electron-updater` dependency + GitHub release check wired; full signed update flow needs a release feed |
| Code signing | ⬜ | Requires your certificate. Unsigned builds trigger SmartScreen on first run. |
| macOS/Linux installers | ⬜ | Runs from source today |
