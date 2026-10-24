const chevronSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`;

interface MonthYearPickerProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function MonthYearPicker({ month, year, onMonthChange, onYearChange }: MonthYearPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const selectStyle = {
    backgroundColor: 'var(--input-bg)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
    colorScheme: 'inherit' as any,
    backgroundImage: chevronSvg,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
  };

  return (
    <div className="flex items-center gap-3">
      <select
        value={month}
        onChange={(e) => onMonthChange(Number(e.target.value))}
        className="border rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer pr-8 transition-colors"
        style={selectStyle}
      >
        {monthNames.map((name, i) => (
          <option key={i} value={i + 1}>{name}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => onYearChange(Number(e.target.value))}
        className="border rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer pr-8 transition-colors"
        style={selectStyle}
      >
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}
