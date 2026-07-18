<div align="center">
  <h1>✒️ InkCalibur</h1>
  <p><strong>Real-time Collaborative Drawing Application</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1.0-black?style=flat&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Express-5-000000?style=flat&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-7-2D3748?style=flat&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/WebSocket-实时-4FC08D?style=flat" alt="WebSocket" />
    <img src="https://img.shields.io/badge/Turborepo-2.6-EF4444?style=flat&logo=turborepo" alt="Turborepo" />
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

InkCalibur is a full-stack, real-time collaborative drawing application inspired by [Excalidraw](https://excalidraw.com/). It enables multiple users to draw together on a shared canvas in real-time, with support for rooms, shapes, and live synchronization.

Built as a **scalable monorepo** using **Turborepo** and **pnpm**, combining a **Next.js frontend**, an **Express HTTP API**, and a **WebSocket server** — all powered by **PostgreSQL** via **Prisma ORM**.

---

<h2 id="features">🧠 Features</h2>

<table>
  <tr>
    <td>🖊️ <b>Real-time Canvas</b></td>
    <td>Collaborative drawing synchronized via WebSockets in real-time</td>
  </tr>
  <tr>
    <td>👥 <b>Multi-Room Support</b></td>
    <td>Create and join separate drawing rooms with unique slugs</td>
  </tr>
  <tr>
    <td>🔐 <b>Authentication</b></td>
    <td>JWT-based auth with bcrypt password hashing</td>
  </tr>
  <tr>
    <td>📦 <b>Type Safety</b></td>
    <td>End-to-end type safety with Zod schemas and TypeScript</td>
  </tr>
  <tr>
    <td>🧩 <b>Monorepo</b></td>
    <td>Modular architecture with shared packages via Turborepo</td>
  </tr>
</table>

---

<h2 id="architecture">🏗️ Architecture</h2>

### Monorepo Structure

```
InkCalibur/
├── apps/
│   ├── frontend/          # Next.js client (port 3000)
│   ├── http-server/       # REST API - Express (port 3001)
│   └── ws-server/         # WebSocket server (port 8080)
│
├── packages/
│   ├── db/                # Prisma schema, migrations, client
│   ├── common/            # Shared types, Zod schemas, config
│   ├── backend-common/    # Shared backend utilities
│   ├── ui/                # Shared React components
│   ├── eslint-config/     # Centralized ESLint config
│   └── typescript-config/ # Shared TS config
│
├── docker/                # Dockerfiles for each service
├── docker-compose.yml     # Local development compose
├── docker-compose.prod.yml# Production compose (EC2)
```

### Data Flow

```
Browser ──HTTP──> http-server:3001 ──Prisma──> PostgreSQL (Neon)
  │                                                   
  └──────WebSocket──> ws-server:8080 ──Prisma──> PostgreSQL (Neon)
```

---

<h2 id="tech-stack">🛠️ Tech Stack</h2>

| Category | Technology |
|----------|-----------|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend API** | Express 5, JWT, bcryptjs |
| **WebSocket** | ws (Node.js WebSocket library) |
| **Database** | PostgreSQL 16 (Neon) |
| **ORM** | Prisma 7 (with Prisma Adapter for PostgreSQL) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Containerization** | Docker, Docker Compose |
| **Deployment** | Docker Hub → EC2 |

---

<h2 id="getting-started">🏁 Getting Started</h2>

### Prerequisites

- Node.js **>= 18**
- pnpm (install globally)
- PostgreSQL database (local or [Neon](https://neon.tech))

```bash
npm install -g pnpm
```

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/RonakSingh2006/InkCalibur.git
cd InkCalibur

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.prod.example .env
# Edit .env with your DATABASE_URL

# 4. Generate Prisma client & run migrations
pnpm run db:generate
pnpm turbo run prisma:migrate

# 5. Start development
pnpm dev
```

The app will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **WebSocket**: ws://localhost:8080

---

---

## 🚧 Development

```bash
# Run all apps
pnpm dev

# Run specific app
pnpm turbo dev --filter=frontend
pnpm turbo dev --filter=http-server
pnpm turbo dev --filter=ws-server
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps & packages |
| `pnpm lint` | Run ESLint across the repository |
| `pnpm format` | Format code with Prettier |
| `pnpm check-types` | Run TypeScript type checking |
| `pnpm run db:generate` | Generate Prisma client |

---

<h2 id="deployment">🚀 Deployment</h2>

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Docker Hub                          │
│  ronaksingh2006/inkcalibur-{http-server,ws-server,frontend} │
└─────────────────────────────────────────────────────────┘
          ▲ push                    │ pull
          │                         ▼
┌──────────────────┐    ┌──────────────────────┐
│   Local Machine   │    │   EC2 Production      │
│   (Build & Push)  │    │   (Pull & Run)        │
│  docker-compose.yml│   │  docker-compose.prod.yml│
└──────────────────┘    └──────────────────────┘
```

## 🗄️ Database

Prisma is managed inside `packages/db`.

```bash
# Set up database URL
# Create packages/db/.env with:
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# Generate Prisma client
pnpm run db:generate

# Run migrations
pnpm turbo run prisma:migrate
```

---

---

## 🧪 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signup` | Create a new user |
| POST | `/signin` | Sign in and receive JWT |
| GET | `/roomId/:slug` | Get room ID by slug |
| GET | `/chats/:roomId` | Get room chat history |
| GET | `/shapes/:slug` | Get shapes for a room |
| POST | `/room` | Create a new room |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/RonakSingh2006/InkCalibur/issues).

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/RonakSingh2006">RonakSingh2006</a>
</div>