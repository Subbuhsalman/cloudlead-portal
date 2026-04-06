"use client";
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button
   */
  variant?: 'primary' | 'secondary' | 'outline';
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional icon rendered inside the button
   */
  icon?: ReactNode;
  /**
   * Position of the icon relative to children
   */
  iconPosition?: 'left' | 'right';

  loading?: boolean;
}

/**
 * A customizable button component with variants, sizes, and optional icon support.
 */
const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  onClick,
  disabled = false,
  className = '',
  loading= false,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium  transition-all  duration-200  ';

  const variants = {
    primary:
      'bg-[var(--primary-color)] hover:bg-[#15e599] hover:text-[var(--primary-color)] text-white focus:ring-[var(--primary-color)]/50 shadow-sm',
    secondary:
      'bg-white  text-gray-700 border border-gray-300 focus:ring-gray-500/50 shadow-sm',
    outline:
      'bg-transparent  text-[#000] border border-[var(--primary-color)] border-[0.5px] ',
  } as const;

  const sizes = {
    sm: 'px-[16px] py-[5px] text-[16.78px] font-normal gap-1.5 min-w-[143.19px] rounded-xl',
    md: 'px-6 py-2.5 text-sm gap-2',
    lg: 'px-8 py-3 text-base gap-2.5',
  } as const;

  const disabledClasses = 'opacity-50 cursor-not-allowed';

  const buttonClasses = [
    baseClasses,
    variants[variant],
    sizes[size],
    disabled ? disabledClasses : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const renderIcon = () => {
    if (!icon) return null;

    const iconClasses =
      size === 'sm' ? 'w-4 ' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';

    return <span className={iconClasses}>{icon}</span>;
  };

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ opacity: loading ? 0.5 : 1 }}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
      {loading && <div className="loader1"></div>}
    </button>
  );
};

export  {Button};
