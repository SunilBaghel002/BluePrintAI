# BlueprintAI — Collaborative AI System Architecture Platform

BlueprintAI is a modern, real-time collaborative system architecture platform built for developers, solutions architects, and engineering teams. It enables teams to visually design, communicate, and generate SaaS application architecture diagrams either manually on an interactive canvas, using AI natural-language prompts, or from curated starter templates.

![BlueprintAI Canvas](/context/blueprint-hero-preview.png)

---

## 🚀 Key Features

### 🎨 Pitch-Black Collaborative Canvas
- **Full Viewport Canvas**: 100% full-screen pitch-black viewport (`#000000`) with a subtle high-contrast dot grid (`#33333A`).
- **Floating Glassmorphic Overlay Sidebars**: Floating Project Sidebar and AI Copilot sidebars with sleek dark glassmorphism (`backdrop-blur-md`).
- **6 Shape Primitives**:
  - **CSS Shapes**: Rectangle, Pill, Circle.
  - **Vector SVG Shapes**: Diamond, Hexagon, Cylinder (scalable `vectorEffect="non-scaling-stroke"`).
- **Interactive Drag Preview**: Real-time shape ghost preview attached to cursor when dragging shapes from the bottom toolbar onto the canvas.

### 🔌 Multi-Directional Port Connections
- **4 Connection Ports Per Shape**: Top, Right, Bottom, and Left ports on every node shape.
- **Bi-Directional Line Routing**: Connect any port on any shape to any port on another shape with smooth, animated teal edges (`#14B8A6`).

### 👥 Real-Time Multiplayer Collaboration
- **Liveblocks Realtime Rooms**: Collaborative state synced instantly across browsers using Liveblocks.
- **Live Cursors & Presence**: Real-time multiplayer cursor tracking with user name tags and deterministic color coding.
- **Role-Based Permissions**: Project owner and collaborator access checks for room joining and editing.

### 🔒 Enterprise Auth & Persistence
- **Clerk Authentication**: Seamless sign-in via GitHub, Google, or email magic link with customizable dark themes.
- **Decoupled Architecture**: Project metadata and access control persisted in PostgreSQL via Prisma ORM; high-frequency canvas state isolated in Liveblocks.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Framework** | Next.js 16+ App Router (Turbopack) |
| **Language** | TypeScript (Strict Mode) |
| **Canvas Engine** | `@xyflow/react` (React Flow v12) |
| **Realtime Sync** | Liveblocks (`@liveblocks/react-flow`, `@liveblocks/node`) |
| **Database & ORM** | PostgreSQL via Prisma ORM (`@prisma/client`) |
| **Authentication** | Clerk Auth (`@clerk/nextjs`) |
| **Styling** | Tailwind CSS + Blueprint Dark System Variables |
| **Icons & UI** | Lucide React, Radix UI Primitives |
| **Validation** | Zod |

---

## 📁 Project Structure

```text
BlueprintAI/
├── app/
│   ├── api/
│   │   ├── liveblocks-auth/        # Liveblocks room token authorization API
│   │   └── projects/               # REST API endpoints for project CRUD & collaborators
│   ├── editor/
│   │   ├── page.tsx                # Editor Home dashboard
│   │   └── [roomId]/page.tsx       # Full-screen workspace room route
│   ├── sign-in/                    # Clerk sign-in page
│   ├── sign-up/                    # Clerk sign-up page
│   └── globals.css                 # Blueprint design tokens & React Flow overrides
├── components/
│   ├── canvas/
│   │   ├── base-canvas.tsx         # React Flow canvas with live presence & drag preview
│   │   ├── canvas-node.tsx         # 6 Shape renderers & 4-port handle connections
│   │   ├── canvas-room.tsx         # Liveblocks room provider & suspense wrapper
│   │   └── shape-toolbar.tsx       # Floating bottom shape drag toolbar
│   └── editor/
│       ├── editor-navbar.tsx       # Top workspace navigation bar
│       ├── project-sidebar.tsx      # Floating left project drawer
│       └── share-dialog.tsx        # Collaborator invite & link copy modal
├── lib/
│   ├── liveblocks.ts               # Cached Liveblocks node client & color utilities
│   ├── prisma.ts                   # Cached Prisma Client instance singleton
│   └── project-access.ts           # Project ownership & collaborator security guards
├── prisma/
│   ├── schema.prisma               # Main Prisma schema file
│   └── models/
│       └── project.prisma          # Project & ProjectCollaborator data models
├── types/
│   └── canvas.ts                   # Node, Edge, and Shape configuration interfaces
└── liveblocks.config.ts            # Liveblocks Presence & UserMeta type definitions
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **npm** or **pnpm**
- **PostgreSQL Database** (e.g. Aiven, Neon, Supabase, or local)
- **Clerk Account** (for authentication API keys)
- **Liveblocks Account** (for real-time collaboration API keys)

### 2. Environment Setup
Create a `.env.local` file in the root directory and configure the required environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Liveblocks Realtime Collaboration
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=pk_dev_...
LIVEBLOCKS_SECRET_KEY=sk_...

# PostgreSQL Database Connection (Prisma)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=verify-full"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup & Migration
Generate the Prisma Client and run database migrations:
```bash
npx prisma generate
npx prisma migrate dev --name init_projects
```

### 5. Run Development Server
Start the Next.js development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 How to Use BlueprintAI

1. **Sign In**: Launch the app and sign in using your Clerk credentials.
2. **Create a Project**: Click **New Project** on the dashboard or left sidebar to create a new canvas workspace.
3. **Add Shapes to Canvas**:
   - Drag any of the 6 shapes (**Rectangle**, **Diamond**, **Circle**, **Pill**, **Cylinder**, **Hexagon**) from the bottom **SHAPES** toolbar.
   - As you drag across the canvas, a ghost preview tracks your cursor to show exact placement.
4. **Connect Nodes**:
   - Hover over any of the 4 teal connection ports (**Top**, **Right**, **Bottom**, **Left**) on a shape node.
   - Drag a connection line to any port on another shape node to create an animated edge.
5. **Realtime Multiplayer**:
   - Click the **Share** button in the top navigation bar to copy the project room link or invite team members.
   - Collaborators joining the room see real-time cursor movements, node creation, and shape position changes live.

---

## 🧪 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| **Development** | `npm run dev` | Starts the Next.js Turbopack dev server at `localhost:3000` |
| **Production Build** | `npm run build` | Builds the optimized Next.js app and checks TypeScript strict mode |
| **Production Start** | `npm run start` | Serves the production build locally |
| **Linting** | `npm run lint` | Runs Next.js ESLint rules across all codebase files |
| **Prisma Studio** | `npx prisma studio` | Opens interactive database GUI at `localhost:5555` |

---

## 📄 License
MIT License © BlueprintAI Team
