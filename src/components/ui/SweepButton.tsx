import React from 'react';

interface SweepButtonProps {
  children: React.ReactNode;
  dir?: 'left' | 'right';
  gold?: boolean;
  solid?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function SweepButton({
  children,
  dir = 'left',
  gold = false,
  solid = false,
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: SweepButtonProps) {
  // Direction animation classes
  const translateAnim = dir === 'left'
    ? '-translate-x-full group-hover:translate-x-0 group-active:translate-x-0'
    : 'translate-x-full group-hover:translate-x-0 group-active:translate-x-0';

  let buttonClasses = '';
  let fillClasses = '';
  let textClasses = '';

  if (solid) {
    if (gold) {
      // Solid Gold background -> sweeps obsidian dark on hover
      buttonClasses = 'bg-[#C6A15B] text-[#14201F] border-2 border-[#C6A15B] shadow-md hover:shadow-xl';
      fillClasses = 'bg-[#14201F]';
      textClasses = 'group-hover:text-white group-active:text-white';
    } else {
      // Solid Teal background -> sweeps gold on hover
      buttonClasses = 'bg-[#0E4F4F] text-[#F6F3EC] border-2 border-[#0E4F4F] shadow-md hover:shadow-xl';
      fillClasses = 'bg-[#C6A15B]';
      textClasses = 'group-hover:text-[#14201F] group-active:text-[#14201F]';
    }
  } else {
    if (gold) {
      // Outline Gold -> sweeps gold on hover
      buttonClasses = 'bg-transparent text-[#C6A15B] border-2 border-[#C6A15B]';
      fillClasses = 'bg-[#C6A15B]';
      textClasses = 'group-hover:text-[#14201F] group-active:text-[#14201F]';
    } else {
      // Outline Teal -> sweeps teal on hover
      buttonClasses = 'bg-transparent text-[#0E4F4F] border-2 border-[#0E4F4F]';
      fillClasses = 'bg-[#0E4F4F]';
      textClasses = 'group-hover:text-white group-active:text-white';
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative px-6 py-3.5 font-semibold rounded-full overflow-hidden group transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 select-none ${buttonClasses} ${className}`}
    >
      {/* To'ldiruvchi orqa fon (Sweep fill layer) */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out pointer-events-none ${fillClasses} ${translateAnim}`}
      />

      {/* Matn va Belgilar (Foreground text and icons) */}
      <span className={`relative z-10 flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-300 ${textClasses}`}>
        {children}
      </span>
    </button>
  );
}
