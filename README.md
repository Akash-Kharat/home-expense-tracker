# Home Expense & Savings Tracker

A full-stack web application to track monthly expenses and savings for families with multiple earning members. Built with React.js, Express.js, and MongoDB.

## Features

- **Multi-Member Support**: Track expenses and savings for multiple family members
- **Customizable Categories**: Add, edit, or remove expense and savings categories
- **Flexible Contributions**: Set different contribution percentages for each member per category
- **Balance Calculation**: Automatic calculation of monthly balance for each member and overall
- **Interactive Dashboard**: Visual charts and summary cards showing financial overview
- **Investment Tracking**: Track different types of investments (SIP, Equity, FD, RD)
- **Frequency Options**: Support for monthly, quarterly, yearly, and one-time investments
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Animated UI**: Smooth animations using Framer Motion

## Tech Stack

### Frontend
- React.js (JavaScript)
- Material-UI (MUI)
- Framer Motion (Animations)
- Recharts (Data Visualization)
- Axios (API calls)
- React Router (Navigation)

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)

## Project Structure

```
Home-Expense/
├── backend/
│   ├── models/
│   │   ├── Member.js
│   │   ├── Category.js
│   │   ├── Expense.js
│   │   └── Savings.js
│   ├── routes/
│   │   ├── memberRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── expenseRoutes.js
│   │   ├── savingsRoutes.js
│   │   └── dashboardRoutes.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   └── Layout/
    │   ├── pages/
    │   │   ├── Dashboard.js
    │   │   ├── Expenses.js
    │   │   ├── Savings.js
    │   │   ├── Categories.js
    │   │   └── Members.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/home-expense-tracker
NODE_ENV=development
```

4. Start MongoDB (if using local installation):
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# Or start manually
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### 1. Add Family Members
- Navigate to the "Members" page
- Click "Add Member"
- Enter member name and monthly income
- Save

### 2. Create Categories
- Go to the "Categories" page
- Create expense categories (e.g., Home Expense, Medical, Personal)
- Create savings categories (e.g., SIP, Equity, FD, RD)

### 3. Track Expenses
- Navigate to "Expenses"
- Select month and year
- Click "Add Expense"
- Choose category, enter total amount
- Set contribution percentage for each member (amounts calculate automatically)
- Save

### 4. Track Savings
- Navigate to "Savings"
- Select month and year
- Click "Add Savings"
- Choose category, set frequency
- Enter contribution amount for each member
- Save

### 5. View Dashboard
- The Dashboard shows:
  - Total income, expenses, savings, and balance
  - Member-wise breakdown
  - Category-wise charts
  - Visual representation of financial data

## Example Scenario

**Family with 2 earning members:**

**Member 1 (John)**: ₹60,000/month
**Member 2 (Jane)**: ₹50,000/month

**Expense Categories:**
1. Home Expense: ₹60,000 (50% each = ₹30,000 each)
2. Medical Expense: ₹4,000 (50% each = ₹2,000 each)
3. Personal Expense: ₹10,000 (₹5,000 each)
4. Trip Expense: ₹10,000 (30% John = ₹3,000, 70% Jane = ₹7,000)
5. Other: ₹4,000 (50% each = ₹2,000 each)

**Savings Categories:**
1. SIP: ₹25,000 (John: ₹10,000, Jane: ₹15,000)
2. Equity: ₹4,000 (₹2,000 each)
3. FD: ₹10,000 (One-time, frequency: yearly)
4. RD: ₹10,000 (Monthly)

**Monthly Balance:**
- **John**: ₹60,000 - ₹42,000 (expenses) - ₹12,000 (savings) = ₹6,000
- **Jane**: ₹50,000 - ₹46,000 (expenses) - ₹17,000 (savings) = -₹13,000

## API Endpoints

### Members
- `GET /api/members` - Get all members
- `POST /api/members` - Create member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Categories
- `GET /api/categories?type=expense|savings` - Get categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses
- `GET /api/expenses?month=1&year=2025` - Get expenses
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Savings
- `GET /api/savings?month=1&year=2025` - Get savings
- `POST /api/savings` - Create saving
- `PUT /api/savings/:id` - Update saving
- `DELETE /api/savings/:id` - Delete saving

### Dashboard
- `GET /api/dashboard/summary?month=1&year=2025` - Get monthly summary
- `GET /api/dashboard/yearly-summary?year=2025` - Get yearly summary

## Key Features Explained

### Balance Calculation
The app automatically calculates:
- Individual member expenses based on contribution percentages
- Total expenses across all categories
- Total savings/investments
- Remaining balance for each member
- Overall family balance

### Contribution System
For expenses:
- Enter total amount and percentage for each member
- Amounts calculate automatically based on percentages
- Supports unequal splits (e.g., 30%-70%, 50%-50%)

For savings:
- Enter individual amounts for each member
- Total calculates automatically
- Allows different investment amounts per member

### Category Management
- Add custom categories for both expenses and savings
- Modify existing categories
- Deactivate categories (soft delete)
- Separate tabs for expense and savings categories

## Development

### Run in Development Mode

Backend:
```bash
cd backend
npm run dev
```

Frontend:
```bash
cd frontend
npm start
```

### Build for Production

Frontend:
```bash
cd frontend
npm run build
```

## Database Schema

### Member
- name: String
- monthlyIncome: Number
- isActive: Boolean

### Category
- name: String
- type: 'expense' | 'savings'
- description: String
- isActive: Boolean

### Expense
- categoryId: ObjectId (ref: Category)
- totalAmount: Number
- contributions: [{ memberId, percentage, amount }]
- month: Number (1-12)
- year: Number
- description: String

### Savings
- categoryId: ObjectId (ref: Category)
- totalAmount: Number
- contributions: [{ memberId, amount }]
- month: Number (1-12)
- year: Number
- frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time'
- description: String

## Future Enhancements

- User authentication and authorization
- Multiple family/household support
- Budget planning and alerts
- Export data to CSV/PDF
- Mobile app (React Native)
- Recurring expense automation
- Bill reminders
- Investment portfolio tracking
- Yearly financial reports

## License

This project is open source and available for personal use.

## Support

For issues or questions, please create an issue in the repository.
