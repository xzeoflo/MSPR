// components/ui/Button.tsx

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

export default function Button({ title, ...props }: ButtonProps) {
  const buttonClasses = "w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-stone-900 text-white hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-300 focus-visible:ring-offset-1";

  return (
    <button
      type="submit"
      className={buttonClasses}
      {...props}
    >
      {title}
    </button>
  );
}
