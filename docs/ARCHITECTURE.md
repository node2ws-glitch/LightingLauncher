# Architecture

## Process model

```
┌──────────────────────────── renderer (sandboxed) ───────────────────────────┐
│ React + Zustand + Tailwind + Framer Motion                                  │
│ No Node, no fs, no child_process. Only window.ag (typed, validated IPC)     │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │ contextBridge (src/preload)
┌───────────────────────────────────┴─────────────────────────────────────────┐
│ main process                                                                │
│  context.ts    wires services, owns broadcast()                             │
│  ipc.ts        every handler validates input with zod and returns clean      │
│                errors (no stack traces, no absolute paths)                  │
│  services:                                                                  │
│   accounts/    AccountsService · microsoft auth · TokenStore (DPAPI/AES)     │
│   java/        detect · recommend · jvmArgs · provision (Adoptium)          │
│   minecraft/   manifest · rules · installer · loaders · args · launch       │
│   performance/ PerformanceService · ProcessMonitor · TelemetryServer        │
│   mods/        ModsService · modMetadata (jar parsing) · zip                 │
│   skins/capes/cosmetics/hud  asset services                                 │
│   diagnostics/ crashSignatures · DiagnosticsService                         │
│   storage/     paths · jsonStore (atomic writes)                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key decisions

* **CommonJS main/preload bundles.** Electron's preload loader is most reliable with CJS; the
  renderer remains a normal ESM Vite app. Source code contains no `require`/`import.meta` so both
  toolchains stay happy.
* **One shared contract.** `src/shared/types.ts` and `src/shared/ipc.ts` are compiled by both sides;
  the preload implements the `AgApi` interface so any mismatch is a type error.
* **Pure services, thin Electron layer.** Everything under `src/accounts|java|minecraft|performance|…`
  is Electron-free, which is why they run under plain Node/Vitest. `paths.ts` takes an explicit root.
* **Truthful telemetry.** The only source of FPS is the loopback listener fed by AG Bridge. There is no
  code path that invents FPS, and benchmarks record their `source`.
* **Isolation by construction.** Every instance owns `versions/<id>/minecraft`. Shared libraries and
  assets are deduplicated like the official launcher. Installs never touch `saves/`.

## Install pipeline

1. `ManifestService` fetches `version_manifest_v2.json` (10 min cache, stale-cache fallback offline).
2. Version JSON is downloaded and verified against the manifest SHA-1.
3. Loader JSON (Fabric/Quilt) is fetched from their meta APIs and merged; Forge/NeoForge run their
   official installer against an instance-local game dir, then libraries are folded into the cache.
4. Client jar, libraries, natives and asset objects download concurrently (8–12 workers) with SHA-1
   verification, `.part` files and retries; existing valid files are skipped.
5. Natives are extracted from jars; legacy `virtual/`/`map_to_resources` assets are materialised.
6. `instance.json` is written, then **Verify** re-hashes everything.

## Launch pipeline

`launch.ts` resolves profile identity → picks Java → builds JVM args (memory, G1, obsolete-flag
stripping, telemetry/cosmetic system properties) → builds game args from the version's `arguments`
with feature rules → redacts secrets for logs → spawns, streams stdout/stderr, samples the process,
and on nonzero exit runs the crash-signature scanner.

## Security boundaries

* Renderer: `sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`, CSP with no remote
  scripts, navigation blocked, window-open allowlist.
* IPC: zod validation for every structured payload; path traversal rejected (`instanceDir`,
  `CosmeticManifest`, mod file names, ZIP entry names).
* Tokens: never cross IPC. Stored with `safeStorage` (DPAPI) when available, else AES-256-GCM.
* Networking: HTTPS only, allowlisted hosts, `AbortSignal` timeouts, bounded retries.
* External links: the renderer can never call `shell.openExternal` with an arbitrary URL.
  `app:open-external` accepts HTTPS only and rejects any host outside
  `minecraft.net`, `www.minecraft.net`, `help.minecraft.net`, `status.mojang.com`.
* Service status: `app:services-status` issues two unauthenticated GETs to Mojang's public
  content and session endpoints with a 4 s abort. No token, profile or machine identifier is sent,
  and the dashboard shows "not checked" until the user asks for a probe.

## Interface shell

* `src/components/Sidebar.tsx` — 78 px icon rail, 13 destinations, keyboard focusable.
* `src/components/TitleBar.tsx` — draggable header; account chip reflects the *real* selected
  profile and labels offline profiles as unauthenticated.
* `src/pages/HomePage.tsx` — hero launch card (artwork + live `skinview3d` character), a
  services/diagnostics column, AG news grid and the profile list. Every number on it is read
  from the store; nothing is simulated.
* `src/renderer/art.ts` — generated by `scripts/embed-art.py` from `assets/art/`, inlined as
  data URIs so the dashboard renders identically from `file://`, in a packaged app, and in the
  sandboxed HTML preview.
* `src/components/BackgroundFX.tsx` — biome/day-night canvas backdrop. Scene choice is renderer-only
  state in `localStorage` (`ag.scene.v1`); the loop pauses on `document.hidden` and stops entirely
  under *Reduce motion*.
* `src/components/ModePill.tsx` — game-mode switcher. It never writes `options.txt` itself; it calls
  `performance.apply` so backups and verification stay in one place.
* `src/renderer/audio.ts` — Web Audio synthesis (clicks + ambient pad). No audio assets ship.
* `src/pages/WardrobePage.tsx` — 3D inspector; zoom and light multipliers are applied to the
  `skinview3d` viewer, not faked with CSS filters.
* Startup resilience: `src/main/index.ts` logs to `userData/logs/main.log`, catches
  `uncaughtException`/`unhandledRejection`, shows a native dialog on fatal startup errors, force-shows
  the window after 4 s, and logs `did-fail-load` / `render-process-gone`. `registerIpc()` wraps every
  channel in an idempotent, non-throwing helper.
