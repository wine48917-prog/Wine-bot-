# WINE BOT

WINE BOT is a WhatsApp bot with a private web control panel. Developed by VELOR; rights reserved to WINE.

## Requirements
- Node.js 20+
- A persistent Node.js host (Railway or a VPS). Do not deploy the WhatsApp socket as a Vercel serverless function.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set a long random `ADMIN_TOKEN`.
3. `npm start`
4. Open `http://localhost:3000`, enter the admin token, then pair the WhatsApp number.

## Environment variables
See `.env.example`. Keep `.env` and `data/session` private. Never commit WhatsApp credentials or the admin token.

## Access policy
- Public: `.menu`, `.ping`, `.info`, `.help`.
- Developer-only: `.status` / `.حالة` and reserved management commands.
- Developer number is configured through `DEVELOPER_NUMBER`.

## Deployment
Deploy as a persistent Railway service and attach a persistent volume at `/app/data` so WhatsApp authentication survives restarts. The service serves the control panel and runs the WhatsApp connection in the same Node process.

The dashboard API requires `Authorization: Bearer <ADMIN_TOKEN>`. Do not expose this token in public frontend code or commit it to Git.