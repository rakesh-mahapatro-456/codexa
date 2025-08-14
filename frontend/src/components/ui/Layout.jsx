"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const LayoutGrid = ({ children }) => {
  const [selected, setSelected] = useState(null);
  const [lastSelected, setLastSelected] = useState(null);

  const handleClick = (index) => {
    setLastSelected(selected);
    setSelected(index);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {React.Children.map(children, (child, i) => (
        <motion.div
          key={i}
          onClick={() => handleClick(i)}
          className={cn(
            "relative overflow-hidden",
            selected === i
              ? "rounded-lg cursor-pointer absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-col"
              : lastSelected === i
              ? "z-40 bg-white rounded-xl h-full w-full"
              : "bg-white rounded-xl h-full w-full"
          )}
          layoutId={`card-${i}`}
        >
          {selected === i && (
            <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
              />
              <motion.div
                layoutId={`content-${i}`}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="relative px-8 pb-4 z-[70]"
              >
                {child}
              </motion.div>
            </div>
          )}
          {selected !== i && child}
        </motion.div>
      ))}

      {/* Overlay */}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
          selected !== null ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected !== null ? 0.3 : 0 }}
      />
    </div>
  );
};
