# 🏠 Home Expense SaaS

A collaborative household financial operating system. Multi-family SaaS for tracking expenses, budgets, settlements, and analytics.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS + TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT + bcryptjs |
| Frontend | React 19 + Vite + TypeScript |
| Styling | TailwindCSS v4 (dark glassmorphic UI) |
| State | Zustand (auth) + TanStack Query v5 (server) |
| Charts | Recharts |
| Icons | Lucide React |

## Quick Start

### Prerequisites
- Node.js v18+
- Docker Desktop (for PostgreSQL)

### 1. Start Database
```bash
docker compose up -d
```
This starts PostgreSQL on port 5432 with:
- DB: `home_expense_db`
- User: `admin`
- Password: `admin123`

### 2. Setup Backend
```bash
cd backend
cp .env.example .env  # or use existing .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```
Backend runs on http://localhost:3001

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on http://localhost:5173

## Project Structure

```
home-expense-tracker/
├── backend/                 # NestJS API
│   ├── prisma/
│   │   └── schema.prisma    # Database schema (9 models)
│   └── src/
│       ├── auth/            # JWT authentication
│       ├── members/         # Financial participants
│       ├── categories/      # Budget categories
│       ├── budgets/         # Monthly allocations
│       ├── expenses/        # Spending records
│       ├── settlements/     # Reimbursement engine
│       ├── analytics/       # Dashboard & trends
│       ├── month-locks/     # Freeze months
│       ├── audit-logs/      # Action tracking
│       └── invitations/     # Family invite system
├── frontend/                # React SPA
│   └── src/
│       ├── api/             # Axios client + endpoints
│       ├── components/ui/   # GlassCard, Button, Modal...
│       ├── layouts/         # AppLayout, AuthLayout
│       ├── pages/           # All application pages
│       ├── store/           # Zustand (auth, toasts)
│       └── types/           # TypeScript interfaces
├── docker-compose.yml       # PostgreSQL container
└── README.md
```

## API Endpoints

All routes prefixed with `/api/v1/`

### Auth
- `POST /auth/register` — Create account + family
- `POST /auth/login` — Get JWT token
- `GET /auth/me` — Current user profile

### Members
- `GET/POST/PATCH/DELETE /members`

### Categories
- `GET/POST/PATCH/DELETE /categories`

### Budgets
- `GET/POST/PATCH/DELETE /budgets`
- `GET /budgets/summary` — Budget vs actual

### Expenses
- `GET/POST/PATCH/DELETE /expenses`

### Settlements
- `POST /settlements/generate` — Calculate who owes whom
- `GET /settlements` — List settlements
- `PATCH /settlements/:id/settled` — Mark as paid

### Analytics
- `GET /analytics/dashboard`
- `GET /analytics/category-trends`
- `GET /analytics/member-trends`
- `GET /analytics/budget-burn`

### Month Locks
- `POST /months/lock`
- `POST /months/unlock`
- `GET /months/status`

### Invitations
- `POST /families/invite`
- `POST /families/accept`
- `GET /families/invitations`

## Settlement Algorithm

For each expense in a month:
```
if paidBy != category.manager:
    manager owes paidBy the expense amount
```

Net amounts are aggregated between member pairs to minimize transactions.

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://admin:admin123@localhost:5432/home_expense_db
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=7d
PORT=3001
FRONTEND_URL=http://localhost:5173
```

## License

Open source for personal use.
