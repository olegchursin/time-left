"use client";

import { useEffect, useState } from "react";

type TimeUnit = {
  total: number;
  remaining: number;
  label: string;
};

type Theme = 'light' | 'dark' | 'system';

export default function Home() {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { total: 24, remaining: 24, label: "hours" },
    { total: 60, remaining: 60, label: "minutes" },
    { total: 60, remaining: 60, label: "seconds" }
  ]);
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Load saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme') as Theme || 'system';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    setTheme(savedTheme);

    if (savedTheme === 'dark' || (savedTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const timeLeft = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setTimeUnits([
        { total: 24, remaining: hours, label: "hours" },
        { total: 60, remaining: minutes, label: "minutes" },
        { total: 60, remaining: seconds, label: "seconds" }
      ]);
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (newTheme === 'dark' || (newTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <main className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Time Left Today</h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Dark
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`px-3 py-1 rounded ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                System
              </button>
            </div>
          </div>
          <div className="flex gap-8">
            {timeUnits.map((unit) => (
              <div key={unit.label} className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-6 gap-1 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  {[...Array(unit.total)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < unit.remaining ? 'bg-blue-500 dark:bg-blue-400' : 'bg-gray-200 dark:bg-gray-600'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
