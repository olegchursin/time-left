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
      <main className="w-full max-w-4xl p-2 sm:p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
        <div className="flex flex-col gap-4 sm:gap-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white text-center sm:text-left">
              Time Left Today
            </h1>
            <div className="flex gap-2">
              {(['light', 'dark', 'system'] as Theme[]).map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => handleThemeChange(themeOption)}
                  className={`px-2 sm:px-3 py-1 text-sm sm:text-base rounded ${
                    theme === themeOption
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </button>
              ))}
            </div>
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
      </main>
    </div>
  );
}
