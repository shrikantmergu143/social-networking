# NestJS API

A backend application built with **NestJS, TypeORM, and PostgreSQL**, featuring environment-based database configuration and TypeORM migration management.

## Tech Stack

- **NestJS** — Node.js backend framework
- **TypeScript** — Type-safe development
- **PostgreSQL** — Relational database
- **TypeORM** — Object-relational mapper (ORM)
- **NestJS Config** — Environment variable management

## Prerequisites

Ensure the following tools are installed:

- Node.js (LTS)
- npm
- PostgreSQL
- NestJS CLI

Install the NestJS CLI if needed:

```bash
npm install -g @nestjs/cli
```

## Project Setup

Clone the repository or create a new project:

```bash
nest new nestjs-api
cd nestjs-api
```

Install dependencies:

```bash
npm install @nestjs/config @nestjs/typeorm typeorm pg
npm install -D ts-node tsconfig-paths
```

## Environment Configuration

Create a `.env` file in the project root:

```env
PORT=4000

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=nestjs_db

DB_LOGGING=true
```

Update the values according to your PostgreSQL configuration.

**Security:** Never commit your `.env` file or production credentials. Add `.env` to `.gitignore` and provide a `.env.example` file for other developers.

## Database Setup

Create the PostgreSQL database:

```sql
CREATE DATABASE nestjs_db;
```

Ensure PostgreSQL is running before starting the application.

## Project Structure

```text
nestjs-api/
├── src/
│   ├── config/
│   │   └── database.config.ts
│   ├── database/
│   │   ├── data-source.ts
│   │   └── migrations/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## Database Configuration

The `src/config/database.config.ts` file contains the NestJS TypeORM configuration.

```typescript
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  autoLoadEntities: true,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
});
```

Import the configuration into `app.module.ts` using `ConfigModule.forRoot()` and `TypeOrmModule.forRootAsync()`.

Keep `synchronize: false` and use migrations to manage database schema changes.

## TypeORM Migration Configuration

Create `src/database/data-source.ts`:

```typescript
import 'dotenv/config';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
```

## NPM Scripts

Add the following scripts to the `scripts` section of `package.json`. Merge them with your existing scripts rather than replacing the entire section.

```json
{
  "typeorm": "typeorm-ts-node-commonjs",
  "migration:generate": "npm run typeorm -- migration:generate",
  "migration:run": "npm run typeorm -- migration:run -d src/database/data-source.ts",
  "migration:revert": "npm run typeorm -- migration:revert -d src/database/data-source.ts"
}
```

## Generate a Custom Migration

The migration command accepts a custom directory and migration name.

**Syntax:**

```bash
npm run migration:generate -- <migration-path>/<migration-name> -d src/database/data-source.ts
```

### Examples

Generate a migration inside the users module:

```bash
npm run migration:generate -- src/database/migrations/CreateAuthTables -d src/database/data-source.ts
```

Generate a migration in the central migrations directory:

```bash
npm run migration:generate -- src/database/migrations/AddUserRole -d src/database/data-source.ts
```

Generate a migration for a new module:

```bash
npm run migration:generate -- src/modules/auth/migrations/CreateAuthTables -d src/database/data-source.ts
```

TypeORM generates a timestamped migration file using the supplied path and name, based on detected entity schema changes. Ensure the destination directory exists before running the command.

## Run Migrations

Execute pending migrations:

```bash
npm run migration:run
```

## Revert the Last Migration

```bash
npm run migration:revert
```

Review the migration before executing it, particularly in production environments.

## Start the Application

Development mode:

```bash
npm run start:dev
```

Production build:

```bash
npm run build
npm run start:prod
```

The API runs at:

```text
http://localhost:4000/api
```

The URL assumes `PORT=4000` and `app.setGlobalPrefix('api')` are configured.

## Interactive API Documentation

Start the backend, then open Swagger UI at:

```text
http://localhost:4000/api/docs
```

The OpenAPI JSON is available at `/api/docs-json`. The UI groups routes by module, shows request validation constraints and example payloads, and supports the protected endpoints' JWT bearer authentication. After logging in, copy `accessToken`, choose **Authorize**, and enter the token value. Swagger adds the `Bearer` prefix to requests.

All feature routes except registration and login require `Authorization: Bearer <accessToken>`. Requests are validated with the DTO constraints shown in the schemas. Validation errors return HTTP 400; missing or invalid credentials return HTTP 401; forbidden operations return HTTP 403; missing resources return HTTP 404.

### Example: Login

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "email": "avery@example.com",
  "password": "Example!Pass123"
}
```

The response contains `accessToken`, `tokenType`, `expiresIn`, and a public `user` object. Use the access token as a bearer token for protected routes.

### Example: Create a post

```http
POST /api/posts
Authorization: Bearer <accessToken>
Content-Type: application/json
```

```json
{
  "caption": "A sunny afternoon by the coast.",
  "images": ["https://cdn.example.com/photo.jpg"],
  "tags": ["weekend", "coast"],
  "visibility": "public"
}
```

The response is the created post resource, including its `id`, author, image URLs, tags, visibility, timestamps, and engagement counts. Swagger shows the complete example.

### Image uploads

`POST /api/upload` accepts `multipart/form-data` with a `file` field and an optional `type` field (`profile`, `avatar`, `cover`, `post`, or `story`). Accepted files are JPG, PNG, or WebP images up to 5 MB. The response includes the uploaded file metadata and public URL.

## Development Guidelines

- Keep database credentials in environment variables.
- Use TypeORM migrations instead of automatic schema synchronization.
- Organize features into NestJS modules, controllers, services, DTOs, and entities.
- Validate incoming requests using DTOs and validation pipes.
- Use appropriate exception handling and logging.
- Never commit secrets or production environment files.
- Review migration SQL and test migrations before production deployment.

## Troubleshooting

**Database connection failed**
- Verify PostgreSQL is running.
- Check the database name, username, password, host, and port.
- Confirm that the database exists.

**Migration command fails**
- Verify `src/database/data-source.ts` exists.
- Ensure `typeorm`, `ts-node`, and `tsconfig-paths` are installed.
- Check that your entity files are included in the data source.
- Ensure the migration destination directory exists.

**No changes detected**
- Check that the entity schema has changed.
- Confirm that the data source discovers the entity files.

## License

This project is intended for application development and can be licensed according to your project's requirements.

Generate Module
```
nest g module modules/auth
nest g module modules/users
nest g module modules/profiles
nest g module modules/preferences
nest g module modules/posts
nest g module modules/comments
nest g module modules/stories
nest g module modules/dating
nest g module modules/matches
nest g module modules/conversations
nest g module modules/messages
nest g module modules/notifications
```

```
nest g controller modules/auth --no-spec
nest g controller modules/users --no-spec
nest g controller modules/profiles --no-spec
nest g controller modules/preferences --no-spec
nest g controller modules/posts --no-spec
nest g controller modules/comments --no-spec
nest g controller modules/stories --no-spec
nest g controller modules/dating --no-spec
nest g controller modules/matches --no-spec
nest g controller modules/conversations --no-spec
nest g controller modules/messages --no-spec
nest g controller modules/notifications --no-spec
```


```
nest g service modules/auth --no-spec
nest g service modules/users --no-spec
nest g service modules/profiles --no-spec
nest g service modules/preferences --no-spec
nest g service modules/posts --no-spec
nest g service modules/comments --no-spec
nest g service modules/stories --no-spec
nest g service modules/dating --no-spec
nest g service modules/matches --no-spec
nest g service modules/conversations --no-spec
nest g service modules/messages --no-spec
nest g service modules/notifications --no-spec
```