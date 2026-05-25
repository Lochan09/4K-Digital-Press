# 4K Digital Press — Full Stack

This project is a Vite + React frontend with a simple Express backend for API endpoints.

Quick commands:

- Install dependencies:

```bash
npm install
```

- Run frontend + backend in development (concurrently):

```bash
npm run dev
```

- Build production client and server (server build copies to `server-build`):

```bash
npm run build
```

- Start the built server (after `npm run build`):

```bash
npm start
```

API endpoints:

- `GET /api/content` — returns site content metadata
- `POST /api/orders` — accepts multipart form order submissions (files under `photos`)
- `GET /api/orders` — list submitted orders (in-memory)

Note: This is a simple demo backend intended for local development. For production you should add persistent storage, validation, authentication, and proper file handling.
