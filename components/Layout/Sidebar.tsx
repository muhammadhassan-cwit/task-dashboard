"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // 1. RESIZE LISTENER (As per instructions)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsOpen(false); // Default to closed on mobile
      } else {
        setIsMobile(false);
        setIsOpen(true);  // Default to open on desktop
      }
    };

    // Run once on mount to set initial state
    handleResize();

    // Attach listener
    window.addEventListener('resize', handleResize);

    // Cleanup listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* --- MOBILE HAMBURGER BUTTON --- */}
      {/* Only visible on mobile (md:hidden) */}
      <div className="md:hidden bg-slate-800 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">TaskMaster</h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-2xl focus:outline-none">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* --- SIDEBAR CONTAINER --- */}
      <aside 
        className={`
          bg-slate-800 text-white h-screen transition-all duration-300 ease-in-out z-50
          dark:bg-slate-950 border-r border-slate-700
          ${isMobile ? 'fixed inset-y-0 left-0 w-64 shadow-2xl' : 'relative w-64 shrink-0'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          ${/* On desktop (md), we ignore the translate-x logic so it stays visible if we want, 
              but here we map it to isOpen so you can toggle it on desktop too if you wanted. 
              For now, the logic above sets isOpen=true on desktop. */ ''}
        `}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo (Desktop only) */}
          <h1 className="text-2xl font-bold mb-8 hidden md:block">TaskMaster</h1>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-4">
            <Link 
                href="/" 
                className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
                onClick={() => isMobile && setIsOpen(false)} // Close on click (mobile only)
            >
              Home
            </Link>
            <Link 
                href="/tasks" 
                className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
                onClick={() => isMobile && setIsOpen(false)}
            >
              Tasks
            </Link>
            <Link 
                href="/settings" 
                className="block px-4 py-2 rounded hover:bg-slate-700 transition-colors"
                onClick={() => isMobile && setIsOpen(false)}
            >
              Settings
            </Link>
          </nav>

          {/* Theme Toggle (At the bottom) */}
          <button
            onClick={toggleTheme}
            className="mt-auto px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 border border-slate-600 transition-all flex items-center justify-center gap-3"
          >
            <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            <span className="font-medium">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
        </div>
      </aside>

      {/* --- MOBILE OVERLAY --- */}
      {/* If sidebar is open on mobile, dim the background */}
      {isMobile && isOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}