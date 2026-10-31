# Installation & beginner setup

## 1. Install the app

**From a release build (recommended)**

1. Download `Lighting-Launcher-Setup-0.8.0-win-x64.exe` (project root / `release/`).
   Coming from an older version? Install over it; the installer stops the old process, replaces the
   files and refreshes the shortcuts. (0.1.0 never opened — do not use it.)
2. Run it. It installs per user into `%LOCALAPPDATA%\Programs\Lighting Launcher` — no admin prompt.
   Because the build is unsigned, SmartScreen shows “Windows protected your PC” → **More info** → **Run anyway**.
   Verify the file first: `certutil -hashfile Lighting-Launcher-Setup-0.8.0-win-x64.exe SHA256` should match `release/SHA256SUMS.txt`.
3. The installer lets you pick the install folder and creates Start Menu + desktop shortcuts.
4. Uninstall from *Settings → Apps → Lighting Launcher*. Your data in `%APPDATA%\ag-client` is kept unless you
   delete it manually (uninstaller deliberately preserves worlds and cosmetics).

**From source**

```bash
npm install
npm run dev          # development
npm run dist:win:nsis   # build the installer into release/ (works on Linux, no Wine)
```

## 2. Create a profile

* **Offline profile** — instant, no account. Type a name (3–16 characters: letters, numbers, `_`),
  click **Create**. This is the fastest path to single-player and works fully offline.
* **Microsoft account** — requires a (free) Azure client ID, see the README. Needed for online-mode
  servers and official skins.

## 3. Install a Minecraft version

1. Open **Versions**.
2. Pick a release (enable snapshots in Settings for snapshots).
3. Choose a loader:
   * **Vanilla** — no mods.
   * **Fabric** — recommended for performance (Sodium/Iris). No installer jar; metadata only.
   * **Quilt** — Fabric-compatible.
   * **Forge / NeoForge** — uses the official installer jar (it runs locally, that is how Forge works).
4. Click **Install**. Progress shows client jar, libraries, natives and assets.
   Total download for 1.20.1 is roughly 650 MB and is verified as it downloads.

## 4. Pick Java

Lighting Launcher detects installed JDKs and recommends the right one per version:

| Minecraft | Minimum Java | Recommended |
| --- | --- | --- |
| ≤ 1.16.5 | 8 | 8 |
| 1.17.x | 16 | 17 |
| 1.18 – 1.20.4 | 17 | 17 |
| 1.20.5+ / snapshots | 21 | 21 |

If nothing suitable is installed, **FPS Center → Java & memory → Download Java 17/21** fetches Temurin
from Adoptium and verifies Adoptium's published SHA-256.

## 5. Play

**Home → Play**. The launch log streams into the Play page. If the game crashes, the launcher shows the
detected cause and points at **Logs & Diagnostics**.

## 6. Optional extras

| Want | Do this |
| --- | --- |
| Real FPS numbers, 1% lows, benchmarks | Install **AG Bridge** into the instance (see `ag-bridge/README.md`) |
| Better renderer performance | Mod Manager → install **Sodium** (+ **Iris** for shaders) on Fabric |
| Custom skin/cape | Skin Studio / Cape Studio (works offline) |
| PvP HUD | HUD Editor → arrange modules → Save |
| Shared cosmetics on your own server | `ag-server-plugin/` + AG Bridge on clients |

## Where things live

| Path | Contents |
| --- | --- |
| `%APPDATA%\ag-client\data` | Settings, profiles, encrypted tokens, skins, capes, cosmetics, logs |
| `%APPDATA%\ag-client\data\versions\<id>\minecraft` | Per-instance mods, config, saves, screenshots, logs |
| `%APPDATA%\ag-client\data\libraries`, `assets` | Shared Minecraft cache (like the official launcher) |

Back up that one folder to move everything to another PC.
