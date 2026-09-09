# Track My Expenses — Frontend

React + Vite frontend matched to the current Track My Expenses Spring Boot API.

## Backend endpoints integrated

### Authentication
- `POST /api/auth/register` — create an account
- `POST /api/auth/verify-otp` — verify registration OTP
- `POST /api/auth/resend-otp` — resend registration OTP
- `POST /api/auth/login` — login with email and password
- `POST /api/auth/forgot-password` — request password reset OTP
- `POST /api/auth/reset-password` — reset password with OTP
- `POST /api/auth/change-password` — change password while authenticated

### User
- `GET /api/users/me` — load the authenticated user's profile

### Expenses
- `POST /api/expenses`
- `GET /api/expenses/{id}`
- `GET /api/expenses`
- `PUT /api/expenses/{id}`
- `DELETE /api/expenses/{id}`
- `GET /api/expenses/summary`
- `GET /api/expenses/total`

## Authentication behavior

The backend returns a JWT from login with `token`, `tokenType`, and `expiresInMs`. The frontend stores the token in `localStorage` and attaches it as:

`Authorization: Bearer <token>`

The frontend also stores the server-provided expiration time locally. When the JWT expires, the user is signed out and returned to the login page with an expiration message.

The frontend does not attempt to refresh or extend the JWT because the current backend does not expose a refresh-token endpoint.

## Local setup

```bash
npm install
npm run dev
```

Create `.env` from `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Vercel deployment

Set this Vercel environment variable for the Production environment:

```env
VITE_API_BASE_URL=https://YOUR-RAILWAY-BACKEND-DOMAIN/api
```

Then create a new deployment. Vite exposes `VITE_` variables to the browser, so never put database passwords, SMTP passwords, JWT secrets, or other backend secrets in this project.

## Important backend requirement

The backend CORS setting must contain the exact Vercel frontend origin, for example:

```text
https://your-frontend.vercel.app
```

Do not add a trailing slash.
