import { create } from 'zustand';

type Theme = 'dark' | 'light';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme') as Theme | null;
  return saved === 'light' ? 'light' : 'dark';
};

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.classList.remove('dark', 'light');
  root.classList.add(theme);
  localStorage.setItem('theme', theme);
};

// Apply immediately on module load
applyTheme(getInitialTheme());

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () =>
    set((state) => {
      const next: Theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      return { theme: next };
    }),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
