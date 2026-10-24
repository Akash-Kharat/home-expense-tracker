import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DollarSign, TrendingUp, PiggyBank, Users } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { analyticsApi } from '../../api/endpoints';
import StatCard from '../../components/ui/StatCard';
import MonthYearPicker from '../../components/ui/MonthYearPicker';
import GlassCard from '../../components/ui/GlassCard';
import { PageLoader } from '../../components/ui/LoadingSpinner';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16'];

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div
      className="border rounded-xl px-4 py-3 shadow-xl"
      style={{ backgroundColor: 'var(--tooltip-bg)', borderColor: 'var(--border-color)' }}
    >
      {label && <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {p.name}: <span className="font-semibold">₹{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(() => {
    const saved = sessionStorage.getItem('dashboard-month');
    return saved ? Number(saved) : now.getMonth() + 1;
  });
  const [year, setYear] = useState(() => {
    const saved = sessionStorage.getItem('dashboard-year');
    return saved ? Number(saved) : now.getFullYear();
  });

  const handleMonthChange = (m: number) => { setMonth(m); sessionStorage.setItem('dashboard-month', String(m)); };
  const handleYearChange = (y: number) => { setYear(y); sessionStorage.setItem('dashboard-year', String(y)); };

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', month, year],
    queryFn: () => analyticsApi.getDashboard(month, year),
  });

  if (isLoading) return <PageLoader />;

  // Backend now returns { name, spent, budget } for topCategories
  const pieData = dashboard?.topCategories?.map((c: any) => ({
    name: c.name,
    value: c.spent || 0,
  })).filter((d: any) => d.value > 0) || [];

  const barData = dashboard?.topCategories?.map((c: any) => ({
    name: c.name,
    Budget: c.budget || 0,
    Spent: c.spent || 0,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Your financial overview at a glance.</p>
        </div>
        <MonthYearPicker month={month} year={year} onMonthChange={handleMonthChange} onYearChange={handleYearChange} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Budget" value={dashboard?.totalBudget ?? 0} prefix="₹" color="indigo" />
        <StatCard icon={TrendingUp} label="Total Spent" value={dashboard?.totalSpent ?? 0} prefix="₹" color="amber" />
        <StatCard icon={PiggyBank} label="Remaining" value={dashboard?.remaining ?? 0} prefix="₹" color="emerald" />
        <StatCard icon={Users} label="Members" value={dashboard?.totalMembers ?? 0} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Expenses by Category</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_: any, i: number) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] gap-2">
              <p style={{ color: 'var(--text-muted)' }}>No expense data yet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add expenses to see this chart</p>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Budget vs Actual</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--chart-axis)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                <Bar dataKey="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] gap-2">
              <p style={{ color: 'var(--text-muted)' }}>No budget data yet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set budgets and add expenses to see this chart</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Recent expenses */}
      <GlassCard>
        <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Expenses</h3>
        {dashboard?.recentExpenses && dashboard.recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Date</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Category</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Paid By</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Description</th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: 'var(--text-secondary)' }}>Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {dashboard.recentExpenses.slice(0, 5).map((exp: any) => (
                  <tr
                    key={exp.id}
                    className="transition-colors"
                    style={{ borderColor: 'var(--border-color)' }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
                  >
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{new Date(exp.expenseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{exp.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{exp.paidBy?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-muted)' }}>{exp.description || '—'}</td>
                    <td className="px-4 py-3 text-sm font-medium text-right" style={{ color: 'var(--text-primary)' }}>₹{exp.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>No recent expenses</p>
        )}
      </GlassCard>

      {/* Member breakdown */}
      {dashboard?.memberBreakdown && dashboard.memberBreakdown.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Member Breakdown</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.memberBreakdown.map((mb: any) => (
              <GlassCard key={mb.member.id} hover>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {mb.member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{mb.member.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Income: ₹{mb.member.monthlyIncome?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Spent</span>
                  <span className="text-amber-400 font-medium">₹{mb.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Budget Share</span>
                  <span className="text-indigo-400 font-medium">₹{mb.totalBudget.toLocaleString()}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
