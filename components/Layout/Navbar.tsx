"use client";

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-slate-800 text-white p-4 shadow-md transition-colors duration-300 dark:bg-slate-950">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">TaskMaster</h1>
        
        <div className="flex items-center space-x-6">
          <div className="space-x-4">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <Link href="/tasks" className="hover:text-slate-300 transition-colors">
              Tasks
            </Link>
            <Link href="/settings" className="hover:text-slate-300 transition-colors">
              Settings
            </Link>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-full bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-all flex items-center gap-2"
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="text-sm font-medium">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}