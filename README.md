# AI-LMS Refactor — Base API

> A maintainable, production-ready Node.js + Express REST API used as the backend for an AI-powered LMS (learning management system) refactor.

This repository is a refactored base API implementing authentication, user & student management, courses, enrolments, and email utilities. It uses MongoDB (Mongoose), JWT auth, request validation with Joi, and exposes Swagger API docs.

## Key features

- RESTful routes for users, students, courses and enrolments
- JWT-based authentication (access + refresh tokens)
- Request validation with Joi
- Rate limiting, helmet, CORS, input sanitization
- Email sending via SMTP (nodemailer)
- Swagger/OpenAPI documentation
- PM2 ecosystem for production process management

## Quickstart

Prerequisites

- Node.js 14+ (engines support >=12) or compatible
- MongoDB instance (local or remote)
- pnpm, npm or yarn (pnpm recommended — repo includes pnpm-lock.yaml)

Install

```bash
pnpm install
# or
npm install
```

Create an `.env` file in the project root (example keys below). You can copy `.env.example` if present or create one with:

```
NODE_ENV=development
PORT=3000
MONGODB_URL=mongodb://localhost:27017/ai-lms
MONGODB_TRANSACTIONS=false
JWT_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=30
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=your_user
SMTP_PASSWORD=your_pass
EMAIL_FROM="no-reply@example.com"
```

Run (development)

```bash
pnpm run dev
# or
npm run dev
```

Run (production with pm2)

```bash
pnpm start
# or
npm start
```

Run tests

```bash
pnpm test
# or
npm test
```

Run lint and format

```bash
pnpm run lint
pnpm run lint:fix
pnpm run prettier
pnpm run prettier:fix
```

Docker

Repository provides convenience docker-compose scripts (if present). Example npm scripts:

- `docker:dev` — starts dev compose
- `docker:prod` — starts production compose

## Environment & configuration

Configuration is validated in `src/config/config.js`. Required environment variables include:

- `NODE_ENV` — `development|production|test`
- `PORT` — port the server listens on
- `MONGODB_URL` — base connection string for MongoDB
- `MONGODB_TRANSACTIONS` — boolean to enable transactions
- `JWT_SECRET` and related JWT timing variables
- SMTP variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `EMAIL_FROM`

If the environment validation fails the app will throw on startup with a helpful message.

## API docs

The project uses `swagger-jsdoc` + `swagger-ui-express`. When running the app, open the API docs (by default) at `/docs` or at the path configured in `src/docs/swaggerDef.js`.

## Project structure

- `src/` — application source
  - `config/` — configuration and env validation
  - `controllers/` — request handlers
  - `services/` — business logic and DB access
  - `models/` — Mongoose schemas
  - `routes/` — express routes, versioned under `routes/v1`
  - `middlewares/` — auth, validation, error handling
  - `docs/` — swagger/OpenAPI definitions
- `tests/` — unit and integration tests
- `ecosystem.config.json` — PM2 config for production

Explore the entry point at `src/index.js`.

## Contributing

1. Fork the repo and create a feature branch
2. Run tests and linters locally
3. Open a PR with a clear description and changelog entry

This project includes `lefthook` and lint-staged pre-commit hooks (see `package.json` `prepare` script).

## Troubleshooting

- If the server throws a config validation error, check your `.env` for missing variables.
- For DB connection issues, ensure MongoDB is reachable and the connection string is correct.

## License

This project is licensed under the MIT License. See the `LICENSE` file.

## Maintainer / Contact

If you need help, open an issue in the repository or contact the maintainers listed in `package.json`.
