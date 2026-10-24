import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', style, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            className="block text-sm font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full border rounded-xl px-4 py-3 placeholder:opacity-40 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all duration-200 ${
            error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : ''
          } ${className}`}
          style={{
            backgroundColor: 'var(--input-bg)',
            borderColor: error ? undefined : 'var(--border-color)',
            color: 'var(--text-primary)',
            colorScheme: 'inherit',
            ...style,
          }}
          {...props}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
