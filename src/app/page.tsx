"use client";

import { useEffect, useState } from "react";

type TimeUnit = {
  total: number;
  remaining: number;
  label: string;
};

export default function Home() {
  const [timeUnits, setTimeUnits] = useState<TimeUnit[]>([
    { total: 24, remaining: 24, label: "hours" },
    { total: 60, remaining: 60, label: "minutes" },
    { total: 60, remaining: 60, label: "seconds" }
  ]);

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

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <main className="p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-bold text-center mb-4">Time Left Today</h1>
          <div className="flex gap-8">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="flex flex-col items-center gap-2">
                <div className="grid grid-cols-6 gap-1 p-4 bg-gray-50 rounded">
                  {[...Array(unit.total)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${i < unit.remaining ? 'bg-blue-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600">
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
