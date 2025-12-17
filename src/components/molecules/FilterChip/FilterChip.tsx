import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const filterChipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        primary: 'bg-brand-black text-white hover:bg-gray-800',
        outlined: 'border-2 border-gray-300 bg-white text-gray-900 hover:border-gray-400',
        success: 'bg-success-light text-success-dark hover:bg-success',
        error: 'bg-error-light text-error-dark hover:bg-error',
      },
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        variant: 'default',
        selected: true,
        className: 'bg-gray-900 text-white hover:bg-gray-800',
      },
      {
        variant: 'outlined',
        selected: true,
        className: 'border-gray-900 bg-gray-900 text-white hover:bg-gray-800',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'md',
      selected: false,
    },
  }
);

interface FilterChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof filterChipVariants> {
  label: string;
  onRemove?: () => void;
  removable?: boolean;
  icon?: React.ReactNode;
}

export function FilterChip({
  label,
  onRemove,
  removable = false,
  icon,
  variant,
  size,
  selected,
  className,
  onClick,
  ...props
}: Readonly<FilterChipProps>) {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  return (
    <button
      data-component="FilterChip"
      data-variant={variant}
      data-size={size}
      data-selected={selected}
      type="button"
      onClick={onClick}
      className={cn(filterChipVariants({ variant, size, selected }), className)}
      {...props}
    >
      {icon && (
        <span data-component="FilterChip.Icon" className="flex-shrink-0">
          {icon}
        </span>
      )}
      <span data-component="FilterChip.Label">{label}</span>
      {removable && (
        <button
          data-component="FilterChip.RemoveButton"
          type="button"
          onClick={handleRemove}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label={`Remove ${label}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </button>
  );
}

