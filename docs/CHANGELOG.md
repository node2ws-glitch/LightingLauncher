# Changelog

## 0.9.5 — Name-tag bolt + Orbit Home

Two things players asked for after 0.9.4: a client badge by the in-game name tag (the little
logo PvP clients show next to your name), and a home screen in that neon clubhouse style -
big PLAY emblem, glass panels, everything at a glance. Both land as **options**: nothing about
the current UI or name rendering changes unless you flip the switches (the badge defaults on,
the layout defaults to classic).

### Added
* **Name tag badge (AG Bridge 1.2.0).** A gold ⚡ is wrapped in front of your own display name,
  so your name tag and tab entry read "⚡ You" in-game. It is rendered entirely on your client:
  only your own player entry is touched, server tab formatting is preserved (the original text
  is wrapped, not replaced), it is restored exactly when the option is off, and nothing is sent
  anywhere - vanilla players see your plain name, and nobody else gets branded. Implemented
  without a new mixin (the click counter is still the only one) by locating the display-name
  field by type with the same fail-safe probe as the skin applier; the field choice and text
  composition were executed against both real game jars, and both versions ship the Unifont
  fallback that renders ⚡. Setting: **Settings → Bolt badge by my name tag** (on by default;
  applies from the next launch, like all manifest cosmetics). Bridge versions: Minecraft
  1.20.1 and 1.21.11 (Fabric/Quilt + Fabric API), installed per instance as before.
* **Orbit Home layout.** A second, optional Home: glowing PLAY hex in the centre, quick
  settings (RAM, preset, motion, name badge) on the left, the curated partner servers with
  real one-shot pings on the right, and news / your-look / live-session cards along the bottom,
  over the live backdrop with drifting cubes. It uses the exact same launch path, store data
  and honesty rules as the classic Home - no static mock numbers. Switch under
  **Settings → Home screen layout** or the ✦ button on Home; switch back any time.
  Transform/opacity-only motion, so the 1366×768 visibility rule holds and Reduce Motion
  silences it.

### Notes
* Website copy mentions the badge and Orbit; screenshots still show the classic layout
  (no new capture was fabricated for this release).

## 0.9.4 — Skins in-game, less lag, lighter downloads

Three player reports drove this release: launcher skins never appeared in the game, Minecraft
felt laggy with the launcher open, and both downloads were fatter than they needed to be. The
skins one turned out to be the most honest bug in the book: AG Bridge had only ever *loaded*
the cosmetics manifest - it never applied a single texture. That is fixed for real this time.

### Added
* **Skins & capes now show in-game, offline profiles included.** AG Bridge 1.1.0 registers the
  launcher-chosen PNGs and applies them to your own player after you join a world. A new
  **Minecraft 1.21.11 build** joins the existing 1.20.1 build (bridge binaries cannot cross
  game versions); the launcher installs the matching one per instance and keeps refusing
  anything unverified. Scope stays honest: nothing is sent to any server, vanilla players still
  see the server-side look, no authentication is touched, and there is still exactly one mixin
  (the click counter - skins are applied by filling the local player entry's own texture data,
  located by type with strict fail-safe checks). Both versions' field shapes were verified by
  executing the probing code against the real game jars; one such check caught that 1.21.11
  derives texture bind paths from asset ids, which would have shipped a broken texture.
  Any unexpected game shape makes the feature disable itself instead of risking the game.
* **Built-in skin: Neon Volt (slim).** Seeded into the Skins library on first run (same
  one-shot pattern as the cape collection; delete it and it stays deleted).

### Performance (launcher overhead while you play)
* **Game logs are batched** across IPC (150 ms windows, 500-line cap, state changes flush
  first) instead of one message + UI re-render per line - a modded startup can emit hundreds
  of lines per second.
* **The animated backdrop fully pauses** while a game is preparing/spawning/running, even if
  the launcher window stays visible on another screen (previously only hidden/blur did this).
* **Fixed game heap:** `-Xms` now equals `-Xmx`, removing periodic heap-resize hitches.
* **Removed the dead process sampler end-to-end.** The "Game RAM / Game process" numbers were
  wired to nothing (always blank, benchmarks silently stored 0 MB) - and had it ever run, its
  Windows path spawned PowerShell per sample. Gone: service, IPC channel, store field. The
  stat cards now show the bridge-reported Minecraft version instead. `memoryMbMax` on old
  benchmark records is legacy-optional.
* None of this invents FPS: it takes the *launcher* out of the frame-time picture. In-game FPS
  still depends on hardware and video settings; FPS Center presets remain the lever there.

### Lighter
* Installer: Chromium locale packs pruned to en-US (`electronLanguages`), about 17 MB less
  installed weight; the duplicate bridge jar that used to ship is gone (two per-version jars
  instead).
* Website: screenshots re-encoded PNG → JPEG q82, 3.38 MB → 0.82 MB (same captures, masters
  kept in `site-screenshots/`).

### Motion
* Launcher: sheen sweeps on the Launch buttons, a panning gradient on gradient text, floating
  crest on the splash, staggered card entrances in Skins/Capes. Website: the same treatment
  (headline pan, button sheen, bobbing hero card, drift glow, hover lift/zoom, staggered
  cards). Transform/opacity only - no layout shifts at 1366×768 or on phones, and the Reduce
  Motion setting / `prefers-reduced-motion` still silence all of it.

## 0.9.3 — Support, built in

Lighting-Launcher had diagnostics but no way to *reach* devaru007 when something broke. This
release wires official Discord support into the launcher and the website, and makes crash
reports travel to where they'll actually be read.

### Added
* **Official Discord (discord.gg/wB6j6PECNZ)** everywhere players look for help: a rail button
  on every screen, a **Settings → Support & Bug Reports** panel, buttons on Logs & Diagnostics,
  a link in the Home crash banner, and nav/FAQ/footer links on the website.
* **Automatic crash reports.** When a game process crashes, the launcher posts a report to the
  support Discord webhook: diagnosed cause (from the crash-signature analyzer), launcher +
  Minecraft + loader versions, exit code, OS, game RAM, the matching evidence line, and the
  last ~80 log lines. Safeguards: everything is redacted first (access tokens, UUIDs, e-mails,
  the OS username in file paths, Discord @-mentions defused); identical crashes are deduped
  (10 minutes) and capped (6/hour) so a crash loop can't flood the channel; pre-flight errors
  (Java not downloaded yet, missing files) are never reported; a failed send is dropped
  silently. **On by default; switch it off in Settings → Support & Bug Reports.**
* **Manual bug reports.** Logs → *Send to Discord* (and the Settings support panel) opens a
  dialog: describe the problem, optionally attach the recent log, send. The main process
  attaches versions/diagnosis and redacts — the renderer never sees the webhook URL.

### Notes
* The webhook credential lives only in the main process, never in the renderer bundle.
* Settings subtitle and the website "Where does my data go?" answer were updated to describe
  crash reports accurately.

## 0.9.2 — Launch repair

A bug-fix release for one serious problem: pressing Launch ran for a minute or two and Minecraft
never opened. Reproduced end-to-end, root-caused to the launcher's own companion mod, and fixed so
an optional mod can never block the game again.

### The bug
* The launcher automatically copied its **AG Bridge** companion mod into every Fabric/Quilt instance
  with Minecraft ≥ 1.20. The bridge binary is built against **Minecraft 1.20.1** and calls Fabric
  API without declaring it. On 1.21.11 its startup code calls a `KeyBinding` constructor Mojang
  removed, Fabric's entrypoint stage throws `NoSuchMethodError`, and the JVM dies before any window
  appears — the "Launch works, then 1–2 minutes pass and Minecraft doesn't open" report.

### Fixed
* **The bridge is now gated.** It is installed only when the instance's Minecraft version matches
  the bridge's own declared range (read from the jar itself) **and** Fabric API is present in
  `mods/`. Anything else skips it — and a managed copy left behind by older launcher versions is
  **removed before launch**, so existing broken instances heal on their next launch. Verified in
  three live launches (1.21.11 heal, 1.20.1 + Fabric API loads the bridge, 1.20.1 without Fabric
  API skips it), each with zero entrypoint errors.
* **The bridge jar is honest now (1.0.1):** declares `fabric-api` in `depends`, pins
  `minecraft >=1.20.1 <1.20.2`, and its single mixin is no longer `required` — so even a
  hand-installed copy is rejected by Fabric Loader with a readable message instead of a stack trace.
* **Telemetry port 0:** the launcher handed the game `-Dag.telemetry.port=0` (captured before the
  server had bound), so live FPS could never connect. The endpoint is now resolved per launch.
* **32-bit Java could be selected:** the 64-bit check matched the "64" inside the host arch string
  ("x86x64") even for 32-bit JVMs. 64-bit is now genuinely required.
* **Home crash banner** now shows the diagnosed cause from the crash analyzer instead of generic text.

### Honest scope change
* AG Bridge features (live FPS/language telemetry, local-cosmetic bridge, Right Shift HUD sync)
  are **verified on Minecraft 1.20.1 + Fabric API only** and pause on other versions until the
  bridge is rebuilt per Minecraft version. The game itself launches everywhere. The HUD page and
  cosmetics studio still edit and save layouts exactly as before.

## 0.9.1 — The glass update

A full visual refresh, requested after 0.9.0 landed. No behaviour changed: same pages, same buttons,
same data — this release is about how the launcher looks and feels.

### Removed
* **The FPS Booster / PvP Pro / Cinematic pills are gone from the Home screen**, along with the blurb
  under them. The hero is now the artwork, your skin and the Launch button. Nothing was lost: those
  pills were shortcuts to three of the FPS Center presets (`max-fps`, `competitive`, `quality`),
  and every preset is still one click away on the **FPS** page. A preset you already applied stays
  applied and is still shown on the Client engine card.

### New default accent: Surge
* Sixth interface template — electric cyan melting into mint, matching the crest. It is the new
  default, so the new look arrives on existing installs too (template preference moved to a v2 key;
  Ember / Frost / Venom / Void / Mono remain in the backdrop picker in the title bar).
* All glow colours are now derived from the active template instead of a hard-coded orange, so
  switching template retints the whole launcher — buttons, progress bars, scrollbars, the Launch
  button's breathing glow and the title bar/rail highlights included.

### Glass everywhere
* Panels are frosted glass over the live backdrop: deeper blur, higher saturation, a top inner
  highlight and a soft accent halo on hover. Two shared surfaces (`glass-card`, `glass-inset`)
  replace the flat `bg-ink-*` cards across all 16 pages; nested rows deliberately skip backdrop
  blur so dense lists stay fast and crisp.
* The icon rail and title bar are translucent now, the active rail item is a glowing gradient tile,
  and the wordmark carries a faint gradient sheen.
* The backdrop gained two slow-drifting glow orbs and a faint top grid; the dashboard skin stage
  floats gently, the Launch button is an animated brand gradient with a sheen sweep on hover, and
  page transitions eased out a little. Reduce motion still turns all of it off.

### Honest notes
* Looks only — no launch, account, mod or performance behaviour was touched. The window-size rules
  are unchanged: every control still fits at 1366x738.

## 0.9.0 — Profiles, partner servers, and a launch screen you can trust

Three screens from the reference images, plus two real launch bugs found while building them.

### New screens

**Profiles** (`src/pages/ProfilesPage.tsx`)
Card per profile: cover, skin head (cropped from the skin you actually assigned; a labelled default
when none is), name, `Lighting-Launcher + Fabric 0.20.1`, `Minecraft 26.3`, live mod and resource-pack
counts, allocated memory, Play / Mods / Packs and a "…" menu (make default, rename, delete). The
selected profile gets the accent ring and a check badge; new profiles get the dashed
*Create profile* tile with an offline name field and a real Microsoft browser sign-in.

**Partner servers** (`src/pages/ServersPage.tsx`)
Three-column card grid. Artwork is the server's own favicon (from a real status ping) over a
generated gradient — no borrowed key art. Each card shows the live player count, latency and MOTD,
with "Offline" when the server does not answer. Search, *Become a Partner* (explains the curation
rules — there is no self-serve list), and a *Recommended / Most players* toggle that really re-sorts.
Servers can be pinned into **quick slots** for one-click joining.

**Launch screen** (`src/components/LaunchOverlay.tsx`)
Flat grey backdrop, the launcher mark and the hyphenated wordmark, one thin bar. The bar shows a real
percentage while files are being downloaded and an indeterminate sweep while Java starts, and the
caption is the launcher's real status line. Escape or *Hide* dismisses it; it closes itself the
moment the game reports it is running.

### Launch fixes found while testing those screens

| Bug | Cause | Fix |
| --- | --- | --- |
| Minecraft 26.3 died with `UnsupportedClassVersionError` | `requirementFor()` only knew `1.x` versions, so the year-based `26.3` fell through to "Java 21" and the launcher downloaded Temurin 21 | The version json's `javaVersion.majorVersion` is now authoritative (`pickJava(..., meta.javaMajor)`), the table understands `26.x` → Java 25, and Temurin 25 is provisioned on demand (`src/java/recommend.ts`, `src/minecraft/launch.ts`) |
| A refused launch left the splash spinning forever | `start()` set phase `preparing` before the memory check and never reset it when it threw | `start()` wraps `startInner()`; any pre-spawn failure returns the status to `idle` with the real message |
| 0.8.2's launch repair was missing from the tree | `jobNeedsWork()` / `ensureHealthy()` had been lost | Restored: strict size + SHA-1 checks before every spawn, checksum-aware Verify & Repair, one automatic repair-and-relaunch |

Verified live in this round: Fabric 26.3 install (41 MB), Temurin 25 download, JVM start, Fabric mod
discovery, and the expected `Graphics initialisation failed` crash in a container with no GPU — which
the crash detector reported with the right advice instead of a generic message.

### Interface
* Icon rail compacted (17 px icons, tighter rows) and the music widget turned into a small popover,
  so all 16 pages fit at 1366x738 without clipping.
* Title bar reads the version from the running app and shows `LIGHTING-LAUNCHER` (hyphen), matching
  the exe, the splash and the logs.
* New `app.instanceContents` IPC: mods, disabled mods, resource-pack names and `options.txt`
  presence for one instance — read from disk, never cached in settings.

### Docs
`docs/FEATURE-REQUESTS.md` — the honest triage of the PvP / performance / utility wishlist
(Done / Partial / Planned / Not planned, with reasons).

### Website (`website/`)
Rebuilt against this release and regenerated from the real installer, so the page cannot drift from
the binary: version, file name, size (113.3 MB) and SHA-256 are read out of
`Lighting-Launcher-Setup-0.9.0-win-x64.exe` at build time.
* New **"Servers, profiles, and the few seconds after Play"** section — the three rebuilt screens with
  real captions, captured from a live install.
* New **"What 0.9.0 actually does — and what it does not"** table: 22 lines of the launcher wishlist
  labelled Built / Partial / Planned / Not planned, including the fairness line about reach and hitbox.
* Screenshot carousel now carries ten screens (profiles and the launch screen added); the stale
  "add your own server" caption is gone.
* Sections stay visible if scripts are blocked or the reveal animation never fires, and the OS
  detection states plainly when no build exists for the platform it detected.

## 0.8.2 — Launch works: broken libraries repair themselves

You reported: "when i launch the game it works but minecraft didnt launch". The Logs & Diagnostics
panel from your screenshot had the answer in it — `NoClassDefFoundError:
org/lwjgl/glfw/GLFWErrorCallback`, plus three libraries "missing from disk".

### Root cause
A library jar was truncated (interrupted download). The file **existed**, so:

* the pre-launch guard only checked `fs.existsSync`, and
* `Verify & Repair` filtered with `!fs.existsSync(j.dest)` before queueing downloads,

so the broken jar was skipped on every single attempt and Java died as soon as it touched LWJGL.
A second, quieter bug made this hard to see: the on-disk library check in Diagnostics ignored
Mojang's OS rules, so a Windows install reported `java-objc-bridge` (macOS) and two Linux netty
natives as "missing" — three errors that had nothing to do with the crash.

### Fixes
| Change | File |
| --- | --- |
| `jobNeedsWork()` — a file counts as present only when its size matches the manifest (>0) or its SHA-1 verifies | `src/minecraft/http.ts` |
| `ensureHealthy()` — re-resolves version metadata when it was written by an older merge format, then re-downloads only the files that fail the size/checksum check | `src/minecraft/installer.ts` |
| LaunchService calls it before every spawn and logs each file it repaired | `src/minecraft/launch.ts` |
| A library crash triggers **one** automatic repair + relaunch, then reports honestly instead of looping | `src/minecraft/launch.ts` |
| `refreshMissing()` (Verify & Repair) uses the same checksum-aware filter | `src/minecraft/installer.ts` |
| Diagnostics filters by `libraryAllowed()` and flags zero-byte jars | `src/diagnostics/DiagnosticsService.ts` |
| `InstanceMeta.jsonFormat` stamps the merge format so old installs get re-resolved once | `src/minecraft/instance.ts` |

Verified against the real 1.21.11 manifest: a deliberately zero-byte `lwjgl-glfw-3.3.3.jar` is
detected and re-downloaded to 135,546 bytes with `GLFWErrorCallback` present
(`tests/librarySelfHeal.test.ts`, 5 tests; the end-to-end repair was also run once against Mojang's
CDN during development).

### Renamed to Lighting-Launcher
The product name now uses a hyphen everywhere: window title bar, `app.name`, the packaged
`Lighting-Launcher.exe`, the desktop and Start-menu shortcuts, the Add/Remove Programs entry, the
installer header art and the website. `appId`, the userData folder and the artifact file name are
unchanged, so upgrading keeps your accounts, skins and instances.

### Servers: curated only
The "Add your own server" panel and the `servers:add` / `servers:remove` IPC channels are gone.
`ServersService` now serves only the partner list that ships with the build, so every card on the
page is one the launcher curated.

### Everything visible on a 1366×768 laptop
Height media queries compact the nav rail and hide the jukebox's decorative legend and volume slider
below 860 px, and compact again below 760 px. All 15 nav buttons, their labels, the music controls
and the memory readout stay on screen — nothing is pushed out of view or clipped.

### Website
* Detects the visitor's OS (Windows / macOS / Linux / Android-iOS, including iPadOS reporting a Mac UA)
  and labels the primary button for it.
* Only a Windows x64 build exists, so macOS/Linux/mobile visitors see "no build for this OS yet" with
  the platform list expanded and every row visible — no dead or invisible buttons.
* New FAQ entries for "what if the game doesn't start" and "can I add my own servers".
* The page, the setup art and the logo now read LIGHTING-LAUNCHER.

### Still not verified
* No Windows machine here: the installer is verified by compiling it with the exact art and by reading
  the icon and VERSIONINFO resources back out, not by clicking through the wizard.
* The auto-repair was exercised against real Mojang downloads in Node, not by launching a game window.

## 0.8.1 — The crest goes everywhere (app, shortcut, setup) + marketing page

You asked for the uploaded logo to appear everywhere, and for a site in the layout of the reference
launcher page. Both are done, and the parts that are *claimed* below were checked against the built
files, not assumed.

### One original mark, four renderings
`resources/brand/logo-mark.svg` is the master drawing: a hexagonal plate, a cyan → green → amber ring,
an inner keyline, six pixel sparks and a blocky bolt. Everything else is generated from it by
`npm run icons` (`scripts/render-brand.mjs`, which renders through Electron's own compositor so the
output is exactly what Chromium draws):

| Output | Where it shows up |
| --- | --- |
| `resources/icon.png` (512×512) | `BrowserWindow` icon — taskbar and Alt-Tab |
| `resources/icon.ico` (16–256, 7 sizes) | exe icon, shortcut icon, uninstaller, setup window icon |
| `resources/brand/installer-welcome.bmp` (164×314) | setup welcome **and** finish page sidebar |
| `resources/brand/installer-header.bmp` (150×57) | the header strip on every setup/uninstall page |
| `src/components/Logo.tsx` + boot screen SVG | title bar, startup screen, Settings → About |

The `.ico` and the exe are verified: extracting `RT_ICON` from `release/win-unpacked/Lighting Launcher.exe`
returns 16/24/32/48/64/128/256 with the new crest, and the setup.exe embeds the same seven sizes.

### The exe used to keep Electron's icon
`electron-builder` is invoked with `-c.win.signAndEditExecutable=false` here because editing PE resources
needs Wine on Linux. The side effect was that the packaged `Lighting Launcher.exe` kept Electron's default
icon and had no version block. `scripts/stamp-exe-icon.mjs` now writes the icon group and the VERSIONINFO
strings with `resedit` (pure JavaScript, no Wine) as step 4/5 of the installer build.

Verified on the built file: `ProductName = Lighting Launcher`, `FileVersion = 0.8.1.0`,
`LegalCopyright = Copyright (c) 2026 Lighting Launcher`.

### Setup screens
`scripts/installer.nsi` now defines `MUI_WELCOMEFINISHPAGE_BITMAP`, `MUI_HEADERIMAGE` (right-aligned),
`MUI_HEADERIMAGE_UNBITMAP`, `Icon` and `UninstallIcon`. `electron-builder.yml` carries the same art for
builds made in CI.

### Marketing page
`website/index.html` — one self-contained file (inline CSS/SVG, screenshots inlined as data URIs, no CDN,
no external fonts) built by `npm run site`:

* sticky nav, hero with a real screenshot, feature checklist, three feature cards,
  a "numbers we can stand behind" section, a branding section, an eight-screen carousel, accordion FAQ,
  download block and footer;
* every screenshot comes from the real renderer via `npm run site:capture`
  (`scripts/capture-screenshots.mjs` attaches over the DevTools protocol to the unmodified app);
* version, file name, size and SHA-256 are read from the actual installer by `website/build.mjs`;
* no invented FPS chart. The performance bars are empty and the text says why.

### Small fixes
* Settings: "AG Bridge" wording and the hotkey label no longer use the old client name; the About panel
  shows the crest, the version and "made by devaru007".
* Dashboard: "run on AG online services" → "run on Lighting Launcher online services".

### Still not verified
* The installer has never been run on a real Windows machine (no Windows here), so the branded setup
  pages are verified by compiling cleanly with the exact 164×314 / 150×57 bitmaps and by reading the
  icon resources back out of the built exe — not by clicking through the wizard.
* The website was checked in Chromium at 1440×950 and 430×900.

## 0.8.0 — Microsoft sign-in that returns to the launcher by itself

You asked for: the launcher opens a link, you sign in, and the account connects automatically. That is
now the primary flow.

### What was there before
Only the device-code flow: it opened a page that showed a **code you had to type**. It worked, but it
is not "log in and it connects".

### What it does now
`src/accounts/oauthLoopback.ts` implements OAuth 2.0 **authorization code + PKCE** with a loopback
redirect, the supported pattern for desktop apps:

1. The launcher opens a listener on `127.0.0.1` (random port) and builds an authorize URL for
   `login.microsoftonline.com/consumers/oauth2/v2.0/authorize` with `S256` PKCE and a random `state`.
2. Your **default browser** opens on Microsoft's own sign-in page. The password is typed there, never
   in the launcher.
3. Microsoft redirects to `http://localhost:<port>?code=…`; the launcher answers with a styled
   "Signed in — you can close this tab" page.
4. It verifies `state`, exchanges the code + PKCE verifier for tokens, then runs the same
   Xbox Live → Minecraft → entitlements chain and selects the new profile.

The Accounts page now has **Connect Microsoft account** (browser, default) and a smaller
**Use a code instead** (device code) button for when a browser or redirect is not available.

### About the URL you pasted
`login.microsoftonline.com/common/oauth2/v2.0/authorize?...redirect_uri=https://account.microsoft.com/auth/complete-signin-oauth...`
is Microsoft's **own** sign-in app (MSAL desktop, client ID `81feaced-…`). Its result is delivered to
`account.microsoft.com`, not to any program on your PC — there is nothing legitimate to hook there, and
using another application's client ID would be impersonation. A loopback redirect is how a desktop app
receives its own sign-in result, which is exactly what was implemented.

### Failure handling (no silent spinners)
| Situation | What you see |
| --- | --- |
| You close/cancel the sign-in | "Sign-in was cancelled in the browser." |
| Azure app has no `http://localhost` redirect | A precise AADSTS50011 message telling you to add *Mobile and desktop applications → http://localhost*, with the device-code button next to it |
| Nothing comes back for 5 minutes | "Sign-in timed out. Start it again from Lighting Launcher." |
| `state` mismatch | A refusal to accept the response |
| Microsoft returns an OAuth error | The actual `error_description` |

### Verified for 0.8.0
- `tests/oauthLoopback.test.ts` — **15 tests**, no mocks for the networking parts:
  - PKCE: independent SHA-256 recomputation of the challenge, base64url rules, randomness per call
  - authorize URL: consumers endpoint, `response_type=code`, `S256`, `XboxLive.signin offline_access`,
    `prompt=select_account`
  - loopback listener: a real HTTP request to the real socket returns the code and the success page;
    `?error=access_denied` rejects with a cancel message; a non-redirect path is rejected; the timeout
    path fires
  - token exchange: a real POST to Microsoft's token endpoint with a bogus code is rejected and the
    error is surfaced (proves the request is formed correctly enough to be answered, and that failures
    are not swallowed)
  - `isRedirectMismatch` recognises AADSTS50011 and does not fire on unrelated errors
- `npm run typecheck` clean; `npm test` — **111 passed, 1 skipped**.
- Packaged boot: `starting Lighting Launcher 0.8.0` → window shown, no renderer errors.
- `Lighting-Launcher-Setup-0.8.0-win-x64.exe` — 114 MB, SHA-256 `1ea9f1ae1b5d42eea6e746559782a209c5a40ec1049aa9c540a8da7c6b3a255f`.

### Not verified, plainly
- A **real, completed Microsoft sign-in**: that needs an Azure app registration with the loopback
  redirect and a Microsoft account. The launcher ships without a shared client ID on purpose
  (settings → Accounts holds yours). Everything up to and including the token request is exercised;
  the successful round trip with a live account is not.
- The browser opening on Windows (the handler calls `shell.openExternal`, standard Electron).

## 0.7.2 — the launch crash: library merge was dropping real jars

Your crash report said it plainly:

```
java.lang.NoClassDefFoundError: org/lwjgl/glfw/GLFWErrorCallback
"Missing or corrupt libraries — The classpath is incomplete"
"Fabric loader error — Fabric could not start the mod set"
```

It was not an interrupted download. **A loader install was throwing away the real library jars.**

### Root cause
Modern Mojang manifests list each platform's natives as its own library entry, all sharing
group:artifact:

```
org.lwjgl:lwjgl-glfw:3.3.3                  <- the jar with GLFWErrorCallback
org.lwjgl:lwjgl-glfw:3.3.3:natives-linux
org.lwjgl:lwjgl-glfw:3.3.3:natives-windows
org.lwjgl:lwjgl-glfw:3.3.3:natives-windows-arm64
org.lwjgl:lwjgl-glfw:3.3.3:natives-windows-x86
```

`libraryKey()` returned `group:artifact` only, so `mergeVersionJson()` (used whenever a loader is
installed over vanilla) collapsed all of them into **one** entry — whichever came last. The main jar
disappeared from the classpath and a natives jar took its place.

Proven against the real `1.21.11` manifest, old code vs new:

| | Old | New |
| --- | --- | --- |
| glfw main jar on classpath | **no** | yes |
| glfw entries kept after merge | `natives-windows-x86` only | all 7 |
| classpath entries | 44 | 63 |

### Fixes
1. **`libraryKey()` includes the classifier** (`group:artifact:classifier`) — main jars and each
   natives variant stay separate, while a loader can still override a library version.
2. **`collectLibraryJobs()` no longer returns early** after the artifact. Pre-1.19 manifests put
   natives in the *same* entry as the artifact, so 1.13–1.18 installs were skipping every native jar
   and failing at extraction with "Missing native jar".
3. **Wrong-architecture natives are filtered out** (`nativesArchAllowed`): arm64 natives only on
   arm64, `-x86` only on a 32-bit JVM, so they never bloat or poison a 64-bit classpath.
4. **Verify & Repair now re-resolves first** (`MinecraftInstaller.reresolve`). A json written by the
   buggy merge is itself wrong, so repairing files alone could never fix it — the metadata is now
   rebuilt from Mojang + the loader profile, then only missing/wrong-SHA-1 files are re-downloaded.
   **Your existing broken 1.21.11-fabric instance is repairable with one click — no reinstall.**
5. **Diagnostics reports the real thing**: a new on-disk check counts library jars that are actually
   missing and puts a **Verify & Repair** button on the finding. Crash findings for missing
   libraries / loader errors get the same button.
6. **Duplicate findings merged.** The screenshot showed "Missing or corrupt libraries" twice; identical
   findings are now collapsed, keeping the one that carries a fix.

### Verified for 0.7.2
- `tests/libraryMerge.test.ts` (10 tests): builds a manifest shaped like 1.21.11 (main jar + 5 natives
  variants), merges a Fabric profile, and asserts the real jars survive on the classpath, arm64/x86
  natives are excluded, and pre-1.19 single-entry natives are still downloaded.
- Checked against the **live Mojang manifest for 1.21.11**: before/after table above.
- `npm run typecheck` clean; `npm test` — **96 passed, 1 skipped**.
- Packaged boot: `starting Lighting Launcher 0.7.2` → window shown, no renderer errors.
- `Lighting-Launcher-Setup-0.7.2-win-x64.exe` — 114 MB, SHA-256 `4dcbbebd3929441b6e9ab63e2b6626dc4b63b75958bef5c8bfa49eec42d71077`.
- **Not verified:** an actual game launch on Windows (no Windows host or Minecraft account here). The
  classpath that is produced is now byte-for-byte comparable to the manifest's intent, and is asserted
  in tests, but I have not seen the game window open.

## 0.7.1 — the black screen is gone

You said a black screen during install would make people think they were being hacked. That was fair:
there were **two** separate black screens, and both are fixed.

### 1. The window's first paint was a black rectangle
`BrowserWindow` used `backgroundColor: '#07090d'` and `index.html` shipped an empty `<div id="root">`.
Between the window appearing and the React bundle mounting, the user therefore saw a flat near-black
window — exactly the look of something dodgy.

`src/renderer/index.html` now contains a complete, inline **boot screen**: brand mark, "LIGHTING
LAUNCHER", an indeterminate progress bar, "Starting up…" and the devaru007 credit, on the same
blue-ink gradient the app uses. It is inline `<style>`/inline SVG only, so it draws on the very first
frame without waiting for the JS bundle or Tailwind. `main.tsx` removes it two animation frames after
React's first paint, fading it out so the hand-off is invisible.

Deliberate detail: nothing on that screen animates from `opacity: 0`. The first version did, and a
screenshot caught the frame where the text had not faded in yet. Now the text is painted immediately.

Window and page background are the same coloured gradient (`#0b1322` base, not `#07090d`), and the
React `Splash` was given the identical gradient, so boot screen → Splash → app has no colour jump.

### 2. The installer flashed a black console
`scripts/installer.nsi` closes a running copy of the launcher with:

```nsis
ExecWait 'taskkill /F /IM "Lighting Launcher.exe" /T' $0
```

`ExecWait` launches `taskkill.exe` with its own console window, so a black box appeared in the middle
of the install. It is now `nsExec::ExecToLog`, which runs the same command with no window at all. The
uninstaller got the same treatment — it also needs the app closed before deleting files, and previously
would fail to remove a locked folder.

### Verified for 0.7.1
- **Frame captures with Electron's `capturePage()`**, JS disabled so only the pre-React paint can be
  captured: logo, name, progress bar, "Starting up…" and the credit are all present on that first
  frame. Saved as `shots/pre-react-boot-screen.png`, `shots/first-frame.png`,
  `shots/after-app-loads.png`.
- Packaged boot: `starting Lighting Launcher 0.7.1` → `main window created` → `window ready-to-show`,
  zero renderer errors.
- `npm run typecheck` clean; `npm test` — **86 passed, 1 skipped**.
- `Lighting-Launcher-Setup-0.7.1-win-x64.exe` — 114 MB, SHA-256
  `52d153aa4665e62c020178ebad28b66ff6cce85c0e992ac495e91ff38cb34894`.
- **Not verified:** the installer's console behaviour on a real Windows machine (no Windows host
  here). `nsExec` is the documented way to run a command without a window in NSIS, but this is worth
  one glance when you install.

## 0.7.0 — Servers page, with LightingMC as the first partner server

You gave a real server, so this is a real feature rather than the "no partner network" placeholder I
declined in 0.5.0.

### The list
`src/shared/servers.ts` ships the partner entries. Currently one:

| Name | Address | Kind |
| --- | --- | --- |
| LightingMC | `lightingmc.net:40382` | partner (built in, cannot be removed) |

"Partner" means exactly one thing here: the launcher ships a card for that server. It is not a claim
of affiliation, and the card says so at the bottom of the page.

### Status is a real ping, not an estimate
`src/minecraft/ping.ts` implements the Minecraft Server List Ping (1.7+) directly over TCP:
handshake with varint framing → status request → parse the JSON. It reports online/offline, player
counts, version name, MOTD, sample players and the **measured** round-trip time. SRV records
(`_minecraft._tcp.<host>`) are honoured when the address has no explicit port, like the vanilla
client. If the server does not answer, the card says offline with the actual socket error — player
counts and ping stay empty rather than guessed.

**Live check against your server:** `lightingmc.net:40382` → `online: true`, `Paper 26.2`,
players `0 / 50`, protocol `767`, MOTD read, favicon received.

### Join
`servers:join` reuses the normal `LaunchService.start()` — same Java selection, memory validation,
library checks and logging — with a `server` field in the request. `serverArgs()` picks the right
flag by version:

- **1.20+** → `--quickPlayMultiplayer host:port`
- **older** → `--server host --port port`

so the client connects on startup instead of sitting at the menu.

### Adding your own
Name + host:port (+ optional note), validated with `parseServerAddress` (rejects `http://`, spaces,
out-of-range ports, unbracketed IPv6). Stored in `<userData>/servers.json`. Nothing is uploaded.

### Verified for 0.7.0
- `npm run typecheck` — clean.
- `npm test` — **86 passed, 1 skipped**. New `tests/servers.test.ts` (10 tests) stands up an actual
  TCP server that speaks the status protocol and checks the handshake/response parsing end to end,
  plus address validation, the offline path, MOTD flattening and the join-flag selection.
- Real ping of `lightingmc.net:40382` from this environment succeeded (details above).
- Packaged boot: `starting Lighting Launcher 0.7.0` → `main window created` →
  `window ready-to-show, shown`, no renderer errors.
- `Lighting-Launcher-Setup-0.7.0-win-x64.exe` — 114 MB, SHA-256
  `363a4873d3f674db48dadec6530f425911bcff624a9734ed42254bcba67edbbd`, listed in `release/SHA256SUMS.txt`.

### Limits, stated plainly
The launcher pings and connects; it does not and cannot bypass the server's whitelist, bans or
version checks. A server that requires a specific client version still refuses a mismatch.

## 0.6.0 — startup screen: slower, and it shows what's new

You said the loading screen was too fast and wanted the new stuff pulled in and shown there. Both,
without inventing anything.

### The screen now shows real work
`src/store/useAppStore.ts` used to `Promise.all` eight calls and flip `ready` once at the end, so the
splash had nothing to display and left after a fixed 900 ms. Bootstrap is now a list of named steps,
run in order, each reported to the store as `pending → running → done|failed` with the real result:

| Step | Detail line it produces |
| --- | --- |
| Checking installation | `Lighting Launcher 0.6.0` |
| Loading preferences | `Preferences loaded` |
| Reading accounts | `2 offline profiles · 0 Microsoft accounts` |
| Scanning hardware and Java | `16 GB RAM · Java 21 (Eclipse Adoptium)` |
| Reading installed versions | `3 instances installed` |
| Loading performance presets | `7 presets · launcher idle` |
| Fetching announcements | `3 announcements` |
| Checking for updates | `Up to date` |
| Loading skins, capes and cosmetics | `5 skins · 2 capes · 18 cosmetics` |
| Preparing the HUD editor | `HUD layout loaded` |

A step that throws is stored as **failed** with its real error message and surfaced at the bottom of
the splash — the bar can no longer just stop.

### It is slower on purpose, and adjustable by behaviour
- First launch of a version you have not seen: **~6.2 s**, so the notes are readable.
- Later launches of the same version: **~2.6 s** (remembered in `localStorage` under
  `ag.whatsNew.lastSeenVersion`).
- **Skip / Enter Lighting Launcher** appears as soon as booting finishes.
- A **20 s hard ceiling** guarantees a slow disk can never trap you there.
- `prefers-reduced-motion` / the app's Reduce motion setting removes the springs and fades.

### Where "what's new" comes from
`src/shared/whats-new.ts` holds the release notes for 0.6.0, 0.5.1, 0.5.0 and 0.4.0. They are bundled
with the build, so the panel works offline and cannot show content that does not exist. The splash
renders the newest entry with version chips to switch between releases, and `NewsPage` renders the same
entries as feed items so the notes are not only visible once.

`tests/whatsNew.test.ts` fails the build when the newest entry's version does not equal
`package.json`'s version, when bullets are missing/placeholder, or when banned words appear — so a
version bump cannot ship with stale notes.

### Verified for 0.6.0
- `npm run typecheck` — clean.
- `npm test` — **76 passed, 1 skipped** (5 new release-note tests, 4 new splash render tests covering
  real step details, the what's-new panel, a failed step being shown, and the dismiss button).
- Packaged boot: `starting Lighting Launcher 0.6.0` → `main window created` →
  `window ready-to-show, shown`, no renderer errors.
- `Lighting-Launcher-Setup-0.6.0-win-x64.exe` — 114 MB, SHA-256
  `f5e5156e32b8cc3e18d733804da61cc7cc89a5723e6e9901521359dc9deb5837`, listed in `release/SHA256SUMS.txt`.

### Branding fix found while testing
The compiled AG Bridge jar still carried the old project name in its language file, so Minecraft's
controls screen said category **"AG Client"** and the binding was called **"Open AG menu"**. The jar's
`assets/ag-bridge/lang/en_us.json` was patched in place (no recompilation, keys unchanged) to
**"Lighting Launcher"** / **"Open Lighting menu"**, both bundled copies re-hashed, and the HUD page
text in the launcher updated to match. Nothing else in the jar changed.

## 0.5.1 — Java: stop dead-ending the user

You hit this on a real Windows install: **Logs & Diagnostics said "No Java 21+ runtime found"** for
`1.21.11-fabric-0.20.1`, and the only way forward was to leave the page, find FPS Center → Java and
press a download button. Three separate defects were behind that.

### 1. Play now installs the runtime it needs
`src/minecraft/launch.ts` threw `No Java 21+ runtime found…` and stopped. Every piece needed to fix
it already existed (`provisionJava`, Adoptium lookup, SHA-256 verification) — it just was not wired
into the launch path. `LaunchService` now takes an `ensureJava` dependency: when no runtime satisfies
the version's requirement (or a pinned runtime is too old), it downloads the managed Temurin build,
re-detects, and continues the launch. A failed download still produces a real error naming the cause
and pointing at FPS Center → Java.

### 2. "Re-analyse" now actually re-detects Java
`diagnostics:analyze` read `systemInfo()`, which returns the *cached* snapshot and, when the cache was
empty, a hardcoded `javaRuntimes: []`. So the report could claim "Detected: none" even when a runtime
had just been downloaded. The channel now refreshes the system snapshot first, `java:provision`
invalidates the cache, and `diagExport` does the same — the header's **Java** field and every finding
come from a fresh probe.

### 3. Findings carry a one-click fix
`DiagnosticsFinding` gained an optional `action`. The Java finding now renders a **Download Java 21**
button directly in Logs & Diagnostics, which runs the same verified Adoptium download and re-analyses
when it finishes. No more "go to another page and find the button".

### Files touched
`src/minecraft/launch.ts`, `src/main/context.ts` (shared `ensureManagedJava`, `refreshSystem` /
`invalidateSystem` on the context), `src/main/ipc.ts`, `src/diagnostics/DiagnosticsService.ts`,
`src/shared/types.ts` (`DiagnosticAction`), `src/pages/LogsPage.tsx`,
`tests/javaAutoProvision.test.ts` (new).

### Verified for 0.5.1
- `npm run typecheck` — clean.
- `npm test` — **67 passed, 1 skipped** (3 new launch tests: auto-download happens, honest error when
  it cannot, no download when a runtime already exists).
- **Real end-to-end provisioning in this environment:** `provisionJava(21, …)` downloaded
  `OpenJDK21U-jdk_x64_linux_hotspot_21.0.13_9.tar.gz` (198 MB) from Adoptium, the published SHA-256
  matched, it extracted, and `probeJava` reported `Java 21.0.13 (Eclipse Adoptium)`. Re-running
  `detectJavaRuntimes` on that root returned it with `managed: true` — so detection of managed
  runtimes is proven, not assumed.
- `electron-vite build` + `electron-builder --win --dir --x64` — exit 0; packaged boot prints
  `starting Lighting Launcher 0.5.1` → `main window created` → `window ready-to-show, shown` with
  zero IPC errors, and `resources/ag-bridge/ag-bridge.jar` is inside the package.
- `Lighting-Launcher-Setup-0.5.1-win-x64.exe` — 114 MB, SHA-256
  `0950d5c11f2d7a3c46820e3b73f8f7f6d8dcdae56cd7f0a087b943930f40abe2`, listed in `release/SHA256SUMS.txt`.
- **Not verified:** the launch auto-download through the real UI on Windows (no Windows host here),
  and the installer has still not been run on a real Windows machine.

### Housekeeping
`package.json` had lost its `scripts` and `devDependencies` blocks (only the 10 runtime dependencies
survived), which also rewrote `package-lock.json` down to 54 packages. Both were rebuilt from the
repo's own configs — `electron.vite.config.ts`, `vitest.config.ts`, the tsconfigs and both CI
workflows — and `npm install` restores 449 packages. Typecheck, the full test suite, the Electron
build and the installer all run again.

## 0.5.0 — parity pass on a competitor changelog

You pasted FastClient's release notes and asked me to add or fix what applies. Below is the honest
mapping: what was implemented here, and what is deliberately not — with reasons.

### Implemented

| Item from that list | What actually changed |
| --- | --- |
| Fixed opening the Minecraft folder on Windows | `app:open-path` target `game` pointed at the **versions root** (a folder full of instance ids). It now opens the selected instance's real `.minecraft` directory, where `saves/`, `options.txt` and `mods/` live. A separate `instance` target still opens the versions root, the schema is a zod enum, and paths are created before opening. |
| Fixed a false crash report after closing Minecraft | A clean shutdown now wins over the exit code: if the log tail contains `Stopping!` / `Stopping worker threads` / `Saving and pausing game`, the session ends as `exited`, not `crashed`. Previously a non-zero exit after a normal quit raised a scary crash toast. |
| Improved installation with cancellation | New `versions:cancel-install` channel. The installer checks a cancel flag between phases and before every downloaded file, so cancelling stops in seconds. Partial files are kept — restarting the same version resumes rather than re-downloading. A **Cancel** button appears on the progress bar. |
| Added new launcher presets: **Fabric** and **Vulkan** | Two new presets, `fabric-sodium` and `vulkan`, with real `options.txt` values. Both say in their own description that they only write options — they never install Sodium/VulkanMod behind your back. |
| Removed Lite preset | There was no *Lite* preset in Lighting Launcher; nothing to remove. Presets are now Max FPS, Competitive, Balanced, Quality, Fabric + Sodium, Vulkan, Vanilla. |
| Instant random username generation for local accounts | Dice button next to the offline-name field generates a valid 3–16 character name (letters/digits/underscore, never starting with a digit). |
| Last played sorting for profiles, persistent | Sort toggle in the profiles panel: *Last played* or *Name A–Z*, remembered in `localStorage`, with the last-played date shown on each row. |
| Fixed flickering skin previews | The WebGL viewer was rebuilt whenever auto-rotate was toggled (a new context = a visible flash). `autoRotate` is now applied as a property on the existing viewer. |
| HUD shortcuts must not fire while typing | Already guarded (`client.currentScreen == null`), verified in the menu code: the Right Shift handler only opens the menu when no screen is open. |
| Zoom enabled by default, hold C | Already the default in the HUD module set (`zoom` enabled, key `C`). |
| Automatic hide launcher / restore on exit | Already present as *Close launcher when Minecraft starts* + *Reopen launcher when Minecraft exits* in Settings. |

### Not implemented — and why

| Item | Reason |
| --- | --- |
| Partner servers rotating | There is no partner network behind Lighting Launcher. Inventing a list of "partners" would be fake content. |
| Website redesign, launcher↔website sign-in, 2FA authenticator, linked profile management | There is no AG/Lighting website or account service. The optional `backend/` is a local Fastify service you run yourself; it has no sign-in emails, store or 2FA. |
| Linux auto-updates (deb/rpm), Linux packages | No update feed or packaging pipeline for Linux exists. Shipping an updater with no signed feed would be worse than none. |
| Minecraft 26.3 / 26.1.2 support | Those version numbers do not exist in Mojang's manifest format this launcher consumes; the version list is fetched live from Mojang, so whatever real versions exist are listed. Claiming a fictional version would be dishonest. |
| 1.8.9 out of beta, 1.8.9 mod support, 1.8.9 Realms removal | Lighting Launcher installs and launches 1.8.9 through the same Mojang pipeline as any other version; there is no beta channel to graduate. The bundled AG Bridge mod targets 1.20+ (Fabric), not 1.8.9 — and it does not touch Realms at all. |
| FastClient badges in TAB/nametags, store, cosmetics marketplace, Discord banner, Flashback recording | Those are another client's brand, economy and third-party integrations. Nothing of theirs is copied or impersonated here. |
| Friends, live chat, activity, saved messages | Depends on a hosted service that does not exist. The Launcher's Friends panel says so explicitly instead of showing fake users. |
| Resource pack toggles / resource-pack button fixes | Lighting Launcher does not manage resource packs; there is no button to fix. |
| Multi-instance running, reconnect button, motion blur restore | These are in-game client features outside this launcher's scope. Reconnect/motion blur would require gameplay code we do not ship. |
| macOS display fixes, Intel Mac install fixes | There is no macOS build. The project ships Windows x64 and runs from source elsewhere. |
| Skin renaming on cards, continuous rotation on hold | Not done in this pass. Rename exists in the profile editor; rotation on hold is a UI nicety that did not justify another WebGL control path yet. |

### Verified for 0.5.0

- `npm run typecheck` — clean.
- `npm test` — 64 passed, 1 skipped.
- Preset ids validated by the existing performance tests; new presets flow through the same
  `options.txt` writer with timestamped backups.
- Cancellation is cooperative and covered by the install pipeline's existing recovery behaviour
  (partial `.part` files are removed per download; completed files are reused via checksum).
- `electron-vite build` + `electron-builder --win --dir --x64` — exit 0; packaged boot prints
  `starting Lighting Launcher 0.5.0` → `main window created` → `window ready-to-show, shown` with
  zero IPC errors, and `resources/ag-bridge/ag-bridge.jar` is inside the package.
- `Lighting-Launcher-Setup-0.5.0-win-x64.exe` — 114 MB, SHA-256
  `237eb9bf28137711ebc66299740e3c7610227f65b9c10ecb7743902b7f1f5eaa`, listed in
  `release/SHA256SUMS.txt`. Built with `scripts/installer.nsi` (makensis on Linux); the NSIS script
  packages `release/win-unpacked` wholesale, so the jar and asar are inside.
- **Not verified:** the cancel path end to end against a real Mojang download here (needs a full
  ~650 MB fetch); the button and IPC are wired and typechecked. The installer has not been run on a
  real Windows machine — no Wine/Windows host in this environment.

## 0.4.0 — the in-game Right Shift menu actually ships

### The gap in 0.3.0

In 0.3.0 the HUD Editor page was the *designer*, and the Right Shift menu lived in mod source that
had never been compiled — so nothing appeared in game. That is now closed: **AG Bridge is built and
bundled inside the installer.**

### Bridge jar built for real

Built here with Fabric Loom 1.7.4 against Minecraft **1.20.1** (Yarn 1.20.1+build.10, Loader 0.15.11,
Fabric API 0.92.2+1.20.1) on Temurin **17**, Gradle 8.10.2:

- `BUILD SUCCESSFUL` → `ag-bridge-1.0.0.jar` (37.6 kB) containing the entrypoint, HUD renderer,
  menu screen, layout/config classes, the CPS click mixin, `ag-bridge.mixins.json` and a generated
  refmap that maps `doAttack` → `intermediary method_1536` (proof the mixin binds at runtime).
- Compiled against the real mapped Minecraft classes, which caught three genuine API mistakes that
  the earlier "it compiles standalone" check could not: a missing `FrameSampler.Snapshot` qualifier,
  a non-existent `getDebugHud()`, and a wrong sidebar-slot enum. All fixed and rebuilt.
- Build notes for low-memory machines are in `resources/ag-bridge/README.md` (the sandbox has 1.9 GB,
  so the heap is capped and the sources remap is skipped).

### Auto-install into the game

The launcher copies the bundled jar to `<instance>/mods/ag-bridge.jar` for **Fabric/Quilt** instances
on Minecraft 20+, and the resolver now accepts any `ag-bridge*.jar` so a version bump cannot silently
disable the mod.

### Interface: editor vs in-game, made obvious

The HUD Editor now opens with a panel stating that the page is the **designer** and that
**Right Shift** opens the real in-game menu, with the rebind path
(Minecraft → Options → Controls → AG Client) spelled out. The drag canvas footer repeats the hotkey.
A stale "bridge offline" badge was replaced with "bridge idle" — the bridge only reports while the
game is running, so "offline" was misleading.

### Verified

- Fabric build: `BUILD SUCCESSFUL`; jar contents and refmap inspected.
- `npm run typecheck` — clean. `npm test` — 64 passed, 1 skipped.
- Packaged 0.4.0 boot: `starting Lighting Launcher 0.4.0` → `main window created` →
  `window ready-to-show, shown`; jar present at `resources/ag-bridge/ag-bridge.jar` inside the package.
- `Lighting-Launcher-Setup-0.4.0-win-x64.exe` — 114 MB, SHA-256
  `a2eb68f516a4338e9965bc1302d6a3c6a180b89746dfe3033e78745657b9d782`.
- **Not verified:** launching Minecraft with the mod here (no GPU/display in this sandbox) and running
  the installer on Windows. Install a Fabric 1.20.1 instance, launch it, press Right Shift.

## 0.3.0 — Lighting Launcher

Renamed from "AG Client" to **Lighting Launcher** (made by devaru007). The internal package name is
now `lighting-launcher`, the installer and shortcuts are called *Lighting Launcher*, and the app
data folder is `%APPDATA%\lighting-launcher`.

### Rename without losing anyone's setup

Electron derives the data folder from the product name, so a rename would have orphaned every
existing profile, installed version and skin. On first start the launcher copies
`%APPDATA%\ag-client` into the new folder once (`migrateLegacyProfileData`), writes
`migrated-from-ag-client.txt`, and leaves the old folder untouched. Verified end to end.

### Fixed — blank pages (MODS and NEWS showed an empty window)

Two causes, both fixed:

1. **Page transition deadlock.** `<AnimatePresence mode="wait">` keeps the incoming page unmounted
   until the outgoing exit animation completes. Chromium throttles animation frames for unfocused
   or occluded windows, so the callback could be deferred indefinitely and the content area stayed
   empty — exactly the "I clicked MODS and got a black screen" report. Pages now use a CSS-only
   enter animation with no exit phase, which cannot deadlock.
2. **Framer shared-layout projection stalls.** The sidebar's active-bar used a shared `layoutId`,
   which measured every rail item on each navigation. It now uses a plain element with a CSS
   transition. This also fixed a test-suite hang and removes needless work per click.

Added `ErrorBoundary` around page content: a crashing page now explains itself with a retry button
and a link to the logs instead of unmounting the whole UI. *Reduce motion* now genuinely disables
Framer animations via `MotionConfig`.

### Fixed — buttons that appeared to do nothing

Every folder/stop/select/update action was `void api.x()`: a rejected IPC call produced no toast,
no spinner and no error. All user actions now run through `src/renderer/actions.ts`, which sets busy
state and reports success *and* failure. `updatesCheck` also distinguishes "up to date" from
"update feed unreachable" instead of reporting both as current.

### Performance

- **Backdrop stops completely when hidden.** The biome canvas cancels its animation frame on
  `visibilitychange`/`blur` instead of burning frames, so the launcher costs ~0% CPU minimised.
- **Jukebox stops in the background** (new *Pause animations and audio in the background* setting).
- **Installs are faster:** download worker count is configurable (default **12**, up from 8 for
  libraries and 12 for assets); assets run at workers + 2. Set it in Settings → Speed.
- **Installer installs faster:** setup.exe is compressed with zlib instead of solid LZMA.
  Decompression is several times quicker; the file grows 78 MB → 113 MB in exchange. That is the
  deliberate trade for "installs fast".
- Reduced per-click work by removing the shared-layout measurement described above.

### In-game HUD on Right Shift (AG Bridge)

- New `AgMenuScreen`, `AgMenuLayout`, `AgHudConfig`, `AgHudRenderer`, `AgKeybinds` and one
  click-counting mixin. **Right Shift** opens a centred panel over the game: category tabs
  (HUD / Player / Utility / Search), module cards with toggle pills, and Your existing layout.
  The key is rebindable in Minecraft's controls under "AG Client".
- Toggles made in game are written back to the profile's HUD file
  (`-Dag.hud.file=<userData>/hud/<profile>.json`), so the launcher's HUD editor and the in-game
  menu stay in sync.
- Draw cost is deliberately tiny: flat rectangles and short strings only, no textures, no blur, no
  per-frame allocation, skipped entirely while the vanilla HUD is hidden.
- New modules: **Clock**, **Biome**, **Server info**, **Combo counter** (18 total).
- Honest status: the pure-logic classes (`AgHudConfig`, `AgMenuLayout`, `AgClickCounter`) compile
  and pass a 20-assertion self-test with a plain JDK. The Minecraft-facing classes
  (`AgMenuScreen`, `AgHudRenderer`, `AgKeybinds`, the mixin) need the Fabric toolchain and have
  **not** been built into a jar here — run `cd ag-bridge && ./gradlew build` on a machine with the
  Fabric toolchain, then drop the jar in `resources/ag-bridge/`.

### Interface

- **Startup animation** with the new mark and a moving light bar.
- **Interface templates** (Ember / Frost / Venom / Void / Mono) switch the whole accent palette via
  CSS variables; pick them in the scene menu in the title bar and they persist.
- **Jukebox** now has three generated tracks (Quiet Caves, Dusk Drift, Ember Forge) with
  prev/next, plus the existing volume and click-sound controls. Still generated audio only — the
  Minecraft soundtrack is copyrighted and is not bundled or streamed.
- New original logo: hex shield + angular "L" + lightning bolt, green→cyan→orange gradient, used
  in-app and for the window/exe/installer icons.
- Credit **"made by devaru007"** in the title bar, the splash screen and the README licence.

### Note on naming

No "FastClient" or "DanClient" references exist anywhere in this project — nothing to remove.
Lighting Launcher is its own codebase; borrowed names, assets or code from other clients are not
used.

### Verified

- `npm run typecheck` — clean (node, web, test-ui).
- `npm test` — **64 passed, 1 skipped** (10 files).
- Bridge logic: `javac` + 20-assertion self-test passes (config parse/round-trip, toggle, category
  and search filters, layout hit-testing, small-window clamping).
- Packaged app boot: `starting Lighting Launcher 0.3.0` → `main window created` →
  `window ready-to-show, shown`, zero IPC errors; legacy-data migration confirmed.
- `Lighting-Launcher-Setup-0.3.0-win-x64.exe` — 113 MB NSIS installer, SHA-256
  `7662a81a3a827425abd8ee2b59bc708ee01b250591d7e868eec91ee89ed05e16`.
- **Not verified:** running the installer or the app on Windows (build sandbox is Linux), and the
  Fabric jar for the in-game menu.

## 0.2.0 — startup fix + interface release

### Fixed: the installed launcher started but never showed a window

**Symptom:** after installing `Lighting-Launcher-Setup-0.1.0-win-x64.exe`, launching Lighting Launcher did nothing.
Task Manager showed the process; no window appeared; no error dialog.

**Cause:** `src/main/ipc.ts` contained *two* handlers for the `app:open-external` channel — the
original allowlist handler and a second one added in 0.1.0. `ipcMain.handle()` throws when a channel
is registered twice. Registration ran inside `app.whenReady().then(...)`, so that single throw rejected
the whole startup chain *before* `createWindow()` was reached. The main process kept running with zero
windows, which is exactly what "it doesn't open" looks like.

**Fix:**

- One handler per channel. The surviving handler keeps the stricter rule: HTTPS only, exact host
  allowlist (`minecraft.net`, `www.minecraft.net`, `help.minecraft.net`, `status.mojang.com`,
  `modrinth.com`, `github.com`, `api.github.com`, `aka.ms`, `lightinglauncher.local`).
- Registration is now idempotent and fault-tolerant: a duplicate or failing channel is logged and
  skipped instead of killing startup.
- `app.whenReady()` has a `.catch()` that writes a log and shows a native error dialog.
- `uncaughtException` / `unhandledRejection` are captured the same way.
- The window is force-shown after 4 s if `ready-to-show` never fires, and `did-fail-load`,
  `render-process-gone` and renderer console errors are written to the startup log.
- Startup is logged to `%APPDATA%\ag-client\logs\main.log` (`starting …`, `main window created`,
  `window ready-to-show, shown`).
- Regression test `tests/ipc.test.ts` fails the build on duplicate channels, on channels declared in
  the shared contract with no handler, and on channels the preload exposes without a handler. It
  immediately caught a second latent bug (`launch:logs` declared but never implemented — removed).

### Fixed: window icon path

The packaged build resolved the window icon to `resources/resources/icon.png`, which never existed.
`resources/icon.png` and `resources/icon.ico` are now shipped via `extraResources`, and the resolver
checks candidate paths and skips the icon if none exist instead of passing a bad path.

### Added — interface

- **Live biome backdrop** (`src/components/BackgroundFX.tsx`): Cherry Grove, Basalt Deltas, End Void
  and Alpine Ridge, each with a day/dusk/night palette and canvas weather (petals, embers, void
  sparks, snow). Time of day follows the system clock ("Auto") or can be pinned. Layers parallax
  against the pointer. Pauses when the window is hidden and is disabled entirely by *Reduce motion*.
  Picker lives in the title bar.
- **Glassmorphic command center:** every panel now uses a semi-transparent surface with
  `backdrop-filter: blur(22px)`, with a solid fallback via `@supports`. The hero card gets a
  loader-tinted neon edge (cyan for Fabric/Quilt, orange for Forge/NeoForge) and the launch button
  breathes with a soft glow.
- **The Wardrobe** (`src/pages/WardrobePage.tsx`): full-height WebGL inspector with camera zoom,
  studio light intensity, auto-rotate, five stage backgrounds, and apply actions for skins, capes
  and cosmetic presets. Uses the profile's real stored assets.
- **Jukebox** (`src/components/Jukebox.tsx`, `src/renderer/audio.ts`): generated ambient pad plus
  synthesised UI clicks. **No recorded music is bundled or streamed** — the Minecraft soundtrack
  (C418 / Lena Raine) is copyrighted and licensed to Mojang, so AG ships its own synth instead and
  labels it "generated".
- **Game-mode pill** (`src/components/ModePill.tsx`): FPS Booster / PvP Pro / Cinematic above the
  Play button, with a spring-animated highlight. Each maps to a real preset
  (`max-fps` / `competitive` / `quality`) and applies it through the same verified `options.txt`
  writer with a timestamped backup. Cinematic states plainly that shaders additionally need Iris —
  the mode does not install mods or shaders.

### Verified

- `npm run typecheck` — clean (node, web, test-ui projects).
- `npm test` — 64 passed, 1 skipped.
- Packaged `app.asar` booted under Electron: `main window created` → `window ready-to-show, shown`,
  zero IPC errors.
- `Lighting-Launcher-Setup-0.2.0-win-x64.exe` — 78.1 MB NSIS installer, SHA-256
  `547bcf7d3cb201b6c4a3bd991921fd126692b3386fa4602d28714d3865099db9`.
- Not verified: running the installer or the app on Windows itself (build sandbox is Linux).

## 0.1.0 — first Windows preview

Mojang install pipeline, Microsoft device-code sign-in, offline profiles, Skin/Cape/Cosmetics studios,
PvP HUD editor, Modrinth mod manager, performance center, NAS bridge, NSIS packaging.
