# Compatibility matrix

## Minecraft versions

| Range | Install | Launch | Notes |
| --- | --- | --- | --- |
| 1.20.5 – current releases | ✅ | ✅ | Java 21. Arguments format `arguments.game/jvm`. |
| 1.18 – 1.20.4 | ✅ | ✅ | Java 17. **Verified live with 1.20.1.** |
| 1.17.x | ✅ | ✅ | Java 16 minimum, 17 recommended. |
| 1.13 – 1.16.5 | ✅ | ✅ | Java 8. Natives handled per-OS. |
| 1.7.10 – 1.12.2 | ✅ | ⚠️ | Legacy asset virtualisation implemented; very old Forge builds are untested. |
| Snapshots | ✅ (enable in Settings) | ⚠️ | Treated as newest Java; behaviour follows Mojang's manifest. |
| Alpha/beta | ⚠️ | ⚠️ | Listed when snapshots are enabled; not a target. |

## Mod loaders

| Loader | Install method | Status |
| --- | --- | --- |
| Fabric | Official meta API profile JSON (no code execution) | ✅ supported |
| Quilt | Quilt meta API profile JSON | ✅ supported |
| Forge | Official installer jar via `--installClient` | ✅ supported (needs Java 17/21) |
| NeoForge | Official installer jar | ✅ supported (needs Java 21) |
| Vanilla | No mods | ✅ supported |

Mods themselves are installed from **Modrinth** with loader + game-version facets, so incompatible
builds are filtered out before download. Local jar metadata is parsed for id, version, dependencies and
declared Minecraft ranges to catch what the API cannot (hand-copied jars, duplicates).

## Performance mods (installed through the Mod Manager, not bundled)

| Loader | Renderer optimisation | Shaders |
| --- | --- | --- |
| Fabric | Sodium | Iris |
| Quilt | Sodium (Fabric build) | Iris |
| Forge | Embeddium / Rubidium | Oculus |
| NeoForge | Embeddium | Iris (NeoForge build) |

Lighting Launcher does not ship or redistribute these mods; it installs them from Modrinth on request, verified
against Modrinth's hashes. **OptiFine is not recommended** — the conflict engine warns when it is mixed
with Sodium/Iris.

## Cosmetics & skins visibility

| | You (AG Bridge) | Other AG Bridge users | Vanilla players |
| --- | --- | --- | --- |
| Local skin | ✅ | ❌ | ❌ |
| Local cape | ✅ | ❌ | ❌ |
| Shared cape (relay plugin) | ✅ | ✅ | ❌ |
| Official Mojang cape | ✅ | ✅ | ✅ (account-owned, not spoofed) |

In-game local cosmetics need the AG Bridge build for your exact Minecraft version — 1.20.1 and
1.21.11 ship today — on Fabric/Quilt with Fabric API installed. The launcher copies the matching
build into the instance at launch and removes a build that does not belong; offline profiles are
fully supported (that is the point: they cannot fetch textures from Mojang). The skin is applied
to your own player entry only, after joining a world, and nothing about it is sent to the server.

## Java runtime

Detection probes every candidate with `java -XshowSettings:properties -version` and parses the real
version. Managed runtimes are Temurin JDKs from Adoptium, SHA-256 verified, stored under
`<data>/runtimes/temurin-<major>`.

## Operating systems

| OS | Launcher | Minecraft |
| --- | --- | --- |
| Windows 10/11 x64 | ✅ primary target (NSIS installer) | ✅ |
| Linux x64 | ⚠️ runs from source (`npm run dev`); installer not produced | ✅ |
| macOS | ⚠️ runs from source | ✅ (needs `-XstartOnFirstThread`, handled by Mojang args) |

Windows is the release target for 0.1.x; the Linux/macOS paths exist because nothing in the code is
Windows-specific, but they are not part of the tested release.
