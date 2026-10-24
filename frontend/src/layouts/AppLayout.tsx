import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Tags,
  Wallet,
  Receipt,
  ArrowLeftRight,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Home,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '../store/auth-store';
import { useThemeStore } from '../store/theme-store';
import { authApi } from '../api/endpoints';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/categories', icon: Tags, label: 'Categories' },
  { to: '/budgets', icon: Wallet, label: 'Budgets' },
  { to: '/expenses', icon: Receipt, label: 'Expenses' },
  { to: '/settlements', icon: ArrowLeftRight, label: 'Settlements' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, setUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    select: (data: { user: typeof user }) => {
      if (data?.user) setUser(data.user);
      return data;
    },
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className="flex h-screen overflow-hidden transition-colors duration-250"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm z-40 lg:hidden"
            style={{ backgroundColor: 'var(--modal-overlay)' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col backdrop-blur-xl border-r transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20' : 'w-72'}`}
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>HomeExpense</h1>
                <p className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>SaaS Platform</p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center mx-auto">
              <Home className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer hover:opacity-80"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                    : ''
                } ${collapsed ? 'justify-center' : ''}`
              }
              style={({ isActive }) => ({
                color: isActive ? '#6366f1' : 'var(--text-secondary)',
                backgroundColor: isActive ? undefined : undefined,
              })}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className="w-5 h-5 shrink-0"
                    style={{ color: isActive ? '#6366f1' : 'var(--text-secondary)' }}
                  />
                  {!collapsed && (
                    <span style={{ color: isActive ? '#6366f1' : 'var(--text-secondary)' }}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-3 border-t transition-colors cursor-pointer hover:opacity-80"
          style={{
            borderColor: 'var(--border-color)',
            color: 'var(--text-muted)',
          }}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl"
          style={{
            backgroundColor: 'var(--header-bg)',
            borderColor: 'var(--border-color)',
          }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2 rounded-xl border transition-all duration-200 cursor-pointer hover:scale-105"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-color)',
                color: isDark ? '#f59e0b' : '#6366f1',
              }}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.role}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg transition-colors cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              title="Logout"
              onMouseOver={(e) => (e.currentTarget.style.color = '#ef4444')}
              onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
