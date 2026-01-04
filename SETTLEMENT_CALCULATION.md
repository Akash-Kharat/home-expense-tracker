# Settlement Calculation System

## Overview
The expense tracking system now includes a **Handler-based Settlement Calculation** that tracks who manages each expense/savings category and calculates how much one person owes another at the end of each month.

## How It Works

### 1. Handler Concept
- Each expense and savings category has a designated **Handler** (the person who manages that fund)
- Both members contribute their share to the category
- The handler receives the total amount to manage the expenses

### 2. Example Scenario

**Members:**
- Person 1 (John): ₹60,000/month
- Person 2 (Jane): ₹50,000/month

**Home Expense Category:**
- Handler: Person 1
- Total Amount: ₹30,000
- Contributions:
  - Person 1: 50% = ₹15,000
  - Person 2: 50% = ₹15,000

**Calculation:**
- Person 1 contributes: ₹15,000 (paid out)
- Person 1 receives: ₹30,000 (as handler)
- Person 1 net gain: +₹15,000

- Person 2 contributes: ₹15,000 (paid out)
- Person 2 receives: ₹0 (not the handler)
- Person 2 net loss: -₹15,000

**Settlement:** Person 1 owes Person 2 ₹15,000

### 3. Complete Monthly Calculation

For each member:
```
Net Position = Income + Received (as handler) - Contributions (paid out) - Savings
```

Where:
- **Income**: Monthly salary
- **Received**: Total amount received as handler of various expenses/savings
- **Contributions**: Total amount paid out as contribution to various expenses
- **Savings**: Total amount invested in savings

### 4. Multiple Expense Example

**Person 1 handles:**
- Home Expense: ₹30,000 (contributes ₹15,000, receives ₹30,000)
- Personal Expense: ₹10,000 (contributes ₹5,000, receives ₹10,000)

**Person 2 handles:**
- Medical Expense: ₹4,000 (contributes ₹2,000, receives ₹4,000)
- Trip Expense: ₹10,000 (contributes ₹7,000, receives ₹10,000)

**Monthly Calculation:**

**Person 1:**
- Income: ₹60,000
- Paid Out: ₹15,000 + ₹5,000 + ₹2,000 + ₹3,000 = ₹25,000
- Received: ₹30,000 + ₹10,000 = ₹40,000
- Savings: ₹12,000
- **Net Position:** ₹60,000 + ₹40,000 - ₹25,000 - ₹12,000 = **₹63,000**

**Person 2:**
- Income: ₹50,000
- Paid Out: ₹15,000 + ₹5,000 + ₹2,000 + ₹7,000 = ₹29,000
- Received: ₹4,000 + ₹10,000 = ₹14,000
- Savings: ₹17,000
- **Net Position:** ₹50,000 + ₹14,000 - ₹29,000 - ₹17,000 = **₹18,000**

## Database Changes

### Expense Model
```javascript
{
  categoryId: ObjectId,
  handlerId: ObjectId,  // NEW: References Member who handles this expense
  totalAmount: Number,
  contributions: [{ memberId, percentage, amount }],
  month: Number,
  year: Number,
  description: String
}
```

### Savings Model
```javascript
{
  categoryId: ObjectId,
  handlerId: ObjectId,  // NEW: References Member who handles this savings
  totalAmount: Number,
  contributions: [{ memberId, amount }],
  frequency: String,
  month: Number,
  year: Number,
  description: String
}
```

## Dashboard Display

### Member-wise Settlement Table
Shows for each member:
- **Income**: Monthly salary
- **Paid Out**: Total contributions to all expenses
- **Received**: Total amount received as handler
- **Savings**: Total invested in savings
- **Net Position**: Final balance (positive = surplus, negative = deficit)

### Settlement Amount
The difference in net positions shows who owes whom:
- If Person 1 has +₹63,000 and Person 2 has +₹18,000
- The total should equal total income
- The settlement ensures both members are in the correct position

## UI Changes

### Expense/Savings Form
- Added **"Handler (Manages Fund)"** dropdown
- User selects which member will manage the funds for that category
- Handler is displayed in the expense/savings list with a chip

### Dashboard
- Updated table to show "Member-wise Settlement"
- Displays: Income, Paid Out, Received, Savings, Net Position
- Color coded: Green for positive, Red for negative balances

## Benefits

1. **Clear Accountability**: Know who manages which funds
2. **Accurate Settlements**: Calculate exact amounts owed between members
3. **Transparency**: See all contributions and receipts clearly
4. **Flexible**: Different members can handle different categories
5. **Real-time Tracking**: Know settlement amount at any point in the month

## Usage Instructions

### Adding an Expense:
1. Go to Expenses page
2. Click "Add Expense"
3. Select Category
4. **Select Handler** (who will manage this fund)
5. Enter Total Amount
6. Set contribution percentages for each member
7. Save

### Viewing Settlement:
1. Go to Dashboard
2. Select Month and Year
3. View "Member-wise Settlement" table
4. Check "Net Position" column to see who owes whom

### Understanding Net Position:
- **Positive (+)**: This person has surplus money
- **Negative (-)**: This person has deficit
- Compare net positions to determine settlement

## Notes

- Both expenses and savings support the handler concept
- Handler is required when creating new expenses/savings
- Existing records without handler may show "Not Set"
- Settlement calculation happens automatically in real-time
