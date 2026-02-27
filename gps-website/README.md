# CRESTECH GPS Website

This project is a Vite + React frontend with a small PHP/MySQL backend for authentication, fleet data, geofences, reports, billing, audit logs, and profile management.

## What Changed

- Real token-based auth replaced the demo-only in-memory login flow.
- The PHP backend now exposes a single API surface at `backend/api.php`.
- Dashboard, live map, geofences, reports, admin billing, admin audit log, admin user detail, and profile pages now read from backend data.
- Password reset now generates real reset tokens and supports a reset form.
- Backend schema bootstrap and seed data run automatically on the first API request.

## Local Setup

1. Create the database and user.
   - Use `backend/create_db.php`, or run the SQL in `backend/local_setup.sql`.
2. Copy values from `.env.example`.
   - Frontend values belong in a Vite `.env` file.
   - Backend values must be set in the environment your PHP server uses.
3. Serve the PHP backend from a URL that exposes `gps-website/backend/api.php`.
   - Default frontend config expects `http://localhost/gps-website/backend/api.php`.
4. Start the frontend:

```bash
npm install
npm run dev
```

5. Open the Vite app at `http://localhost:5173`.

## Seed Accounts

- User: `user@crestech.co.tz` / `user123`
- Admin: `admin@crestech.co.tz` / `admin123`

The backend creates these automatically if they do not already exist.

## Useful Commands

```bash
npm run typecheck
npm test
```

## Notes

- The backend now supports CORS through `GPS_FRONTEND_ORIGIN`.
- Password reset emails attempt to use PHP `mail()`. In local development, the reset link is also returned in the API response when `GPS_DEBUG_EXPOSE_RESET_TOKEN=1`.
- The live map and geofence pages use OpenStreetMap embeds, so they do not require an extra frontend map package.
