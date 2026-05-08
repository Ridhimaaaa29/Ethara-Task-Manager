# Ethara Task Manager - Deployment Guide

## Current Status
✅ **Application Build Complete** - Next.js build successful with TypeScript validation passing
✅ **Dev Server Running** - Frontend accessible at http://localhost:3000
✅ **All Routes Created** - 13 API routes + 5 UI pages compiled and ready
✅ **Prisma Schema** - Defined with User, Project, ProjectMember, Task models

⏳ **Pending**: Database setup and Railway deployment

---

## Quick Start - Local Development

### Prerequisites
- Node.js 20.x
- PostgreSQL (or use cloud database)
- npm 10.x

### Setup
```bash
cd E:\ethara

# Install dependencies (already done)
npm install

# Create .env.local with database connection
cp .env.example .env.local

# Update DATABASE_URL in .env.local
# Example: postgresql://user:password@localhost:5432/ethara

# Update AUTH_SECRET with a random string
# openssl rand -base64 32

# Run Prisma migrations
npx prisma migrate dev --name init

# Start dev server
npm run build
npm run dev
```

Dev server: http://localhost:3000

---

## Database Setup Options

### Option 1: Railway (Recommended for Demo)
1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Copy DATABASE_URL from service info
5. Add to .env.local

### Option 2: Render.com Free Tier
1. Go to https://render.com
2. Create free PostgreSQL database
3. Copy external connection string
4. Use as DATABASE_URL

### Option 3: Supabase
1. Go to https://supabase.com
2. Create new project
3. Copy PostgreSQL connection string
4. Use as DATABASE_URL

---

## Environment Variables

**Required in .env.local and production:**
```
DATABASE_URL="postgresql://user:password@host:port/dbname"
AUTH_SECRET="long-random-string-minimum-32-characters"
```

**Auth Secret Generation:**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([byte[]]$(New-Guid).ToByteArray()) + [Convert]::ToBase64String([byte[]]$(New-Guid).ToByteArray())
```

---

## Prisma Setup

### Generate Prisma Client
```bash
npx prisma generate
```

### Run Migrations
```bash
# Create dev database and run migrations
npx prisma migrate dev --name init

# Run migrations on production
npx prisma migrate deploy

# View database with GUI
npx prisma studio
```

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login and get session
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard` - Get user's dashboard data (metrics, projects, tasks)

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create project (admin-only)
- `PATCH /api/projects/[id]` - Update project (admin-only)
- `DELETE /api/projects/[id]` - Delete project (admin-only)

### Project Members
- `POST /api/projects/[id]/members` - Add member to project (admin-only)

### Tasks
- `GET /api/tasks` - List tasks assigned to user or in their projects
- `POST /api/tasks` - Create task (project admin-only)
- `PATCH /api/tasks/[id]` - Update task status or details
- `DELETE /api/tasks/[id]` - Delete task (admin-only)

---

## Deployment to Railway

### 1. Prepare Code
```bash
# Ensure build works
npm run build

# Commit to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Create Railway Project
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect your GitHub repository
5. Select the ethara repository

### 3. Configure Variables
In Railway dashboard:
- Set `DATABASE_URL` to your PostgreSQL connection
- Set `AUTH_SECRET` to a secure random string
- Set `NODE_ENV` to `production`

### 4. Deploy
Railway will automatically deploy when you push to GitHub.

### 5. Run Migrations on Production
```bash
# In Railway console or via CLI
npx prisma migrate deploy
```

---

## Features Implemented

### Authentication
- User signup with auto-admin-first-user logic
- Secure login with bcryptjs password hashing
- JWT session tokens in httpOnly cookies
- 7-day session expiration

### Role-Based Access Control
- **ADMIN**: Create projects, manage members, manage all tasks
- **MEMBER**: View assigned tasks, update task status for own assignments

### Projects
- Create and manage projects
- Add team members to projects
- Track project status (ACTIVE/ARCHIVED)

### Tasks
- Create tasks with title, description, priority, due date
- Assign tasks to team members
- Update task status (TODO, IN_PROGRESS, BLOCKED, DONE)
- Track completion and overdue status

### Dashboard
- User metrics: projects, tasks, overdue, completed
- Project overview with task statistics
- Recent tasks list
- Task status breakdown chart

---

## Testing

### Manual Test Flow
1. **Signup**: Create first user (becomes ADMIN)
2. **Create Project**: As admin, create a test project
3. **Add Member**: Invite another user (becomes MEMBER)
4. **Create Task**: Create task and assign to member
5. **Update Task**: Member logs in and updates their assigned task status
6. **Verify RBAC**: Ensure non-admins can't create projects or manage other users' tasks

### API Testing with cURL
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"securepass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepass123"}'

# Get Dashboard
curl -X GET http://localhost:3000/api/dashboard \
  -H "Cookie: ethara_session=<your_token>"
```

---

## Build & Run Commands

```bash
# Development
npm run dev                 # Start dev server with hot reload

# Production
npm run build              # Build optimized production bundle
npm run start              # Start production server
npm run lint               # Run ESLint checks

# Database
npx prisma generate       # Generate Prisma client
npx prisma migrate dev    # Create dev migration
npx prisma migrate deploy # Deploy migrations to production
npx prisma studio         # Open Prisma GUI
```

---

## Project Structure

```
ethara/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/, dashboard, projects, tasks  (REST routes)
│   │   ├── login/, signup/, dashboard/            (UI pages)
│   │   └── layout.tsx, page.tsx, globals.css
│   ├── components/
│   │   └── auth-form, project-form, task-form, etc.
│   └── lib/
│       ├── db.ts           (Prisma client singleton)
│       ├── auth.ts         (JWT helpers)
│       ├── permissions.ts  (RBAC logic)
│       ├── validators.ts   (Zod schemas)
│       └── dashboard.ts    (Data aggregation)
├── prisma/
│   └── schema.prisma       (Database models)
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

---

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Check PostgreSQL is running (local) or accessible (cloud)
- Test connection: `npx prisma db push`

### Prisma Generate Failed
- Ensure `effect` package is installed: `npm install effect`
- Run: `npm install` to get all dependencies

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Run build again: `npm run build`

### Dev Server Won't Start
- Check port 3000 is available
- Kill process using 3000: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Or access from different port: `npm run dev -- -p 3001`

---

## Next Steps

1. **Set up PostgreSQL database** (Railway, Render, or Supabase)
2. **Configure environment variables** (.env.local for local, Railway secrets for production)
3. **Run Prisma migrations** to create database schema
4. **Test API endpoints** with sample data
5. **Deploy to Railway** and enable continuous deployment from GitHub
6. **Record demo video** showing full workflow (signup, create project, add members, create/update tasks)
7. **Update README** with final deployment URL

---

## Live Demo URL
(Will be updated after Railway deployment)

[Deployment URL will appear here after setup]
