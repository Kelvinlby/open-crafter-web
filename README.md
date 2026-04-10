<div align="center">

<img width="607" height="121" alt="open-crafter-webui" src="https://github.com/user-attachments/assets/2e3ad034-01a4-4e3f-8ef0-9e8dbc2c801a" />

</br>
</br>

[![mod](https://img.shields.io/static/v1?label=Github&message=open-crafter&color=white&logo=github&style=for-the-badge)](https://github.com/Kelvinlby/open-crafter)
[![discord](https://img.shields.io/static/v1?label=Discord&message=Chat&color=7289DA&logo=discord&style=for-the-badge)](https://discord.gg/FjRpnp3S8z)

<img width="712" height="532" alt="home-widget" src="https://github.com/user-attachments/assets/6ba6726e-c0f5-4e24-9c92-6df4cfc2a39d" />

</div>

# Architecture overview

Open Crafter has three components:

- **Mod** — Fabric client mod. Runs inside Minecraft, hosts a Unix domain socket server, and exposes game state/actions to the engine via JSON-RPC.
- **Engine** — Rust backend that drives the AI model and issues commands over the socket.
- **Web UI** (this repo) — Frontend panel, opened in-game via the mod's embedded browser.

# Tech stack

- React 19, React Router 7, TypeScript
- Vite 8 (dev server + bundler)
- Material Design 3 — CSS custom properties, dark theme

# Project structure

```
src/
├── pages/        # Model, Runtime, SkillTool, API, Chat
├── components/   # NavRail, ListPanel, Snackbar, form inputs (TextField, Select, Slider, Switch…)
├── hooks/
│   ├── useBackendData.ts   # fetch on mount, lazy tab loads, 500 ms polling, 300 ms debounced saves
│   ├── useModelStatus.ts   # load/unload state machine
│   └── useMockData.ts      # dev mock data
├── api.ts        # endpoint constants, getJson / postJson helpers
└── types/        # shared TypeScript types
```

# Dev setup

```bash
npm install
npm run dev      # localhost:5173 — /api/* proxied to http://127.0.0.1:6121
npm run build    # output → dist/
npm run lint
```

# Notes

- The Engine serves `dist/` directly in production.
- Page zoom is fixed at 1.2× for in-game browser rendering.
