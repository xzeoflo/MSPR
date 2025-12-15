// components/Header.tsx

import { Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function Header() {

  const actionClasses = "flex items-center justify-center w-10 h-10 rounded-full text-gray-400 hover:bg-stone-800 hover:text-white transition-colors duration-200 cursor-pointer";

  return (
    <header className="w-full h-16 flex items-center justify-between bg-stone-950 text-white p-4 border-b border-stone-800 shadow-xl">

      <div className="flex items-center space-x-4 pl-2">
        <h1 className="text-lg font-semibold tracking-tight text-white">
          MSPR
        </h1>
      </div>

      <div className="flex items-center space-x-3">

        <div className={actionClasses}>
          <Bell className="w-5 h-5" />
        </div>

        <Link href="/dashboard/profile" className={actionClasses}>
          <User className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
}
