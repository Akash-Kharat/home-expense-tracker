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
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 ${
        hover ? 'hover:bg-white/[0.07] hover:translate-y-[-2px] hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
