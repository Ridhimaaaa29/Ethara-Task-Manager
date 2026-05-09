# ETHARA TASK MANAGER - DEMO VIDEO SCRIPT

## Video Length: 2-5 minutes
## Best Format: MP4 (H.264, 1920x1080, 30fps)

---

## DEMO FLOW

### INTRO (15 seconds)
```
"Hi! This is Ethara, a full-stack team task manager built with Next.js, 
Prisma, and PostgreSQL. Let me show you how it works."

Show:
- Landing page
- Features list
```

### FEATURE 1: AUTHENTICATION (30 seconds)
```
"First, let's create an account. The first user becomes an admin."

Show:
- Click "Get started"
- Fill signup form (Name, Email, Password)
- Submit signup
- Auto-redirect to dashboard
```

### FEATURE 2: PROJECT CREATION (30 seconds)
```
"As an admin, I can create projects. Let me create a 'Website Redesign' project."

Show:
- Dashboard as admin
- Scroll to "Create project" section
- Enter project name: "Website Redesign"
- Enter description: "Update main website design"
- Click "Create project"
- Project appears in list
```

### FEATURE 3: TASK CREATION (30 seconds)
```
"Now I can create tasks within the project and assign them to team members."

Show:
- Click into project
- Scroll to task creation form
- Create task: "Design homepage mockup"
- Set priority: "High"
- Click "Create task"
- Task appears in project task list
```

### FEATURE 4: MEMBER MANAGEMENT (30 seconds)
```
"I can also add team members. Let me logout and create a regular member account."

Show:
- Click "Log out"
- Signup as second user (e.g., "John Developer")
- Shows as "MEMBER" role
- Go back to admin account (login)
- In project, add member by email
```

### FEATURE 5: ROLE-BASED ACCESS (30 seconds)
```
"Notice the admin has full control, but members have limited permissions. 
The role-based access control keeps the team organized."

Show:
- Dashboard as admin vs member
- Admin sees "Create project" button
- Member doesn't see it
- Only admins can manage team members
```

### FEATURE 6: DASHBOARD METRICS (20 seconds)
```
"The dashboard shows key metrics: projects, tasks, overdue items, and completion status."

Show:
- Metrics cards at top
- Project overview with task breakdown
- Progress overview sidebar
- Recent work list
```

### REST API (20 seconds - OPTIONAL)
```
"Behind the scenes, we have 10 REST API endpoints backed by Prisma and PostgreSQL."

Show:
- Open browser dev tools (Network tab)
- Create a task
- Show POST /api/tasks request
- Show response with task data
```

### CLOSING (20 seconds)
```
"Ethara is production-ready, fully type-safe with TypeScript, and 
can be deployed to Railway with one click. Everything is documented 
and easy to customize."

Show:
- GitHub repo (Ridhimaaaa29/Ethara-Task-Manager)
- Live deployed URL on Railway
```

---

## KEY POINTS TO EMPHASIZE

✅ **Authentication**: Secure signup/login with JWT tokens
✅ **Role-Based Access**: Admin vs Member permissions clearly implemented
✅ **Full CRUD**: Create, read, update, delete for projects and tasks
✅ **Real Database**: PostgreSQL with Prisma ORM
✅ **Type-Safe**: 100% TypeScript for confidence
✅ **Responsive UI**: Works on desktop (mention mobile-ready)
✅ **Production-Ready**: Deployed on Railway
✅ **Well-Documented**: Comprehensive README and deployment guide

---

## RECORDING TIPS

1. **Screen Resolution**: Record at 1920x1080 (1080p)
2. **Audio**: Clear voice narration with background music (optional)
3. **Pacing**: Talk slowly, give users time to read
4. **Clicks**: Make sure clicks are visible
5. **Network**: Ensure internet is stable for live features
6. **Timing**: Keep it between 2-5 minutes (aim for 3-4)

---

## FILE TO RECORD

Use the local dev server running at:
- `http://localhost:3000` (for local demo)
- Or Railway live URL (when deployed)

---

## TOOLS TO RECORD

**Windows:**
- OBS Studio (free, professional)
- ScreenFlow (macOS)
- Camtasia (paid, easy)
- Windows 11 Snip & Sketch

**Steps:**
1. Start dev server: `npm run dev`
2. Open http://localhost:3000
3. Record screen with voiceover
4. Export as MP4
5. Upload to submit form

---

## DEMO CREDENTIALS (if needed)

First Admin:
- Email: admin@demo.local
- Password: DemoPassword123!

Team Member:
- Email: member@demo.local
- Password: MemberPass123!

---

## EDITING (POST-RECORDING)

- Add intro/outro slides
- Zoom in on important UI elements
- Add text overlays for key features
- Background music (royalty-free from YouTube Audio Library)
- Keep pacing consistent

