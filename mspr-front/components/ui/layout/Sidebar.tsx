// components/Sidebar.tsx

import Link from "next/link";
import { LogIn, LayoutDashboard, Users, Settings, House } from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, tooltip: 'Dashboard' },
  { href: '/dashboard/users', icon: Users, tooltip: 'Utilisateurs' },
  { href: '/dashboard/settings', icon: Settings, tooltip: 'Paramètres' },
];

export default function Sidebar() {

  const linkClasses = "flex justify-center items-center p-3 rounded-lg text-sm font-medium transition-colors duration-200 w-full relative group";
  const iconClasses = "w-5 h-5";

  return (

    <aside className="w-25 shrink-0 p-2 h-full flex flex-col bg-neutral-950 text-stone-400 border-r border-neutral-800">

      <nav className="flex flex-col space-y-1 flex-1">
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${linkClasses} hover:bg-neutral-800 hover:text-white`}
              >
                <item.icon className={iconClasses} />
                <span className="absolute left-full ml-3 px-3 py-1 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-neutral-700 text-white">
                  {item.tooltip}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-4 space-y-1 border-t border-neutral-800">
        <Link
          href="/"
          className={`${linkClasses} hover:bg-stone-800 hover:text-white`}
        >
          <House className={iconClasses} />
        </Link>
        <Link
          href="/login"
          className={`${linkClasses} hover:bg-red-500 hover:text-white`}
        >
          <LogIn className={iconClasses} />
        </Link>
      </div>
    </aside>
  );
}
