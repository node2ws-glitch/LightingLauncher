# Security & privacy notes

## Threat model

Lighting Launcher is a local desktop app that downloads and runs game software. The realistic threats are:
malicious downloaded files, a tampered local data folder, a compromised renderer, and a malicious
server. It is **not** designed to defend against an attacker who already has code execution as your
Windows user.

## What the app does

| Control | Implementation |
| --- | --- |
| Renderer isolation | `contextIsolation: true`, `sandbox: true`, `nodeIntegration: false`, no remote module |
| IPC surface | Explicit channel list (`src/shared/ipc.ts`); every handler validates payloads with zod |
| Content Security Policy | `default-src 'self'`, no remote scripts, `object-src 'none'`, `frame-ancestors 'none'` |
| Navigation | In-app navigation blocked; window.open restricted to an allowlist, external links via `shell.openExternal` |
| Download integrity | SHA-1 vs Mojang manifests, SHA-512 vs Modrinth, SHA-256 vs Adoptium; mismatches delete the file and retry |
| Path safety | Instance ids sanitised, `path.relative` escape check, mod file names `basename`d, ZIP entries flattened |
| Token storage | Electron `safeStorage` (DPAPI on Windows) → AES-256-GCM file fallback (0600) |
| Token exposure | Tokens never leave the main process; launch command lines are redacted before logging |
| Imported images | PNG signature + bit depth + colour type + exact dimensions checked before storing |
| Local telemetry | HTTP bound to `127.0.0.1`, random per-session token header, 16 KB body cap, zod validation |
| Crash / bug reports | Posted to the project's Discord webhook from the main process only. Tokens, UUIDs, e-mails and the OS username in paths are redacted first; automatic crash reports are deduped, rate-capped, and can be switched off in Settings → Support & Bug Reports. The webhook URL never enters the renderer |
| Server relay | Identity from `Player#getUniqueId()`, offline ids namespaced, payload + rate limits |
| Backend | Helmet, CORS allowlist, rate limiting, schema validation, JWT with mandatory 32+ char secret, request logging disabled (no IPs) |

## What the app deliberately does **not** do

* It never asks for, stores, or transmits a Microsoft password.
* It never extracts credentials or tokens from other launchers.
* It never disables Windows Defender, services, or GPU security features.
* It never bundles or redistributes Minecraft assets — they are downloaded from Mojang at install time.
* It never bypasses licensing or server authentication. Offline profiles cannot join online-mode servers.
* It never claims local cosmetics are visible to vanilla players.
* It contains no combat cheats (kill aura, aim assist, reach, anti-knockback, packet exploits).

## Known limitations (be honest with yourself)

1. **The AES-256-GCM fallback** (used only when `safeStorage` is unavailable, e.g. some Linux setups)
   derives its key from machine/user identifiers. It stops casual file inspection, not an attacker running
   as your user.
2. **Skins and capes are arbitrary images.** They are validated as PNGs of the correct size, but a PNG is
   still an image decoder input. Keep texture parsers in the game/bridge up to date.
3. **Mods run with full Java permissions.** Installing a mod is equivalent to running a program — install
   only from Modrinth and only mods you trust.
4. **Forge/NeoForge installers execute local Java code.** That is how those loaders are distributed; AG
   Client only runs them when you explicitly install that loader.
5. **No code signing** in the preview build, so SmartScreen will warn. Verify the SHA-256 of the installer
   published with each release.
6. **Third-party servers** may prohibit client mods. Ask before joining; bans are the server's decision and
   Lighting Launcher cannot prevent them.

## Data collected

**None leaves your machine by default.** Configuration, profiles, cosmetics, benchmarks and logs are all
local files under `%APPDATA%\ag-client\data`. The only outbound requests are the downloads you trigger
(Mojang, Fabric/Quilt meta, Forge/NeoForge, Adoptium, Modrinth) plus an optional GitHub version check when
update checking is enabled (a single unauthenticated GET; no identifiers sent).

The optional backend (`backend/`) stores only what it is sent: an opaque account id, mod collections and,
for admins, announcements. It does not accept Microsoft tokens by design.

## Reporting a problem

Include the diagnostics export (no tokens) and the steps to reproduce. Do **not** attach
`accounts/tokens.enc`.
