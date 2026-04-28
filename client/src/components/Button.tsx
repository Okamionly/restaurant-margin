import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-teal-600 hover:bg-teal-500 text-white',
  secondary: 'bg-mono-350 hover:bg-mono-400 text-white',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  ghost: 'bg-transparent hover:bg-mono-300 text-mono-800',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white',
};

// FIX 2026-04-28 (audit Marc persona kiosk) : size sm passe de py-1.5 (~28px) a
// py-2.5 + min-h-[44px] pour respecter WCAG 2.5.5 Target Size (44px min).
// Critique pour usage tablette/kiosk avec doigts mouilles ou farinés.
const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'py-2.5 px-4 text-xs min-h-[44px]',
  md: 'py-2.5 px-5 text-sm min-h-[44px]',
  lg: 'py-3 px-6 text-base min-h-[48px]',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  children,
  onClick,
  type = 'button',
  className = '',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-xl
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        focus-visible:ring-teal-500 dark:focus-visible:ring-offset-mono-50
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
