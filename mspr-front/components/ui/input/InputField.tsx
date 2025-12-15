// components/ui/InputField.tsx

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  id: string;
}

export default function InputField({ label, icon: Icon, id, ...props }: InputFieldProps) {
  const inputClasses = "flex h-10 w-full rounded-md border border-stone-800 bg-stone-950 px-3 py-2 text-sm ring-offset-stone-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-300 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-white";

  return (
    <div>
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-stone-300 mb-2 block"
      >
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-500" />
        <input
          id={id}
          className={`${inputClasses} pl-10`}
          {...props}
        />
      </div>
    </div>
  );
}
