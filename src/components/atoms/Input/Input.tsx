import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div data-component="Input" className="w-full">
      {label && (
        <label
          data-component="Input.Label"
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground mb-2"
        >
          {label}
        </label>
      )}
      <input
        data-component="Input.Field"
        id={inputId}
        className={cn(
          'flex h-11 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-error focus-visible:ring-error',
          className
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p
          data-component="Input.Error"
          id={`${inputId}-error`}
          className="mt-1 text-sm text-error"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

