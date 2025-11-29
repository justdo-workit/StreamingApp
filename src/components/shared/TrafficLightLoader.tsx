"use client";

import { useEffect, useState } from "react";

const TOTAL_STEPS = 5; // 0: off, 1–3: red lights build up, 4: all green

export default function TrafficLightLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        // stop incrementing once we reach the final green state
        if (prev >= TOTAL_STEPS - 1) {
          clearInterval(interval);
          return TOTAL_STEPS - 1;
        }
        return prev + 1;
      });
    }, 600); // change speed here (ms)
    return () => clearInterval(interval);
  }, []);

  const getLightClass = (index: number) => {
    // index: 0 = top, 1 = middle, 2 = bottom
    if (step === 4) {
      // all green
      return "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.9)]";
    }

    const lightNumber = index + 1;
    if (step >= lightNumber) {
      // turning red one by one
      return "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)]";
    }

    // off
    return "bg-neutral-800";
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Light housing */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-neutral-900 px-6 py-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-neutral-800">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`h-10 w-10 rounded-full transition-all duration-300 ${getLightClass(
                index
              )}`}
            />
          ))}
        </div>

        {/* Optional “loading” text */}
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
          
        </p>
      </div>
    </div>
  );
}
