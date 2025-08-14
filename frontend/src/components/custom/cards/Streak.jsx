import React from "react";
import { NumberTicker } from "../../magicui/number-ticker";
import { Flame } from "lucide-react";

const Streak = ({ streak = 7 }) => {
  return (
    <div className="w-full min-h-[140px] sm:min-h-[160px] bg-white dark:bg-neutral-900 rounded-2xl shadow-md flex flex-col items-center justify-center p-4 border border-zinc-200 dark:border-zinc-700 fill-card">
      {/* Icon + Number */}
      <div className="flex items-center justify-center gap-2 md:gap-3">
        <Flame className="text-yellow-400 drop-shadow-md" size={40} />
        <NumberTicker
          value={streak}
          className="text-4xl md:text-5xl font-extrabold text-neutral-800 dark:text-white leading-none"
        />
      </div>

      {/* Label */}
      <span className="mt-2 text-sm md:text-base font-medium text-zinc-600 dark:text-zinc-300">
        Day Streak
      </span>
    </div>
  );
};

export default Streak;