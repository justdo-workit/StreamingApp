"use client";

import { useState, useEffect } from "react";

type CountdownTimerProps = {
  targetDate: string;
};

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    return (
        <div className="mt-4 flex items-center justify-center space-x-2 md:space-x-4">
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/20 md:h-24 md:w-24"></div>
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/20 md:h-24 md:w-24"></div>
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/20 md:h-24 md:w-24"></div>
            <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/20 md:h-24 md:w-24"></div>
        </div>
    );
  }

  const timerComponents = Object.entries(timeLeft);

  return (
    <div className="mt-4">
      {timerComponents.length ? (
        <div className="flex items-center justify-center space-x-2 md:space-x-4">
          {timerComponents.map(([interval, value]) => (
            <div key={interval} className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-primary/20 md:h-24 md:w-24">
              <span className="text-2xl font-bold md:text-4xl">{value.toString().padStart(2, '0')}</span>
              <span className="text-xs uppercase text-gray-300">{interval}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-xl font-bold">Race in Progress!</span>
      )}
    </div>
  );
}
