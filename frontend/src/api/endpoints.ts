import api from './client';
import type {
  AuthResponse,
  Member,
  Category,
  Budget,
  BudgetSummary,
  Expense,
  Settlement,
  DashboardData,
  CategoryTrend,
  MemberTrend,
  BudgetBurn,
  Invitation,
  MonthLockStatus,
} from '../types';

// ─── Auth ────────────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string; familyName: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  getMe: () => api.get('/auth/me').then((r) => r.data),
};

// ─── Members ─────────────────────────────────────────────────
export const membersApi = {
  getAll: () => api.get<Member[]>('/members').then((r) => r.data),

  create: (data: { name: string; monthlyIncome: number }) =>
    api.post<Member>('/members', data).then((r) => r.data),

  update: (id: string, data: Partial<{ name: string; monthlyIncome: number; isActive: boolean }>) =>
    api.patch<Member>(`/members/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/members/${id}`).then((r) => r.data),
};

// ─── Categories ──────────────────────────────────────────────
export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories').then((r) => r.data),

  create: (data: { name: string; type: string; managerId: string }) =>
    api.post<Category>('/categories', data).then((r) => r.data),

  update: (id: string, data: Partial<{ name: string; type: string; managerId: string; isActive: boolean }>) =>
    api.patch<Category>(`/categories/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
};

// ─── Budgets ─────────────────────────────────────────────────
export const budgetsApi = {
  getAll: (month?: number, year?: number) =>
    api.get<Budget[]>('/budgets', { params: { month, year } }).then((r) => r.data),

  create: (data: { categoryId: string; amount: number; month: number; year: number }) =>
    api.post<Budget>('/budgets', data).then((r) => r.data),

  update: (id: string, data: Partial<{ amount: number }>) =>
    api.patch<Budget>(`/budgets/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/budgets/${id}`).then((r) => r.data),

  getSummary: (month: number, year: number) =>
    api.get<BudgetSummary[]>('/budgets/summary', { params: { month, year } }).then((r) => r.data),
};

// ─── Expenses ────────────────────────────────────────────────
export const expensesApi = {
  getAll: (month?: number, year?: number) =>
    api.get<Expense[]>('/expenses', { params: { month, year } }).then((r) => r.data),

  create: (data: {
    categoryId: string;
    paidByMemberId: string;
    amount: number;
    description?: string;
    expenseDate: string;
    month: number;
    year: number;
  }) => api.post<Expense>('/expenses', data).then((r) => r.data),

  update: (
    id: string,
    data: Partial<{
      categoryId: string;
      paidByMemberId: string;
      amount: number;
      description: string;
      expenseDate: string;
    }>
  ) => api.patch<Expense>(`/expenses/${id}`, data).then((r) => r.data),

  delete: (id: string) => api.delete(`/expenses/${id}`).then((r) => r.data),
};

// ─── Settlements ─────────────────────────────────────────────
export const settlementsApi = {
  generate: (month: number, year: number) =>
    api.post<Settlement[]>('/settlements/generate', { month, year }).then((r) => r.data),

  getAll: (month?: number, year?: number) =>
    api.get<Settlement[]>('/settlements', { params: { month, year } }).then((r) => r.data),

  markSettled: (id: string) =>
    api.patch<Settlement>(`/settlements/${id}/settled`).then((r) => r.data),
};

// ─── Analytics ───────────────────────────────────────────────
export const analyticsApi = {
  getDashboard: (month: number, year: number) =>
    api.get<DashboardData>('/analytics/dashboard', { params: { month, year } }).then((r) => r.data),

  getCategoryTrends: (year: number) =>
    api.get<CategoryTrend[]>('/analytics/category-trends', { params: { year } }).then((r) => r.data),

  getMemberTrends: (year: number) =>
    api.get<MemberTrend[]>('/analytics/member-trends', { params: { year } }).then((r) => r.data),

  getBudgetBurn: (month: number, year: number) =>
    api.get<BudgetBurn[]>('/analytics/budget-burn', { params: { month, year } }).then((r) => r.data),
};

// ─── Month Locks ─────────────────────────────────────────────
export const monthLocksApi = {
  lock: (month: number, year: number) =>
    api.post('/months/lock', { month, year }).then((r) => r.data),

  unlock: (month: number, year: number) =>
    api.post('/months/unlock', { month, year }).then((r) => r.data),

  getStatus: (month: number, year: number) =>
    api.get<MonthLockStatus>('/months/status', { params: { month, year } }).then((r) => r.data),
};

// ─── Invitations ─────────────────────────────────────────────
export const invitationsApi = {
  invite: (email: string, role: string) =>
    api.post<Invitation>('/families/invite', { email, role }).then((r) => r.data),

  accept: (data: { token: string; name: string; password: string }) =>
    api.post('/families/accept', data).then((r) => r.data),

  getAll: () =>
    api.get<Invitation[]>('/families/invitations').then((r) => r.data),

  delete: (id: string) =>
    api.delete(`/families/invitations/${id}`).then((r) => r.data),
};

// ─── Audit Logs ──────────────────────────────────────────────
export const auditLogsApi = {
  getAll: () => api.get('/audit-logs').then((r) => r.data),
};
