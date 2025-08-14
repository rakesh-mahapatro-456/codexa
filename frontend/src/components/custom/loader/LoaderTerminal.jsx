"use client";

import { useState, useEffect } from "react";
import { Terminal, TypingAnimation } from "../../magicui/terminal";

const BLINK_INTERVAL = 500;
const line = "Initializing Codexa...";

export function LoaderTerminal() {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => {
      setShowCursor((v) => !v);
    }, BLINK_INTERVAL);
    return () => clearInterval(blink);
  }, []);

  return (
    <Terminal>
      <TypingAnimation duration={60}>{line}</TypingAnimation>
      {showCursor && (
        <span className="inline-block w-1 ml-1 bg-current animate-pulse" />
      )}
    </Terminal>
  );
}
