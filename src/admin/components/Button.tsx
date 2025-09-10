import { ButtonHTMLAttributes, forwardRef } from 'react';
import { classNames } from '../../utils/classNames';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline:
    'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      type = 'button',
      disabled = false,
      isLoading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classNames(
          'inline-flex items-center justify-center rounded-md border border-transparent font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth ? 'w-full' : '',
          isDisabled ? 'opacity-70 cursor-not-allowed' : '',
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className={classNames(
              'animate-spin -ml-1 mr-2 h-4 w-4',
              size === 'xs' ? 'h-3 w-3' : 'h-4 w-4',
              variant === 'outline' || variant === 'ghost'
                ? 'text-gray-700'
                : 'text-white'
            )}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {leftIcon && !isLoading && (
          <span className="mr-2 -ml-1">{leftIcon}</span>
        )}
        {children}
        {rightIcon && <span className="ml-2 -mr-1">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
