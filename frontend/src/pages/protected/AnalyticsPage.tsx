import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Area, AreaChart, Legend,
} from 'recharts';
import { analyticsApi } from '../../api/endpoints';
import GlassCard from '../../components/ui/GlassCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f43f5e', '#84cc16'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div
      className="border rounded-lg p-3 shadow-xl"
      style={{ backgroundColor: 'var(--tooltip-bg)', borderColor: 'var(--border-color)' }}
    >
      <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value?.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const { data: categoryTrends, isLoading: loadingCat } = useQuery({
    queryKey: ['analytics', 'category-trends', year],
    queryFn: () => analyticsApi.getCategoryTrends(year),
  });

  const { data: memberTrends, isLoading: loadingMember } = useQuery({
    queryKey: ['analytics', 'member-trends', year],
    queryFn: () => analyticsApi.getMemberTrends(year),
  });

  const { data: budgetBurn, isLoading: loadingBudget } = useQuery({
    queryKey: ['analytics', 'budget-burn', month, year],
    queryFn: () => analyticsApi.getBudgetBurn(month, year),
  });

  const { data: dashboard, isLoading: loadingDash } = useQuery({
    queryKey: ['analytics', 'dashboard', month, year],
    queryFn: () => analyticsApi.getDashboard(month, year),
  });

  const isLoading = loadingCat || loadingMember || loadingBudget || loadingDash;

  // Backend now returns { name, months[] } for category/member trends
  const categoryChartData = MONTHS.map((m, i) => {
    const row: any = { month: m };
    if (categoryTrends && Array.isArray(categoryTrends)) {
      categoryTrends.forEach((cat: any) => {
        row[cat.name] = cat.months?.[i] || 0;
      });
    }
    return row;
  });

  const memberChartData = MONTHS.map((m, i) => {
    const row: any = { month: m };
    if (memberTrends && Array.isArray(memberTrends)) {
      memberTrends.forEach((mem: any) => {
        row[mem.name] = mem.months?.[i] || 0;
      });
    }
    return row;
  });

  // Pie data from dashboard topCategories — handle both old {amount} and new {spent}
  const pieData = dashboard?.topCategories?.map((cat: any) => ({
    name: cat.name,
    value: Number(cat.spent ?? cat.amount ?? 0),
  })).filter((d: any) => d.value > 0) || [];

  // Budget burn bar data — handles both old {categoryName,budgeted} and new {name,budget}
  const burnData = budgetBurn?.map((b: any) => ({
    name: b.name || b.categoryName || b.category || 'Unknown',
    budget: Number(b.budget ?? b.budgeted ?? 0),
    spent: Number(b.spent ?? 0),
  })).filter((b: any) => b.budget > 0 || b.spent > 0) || [];

  const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const hasCategoryData = categoryTrends && categoryTrends.length > 0;
  const hasMemberData = memberTrends && memberTrends.length > 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Financial insights and trends</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="px-3 py-2 border rounded-xl text-sm focus:border-indigo-500 focus:outline-none"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              colorScheme: 'inherit' as any,
            }}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-2 border rounded-xl text-sm focus:border-indigo-500 focus:outline-none"
            style={{
              backgroundColor: 'var(--input-bg)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)',
              colorScheme: 'inherit' as any,
            }}
          >
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Trends */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Category Trends</h2>
          </div>
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={12} />
                <YAxis stroke="var(--chart-axis)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                {categoryTrends?.map((cat: any, i: number) => (
                  <Line
                    key={cat.name}
                    type="monotone"
                    dataKey={cat.name}
                    stroke={COLORS[i % COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={TrendingUp} title="No data" description="Add expenses to see trends" />
          )}
        </GlassCard>

        {/* Member Trends */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Member Trends</h2>
          </div>
          {hasMemberData ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={memberChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" stroke="var(--chart-axis)" fontSize={12} />
                <YAxis stroke="var(--chart-axis)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                {memberTrends?.map((mem: any, i: number) => (
                  <Area
                    key={mem.name}
                    type="monotone"
                    dataKey={mem.name}
                    stroke={COLORS[i % COLORS.length]}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={Activity} title="No data" description="Add expenses to see member trends" />
          )}
        </GlassCard>

        {/* Budget Burn */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Budget vs Actual</h2>
          </div>
          {burnData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={burnData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" stroke="var(--chart-axis)" fontSize={11} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="var(--chart-axis)" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
                <Bar dataKey="budget" fill="#6366f1" radius={[4, 4, 0, 0]} name="Budget" />
                <Bar dataKey="spent" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={BarChart3} title="No data" description="Set budgets and add expenses" />
          )}
        </GlassCard>

        {/* Category Distribution Pie */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-pink-500/20 rounded-lg">
              <PieChart className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Expense Distribution</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: '12px' }} />
              </RechartsPie>
            </ResponsiveContainer>
          ) : (
            <EmptyState icon={PieChart} title="No data" description="Add expenses to see distribution" />
          )}
        </GlassCard>
      </div>
    </div>
  );
}
