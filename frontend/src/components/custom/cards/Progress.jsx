import React, { useEffect, useState } from "react";
import { Card } from "../../ui/card";

const Progress = ({
  solved = 37, // passed as prop
  label = "Problems Solved",
  primaryColor = "#10b981", // Tailwind green-500
  secondaryColor = "#d1d5db", // Tailwind gray-300
}) => {
  const total = 368; // fixed total

  const radius = 90;
  const strokeWidth = 10;
  const circumference = Math.PI * radius;
  const progress = Math.min(solved / total, 1);

  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const p = Math.min(elapsed / duration, 1);
      setAnimatedValue(Math.floor(p * solved));
      if (p < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [solved]);

  return (
    <Card className="w-full min-h-[160px] p-4 sm:p-5 rounded-2xl shadow-md bg-white dark:bg-neutral-900 border border-zinc-200 dark:border-zinc-700 fill-card">
      <div className="relative w-full h-32 flex items-center justify-center">
        {/* SVG Arc */}
        <svg
          width="100%"
          height="100"
          viewBox="0 0 200 100"
          className="absolute top-0 left-0 z-0"
        >
          {/* Background Arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={secondaryColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          />
        </svg>

        {/* Text */}
        <div className="mt-24 z-10 text-center">
          <p className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
            {animatedValue} <span className="text-gray-500 dark:text-gray-400">/ {total}</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium uppercase mt-1">
            {label}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default Progress;
