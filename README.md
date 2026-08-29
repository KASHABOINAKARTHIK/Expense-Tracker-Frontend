# Track My Expenses — Private Frontend

React + Vite frontend for the Track My Expenses Spring Boot API.

## Private single-user authentication

The app requires the configured owner username and password. After login, the backend returns a short-lived JWT. The frontend keeps the token in `sessionStorage` and attaches it to every protected API request.

Closing the browser session removes the token. An expired/invalid token automatically sends the user back to `/login`.

## Setup

```bash
npm install
```

Create `.env` from `.env.example` and set:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the app:

```bash
npm run dev
```

The Spring Boot backend must have its security/database environment variables configured. See the backend `SECURITY_SETUP.md`.

## Production

Set `VITE_API_BASE_URL` to the public HTTPS backend URL ending in `/api`, then build with:

```bash
npm run build
```

For Vercel, set `VITE_API_BASE_URL` as a Production environment variable and redeploy after changing it.

Never put database credentials, `APP_PASSWORD_HASH`, or `JWT_SECRET` in this frontend project. Vite variables prefixed with `VITE_` are exposed to the browser.
