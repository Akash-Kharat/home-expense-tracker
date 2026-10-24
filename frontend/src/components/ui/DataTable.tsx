import type { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No data found',
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className="backdrop-blur-xl border rounded-2xl p-12 text-center"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="backdrop-blur-xl border rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: 'var(--border-color)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${col.className || ''}`}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`border-b transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                style={{ borderColor: 'var(--border-color)' }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '')}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-4 text-sm ${col.className || ''}`}
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {col.render
                      ? col.render(item)
                      : String((item as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
