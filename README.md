# Auto Pool Pump — Pool Monitor

A small full‑stack project that monitors pool and outdoor temperature with an ESP32, displays status on an I2C LCD and reports data to a WebSocket/REST API. Includes a SolidJS website dashboard.

## Components

-   Firmware (ESP32 Arduino sketch): `arduino/arduino.ino`
    Key routines: `setupWiFi`, `setupWebSocket`, `sendSensorDataToWebSocket`, `loop`.
-   Hardware config template: `arduino/config.example.h`
-   Backend API & WebSocket server: `apps/api/src/index.ts` (exports `app`)
-   Frontend (SolidJS + FlyonUI): `apps/website/src/App.tsx` and `apps/website/src/pages/Home.tsx`
-   Monorepo tooling: `package.json` and `turbo.json`

## Features

-   Periodic DS18B20 temperature reads for pool and outdoor sensors.
-   Relay control to activate pump/heater when pool is colder than outdoor beyond threshold (logic in `arduino/arduino.ino`).
-   WebSocket streaming of sensor data and simple JSON commands.
-   Elysia-based API with test client and WebSocket echo/welcome messages (`apps/api/src/index.ts`).
-   Static frontend demo using SolidJS and FlyonUI (`apps/website`).

## Quickstart (dev)

1. Install dependencies (root uses Bun):
    - `bun install`
2. Run services (root):
    - `bun run dev:api` — start API
    - `bun run dev:website` — start frontend
    - or run turbo dev: `bun run dev` (uses `turbo.json`)

API dev script is defined in `apps/api/package.json`. Frontend is a Vite app in `apps/website/package.json`.

## Configure the ESP32

-   Copy `arduino/config.example.h` → `arduino/config.h` and update WiFi, WS host, pins, thresholds.
-   Flash `arduino/arduino.ino` to the ESP32 using Arduino CLI or the Arduino IDE.
-   The firmware expects the WebSocket server at the host/port/path in the config and uses I2C LCD settings from the config file.

## Notes

-   MQTT is not used; communication is via WebSocket and REST.
-   Frontend uses FlyonUI + SolidJS; find UI entry at `apps/website/src/index.tsx`.
-   API server runs on port defined by environment or default 4001 in `apps/api/src/index.ts`.

## License

MIT
