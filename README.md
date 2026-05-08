# Ethara Task Manager

Ethara is a full-stack team task manager built with Next.js, Prisma, PostgreSQL, and REST route handlers. It supports authenticated signup/login, admin/member permissions, project membership, task assignment, and a progress dashboard with overdue tracking.

## ✨ Features

### Authentication & Security
- Email/password signup and login
- First user becomes ADMIN; subsequent users are MEMBERS
- Secure password hashing with bcryptjs
- JWT session tokens stored in httpOnly cookies
- 7-day session expiration

### Projects & Team Management
- Admins create and manage projects
- Add team members to projects
- Projects have status tracking (ACTIVE/ARCHIVED)
- Members can view assigned projects and tasks

### Tasks & Progress
- Admins create tasks within projects
- Assign tasks to team members with priority levels (LOW, MEDIUM, HIGH)
- Task status tracking: TODO, IN_PROGRESS, BLOCKED, DONE
- Due date support with overdue highlighting
- Members update their own task statuses
- Completion tracking with timestamps

### Dashboard
- User metrics: projects, tasks, overdue, completed
- Project overview with task statistics
- Team member display per project
- Recent tasks list
- Visual status breakdown

### REST APIs
- 10 API endpoints for auth, projects, members, and tasks
- Zod validation on all inputs
- Role-based access control (RBAC) on operations
- Error handling with descriptive messages

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: bcryptjs + jose (JWT)
- **Validation**: Zod v4
- **Linting**: ESLint 9

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- PostgreSQL database (local or cloud)

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ethara.git
cd ethara
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your database connection:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ethara"
AUTH_SECRET="your-secure-random-string-here"
```

Generate a secure AUTH_SECRET:
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

5. Set up the database
```bash
npx prisma db push
# or for migrations:
npx prisma migrate dev --name init
```

6. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Usage

### First Time Setup
1. Go to `/signup`
2. Create an account (first user is ADMIN)
3. In dashboard, create a project
4. Add team members to the project
5. Create tasks and assign to members
6. Members log in and update their task statuses

### Admin Workflows
- Create projects and set status
- Add existing users to projects
- Create tasks and assign to team members
- Track team progress on dashboard

### Member Workflows
- View assigned projects
- View tasks assigned to them
- Update task status for their assignments
- See dashboard with their metrics

## 🔐 Role-Based Access Control

| Action | Admin | Member |
|--------|-------|--------|
| Create project | ✅ | ❌ |
| Manage project members | ✅ | ❌ |
| Create task | ✅ | ❌ |
| Update any task | ✅ | ✅ (own only) |
| Delete task | ✅ | ❌ |
| View projects | ✅ | ✅ |
| View dashboard | ✅ | ✅ |

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/signup      - Register new user
POST   /api/auth/login       - Authenticate user
POST   /api/auth/logout      - Clear session
GET    /api/auth/me          - Get current user
```

### Dashboard
```
GET    /api/dashboard        - Get user's dashboard data
```

### Projects
```
GET    /api/projects         - List user's projects
POST   /api/projects         - Create new project (admin-only)
PATCH  /api/projects/[id]    - Update project (admin-only)
DELETE /api/projects/[id]    - Delete project (admin-only)
```

### Project Members
```
POST   /api/projects/[id]/members  - Add user to project (admin-only)
```

### Tasks
```
GET    /api/tasks            - List tasks for user
POST   /api/tasks            - Create task (admin-only)
PATCH  /api/tasks/[id]       - Update task status or details
DELETE /api/tasks/[id]       - Delete task (admin-only)
```

## 🗄️ Database Schema

### User
- id (UUID)
- email (unique)
- name
- passwordHash
- role (ADMIN | MEMBER)
- createdAt

### Project
- id (UUID)
- name
- description
- ownerId (FK to User)
- status (ACTIVE | ARCHIVED)
- createdAt
- updatedAt

### ProjectMember
- projectId (FK to Project)
- userId (FK to User)
- role (ADMIN | MEMBER)

### Task
- id (UUID)
- title
- description
- projectId (FK to Project)
- assigneeId (FK to User, nullable)
- priority (LOW | MEDIUM | HIGH)
- status (TODO | IN_PROGRESS | BLOCKED | DONE)
- dueDate (nullable)
- createdAt
- completedAt (nullable)

## 🧪 Testing

### Manual Test Flow
```
1. Signup as first user (becomes ADMIN)
2. Create a project
3. Signup as another user (becomes MEMBER)
4. As ADMIN, add member to project
5. As ADMIN, create a task
6. As ADMIN, assign task to member
7. As MEMBER, login and update task status
8. Verify RBAC: try creating project as MEMBER (should fail)
```

### API Testing with cURL
```bash
# Signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Admin",
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "securepass123"
  }'

# Get Dashboard (include auth cookie from login response)
curl -X GET http://localhost:3000/api/dashboard \
  -H "Cookie: ethara_session=<token_from_login>"
```

## 📦 Commands

```bash
# Development
npm run dev              # Start dev server (port 3000)

# Production
npm run build            # Build optimized production bundle
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate     # Generate Prisma client
npx prisma db push      # Push schema to database
npx prisma migrate dev  # Create and run migration
npx prisma studio      # Open Prisma GUI
```

## 🚀 Deployment

### Deploy to Railway

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project and connect your GitHub repository
4. Add PostgreSQL service
5. Set environment variables:
   - `DATABASE_URL` (from Railway PostgreSQL)
   - `AUTH_SECRET` (generate new secure string)
6. Deploy
7. Run migrations: `npx prisma migrate deploy`

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📝 Project Structure

```
ethara/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication routes
│   │   │   ├── dashboard/     # Dashboard data
│   │   │   ├── projects/      # Project CRUD & members
│   │   │   └── tasks/         # Task CRUD
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── auth-form.tsx
│   │   ├── project-create-form.tsx
│   │   ├── member-add-form.tsx
│   │   ├── task-create-form.tsx
│   │   ├── task-status-form.tsx
│   │   └── logout-button.tsx
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       ├── auth.ts            # JWT & session helpers
│       ├── permissions.ts     # RBAC checks
│       ├── validators.ts      # Zod schemas
│       └── dashboard.ts       # Dashboard data aggregation
├── prisma/
│   └── schema.prisma          # Database schema
├── .env.example               # Environment template
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Secret key for signing JWT tokens (min 32 characters)

### Optional
- `NODE_ENV` - Set to `production` in production

## 📄 License

MIT

## 🙋 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for efficient team collaboration**
