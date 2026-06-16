import { ButtonHTMLAttributes, ReactNode, ElementType, ComponentPropsWithoutRef } from 'react';
import { cn } from '../../utils/helpers';
import { Loader2 } from 'lucide-react';

type ButtonOwnProps = {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
};

type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps & {
  as?: T;
} & ComponentPropsWithoutRef<T>;

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg',
  secondary: 'bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 shadow-md hover:shadow-lg',
  success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg',
  warning: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-md hover:shadow-lg',
  danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-md hover:shadow-lg',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 border border-gray-200',
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3.5 text-base',
};

const Button = <T extends ElementType = 'button'>({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  className,
  disabled,
  as,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button';
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>
      )}
      {children}
    </Component>
  );
};

export default Button;
