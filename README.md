<h1 align="center">Open Crafter Web UI</h1>
<h3 align="center">Web UI panel for Open Crafter.</h3>

<div align="center">

[![mod](https://img.shields.io/static/v1?label=Github&message=open-crafter&color=white&logo=github&style=for-the-badge)](https://github.com/Kelvinlby/open-crafter)
[![discord](https://img.shields.io/static/v1?label=Discord&message=Chat&color=7289DA&logo=discord&style=for-the-badge)](https://discord.gg/FjRpnp3S8z)

<img width="712" height="532" alt="home-widget" src="https://github.com/user-attachments/assets/6ba6726e-c0f5-4e24-9c92-6df4cfc2a39d" />

</div>

# Architecture overview

Open Crafter has three components:

- **Mod** — Fabric client mod. Runs inside Minecraft, hosts a Unix domain socket server, and exposes game state/actions to the engine via JSON-RPC.
- **Engine** — Rust backend that drives the AI model and issues commands over the socket.
- **Web UI** (this repo) — Frontend panel, opened in-game via the mod's embedded browser.
