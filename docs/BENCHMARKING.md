# FPS benchmarking guide

Lighting Launcher will not print an FPS number it did not measure. Follow these steps to get numbers you can
actually trust.

## 0. Prerequisites

1. Install **AG Bridge** into the instance (`ag-bridge/README.md`, or copy the jar into
   `<instance>/minecraft/mods/`).
2. Launch from Lighting Launcher and join a world. The title bar shows `GAME RUNNING · <n> FPS` once telemetry
   is live, and the FPS Center updates every second.

If the FPS Center shows `—`, the bridge is not reporting: check `logs/latest.log` in the instance for
`AG telemetry reporter armed`.

## 1. Make the test repeatable

| Variable | Fix it |
| --- | --- |
| World & position | Same save, same coordinates, same camera angle |
| Time of day | Same (weather changes lighting cost) |
| Resolution | Same window size; same fullscreen mode |
| Render distance | Set by the preset — record which preset you used |
| Other apps | Close browsers/recorders; check Windows power plan is High Performance |
| Laptop power | Plugged in, or thermal throttling will dominate results |

## 2. Record a baseline (before)

1. Stand still in a representative spot with entities/mobs visible.
2. FPS Center → **Benchmarks** → name it `baseline - balanced`.
3. **Start recording**, wait 20–30 seconds, **Stop & save**.
4. Read the summary: average FPS, min FPS, 1% low, duration.

## 3. Apply an optimisation

Pick **one** change per run so you can attribute the result:

* a renderer preset (`Maximum FPS`, `Competitive PvP`, …), or
* a memory/JVM change, or
* a mod change (Sodium, Lithium, FerriteCore…), or
* a render-distance change.

Presets back up `options.txt` to `options.txt.ag-pre-preset.<timestamp>.bak` before writing, so you can
always diff or restore.

## 4. Record the "after" run

Restart the game (options are read at startup), repeat the exact same scene, and save as
`after - <change>`.

## 5. Interpret honestly

* Compare **average FPS** for throughput and **1% low** for smoothness. A preset can raise average FPS
  while making stutter worse.
* Variability of ±5% between identical runs is normal on Windows. Treat smaller deltas as noise.
* Cap your FPS just under your monitor's refresh rate for stable frame pacing; above the refresh rate
  you pay power/heat for frames you cannot see.
* Frame time (ms) is the more useful number for PvP responsiveness: `1000 / FPS`.

## What the numbers mean in Lighting Launcher

| Field | Definition |
| --- | --- |
| FPS | Frames per second averaged over the ~1 s sample window (from real frame deltas) |
| Frame time | Mean milliseconds between frames in that window |
| 1% low | Mean of the slowest 1% of frames, expressed as FPS |
| Samples | Frames counted in the window (240-frame ring buffer, stalls > 2 s discarded) |
| Source | `ag-bridge` when measured in-game; `manual` for hand-entered values |

## Reading a bad result

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Low FPS, low GPU load | CPU/simulation bound | Reduce simulation distance, entities, chunk updates |
| Low FPS, GPU at 99% | GPU bound | Lower render distance, disable shaders, reduce resolution |
| Stutter spikes | GC / memory pressure | Watch game RAM in FPS Center, adjust `-Xmx`, close other apps |
| FPS drops over minutes | Thermal throttling | Check laptop temps and power plan |
| Good in menu, bad in world | World/entity load | That is expected — always benchmark in-world |
