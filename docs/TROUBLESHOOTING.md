# Troubleshooting

Every item below maps to a real signature the diagnostics module recognises. **Logs & Diagnostics →
Analysis** runs these automatically; the table is for manual triage.

## Launcher

| Symptom | Cause | Fix |
| --- | --- | --- |
| "This action needs the Lighting Launcher desktop app" | You are viewing the UI in a browser | Run `npm run dev` or install the app |
| Microsoft sign-in: "needs an Azure application (client) ID" | No client ID configured | Settings → Microsoft sign-in, or `AG_MS_CLIENT_ID` |
| Sign-in: "does not own Minecraft: Java Edition" | Account lacks entitlement | Buy the game, or use an offline profile for single-player |
| Sign-in: XErr 2148916233 | No Xbox profile on the account | Sign in once at xbox.com, then retry |
| Sign-in: XErr 2148916238 | Child account | A family organiser must add the account to Microsoft Family |
| Version list empty | No network and no cached manifest | Connect once; the manifest is cached for offline use afterwards |

## Install / repair

| Symptom | Cause | Fix |
| --- | --- | --- |
| "Checksum mismatch" during install | Interrupted download or proxy altering content | Retry; Lighting Launcher re-downloads only broken files |
| Verification fails after install | Network flake mid-install | Versions → **Verify** (auto-repairs missing/corrupt files) |
| "No Java 17+ runtime found" | No JDK installed | FPS Center → Download Java 17/21 |
| Forge install fails | Installer needs network / correct JDK | Check `versions/<id>/forge-installer.log`; ensure Java 17 (Forge) or 21 (NeoForge) |

## Launch

| Symptom | Cause | Fix |
| --- | --- | --- |
| "client.jar is missing" | Partial install | Versions → Verify |
| Crash: `UnsupportedClassVersionError` | Wrong Java | Set the Java runtime for that version |
| Crash: `OutOfMemoryError: Java heap space` | Allocation too small for mods/RD | Raise memory by 1024 MB or reduce render distance |
| Crash: `GLFW error` / `Failed to create window` | GPU driver / remote desktop | Update GPU driver from vendor; avoid RDP for gaming |
| Crash: `NoClassDefFoundError` / `Could not find main class` | Missing libraries | Verify & Repair |
| "Unrecognized VM option" | Obsolete flag in custom args | Lighting Launcher strips common ones; clear custom JVM args |
| Exit code 1 with no log | Often a mod loader error before logging | Check the instance's `logs/latest.log` |

## Mods

| Symptom | Cause | Fix |
| --- | --- | --- |
| "No Fabric build supports Minecraft X" | Mod does not target that version | Pick a supported version or a different mod |
| Duplicate mod id | Two jars of the same mod | Mod Manager → Conflicts lists both; delete the older |
| Missing dependency | Required mod absent | Conflict report names it; install it from Browse |
| Wrong loader | Forge jar in a Fabric instance | Move it to a matching instance |
| Mixin apply failed | Two mods transform the same class | Remove the newest mod, re-add one at a time |

## Cosmetics

| Symptom | Cause | Fix |
| --- | --- | --- |
| Skin imported but in-game it is default | Instance is not a supported AG Bridge target, or Fabric API is missing | Skins show in-game on **Minecraft 1.20.1 and 1.21.11** with **Fabric (or Quilt) + Fabric API**; launch from Lighting Launcher (it installs the matching bridge build automatically) and look for `AG local skin applied` in the game log |
| Other players cannot see my cape | Expected: local cosmetics are local | Use the relay plugin + AG Bridge on both sides |
| "Skins must be 64x64 or 64x32" | Wrong dimensions | Resize; the file is rejected before storage |
| 3D preview says "needs WebGL" | No hardware acceleration | Enable GPU acceleration for the app |

## Performance

| Symptom | Cause | Fix |
| --- | --- | --- |
| FPS Center shows `—` | Bridge missing or telemetry disabled | Install AG Bridge; enable telemetry in Settings |
| Presets have no effect | Game was already running | Options are read at startup — restart the game |
| FPS got worse after a preset | Preset not right for your hardware | Try `Balanced`; verify with a benchmark on the same world |
| Launcher itself feels heavy | Motion effects | Settings → Reduce interface motion |

## Getting help / reporting

1. **Logs & Diagnostics → Export report** (writes JSON with findings, Java, memory and log tail).
2. Attach your instance `logs/latest.log` and any `crash-reports/*.txt`.
3. Never share `accounts/tokens.enc` — it holds your session tokens.
