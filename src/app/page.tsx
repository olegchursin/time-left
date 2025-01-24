'use client';

import { useEffect, useState } from 'react';

type TimeUnit = {
  total: number;
  remaining: number;
  label: string;
};

type Theme = 'light' | 'dark' | 'system';

export default function Home() {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { total: 24, remaining: 24, label: 'hours' },
    { total: 60, remaining: 60, label: 'minutes' },
    { total: 60, remaining: 60, label: 'seconds' }
  ]);
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Load saved theme from localStorage or use system preference
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

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
        { total: 24, remaining: hours, label: 'hours' },
        { total: 60, remaining: minutes, label: 'minutes' },
        { total: 60, remaining: seconds, label: 'seconds' }
      ]);
    };

    updateTime(); // Initial update
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;

    if (newTheme === 'dark' || (newTheme === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-200 p-2 sm:p-4">
      <div className="flex flex-col gap-4 sm:gap-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
            Time Left Today
          </h1>
          <button
            title="Toggle theme"
            onClick={() =>
              handleThemeChange(theme === 'dark' ? 'light' : 'dark')
            }
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-md text-gray-900 dark:text-gray-100 transition-colors duration-200"
          >
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {timeUnits.map((unit) => (
            <div
              key={unit.label}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="grid grid-cols-6 gap-1 p-2 bg-gray-100 dark:bg-gray-900 rounded w-full aspect-square"
                style={{ maxWidth: 'min(16rem, calc(25vh - 2rem))' }}
              >
                {[...Array(unit.total)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full flex items-center justify-center place-self-center ${
                      i < unit.remaining
                        ? 'bg-blue-500 dark:bg-blue-400'
                        : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {unit.remaining}{' '}
                {unit.label === 'hours'
                  ? 'h'
                  : unit.label === 'minutes'
                  ? 'm'
                  : 's'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
