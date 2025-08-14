import React from "react";
import { Calendar } from "@/components/ui/calendar"; // shadcn/ui Calendar

const StreakCalendar = ({ streakDates = [], width = "320px" }) => {
  const today = new Date();

  const actualStreakDates = streakDates.length > 0 ? streakDates.map((d) => new Date(d)) : [];

  const isSameDay = (date1, date2) =>
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();

  const isStreakDay = (date) => actualStreakDates.some((streakDate) => isSameDay(streakDate, date));

  const currentStreak = () => {
    let streak = 0;
    let checkDate = new Date(today);

    while (isStreakDay(checkDate)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  };

  return (
    <div style={{ maxWidth: width }} className="w-full mx-auto rounded-xl border bg-background shadow-lg">
      <div className="p-3 md:p-2 lg:p-3">
        <h2 className="text-base md:text-sm lg:text-base font-semibold mb-3 md:mb-2 lg:mb-3 text-center text-foreground">
          🔥 Streak Calendar
        </h2>

        {/* Current Streak Counter */}
        <div className="text-center mb-3 md:mb-2 lg:mb-3">
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded-full">
            <span className="text-lg md:text-base lg:text-lg">🔥</span>
            <span className="font-bold text-sm md:text-xs lg:text-sm text-orange-700 dark:text-orange-200">
              {currentStreak()} day{currentStreak() !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* shadcn Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            className="rounded-md border"
            modifiers={{
              streak: isStreakDay,
              today: (date) => isSameDay(date, today),
            }}
            modifiersClassNames={{
              streak: "bg-green-500 text-white hover:bg-green-600 font-bold",
              today: "bg-slate-600 text-white dark:bg-slate-500 dark:text-white",
            }}
          />
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-2 md:gap-1 lg:gap-3 mt-3 md:mt-2 lg:mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-muted-foreground">Streak Day</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-600 dark:bg-slate-500 rounded"></div>
            <span className="text-muted-foreground">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakCalendar;
