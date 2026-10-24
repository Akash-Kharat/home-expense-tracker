import { useEffect, useState, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend?: { value: number; positive: boolean };
  color?: 'indigo' | 'emerald' | 'amber' | 'red';
}

const colorMap = {
  indigo: 'from-indigo-500 to-purple-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
  red: 'from-red-500 to-pink-500',
};

export default function StatCard({ icon: Icon, label, value, prefix = '', suffix = '', trend, color = 'indigo' }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div
      className="relative backdrop-blur-xl border rounded-2xl p-6 overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-bg)')}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${colorMap[color]}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {prefix}{displayValue.toLocaleString()}{suffix}
          </p>
          {trend && (
            <p className={`text-sm font-medium ${trend.positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-r ${colorMap[color]} bg-opacity-10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

interface StatCardSimpleProps {
  icon: ReactNode;
  label: string;
  value: string;
  subValue?: string;
  color?: string;
}

export function StatCardSimple({ icon, label, value, subValue }: StatCardSimpleProps) {
  return (
    <div
      className="backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
      }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-bg)')}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{value}</p>
          {subValue && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{subValue}</p>}
        </div>
      </div>
    </div>
  );
}
