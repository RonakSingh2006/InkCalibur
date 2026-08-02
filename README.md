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
    <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" alt="Docker" />
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#future-features">Future Features</a> •
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
    <td>🌍 <b>Public & Private Rooms</b></td>
    <td>Create public rooms for open collaboration or password-protected private rooms</td>
  </tr>
  <tr>
    <td>🔗 <b>Invite Links</b></td>
    <td>Share unique invite links (e.g., <code>/join/kF82dQmPa91Z</code>) for instant room access</td>
  </tr>
  <tr>
    <td>🔐 <b>Email OTP Authentication</b></td>
    <td>Secure signup with email verification via 6-digit OTP (5 min expiry) and email/username signin</td>
  </tr>
  <tr>
    <td>🛡️ <b>Route Protection</b></td>
    <td>Unauthenticated users are redirected to the home page via Next.js middleware</td>
  </tr>
  <tr>
    <td>🎨 <b>Versatile Tools</b></td>
    <td>Rectangle, circle, ellipse, line, pencil, eraser, select & move, pan & zoom</td>
  </tr>
  <tr>
    <td>✏️ <b>Stroke Control</b></td>
    <td>Adjustable stroke width (1–12px) and stroke color for every shape</td>
  </tr>
  <tr>
    <td>📥 <b>Export & Clear</b></td>
    <td>Download canvas as PNG image or clear the canvas to start fresh</td>
  </tr>
  <tr>
    <td>🔍 <b>Room Search</b></td>
    <td>Search rooms by name, date, year, or month with debounced search</td>
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

<h2 id="future-features">🔮 Future Features</h2>

| Feature | Description |
|---------|-------------|
| ↩️ <b>Undo / Redo</b> | Step backward and forward through your drawing history for easy corrections |
| 📐 <b>Shape Resize</b> | Resize and scale shapes after drawing them with drag handles |
| ⌨️ <b>Text Tool</b> | Add text annotations, labels, and notes directly onto the canvas |
| 🔑 <b>OAuth Authentication</b> | Sign in with Google, GitHub, and other third-party providers |
| 🤖 <b>AI-Based Drawing</b> | AI-assisted drawing suggestions, auto-complete shapes, and intelligent diagram generation |

---

<h2 id="architecture">🏗️ Architecture</h2>

### Monorepo Structure

```mermaid
graph TD
    subgraph InkCalibur["InkCalibur Monorepo"]
        subgraph Apps["apps/"]
            FE["frontend<br/>Next.js client<br/>(port 3000)"]
            HTTP["http-server<br/>REST API - Express<br/>(port 3001)"]
            WS["ws-server<br/>WebSocket server<br/>(port 8080)"]
        end

        subgraph Packages["packages/"]
            DB["db<br/>Prisma schema, migrations, client"]
            COMMON["common<br/>Shared types, Zod schemas, config"]
            BC["backend-common<br/>Shared backend utilities"]
            UI["ui<br/>Shared React components"]
            ESLINT["eslint-config<br/>Centralized ESLint config"]
            TS["typescript-config<br/>Shared TS config"]
        end

        subgraph Docker["docker/"]
            DF["Dockerfiles for each service"]
            DC["docker-compose.yml<br/>Local development"]
            DCP["docker-compose.prod.yml<br/>Production (EC2)"]
        end
    end

    FE --> COMMON
    HTTP --> COMMON
    HTTP --> BC
    WS --> BC
    HTTP --> DB
    WS --> DB
    FE --> UI
    FE --> ESLINT
    HTTP --> ESLINT
    WS --> ESLINT
    FE --> TS
    HTTP --> TS
    WS --> TS
```

### Data Flow

```mermaid
flowchart LR
    subgraph Client["Browser"]
        FE["Next.js Frontend<br/>(port 3000)"]
    end

    subgraph Servers["Backend Servers"]
        HTTP["http-server<br/>REST API<br/>(port 3001)"]
        WS["ws-server<br/>WebSocket<br/>(port 8080)"]
    end

    subgraph Database["Database"]
        PG[("PostgreSQL<br/>(Neon)")]
    end

    FE -- "HTTP / REST" --> HTTP
    FE -- "WebSocket" --> WS
    HTTP -- "Prisma ORM" --> PG
    WS -- "Prisma ORM" --> PG
```

---

<h2 id="tech-stack">🛠️ Tech Stack</h2>

| Category | Technology |
|----------|-----------|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **Backend API** | Express 5, JWT, bcryptjs, Resend (email) |
| **WebSocket** | ws (Node.js WebSocket library) |
| **Database** | PostgreSQL 16 (Neon) |
| **ORM** | Prisma 7 (with Prisma Adapter for PostgreSQL) |
| **Language** | TypeScript 5.9 (strict mode) |
| **Containerization** | Docker, Docker Compose |
| **CI/CD** | GitHub Actions |
| **Deployment** | GitHub Actions → Docker Hub → EC2 |

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
# Edit .env with your DATABASE_URL and RESEND_API_KEY
#   DATABASE_URL=postgresql://user:password@host:5432/dbname
#   RESEND_API_KEY=re_your_resend_api_key

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

InkCalibur uses a fully automated **CI/CD pipeline** powered by **GitHub Actions**. When you push code to the `main` branch, GitHub Actions builds the Docker images on GitHub's servers, pushes them to Docker Hub, and then deploys them to your EC2 instance — no manual steps required.

### Architecture

```mermaid
flowchart LR
    subgraph Dev["Developer"]
        PUSH["git push origin main"]
    end

    subgraph GH["GitHub"]
        REPO["GitHub Repository"]
        ACTIONS["GitHub Actions<br/>(runs on GitHub servers)"]
        BUILD["Build Docker Images"]
        PUSHIMG["Push Images to Docker Hub"]
    end

    subgraph Hub["Docker Hub"]
        IMAGES["ronaksingh2006/inkcalibur-<br/>{http-server, ws-server, frontend}"]
    end

    subgraph EC2["EC2 Production"]
        PULL["docker pull Images"]
        COMPOSE["docker compose up -d<br/>(docker-compose.prod.yml)"]
    end

    PUSH --> REPO
    REPO -- "push to main<br/>triggers workflow" --> ACTIONS
    ACTIONS --> BUILD
    BUILD --> PUSHIMG
    PUSHIMG -- "docker push" --> IMAGES
    IMAGES -- "docker pull" --> PULL
    PULL --> COMPOSE
```

### How It Works

1. **Push to GitHub** — You push your code to the `main` branch of the repository.
2. **GitHub Actions triggers** — The workflow (`.github/workflows/deploy.yml`) runs automatically on GitHub's servers.
3. **Build & Push** — GitHub Actions logs into Docker Hub, builds the three Docker images (`http-server`, `ws-server`, `frontend`), and pushes them to Docker Hub.
4. **Deploy to EC2** — GitHub Actions SSHes into your EC2 instance, pulls the latest images, and runs `docker compose up -d` using `docker-compose.prod.yml`.

### Required GitHub Secrets

The workflow requires the following secrets to be configured in your GitHub repository (**Settings → Secrets and variables → Actions**):

| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub password or access token |
| `NEXT_PUBLIC_BACKEND_URL` | Public URL of the HTTP API (e.g., `https://api.yourdomain.com`) |
| `NEXT_PUBLIC_WS_URL` | Public WebSocket URL (e.g., `wss://ws.yourdomain.com`) |
| `EC2_HOST` | Public IP or hostname of your EC2 instance |
| `EC2_USER` | SSH username for EC2 (e.g., `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key used to connect to EC2 |
| `DATABASE_URL` | PostgreSQL connection string |
| `RESEND_API_KEY` | Resend API key for sending emails |

### One-Time EC2 Setup

Before the first deployment, your EC2 instance needs:

- **Docker** and **Docker Compose** installed
- The `docker-compose.prod.yml` file (fetched automatically by the workflow from the repo)
- The `.env` file with `DATABASE_URL` and `RESEND_API_KEY` (written automatically by the workflow)

After this one-time setup, every push to `main` will automatically build, push, and deploy the latest version.

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
| POST | `/create-otp` | Send a 6-digit OTP to an email address |
| POST | `/verify-otp` | Verify the OTP sent to an email address |
| POST | `/signup` | Create a new user (with email, name, username, password) |
| POST | `/signin` | Sign in with email or username and receive JWT |
| GET | `/me` | Get current user's details |
| GET | `/rooms` | Get all rooms |
| GET | `/rooms/search?q=` | Search rooms by name or date |
| POST | `/room` | Create a new room (with visibility & password) |
| POST | `/join` | Join a room by invite code (with password for private rooms) |
| GET | `/room/invite/:inviteCode` | Get room info (slug & visibility) by invite code |
| DELETE | `/room/:slug` | Delete a room |
| GET | `/roomId/:slug` | Get room ID & invite code by slug |
| GET | `/shapes/:slug` | Get shapes for a room |

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