# Typhoon Prep App

Mobile-first offline app for typhoon preparation — map of nearby clinics,
hospitals, and evacuation centers, weather warnings, and AI-assisted
before/during/after guidance.

Current status: backbone only. Map is working (SQLite -> FastAPI -> React +
Leaflet). Weather and AI features are stubbed and not wired in yet.

## Tech stack

- **Backend:** Python (FastAPI) + SQLite
- **Frontend:** React + TypeScript (Vite) + Leaflet (map)

## Requirements

- Python 3.10+ ([python.org](https://www.python.org/downloads/) — check "Add to PATH" during install)
- Node.js LTS ([nodejs.org](https://nodejs.org) — Windows Installer, defaults are fine)

## How to run it

You need **two terminals** open at the same time — one for the backend, one
for the frontend. Both need to stay running while you use the app.

### 1. Backend (Terminal 1)

```
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Windows users: if `pip` isn't recognized, use `py -m pip install -r requirements.txt`
and `py -m uvicorn app.main:app --reload --port 8000` instead.

Check it worked: open `http://127.0.0.1:8000/api/facilities` in a browser —
you should see JSON data for 3 sample facilities.

### 2. Frontend (Terminal 2 — separate window, don't close Terminal 1)

```
cd frontend
npm install
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

You should see a map centered on Rosario, Batangas with 3 pins (hospital,
evacuation center, clinic). Click a pin to see its details.

## Stopping the servers

Press `Ctrl+C` in each terminal. On Windows, it may ask
`Terminate batch job (Y/N)?` — type `Y` and press Enter.

## Project structure

```
typhoon-app/
├── backend/
│   └── app/
│       ├── main.py       # FastAPI app, seeds sample data, /api/facilities endpoint
│       ├── models.py     # SQL tables (Facility, CachedResponse)
│       ├── schemas.py    # Request/response shapes
│       └── database.py   # SQLite connection
└── frontend/
    └── src/
        ├── App.tsx        # Renders MapPage
        ├── api/client.ts  # Talks to the backend
        ├── pages/MapPage.tsx  # Leaflet map + facility pins
        └── _later/        # Parked features (Before/During/After, weather,
                            # offline caching) — not wired in yet
```

## Next steps

- Wire the `_later/` pages back in (Before/During/After guides, weather page)
- Connect the offline caching (IndexedDB) so the app works with no signal
- Replace stubbed AI endpoints with real calls (prep plan, weather explainer, etc.)
- Make it installable as a PWA (manifest + service worker are scaffolded, untested)
