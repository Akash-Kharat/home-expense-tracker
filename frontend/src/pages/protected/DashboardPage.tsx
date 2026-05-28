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
    <div className="bg-[#1a1a3a] border border-white/10 rounded-xl px-4 py-3 shadow-xl">
      {label && <p className="text-xs text-slate-400 mb-2">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-sm text-white">
          {p.name}: <span className="font-semibold">₹{p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', month, year],
    queryFn: () => analyticsApi.getDashboard(month, year),
  });

  if (isLoading) return <PageLoader />;

  const pieData = dashboard?.topCategories?.map((c) => ({
    name: c.name,
    value: c.spent,
  })) || [];

  const barData = dashboard?.topCategories?.map((c) => ({
    name: c.name,
    Budget: c.budget,
    Spent: c.spent,
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">Your financial overview at a glance.</p>
        </div>
        <MonthYearPicker month={month} year={year} onMonthChange={setMonth} onYearChange={setYear} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Budget" value={dashboard?.totalBudget || 0} prefix="₹" color="indigo" />
        <StatCard icon={TrendingUp} label="Total Spent" value={dashboard?.totalSpent || 0} prefix="₹" color="amber" />
        <StatCard icon={PiggyBank} label="Remaining" value={dashboard?.remaining || 0} prefix="₹" color="emerald" />
        <StatCard icon={Users} label="Members" value={dashboard?.totalMembers || 0} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Expenses by Category</h3>
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
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500">No data available</div>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-6">Budget vs Actual</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
                <Bar dataKey="Budget" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-slate-500">No data available</div>
          )}
        </GlassCard>
      </div>

      {/* Recent expenses */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Expenses</h3>
        {dashboard?.recentExpenses && dashboard.recentExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Category</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Paid By</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Description</th>
                  <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dashboard.recentExpenses.slice(0, 5).map((exp) => (
                  <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-300">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{exp.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{exp.paidBy?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm text-slate-400">{exp.description || '—'}</td>
                    <td className="px-4 py-3 text-sm text-white font-medium text-right">₹{exp.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm py-8 text-center">No recent expenses</p>
        )}
      </GlassCard>

      {/* Member breakdown */}
      {dashboard?.memberBreakdown && dashboard.memberBreakdown.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Member Breakdown</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboard.memberBreakdown.map((mb) => (
              <GlassCard key={mb.member.id} hover>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {mb.member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{mb.member.name}</p>
                    <p className="text-xs text-slate-400">Income: ₹{mb.member.monthlyIncome?.toLocaleString() || 0}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Spent</span>
                  <span className="text-amber-400 font-medium">₹{mb.totalSpent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Budget Share</span>
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
