import React, { useEffect, useState } from "react";
import { Terminal, TypingAnimation } from "@/components/magicui/terminal";

const Quote = () => {
  const quotes = [
    "Talk is cheap. Show me the code. — Linus Torvalds",
    "Programs must be written for people to read. — Harold Abelson",
    "Code is like humor. When you have to explain it, it's bad. — Cory House",
    "First, solve the problem. Then, write the code. — John Johnson",
    "Simplicity is the soul of efficiency. — Austin Freeman",
    "The only way to learn a new programming language is by writing programs in it. — Dennis Ritchie",
    "Before software can be reusable it first has to be usable. — Ralph Johnson"
  ];

  const [quote, setQuote] = useState("");

  useEffect(() => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  return (
    <Terminal className="!max-w-none !w-full min-h-[140px] [&_code]:!overflow-visible [&_pre]:!whitespace-pre-wrap [&_code]:!whitespace-pre-wrap">
      <TypingAnimation duration={50} className="!whitespace-pre-wrap !break-words text-xs sm:text-sm">
        {quote}
      </TypingAnimation>
    </Terminal>
  );
}

export default Quote;