// components/ui/Card.tsx

import React from 'react';

interface CardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Card({ title, description, children }: CardProps) {
  return (
    <div className="w-full max-w-md space-y-8 p-8 bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-400">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
