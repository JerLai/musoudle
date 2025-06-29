'use client';
import React, { useEffect, useState } from "react";
import { msUntilNextUTCMidnight } from "../utils/dateUtils";

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

const Countdown = () => {
  const [msLeft, setMsLeft] = useState(msUntilNextUTCMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setMsLeft(msUntilNextUTCMidnight());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="uppercase text-center text-lg font-semibold text-gray-700 bg-white/80 mt-4 mb-6 py-4 px-8">
      Next puzzle in: <span className="font-mono">{formatTime(msLeft)}</span>
    </div>
  );
}

export default Countdown