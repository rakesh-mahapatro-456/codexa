import React from "react";
import { Card } from "../../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../../ui/avatar";
import { NumberTicker } from "../../magicui/number-ticker";

const UserCard = ({ name, level, xp, image }) => {
  const levelNumber = parseInt(level.replace(/\D/g, ""), 10);
  return (
    <Card className="w-full mb-4 px-4 py-6 rounded-xl shadow-md fill-card">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {/* Left: Avatar + Name */}
        <div className="flex flex-col items-center sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <Avatar className="w-16 h-16">
            {image ? (
              <AvatarImage src={image} alt={name} />
            ) : (
              <AvatarFallback>{name[0]}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Welcome back,</p>
            <h2 className="text-base sm:text-lg font-semibold text-indigo-600 dark:text-indigo-400">
              {name}
            </h2>
          </div>
        </div>

        {/* Level + XP */}
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <div className="text-center sm:text-right">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Level</p>
            <NumberTicker
              value={levelNumber}
              className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white"
            />
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-700">
            <span className="text-xs text-zinc-600 dark:text-zinc-300">XP:</span>
            <NumberTicker
              value={xp}
              className="font-semibold text-green-600 dark:text-green-400 text-sm"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;