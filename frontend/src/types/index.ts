export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  familyId: string;
  family?: Family;
  createdAt: string;
}

export interface Family {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  name: string;
  monthlyIncome: number;
  isActive: boolean;
  familyId: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'EXPENSE' | 'SAVINGS' | 'INVESTMENT';
  managerId: string;
  manager?: Member;
  isActive: boolean;
  familyId: string;
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  category?: Category;
  amount: number;
  month: number;
  year: number;
  familyId: string;
  createdAt: string;
}

export interface BudgetSummary {
  id: string;
  category: Category;
  budget: number;
  spent: number;
  remaining: number;
}

export interface Expense {
  id: string;
  categoryId: string;
  category?: Category;
  paidByMemberId: string;
  paidBy?: Member;
  amount: number;
  description?: string;
  expenseDate: string;
  month: number;
  year: number;
  familyId: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  fromMemberId: string;
  fromMember?: Member;
  toMemberId: string;
  toMember?: Member;
  amount: number;
  month: number;
  year: number;
  status: 'PENDING' | 'SETTLED';
  familyId: string;
  createdAt: string;
}

export interface MonthLockStatus {
  isLocked: boolean;
  month: number;
  year: number;
}

export interface Invitation {
  id: string;
  email: string;
  token: string;
  role: 'ADMIN' | 'MEMBER';
  used: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface DashboardData {
  totalBudget: number;
  totalSpent: number;
  remaining: number;
  savingsRate: number;
  totalMembers: number;
  topCategories: { name: string; spent: number; budget: number }[];
  recentExpenses: Expense[];
  memberBreakdown: { member: Member; totalSpent: number; totalBudget: number }[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface CategoryTrend {
  name: string;
  months: number[];
}

export interface MemberTrend {
  name: string;
  months: number[];
}

export interface BudgetBurn {
  category: string;
  name: string;
  budget: number;
  spent: number;
}
