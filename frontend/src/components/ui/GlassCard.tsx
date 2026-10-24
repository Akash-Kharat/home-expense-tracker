import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:translate-y-[-2px] hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer' : ''
      } ${className}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
      }}
    >
      {children}
    </div>
  );
}
