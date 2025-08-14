import React, { useEffect, useState } from "react";
import { NumberTicker } from "../../magicui/number-ticker";
import { Progress } from "../../ui/progress";

const DailyProgress = ({
  solved = 0,
  goal = 0,
  xpToday = 0,
  timeZoneOffset = 5.5, // IST default
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setUTCHours(23 - timeZoneOffset, 59, 59, 999);

      const diff = endOfDay - now;
      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timeZoneOffset]);

  useEffect(() => {
    if (solved >= goal && goal > 0) setShowCongrats(true);
  }, [solved, goal]);

  const progressPercent = goal > 0 ? Math.min((solved / goal) * 100, 100) : 0;

  return (
    <div className="fill-card p-5 rounded-xl bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 shadow-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Daily Progress
        </h3>
        <span className="text-sm text-muted-foreground">🕒 {timeLeft} left</span>
      </div>

      {/* Progress display */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">Solved</p>
          <NumberTicker
            value={solved}
            className="text-3xl font-bold text-zinc-800 dark:text-white"
          />
          <p className="text-xs text-muted-foreground">
            Goal: {goal} problems
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-zinc-500">XP Earned</p>
          <NumberTicker
            value={xpToday}
            className="text-2xl font-semibold text-green-600 dark:text-green-400"
          />
          {showCongrats && (
            <p className="text-xs text-amber-500 mt-1">🏆 Keep it up!</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <Progress value={progressPercent} className="h-3" />
    </div>
  );
};

export default DailyProgress;
