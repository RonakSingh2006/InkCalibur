# ✨ InkCalibur

**InkCalibur** is a full-stack, real-time collaborative drawing application inspired by tools like Excalidraw.  
It is built as a **scalable monorepo** using **Turborepo** and **pnpm**, enabling clean separation of concerns, shared tooling, and efficient development workflows.

The project combines a modern **Next.js frontend**, an **Express-based HTTP API**, and a **WebSocket server** for real-time collaboration — all powered by **PostgreSQL** via **Prisma ORM**.

---

## 🧠 Key Features

- 🖊️ Real-time collaborative canvas using WebSockets  
- 👥 Multi-room support with live updates  
- 🔐 Authentication with JWT & bcrypt  
- 📦 Fully type-safe shared contracts (Zod + TypeScript)  
- 🧩 Modular monorepo architecture  
- ⚡ Optimized builds & caching with Turborepo  

---

## 🏗️ Monorepo Structure

The repository is organized into **apps** and **shared packages**, managed via workspace filtering.

```
InkCalibur/
├── apps/
│   ├── frontend/          # Next.js client
│   ├── http-server/       # REST API (Express)
│   └── ws-server/         # WebSocket server
│
├── packages/
│   ├── db/                # Prisma + PostgreSQL
│   ├── common/            # Shared types, Zod schemas, config
│   ├── backend-common/    # Shared backend utilities
│   ├── ui/                # Shared React component library
│   ├── eslint-config/     # Shared ESLint config
│   └── typescript-config/ # Shared TS config
│
├── turbo. json
├── pnpm-workspace.yaml
└── package. json
```

---

## 📦 Applications (`apps/`)

### `frontend`
- **Framework**: Next.js (v16.1.0)
- **UI**: React 19, Tailwind CSS
- **Networking**:  Axios, WebSockets
- **Purpose**: Canvas UI, rooms, authentication, real-time drawing

### `http-server`
- **Framework**: Express.js
- **Auth**: JWT, bcryptjs
- **Purpose**: REST APIs, auth, room management, persistence

### `ws-server`
- **Runtime**: Node.js
- **Library**: `ws`
- **Purpose**: Real-time collaboration, live drawing sync, room broadcasts

---

## 📚 Shared Packages (`packages/`)

- **`@repo/db`**  
  Prisma client, schema, migrations, PostgreSQL connection

- **`@repo/common`**  
  Shared TypeScript types, Zod schemas, constants

- **`@repo/backend-common`**  
  Shared backend utilities (auth helpers, config)

- **`@repo/ui`**  
  Reusable React UI components

- **`@repo/eslint-config`** & **`@repo/typescript-config`**  
  Centralized linting and TypeScript standards

---

## 🛠️ Tech Stack

- **Monorepo**: Turborepo  
- **Package Manager**: pnpm  
- **Frontend**: Next.js, React, Tailwind CSS  
- **Backend**: Node.js, Express, WebSockets  
- **Database**: PostgreSQL  
- **ORM**:  Prisma  
- **Language**:  TypeScript  

---

## 🏁 Getting Started

### Prerequisites

- Node.js **>= 18**
- pnpm (global)

```sh
npm install -g pnpm
```

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/InkCalibur.git
cd InkCalibur
```

2. Install dependencies:

```sh
pnpm install
```

---

## 🚧 Development

### Run all apps (recommended)

```sh
pnpm dev
```

### Run a specific app

```sh
pnpm turbo dev --filter=frontend
pnpm turbo dev --filter=http-server
pnpm turbo dev --filter=ws-server
```

---

## 🗄️ Database Setup

Prisma is managed inside `packages/db`

1. Create a `.env` file (root or `packages/db`) with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/inkcalibur
```

2. Run migrations:

```sh
pnpm turbo run prisma:migrate
```

---

## 📜 Scripts

Available from the root: 

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all apps & packages |
| `pnpm lint` | Run ESLint across repo |
| `pnpm format` | Format with Prettier |
| `pnpm check-types` | TypeScript type checking |

---

## 🚀 Future Enhancements

- 🎨 Advanced shape tools & freehand drawing
- 📡 Presence indicators (cursor, user list)
- 🗂️ Version history & canvas snapshots
- 🔒 Role-based permissions
- 🌐 Cloud deployment & scaling

---

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!   
Feel free to check the [issues page](https://github.com/your-username/InkCalibur/issues).

---

Made with ❤️ by [RonakSingh2006](https://github.com/RonakSingh2006)
```
