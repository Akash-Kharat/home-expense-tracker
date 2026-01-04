# Home Expense Tracking Application - Project Summary

## Overview
A full-stack MERN application for managing household expenses and savings between multiple members with automatic settlement calculations.

## Tech Stack
- **Frontend**: React.js 18.2.0, Material-UI, Framer Motion, Recharts
- **Backend**: Express.js 4.18.2, Node.js
- **Database**: MongoDB with Mongoose 8.0.0

## Core Features

### 1. **Member Management**
- Add/edit/delete household members
- Track monthly income per member
- Active/inactive status

### 2. **Category System**
- Separate categories for expenses and savings
- Each category has:
  - Fixed monthly budget
  - Assigned handler (responsible member)
  - Budget vs actual tracking

### 3. **Expense Tracking**
- Record expenses with:
  - Category selection
  - Single payer (who paid)
  - Amount and description
  - Month/year tracking
- **Filters**: Category and Paid By

### 4. **Savings/Investments**
- Track savings with:
  - Category, payer, amount
  - Frequency (monthly/quarterly/yearly/one-time)
- **Filters**: Category and Paid By

### 5. **Dashboard Analytics**
- **Summary Cards**: Total income, expenses, savings, balance
- **Member-wise Settlement**: 
  - Income, Paid Out, Should Receive (as handler)
  - Savings Paid, Net Position
- **Category Budget Breakdown**: Budget, spent, remaining balance per category
- **Over-Expenses Section**: Shows when members spend on categories they don't handle
- **Visual Charts**: Pie chart for expenses, bar chart for savings

## Key Logic

### Settlement Calculation
```
Net Position = Income + Should Receive (as handler) - Paid Out
```

**Example:**
- Person 1 handles "Home" category (₹10,000 budget)
- Person 2 spends ₹6,000 on "Home" 
- Person 1 owes Person 2 ₹6,000
- Tracked in "Over-Expenses" section

### Budget Tracking
```
Category Balance = Fixed Monthly Budget - Total Spent
```

## Data Flow
1. **Members** → Define who's tracking expenses
2. **Categories** → Define expense/savings types with budgets and handlers
3. **Expenses/Savings** → Record transactions (who paid what, under which category)
4. **Dashboard** → Automatic calculations show who owes whom

## File Structure
```
backend/
├── models/        # MongoDB schemas (Member, Category, Expense, Savings)
├── routes/        # API endpoints
└── server.js      # Express server

frontend/
└── src/
    ├── pages/     # React components (Dashboard, Members, Categories, Expenses, Savings)
    └── services/  # API calls
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB

### Backend Setup
```bash
cd backend
npm install
# Create .env file with MongoDB connection string
npm start
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
# App runs on http://localhost:3000
```

## Current State
- ✅ Multi-member support
- ✅ Category-level handler assignment
- ✅ Single-payer expense model
- ✅ Budget tracking per category
- ✅ Automatic settlement calculations
- ✅ Over-expense tracking (non-handler spending)
- ✅ Category and Paid By filters
- ✅ Month/year selection
- ✅ Visual analytics with charts

## Use Case
Perfect for households, roommates, or couples who share expenses but want to track who handles which categories (rent, groceries, utilities) and automatically calculate who owes whom at month-end.

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Categories
- `GET /api/categories?type=expense|savings` - Get categories by type
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses?month=&year=` - Get expenses for month/year
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Savings
- `GET /api/savings?month=&year=` - Get savings for month/year
- `POST /api/savings` - Create savings
- `PUT /api/savings/:id` - Update savings
- `DELETE /api/savings/:id` - Delete savings

### Dashboard
- `GET /api/dashboard/summary?month=&year=` - Get complete dashboard data
- `GET /api/dashboard/yearly-summary?year=` - Get yearly summary

## Database Models

### Member
- name: String
- monthlyIncome: Number
- isActive: Boolean

### Category
- name: String
- type: String (expense/savings)
- description: String
- fixedAmount: Number (monthly budget)
- handlerId: ObjectId (ref: Member)
- isActive: Boolean

### Expense
- categoryId: ObjectId (ref: Category)
- paidBy: ObjectId (ref: Member)
- amount: Number
- description: String
- date: Date
- month: Number
- year: Number

### Savings
- categoryId: ObjectId (ref: Category)
- paidBy: ObjectId (ref: Member)
- amount: Number
- description: String
- frequency: String (monthly/quarterly/yearly/one-time)
- date: Date
- month: Number
- year: Number
